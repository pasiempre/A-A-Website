"use client";

import { useState } from "react";

import { trackConversionEvent } from "@/lib/analytics";

type FeedbackState = {
  message: string;
  type: "success" | "error";
};

export function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type UseQuoteFormOptions = {
  source: string;
};

export function useQuoteForm({ source }: UseQuoteFormOptions) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const resetForm = () => {
    setName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
    setServiceType("");
    setTimeline("");
    setDescription("");
    setWebsite("");
  };

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          companyName,
          phone,
          email,
          serviceType,
          timeline,
          description,
          website,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback({
          message: "Unable to submit right now. Please call us directly.",
          type: "error",
        });
        await trackConversionEvent({
          eventName: "quote_submit_failed",
          source,
          metadata: { message: body?.error || `HTTP ${response.status}` },
        });
        return;
      }

      await trackConversionEvent({
        eventName: "quote_submit_success",
        source,
        metadata: { serviceType },
      });

      setFeedback({
        message: "Submitted. We’ll call you within the hour.",
        type: "success",
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields: {
      name,
      companyName,
      phone,
      email,
      serviceType,
      timeline,
      description,
      website,
    },
    setters: {
      setName,
      setCompanyName,
      setPhone: (value: string) => setPhone(formatPhoneInput(value)),
      setEmail,
      setServiceType,
      setTimeline,
      setDescription,
      setWebsite,
    },
    isSubmitting,
    feedback,
    submitLead,
  };
}
