import { dispatchSmsWithQuietHours } from "@/lib/notifications";
import { getPostJobSettings } from "@/lib/post-job-settings";
import { sendEmailResilient } from "@/lib/resilient-email";
import { createAdminClient } from "@/lib/supabase/admin";

type StartPostJobSequenceParams = {
  jobId: string;
};

type SequenceResult = {
  started: boolean;
  warnings: string[];
  sequenceId: string | null;
  customerEmailed: boolean;
  adminNotified: boolean;
};

type JobForSequence = {
  id: string;
  title: string;
  qa_status: string | null;
  status: string | null;
  completed_at: string | null;
  client_id: string | null;
};

type ClientContact = {
  id: string;
  name: string | null;
  email: string | null;
};

type AdminContact = {
  id: string;
  full_name: string | null;
  phone: string | null;
  notification_preferences: Record<string, unknown> | null;
};

type ExistingSequence = {
  id: string;
  admin_notified_at: string | null;
  customer_notified_at: string | null;
};

function addHours(isoString: string, hours: number): string {
  return new Date(new Date(isoString).getTime() + hours * 60 * 60 * 1000).toISOString();
}

function buildCustomerCompletionEmail(args: {
  customerName: string;
  jobTitle: string;
}): { subject: string; html: string } {
  const subject = `Your cleaning is complete - ${args.jobTitle}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6;max-width:640px">
      <h2 style="margin-bottom:8px">Your cleaning is complete</h2>
      <p>Hi ${args.customerName},</p>
      <p>
        Your service for <strong>${args.jobTitle}</strong> has been completed and quality-reviewed by our team.
      </p>
      <p>
        If anything needs attention, simply reply to this email and we will address it quickly.
      </p>
      <p style="margin-top:24px">Thank you for choosing A&A Cleaning.</p>
    </div>
  `;

  return { subject, html };
}

export async function startPostJobSequence(
  params: StartPostJobSequenceParams,
): Promise<SequenceResult> {
  const warnings: string[] = [];
  const supabase = createAdminClient();
  const settings = await getPostJobSettings();

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, title, qa_status, status, completed_at, client_id")
    .eq("id", params.jobId)
    .single();

  if (jobError || !job) {
    return {
      started: false,
      warnings: [jobError?.message ?? "Job not found for post-job sequence."],
      sequenceId: null,
      customerEmailed: false,
      adminNotified: false,
    };
  }

  const typedJob = job as JobForSequence;
  const isApproved = typedJob.qa_status === "approved" || typedJob.qa_status === "completed";
  if (!isApproved) {
    return {
      started: false,
      warnings: [`Skipped post-job sequence: QA status is \"${typedJob.qa_status ?? "null"}\".`],
      sequenceId: null,
      customerEmailed: false,
      adminNotified: false,
    };
  }

  const nowIso = new Date().toISOString();

  const { data: existingSequence } = await supabase
    .from("post_job_sequence")
    .select("id, admin_notified_at, customer_notified_at")
    .eq("job_id", typedJob.id)
    .maybeSingle();

  const sequenceSeed = {
    job_id: typedJob.id,
    status: "active",
    next_step: "rating_request",
    approval_at: nowIso,
    rating_request_due_at: addHours(nowIso, settings.ratingRequestDelayHours),
    review_reminder_due_at: addHours(nowIso, settings.reviewReminderDelayHours),
    payment_reminder_due_at: addHours(nowIso, settings.paymentReminderDelayHours),
  };

  const { data: upsertedSequence, error: upsertError } = await supabase
    .from("post_job_sequence")
    .upsert(sequenceSeed, { onConflict: "job_id" })
    .select("id, admin_notified_at, customer_notified_at")
    .single();

  if (upsertError || !upsertedSequence) {
    return {
      started: false,
      warnings: [upsertError?.message ?? "Failed to initialize post-job sequence."],
      sequenceId: null,
      customerEmailed: false,
      adminNotified: false,
    };
  }

  const sequence = upsertedSequence as ExistingSequence;
  const prior = existingSequence as ExistingSequence | null;

  let adminNotified = false;
  if (!prior?.admin_notified_at && !sequence.admin_notified_at) {
    const { data: admins } = await supabase
      .from("profiles")
      .select("id, full_name, phone, notification_preferences")
      .eq("role", "admin")
      .order("created_at", { ascending: true })
      .limit(1);

    const admin = (admins?.[0] ?? null) as AdminContact | null;
    if (admin?.phone) {
      const smsResult = await dispatchSmsWithQuietHours({
        supabase,
        to: admin.phone,
        profileId: admin.id,
        preferences: admin.notification_preferences,
        body: `Job complete: ${typedJob.title}. Review photos and QA in the admin dashboard.`,
        queuedReason: "post_job_admin_notify_quiet_hours",
        context: {
          type: "post_job_admin_notify",
          jobId: typedJob.id,
          jobTitle: typedJob.title,
        },
      });

      if (smsResult.sent || smsResult.queued) {
        adminNotified = true;
        const { error: notifyUpdateError } = await supabase
          .from("post_job_sequence")
          .update({ admin_notified_at: nowIso })
          .eq("id", sequence.id);

        if (notifyUpdateError) {
          warnings.push(`Admin notification sent but sequence update failed: ${notifyUpdateError.message}`);
        }
      } else {
        warnings.push(smsResult.error ?? "Admin SMS notification was not sent.");
      }
    } else {
      warnings.push("No admin phone available for immediate completion alert.");
    }
  }

  let customerEmailed = false;
  if (!prior?.customer_notified_at && !sequence.customer_notified_at) {
    let client: ClientContact | null = null;

    if (typedJob.client_id) {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, name, email")
        .eq("id", typedJob.client_id)
        .maybeSingle();

      if (clientError) {
        warnings.push(`Unable to load client contact for completion email: ${clientError.message}`);
      } else {
        client = (clientData as ClientContact | null) ?? null;
      }
    }

    if (client?.email) {
      const emailPayload = buildCustomerCompletionEmail({
        customerName: client.name ?? "there",
        jobTitle: typedJob.title,
      });

      const emailResult = await sendEmailResilient({
        to: client.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
        tag: "post_job_completion",
      });

      if (emailResult.success) {
        customerEmailed = true;
        const { error: customerUpdateError } = await supabase
          .from("post_job_sequence")
          .update({ customer_notified_at: nowIso })
          .eq("id", sequence.id);

        if (customerUpdateError) {
          warnings.push(`Completion email sent but sequence update failed: ${customerUpdateError.message}`);
        }
      } else {
        warnings.push(emailResult.error ?? "Customer completion email failed.");
      }
    } else {
      warnings.push("No client email available for automatic completion notice.");
    }
  }

  return {
    started: true,
    warnings,
    sequenceId: sequence.id,
    customerEmailed,
    adminNotified,
  };
}
