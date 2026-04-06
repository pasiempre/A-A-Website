"use client";

import { useId, useState } from "react";

import { formatPhoneInput } from "@/components/public/variant-a/useQuoteForm";

export function EmploymentApplicationForm() {
  const formId = useId();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"es" | "en">("es");
  const [city, setCity] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [hasTransportation, setHasTransportation] = useState("yes");
  const [isEligibleToWork, setIsEligibleToWork] = useState("yes");
  const [availabilityText, setAvailabilityText] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusText(null);
    setErrorText(null);

    try {
      const response = await fetch("/api/employment-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          preferredLanguage,
          city,
          experienceYears: experienceYears ? Number(experienceYears) : null,
          hasTransportation: hasTransportation === "yes",
          isEligibleToWork: isEligibleToWork === "yes",
          availabilityText,
          notes,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        if (response.status === 429) {
          setErrorText("Too many submissions. Please try again in an hour.");
          return;
        }

        setErrorText(payload?.error ?? `Unable to submit application (${response.status}).`);
        return;
      }

      setStatusText(preferredLanguage === "es" ? "Solicitud enviada. Te contactaremos pronto." : "Application submitted. We will contact you soon.");
      setFullName("");
      setPhone("");
      setEmail("");
      setCity("");
      setExperienceYears("");
      setAvailabilityText("");
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="surface-panel space-y-4 p-6 md:p-8"
      aria-busy={isSubmitting}
      onSubmit={(event) => void submitApplication(event)}
    >
      <p className="section-kicker">Apply Today</p>
      <h3 className="text-2xl font-semibold tracking-tight text-[#0A1628]">Employment Application</h3>
      <p className="text-sm text-slate-600">
        Complete this form in English or Spanish. Required fields are marked clearly and reviewed quickly.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-fullName`} className="text-sm text-slate-700">
            Nombre completo / Full name
          </label>
          <input
            id={`${formId}-fullName`}
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="text-sm text-slate-700">
            Teléfono / Phone
          </label>
          <input
            id={`${formId}-phone`}
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]"
            value={phone}
            onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-email`} className="text-sm text-slate-700">
            Correo / Email
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-preferredLanguage`} className="text-sm text-slate-700">
            Idioma preferido / Preferred language
          </label>
          <select
            id={`${formId}-preferredLanguage`}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]"
            value={preferredLanguage}
            onChange={(event) => setPreferredLanguage(event.target.value as "es" | "en")}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor={`${formId}-city`} className="text-sm text-slate-700">
            City
          </label>
          <input id={`${formId}-city`} className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]" value={city} onChange={(event) => setCity(event.target.value)} />
        </div>
        <div>
          <label htmlFor={`${formId}-experienceYears`} className="text-sm text-slate-700">
            Experience (years)
          </label>
          <input
            id={`${formId}-experienceYears`}
            type="number"
            min="0"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]"
            value={experienceYears}
            onChange={(event) => setExperienceYears(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-hasTransportation`} className="text-sm text-slate-700">
            Transportation
          </label>
          <select id={`${formId}-hasTransportation`} className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]" value={hasTransportation} onChange={(event) => setHasTransportation(event.target.value)}>
            <option value="yes">Yes / Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-isEligibleToWork`} className="block text-sm text-slate-700">
          Eligible to work in the U.S. / Elegible para trabajar en EE.UU.
        </label>
        <select id={`${formId}-isEligibleToWork`} className="mt-1 w-full rounded border border-slate-300 px-3 py-3 min-h-[44px]" value={isEligibleToWork} onChange={(event) => setIsEligibleToWork(event.target.value)}>
          <option value="yes">Yes / Sí</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${formId}-availabilityText`} className="block text-sm text-slate-700">
          Availability / Disponibilidad
        </label>
        <textarea
          id={`${formId}-availabilityText`}
          rows={3}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-3"
          value={availabilityText}
          onChange={(event) => setAvailabilityText(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`${formId}-notes`} className="block text-sm text-slate-700">
          Notes / Notas
        </label>
        <textarea id={`${formId}-notes`} rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-3" value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>

      {statusText ? <p aria-live="polite" className="text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p aria-live="polite" className="text-sm text-rose-600">{errorText}</p> : null}

      <button type="submit" disabled={isSubmitting} className="cta-primary min-h-[48px] w-full disabled:opacity-60">
        {isSubmitting ? "Submitting..." : preferredLanguage === "es" ? "Enviar solicitud" : "Submit application"}
      </button>

      <p className="text-xs text-slate-500">
        By submitting, you consent to be contacted regarding your application.
      </p>
    </form>
  );
}
