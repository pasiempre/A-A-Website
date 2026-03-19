"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type EmployeeAuthClientProps = {
  initialError?: string;
};

export default function EmployeeAuthClient({ initialError }: EmployeeAuthClientProps) {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);

  const errorText = formError ?? (initialError === "role" ? "Your account is not authorized for employee access." : null);

  const sendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setStatusText(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: false,
        },
      });

      if (signInError) {
        setFormError(signInError.message);
        return;
      }

      setStep("verify");
      setStatusText("Code sent. Enter the 6-digit code from SMS.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setStatusText(null);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (verifyError) {
        setFormError(verifyError.message);
        return;
      }

      router.replace("/employee");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">A&A Cleaning</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Portal Empleado</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in with phone OTP (Twilio-compatible flow).</p>

        {step === "phone" ? (
          <form className="mt-8 space-y-5" onSubmit={sendOtp}>
            <label className="block text-sm font-medium text-slate-700">
              Phone Number (E.164)
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                type="tel"
                placeholder="+15125550199"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>

            {errorText ? <p className="text-sm text-red-600">{errorText}</p> : null}
            {statusText ? <p className="text-sm text-green-700">{statusText}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send code"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={verifyOtp}>
            <label className="block text-sm font-medium text-slate-700">
              Verification Code
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
              />
            </label>

            {errorText ? <p className="text-sm text-red-600">{errorText}</p> : null}
            {statusText ? <p className="text-sm text-green-700">{statusText}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Verifying..." : "Verify and sign in"}
            </button>

            <button
              type="button"
              className="w-full text-sm text-slate-600 underline"
              onClick={() => {
                setStep("phone");
                setToken("");
                setFormError(null);
              }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
