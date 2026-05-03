"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    const loadingToast = toast.loading("Sending your message…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Unable to submit your message right now.");
      }

      toast.dismiss(loadingToast);
      form.reset();
      setSubmitState("success");
      toast.success("Message sent. Our team will get back to you soon.");
    } catch (error) {
      toast.dismiss(loadingToast);
      const message =
        error instanceof Error ? error.message : "Something went wrong while sending your message.";
      setSubmitState("error");
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/18 bg-[linear-gradient(135deg,rgba(67,84,175,0.38),rgba(20,31,106,0.52))] p-6 shadow-[0_18px_60px_rgba(9,16,65,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.28),transparent_38%),radial-gradient(circle_at_82%_86%,rgba(128,148,255,0.22),transparent_44%)]" />
      <div className="relative">
        <p className="mt-3 text-blue-100/85">
          Share your requirements and our team will get back to you shortly.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            required
            name="name"
            type="text"
            placeholder="Your full name"
            className="w-full rounded-xl border border-white/22 bg-white/8 px-4 py-3 text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none"
          />
          <input
            required
            name="email"
            type="email"
            placeholder="Your email address"
            className="w-full rounded-xl border border-white/22 bg-white/8 px-4 py-3 text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none"
          />
          <textarea
            required
            name="message"
            rows={6}
            placeholder="Tell us about your business, call volume, and what you need."
            className="w-full resize-y rounded-xl border border-white/22 bg-white/8 px-4 py-3 text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitState === "submitting" ? "Sending..." : "Send message"}
          </button>
        </form>

        <p className="mt-3 text-sm text-blue-100/80">
          {submitState === "success"
            ? "Your message has been sent. Our team will contact you soon."
            : submitState === "error"
              ? errorMessage
              : "We usually respond within one business day."}
        </p>
      </div>
    </section>
  );
}
