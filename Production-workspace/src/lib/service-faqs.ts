export type ServiceFaqType = "construction" | "commercial" | "turnover" | "specialty";

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export const SERVICE_FAQS: Record<ServiceFaqType, ServiceFaqItem[]> = {
  construction: [
    {
      question: "Do you handle hazardous debris?",
      answer:
        "We handle standard post-construction debris, drywall dust, paint overspray, and adhesive residue. For hazardous materials, we coordinate with licensed disposal partners required by your site policy.",
    },
    {
      question: "Can you work around active trades and tight handoff dates?",
      answer:
        "Yes. We stage rough and final passes around superintendent timelines so your walkthrough date stays on track without blocking active trade work.",
    },
    {
      question: "What happens if the walkthrough finds cleaning issues?",
      answer:
        "We stand behind the final result. If cleaning-related punch-list items are identified, we return quickly to correct them so the handoff is not delayed.",
    },
  ],
  commercial: [
    {
      question: "Can you clean after business hours?",
      answer:
        "Yes. We offer off-hours and weekend windows so your team arrives to a clean space without disrupting operations.",
    },
    {
      question: "How do you keep quality consistent across recurring visits?",
      answer:
        "We follow scope checklists, supervisor reviews, and recurring communication loops so standards remain consistent over time.",
    },
    {
      question: "Do you support different frequencies for different areas?",
      answer:
        "Absolutely. We can combine daily, weekly, and periodic tasks in one plan based on traffic levels and business needs.",
    },
  ],
  turnover: [
    {
      question: "How fast can you turn vacant units?",
      answer:
        "Most turnovers are scheduled within 24-48 hours depending on volume and access. We prioritize vacancy-critical units whenever possible.",
    },
    {
      question: "Do you report damage or maintenance issues while cleaning?",
      answer:
        "Yes. Our crews flag visible issues during the turnover and communicate them so your team can resolve maintenance items faster.",
    },
    {
      question: "Can you support multi-unit turnovers in one property?",
      answer:
        "Yes. We scale crews based on unit count and timeline to keep leasing and move-in schedules on pace.",
    },
  ],
  specialty: [
    {
      question: "What surfaces are included in windows and power washing service?",
      answer:
        "We typically cover exterior glass, facades, entryways, walkways, and pressure-safe concrete surfaces based on site requirements.",
    },
    {
      question: "Is your equipment safe for delicate finishes?",
      answer:
        "Yes. We choose pressure levels and tools by material type to protect glass, painted surfaces, and surrounding finishes.",
    },
    {
      question: "Can this be scheduled for pre-event or property walkthrough dates?",
      answer:
        "Yes. We can align service windows around launch events, inspections, or final presentation timelines.",
    },
  ],
};
