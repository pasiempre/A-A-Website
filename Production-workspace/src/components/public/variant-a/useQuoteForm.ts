"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { trackConversionEvent } from "@/lib/analytics";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";

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
  enableTwoStep?: boolean;
};

type RequestResult = {
  response?: Response;
  error?: string;
  retryable: boolean;
};

const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
  "ttclid",
] as const;
const ATTRIBUTION_STORAGE_KEY = "aa_attribution_params_v1";

function hasStep2Details(payload: {
  companyName: string;
  email: string;
  timeline: string;
  description: string;
}): boolean {
  return Boolean(
    payload.companyName.trim() ||
      payload.email.trim() ||
      payload.timeline.trim() ||
      payload.description.trim(),
  );
}

function getAttributionParamsFromWindow(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  const incoming = new URLSearchParams(window.location.search);
  const persisted = new URLSearchParams(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "");
  const attribution = new URLSearchParams();

  ATTRIBUTION_QUERY_KEYS.forEach((key) => {
    const value = incoming.get(key) || persisted.get(key);
    if (value) {
      attribution.set(key, value);
    }
  });

  return attribution;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function isRetryableErrorMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("timeout") ||
    normalized.includes("network") ||
    normalized.includes("fetch") ||
    normalized.includes("abort")
  );
}

async function requestWithRetry(url: string, init: RequestInit, maxAttempts = 2): Promise<RequestResult> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, {
        ...init,
        timeoutMs: 12_000,
      });

      if (response.ok) {
        return { response, retryable: false };
      }

      const retryable = isRetryableStatus(response.status);
      if (retryable && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
        continue;
      }

      return { response, retryable };
    } catch (error) {
      const message = error instanceof Error ? error.message : "network_request_failed";
      const retryable = isRetryableErrorMessage(message);

      if (retryable && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
        continue;
      }

      return { error: message, retryable };
    }
  }

  return { error: "request_failed", retryable: true };
}

export function useQuoteForm({ source, enableTwoStep = false }: UseQuoteFormOptions) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [enrichmentToken, setEnrichmentToken] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const hasTrackedStartRef = useRef(false);

  const getHeroVariant = () => {
    if (typeof window === "undefined") {
      return "compact";
    }

    const searchParams = new URLSearchParams(window.location.search);
    const queryVariant = searchParams.get("hero");
    if (queryVariant === "compact" || queryVariant === "75") {
      return "compact";
    }
    if (queryVariant === "default" || queryVariant === "100") {
      return "default";
    }

    return window.localStorage.getItem("hero_mobile_variant_v2") ?? "compact";
  };

  const markFormStarted = () => {
    if (hasTrackedStartRef.current) {
      return;
    }

    hasTrackedStartRef.current = true;
    void trackConversionEvent({
      eventName: "quote_form_started",
      source,
      metadata: {
        entry_method: "focus",
      },
    });
  };

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setCanRetry(false);
    setIsSubmitting(true);

    try {
      if (enableTwoStep && currentStep === 1) {
        if (!name.trim() || !phone.trim() || !serviceType.trim()) {
          setFeedback({
            message: "Name, phone, and service type are required to continue.",
            type: "error",
          });
          setCanRetry(false);
          return;
        }

        const stepOneResult = await requestWithRetry("/api/quote-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            flowStep: "step1",
            name,
            phone,
            serviceType,
            website,
          }),
        });

        if (stepOneResult.error) {
          setFeedback({
            message: "Unable to submit right now. Please try again or call us directly.",
            type: "error",
          });
          setCanRetry(stepOneResult.retryable);
          await trackConversionEvent({
            eventName: "quote_submit_failed",
            source,
            metadata: { message: stepOneResult.error, step: 1 },
          });
          return;
        }

        const stepOneResponse = stepOneResult.response;
        if (!stepOneResponse) {
          setFeedback({
            message: "Unable to submit right now. Please try again or call us directly.",
            type: "error",
          });
          setCanRetry(stepOneResult.retryable);
          return;
        }

        if (!stepOneResponse.ok) {
          const body = (await stepOneResponse.json().catch(() => null)) as { error?: string } | null;
          setFeedback({
            message: "Unable to submit right now. Please try again or call us directly.",
            type: "error",
          });
          setCanRetry(stepOneResult.retryable);
          await trackConversionEvent({
            eventName: "quote_submit_failed",
            source,
            metadata: { message: body?.error || `HTTP ${stepOneResponse.status}`, step: 1 },
          });
          return;
        }

        const stepOneBody = (await stepOneResponse.json().catch(() => null)) as { leadId?: string; enrichmentToken?: string } | null;
        const createdLeadId = stepOneBody?.leadId?.trim() ?? "";
        const createdEnrichmentToken = stepOneBody?.enrichmentToken?.trim() ?? "";
        if (!createdLeadId) {
          setFeedback({
            message: "We received your request but could not continue to step 2. Please try again.",
            type: "error",
          });
          setCanRetry(false);
          await trackConversionEvent({
            eventName: "quote_submit_failed",
            source,
            metadata: { message: "missing_lead_id_after_step1", step: 1 },
          });
          return;
        }

        if (!createdEnrichmentToken) {
          setFeedback({
            message: "We received your request but could not secure step 2. Please try again.",
            type: "error",
          });
          setCanRetry(false);
          await trackConversionEvent({
            eventName: "quote_submit_failed",
            source,
            metadata: { message: "missing_enrichment_token_after_step1", step: 1 },
          });
          return;
        }

        setLeadId(createdLeadId);
        setEnrichmentToken(createdEnrichmentToken);
        setCurrentStep(2);
        setFeedback({
          message: "Great. Add optional project details to speed up your quote.",
          type: "success",
        });
        setCanRetry(false);

        await trackConversionEvent({
          eventName: "quote_step1_completed",
          source,
          metadata: { serviceType },
        });

        await trackConversionEvent({
          eventName: "quote_step2_viewed",
          source,
          metadata: { lead_id: createdLeadId },
        });
        return;
      }

      const step2Payload = {
        companyName,
        email,
        timeline,
        description,
      };
      const shouldSkipStep2Submit =
        enableTwoStep && currentStep === 2 && !hasStep2Details(step2Payload);

      const requestResult = shouldSkipStep2Submit
        ? null
        : await requestWithRetry("/api/quote-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              enableTwoStep
                ? {
                    flowStep: "step2",
                    leadId,
                    enrichmentToken,
                    companyName,
                    email,
                    timeline,
                    description,
                    website,
                  }
                : {
                    flowStep: "step1",
                    name,
                    companyName,
                    phone,
                    email,
                    serviceType,
                    timeline,
                    description,
                    website,
                  },
            ),
          });

      if (requestResult?.error) {
        setFeedback({
          message: "Unable to submit right now. Please try again or call us directly.",
          type: "error",
        });
        setCanRetry(requestResult.retryable);
        await trackConversionEvent({
          eventName: "quote_submit_failed",
          source,
          metadata: {
            message: requestResult.error,
            step: enableTwoStep ? currentStep : 1,
            hero_variant: getHeroVariant(),
          },
        });
        return;
      }

      const response = requestResult?.response;
      if (!response && !shouldSkipStep2Submit) {
        setFeedback({
          message: "Unable to submit right now. Please try again or call us directly.",
          type: "error",
        });
        setCanRetry(requestResult?.retryable ?? false);
        return;
      }

      if (response && !response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback({
          message: "Unable to submit right now. Please try again or call us directly.",
          type: "error",
        });
        setCanRetry(requestResult.retryable);
        await trackConversionEvent({
          eventName: "quote_submit_failed",
          source,
          metadata: {
            message: body?.error || `HTTP ${response.status}`,
            step: enableTwoStep ? 2 : 1,
            hero_variant: getHeroVariant(),
          },
        });
        return;
      }

      if (enableTwoStep) {
        if (shouldSkipStep2Submit) {
          await trackConversionEvent({
            eventName: "quote_step2_skipped",
            source,
            metadata: { serviceType },
          });
        }

        await trackConversionEvent({
          eventName: "quote_step2_completed",
          source,
          metadata: { serviceType },
        });
      }

      await trackConversionEvent({
        eventName: "quote_form_submitted",
        source,
        metadata: {
          serviceType,
          hero_variant: getHeroVariant(),
        },
      });

      // F-17: Redirect to confirmation page
      const firstName = name.split(" ")[0] || "";
      const successParams = new URLSearchParams();
      successParams.set("name", firstName);

      const attributionParams = getAttributionParamsFromWindow();
      attributionParams.forEach((value, key) => {
        successParams.set(key, value);
      });

      setCanRetry(false);
      router.push(`/quote/success?${successParams.toString()}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to submit right now. Please try again or call us directly.";
      setFeedback({
        message: "Unable to submit right now. Please try again or call us directly.",
        type: "error",
      });
      setCanRetry(isRetryableErrorMessage(errorMessage));
      await trackConversionEvent({
        eventName: "quote_submit_failed",
        source,
        metadata: {
          message: errorMessage,
          step: enableTwoStep ? currentStep : 1,
          hero_variant: getHeroVariant(),
        },
      });
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
      leadId,
      enrichmentToken,
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
    currentStep,
    isTwoStep: enableTwoStep,
    canRetry,
    submitLead,
    markFormStarted,
    setCurrentStep,
  };
}
