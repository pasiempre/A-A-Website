import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSms } from "@/lib/notifications";

const TEMPLATES = {
  awaiting_scope: (name: string, service: string) => 
    `Hi ${name}, we've received your request for ${service}. Could you please provide more details on the scope or a few photos so we can finalize the quote? - A&A Cleaning`,
  quote_sent: (name: string, service: string, email: string) => 
    `Hi ${name}, we've just sent your quote for ${service} to ${email}. Please let us know if you have any questions! - A&A Cleaning`,
  follow_up: (name: string, service: string) => 
    `Hi ${name}, following up on the quote we sent for ${service}. Are you still looking to get this project completed? - A&A Cleaning`,
};

export async function POST(request: Request) {
  try {
    const { leadId, templateId } = await request.json();
    
    if (!leadId || !templateId || !TEMPLATES[templateId as keyof typeof TEMPLATES]) {
      return NextResponse.json({ error: "Invalid leadId or templateId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("name, phone, email, service_type, notes")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const message = TEMPLATES[templateId as keyof typeof TEMPLATES](
      lead.name, 
      lead.service_type || "cleaning services",
      lead.email || "[email]"
    );

    // Send SMS
    const smsResult = await sendSms(lead.phone, message);
    if (!smsResult.sent) {
      return NextResponse.json({ error: `SMS failed: ${smsResult.error}` }, { status: 500 });
    }

    // Update notes
    const newNote = `[${new Date().toLocaleString()}] SMS Sent (${templateId}): ${message}`;
    const updatedNotes = lead.notes ? `${lead.notes}\n\n${newNote}` : newNote;
    
    await supabase.from("leads").update({ notes: updatedNotes }).eq("id", leadId);

    return NextResponse.json({ success: true, message: "SMS sent and notes updated." });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
