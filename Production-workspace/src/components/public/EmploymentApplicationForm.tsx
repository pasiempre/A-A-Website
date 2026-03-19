"use client";

import { useState } from "react";

export function EmploymentApplicationForm() {
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
    <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={(event) => void submitApplication(event)}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          Nombre completo / Full name
          <input
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </label>
        <label className="text-sm text-slate-700">
          Teléfono / Phone
          <input
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          Correo / Email
          <input
            type="email"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="text-sm text-slate-700">
          Idioma preferido / Preferred language
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={preferredLanguage}
            onChange={(event) => setPreferredLanguage(event.target.value as "es" | "en")}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm text-slate-700">
          City
          <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2" value={city} onChange={(event) => setCity(event.target.value)} />
        </label>
        <label className="text-sm text-slate-700">
          Experience (years)
          <input
            type="number"
            min="0"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={experienceYears}
            onChange={(event) => setExperienceYears(event.target.value)}
          />
        </label>
        <label className="text-sm text-slate-700">
          Transportation
          <select className="mt-1 w-full rounded border border-slate-300 px-3 py-2" value={hasTransportation} onChange={(event) => setHasTransportation(event.target.value)}>
            <option value="yes">Yes / Sí</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>

      <label className="block text-sm text-slate-700">
        Eligible to work in the U.S. / Elegible para trabajar en EE.UU.
        <select className="mt-1 w-full rounded border border-slate-300 px-3 py-2" value={isEligibleToWork} onChange={(event) => setIsEligibleToWork(event.target.value)}>
          <option value="yes">Yes / Sí</option>
          <option value="no">No</option>
        </select>
      </label>

      <label className="block text-sm text-slate-700">
        Availability / Disponibilidad
        <textarea
          rows={3}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={availabilityText}
          onChange={(event) => setAvailabilityText(event.target.value)}
        />
      </label>

      <label className="block text-sm text-slate-700">
        Notes / Notas
        <textarea rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" value={notes} onChange={(event) => setNotes(event.target.value)} />
      </label>

      {statusText ? <p className="text-sm text-emerald-700">{statusText}</p> : null}
      {errorText ? <p className="text-sm text-rose-600">{errorText}</p> : null}

      <button type="submit" disabled={isSubmitting} className="rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
        {isSubmitting ? "Submitting..." : preferredLanguage === "es" ? "Enviar solicitud" : "Submit application"}
      </button>
    </form>
  );
}
