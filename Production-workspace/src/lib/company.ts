export const COMPANY_NAME = "A&A Cleaning Services";
export const COMPANY_SHORT_NAME = "A&A Cleaning";
export const COMPANY_PHONE = "(512) 555-0199";
export const COMPANY_PHONE_E164 = "+15125550199";
export const COMPANY_EMAIL = "AAcleaningservices@outlook.com";
export const COMPANY_CITY = "Austin, Texas";

export const COMPANY_STATS = {
	projectsDelivered: "500+",
	yearsExperience: "15+",
	responseTarget: "1hr",
	executionStandard: "100%",
} as const;

export const COMPANY_HOURS = {
	weekday: { label: "Monday - Friday", hours: "7:00 AM - 6:00 PM" },
	saturday: { label: "Saturday", hours: "8:00 AM - 2:00 PM" },
	sunday: { label: "Sunday", hours: "Closed" },
	summary: "Mon-Fri 7am-6pm - Sat 8am-2pm",
} as const;
