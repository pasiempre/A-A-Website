import { NextResponse } from "next/server";

import { sendResendEmail } from "@/lib/email";
import { COMPANY_EMAIL, COMPANY_NAME } from "@/lib/company";
import { createAdminClient } from "@/lib/supabase/admin";

type EmploymentApplicationBody = {
  fullName?: string;
  phone?: string;
  email?: string;
  preferredLanguage?: "en" | "es";
  city?: string;
  experienceYears?: number;
  hasTransportation?: boolean;
  isEligibleToWork?: boolean;
  availabilityText?: string;
  notes?: string;
};

export async function POST(request: Request) {
  let body: EmploymentApplicationBody;
  try {
    body = (await request.json()) as EmploymentApplicationBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() || "";
  const phone = body.phone?.trim() || "";
  if (!fullName || !phone) {
    return NextResponse.json({ error: "Full name and phone are required." }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data: application, error } = await supabase
      .from("employment_applications")
      .insert({
        full_name: fullName,
        phone,
        email: body.email?.trim() || null,
        preferred_language: body.preferredLanguage === "en" ? "en" : "es",
        city: body.city?.trim() || null,
        experience_years: Number.isFinite(Number(body.experienceYears)) ? Number(body.experienceYears) : null,
        has_transportation: typeof body.hasTransportation === "boolean" ? body.hasTransportation : null,
        is_eligible_to_work: typeof body.isEligibleToWork === "boolean" ? body.isEligibleToWork : null,
        availability_text: body.availabilityText?.trim() || null,
        notes: body.notes?.trim() || null,
      })
      .select("id")
      .single();

    if (error || !application) {
      return NextResponse.json({ error: error?.message ?? "Unable to save application." }, { status: 500 });
    }

    await sendResendEmail({
      to: [COMPANY_EMAIL],
      subject: `New employment application: ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0A1628; line-height: 1.6;">
          <h2>${COMPANY_NAME} employment application</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${body.email?.trim() || "Not provided"}</p>
          <p><strong>Language:</strong> ${body.preferredLanguage === "en" ? "English" : "Spanish"}</p>
          <p><strong>City:</strong> ${body.city?.trim() || "Not provided"}</p>
          <p><strong>Experience (years):</strong> ${body.experienceYears ?? "Not provided"}</p>
          <p><strong>Transportation:</strong> ${typeof body.hasTransportation === "boolean" ? (body.hasTransportation ? "Yes" : "No") : "Not provided"}</p>
          <p><strong>Eligible to work:</strong> ${typeof body.isEligibleToWork === "boolean" ? (body.isEligibleToWork ? "Yes" : "No") : "Not provided"}</p>
          <p><strong>Availability:</strong> ${body.availabilityText?.trim() || "Not provided"}</p>
          <p><strong>Notes:</strong> ${body.notes?.trim() || "None"}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, applicationId: application.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
