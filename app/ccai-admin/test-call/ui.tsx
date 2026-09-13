"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Vapi from "@vapi-ai/web";
import type { IndustrySlug } from "@/lib/vapi/assistants";

type IndustryOption = {
  slug: IndustrySlug;
  name: string;
  configured: boolean;
};

type TestCallConsoleProps = {
  options: IndustryOption[];
  publicKeyConfigured: boolean;
};

type CallStatus = "idle" | "connecting" | "live" | "ending" | "ended" | "error";

type TranscriptRole = "user" | "assistant";

type TranscriptTurn = {
  id: number;
  role: TranscriptRole;
  text: string;
};

type PartialTurn = {
  role: TranscriptRole;
  text: string;
};

const STATUS_LABEL: Record<CallStatus, string> = {
  idle: "Ready",
  connecting: "Connecting",
  live: "Live",
  ending: "Ending call",
  ended: "Call ended",
  error: "Problem",
};

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Vapi types the `message` event as `any`, so narrow the one shape we render. */
function readTranscriptMessage(
  message: unknown
): { role: TranscriptRole; text: string; isFinal: boolean } | null {
  if (!isRecord(message) || message.type !== "transcript") return null;

  const text = typeof message.transcript === "string" ? message.transcript.trim() : "";
  if (!text) return null;

  const role: TranscriptRole = message.role === "user" ? "user" : "assistant";
  return { role, text, isFinal: message.transcriptType === "final" };
}

function readErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message) return error.message;
  if (isRecord(error)) {
    if (typeof error.errorMsg === "string" && error.errorMsg.trim()) return error.errorMsg;
    if (typeof error.error === "string" && error.error.trim()) return error.error;
    if (typeof error.message === "string" && error.message.trim()) return error.message;
  }
  return fallback;
}

export function TestCallConsole({ options, publicKeyConfigured }: TestCallConsoleProps) {
  const firstConfigured = useMemo(
    () => options.find((option) => option.configured) ?? options[0],
    [options]
  );

  const [industry, setIndustry] = useState<IndustrySlug>(firstConfigured.slug);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turns, setTurns] = useState<TranscriptTurn[]>([]);
  const [partial, setPartial] = useState<PartialTurn | null>(null);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [muted, setMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const vapiRef = useRef<Vapi | null>(null);
  const turnIdRef = useRef(0);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  const selectedOption = options.find((option) => option.slug === industry) ?? firstConfigured;
  const isBusy = status === "connecting" || status === "live" || status === "ending";

  // Tear the call down if the operator navigates away mid-conversation.
  useEffect(() => {
    return () => {
      const instance = vapiRef.current;
      if (!instance) return;
      vapiRef.current = null;
      instance.removeAllListeners();
      void instance.stop();
    };
  }, []);

  useEffect(() => {
    if (status !== "live") return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [status]);

  // Follow the newest line, unless the operator has scrolled up to re-read
  // something — then leave their position alone until they return to the bottom.
  useEffect(() => {
    const node = transcriptRef.current;
    if (node && stickToBottomRef.current) node.scrollTop = node.scrollHeight;
  }, [turns, partial]);

  const onTranscriptScroll = useCallback(() => {
    const node = transcriptRef.current;
    if (!node) return;
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 80;
  }, []);

  const appendTurn = useCallback((role: TranscriptRole, text: string) => {
    turnIdRef.current += 1;
    setTurns((previous) => [...previous, { id: turnIdRef.current, role, text }]);
  }, []);

  const startCall = useCallback(async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      setStatus("error");
      setErrorMessage(
        "NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set. Add your public key to .env.local and restart the dev server."
      );
      return;
    }

    setStatus("connecting");
    setErrorMessage(null);
    setTurns([]);
    setPartial(null);
    stickToBottomRef.current = true;
    setAssistantSpeaking(false);
    setMicLevel(0);
    setMuted(false);
    setElapsedSeconds(0);

    // Ask for the microphone first: a denied prompt is by far the most common
    // failure, and this reports it plainly instead of as a connection error.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setStatus("error");
      setErrorMessage(
        "Microphone access was blocked. Allow the mic for this site in your browser settings, then try again."
      );
      return;
    }

    let assistantId: string;
    try {
      const response = await fetch(
        `/api/admin/vapi-assistant?industry=${encodeURIComponent(industry)}`
      );
      const payload = (await response.json().catch(() => ({}))) as {
        assistantId?: string;
        error?: string;
      };

      if (!response.ok || !payload.assistantId) {
        setStatus("error");
        setErrorMessage(payload.error ?? "Could not resolve an assistant for this industry.");
        return;
      }
      assistantId = payload.assistantId;
    } catch {
      setStatus("error");
      setErrorMessage("Could not reach the server to resolve the assistant.");
      return;
    }

    try {
      // Loaded on demand: the SDK pulls in a WebRTC transport that needs `window`.
      const { default: VapiClient } = await import("@vapi-ai/web");
      const instance = new VapiClient(publicKey);
      vapiRef.current = instance;

      instance.on("call-start", () => {
        setStatus("live");
        setElapsedSeconds(0);
      });

      instance.on("call-end", () => {
        setStatus("ended");
        setAssistantSpeaking(false);
        setPartial(null);
        setMicLevel(0);
      });

      instance.on("speech-start", () => setAssistantSpeaking(true));
      instance.on("speech-end", () => setAssistantSpeaking(false));
      instance.on("local-volume-level", (level: number) => {
        setMicLevel(Number.isFinite(level) ? Math.min(Math.max(level, 0), 1) : 0);
      });

      instance.on("message", (message: unknown) => {
        const transcript = readTranscriptMessage(message);
        if (!transcript) return;

        if (transcript.isFinal) {
          setPartial(null);
          appendTurn(transcript.role, transcript.text);
          return;
        }
        setPartial({ role: transcript.role, text: transcript.text });
      });

      instance.on("call-start-failed", (event) => {
        setStatus("error");
        setErrorMessage(readErrorMessage(event, "The call failed to start."));
      });

      instance.on("error", (error: unknown) => {
        setStatus("error");
        setErrorMessage(readErrorMessage(error, "The call ended unexpectedly."));
      });

      await instance.start(assistantId);
    } catch (error) {
      setStatus("error");
      setErrorMessage(readErrorMessage(error, "Could not start the call."));
    }
  }, [appendTurn, industry]);

  const endCall = useCallback(async () => {
    const instance = vapiRef.current;
    if (!instance) {
      setStatus("ended");
      return;
    }

    setStatus("ending");
    try {
      await instance.stop();
    } catch {
      // `call-end` may already have fired; the status below is what matters.
    } finally {
      setStatus("ended");
      setAssistantSpeaking(false);
      setPartial(null);
      setMicLevel(0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const instance = vapiRef.current;
    if (!instance) return;
    const next = !instance.isMuted();
    instance.setMuted(next);
    setMuted(next);
  }, []);

  const copyTranscript = useCallback(async () => {
    const text = turns
      .map((turn) => `${turn.role === "user" ? "You" : "Assistant"}: ${turn.text}`)
      .join("\n");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard permission can be denied; nothing to recover here.
    }
  }, [turns]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr]">
      <div className="glass-card rounded-2xl p-6">
        {!publicKeyConfigured ? (
          <div className="mb-5 rounded-xl border border-amber-300/35 bg-amber-400/10 p-4 text-sm text-amber-100">
            <p className="font-semibold">Public key missing</p>
            <p className="mt-1 text-amber-100/85">
              Add <code className="text-amber-50">NEXT_PUBLIC_VAPI_PUBLIC_KEY</code> to{" "}
              <code className="text-amber-50">.env.local</code> and restart the dev server. This is
              the <em>public</em> key from your Vapi dashboard, not the private API key.
            </p>
          </div>
        ) : null}

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
          Choose an assistant
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = option.slug === industry;
            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setIndustry(option.slug)}
                disabled={isBusy || !option.configured}
                title={option.configured ? undefined : "No assistant ID configured for this industry"}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSelected
                    ? "border-[#9ab1ff] bg-[#4e68ff]/25 text-white"
                    : "border-white/20 bg-white/5 text-blue-100/80 hover:border-white/35"
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative flex h-40 w-40 items-center justify-center">
            {status === "live" ? (
              <>
                <span className="absolute inset-0 animate-ping rounded-full bg-[#4e68ff]/20" />
                <span className="absolute inset-4 rounded-full bg-[#6c78ff]/15" />
              </>
            ) : null}
            <button
              type="button"
              onClick={status === "live" || status === "connecting" ? endCall : startCall}
              disabled={status === "ending" || !selectedOption.configured}
              className={`relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
                status === "live" || status === "connecting"
                  ? "bg-gradient-to-br from-rose-500 to-rose-700"
                  : "bg-gradient-to-br from-[#4e68ff] to-[#855dff] hover:brightness-110"
              }`}
            >
              <span aria-hidden className="text-2xl">
                {status === "live" || status === "connecting" ? "■" : "🎙"}
              </span>
              <span className="mt-1 px-2 text-center leading-tight">
                {status === "connecting"
                  ? "Cancel"
                  : status === "live"
                    ? "End call"
                    : status === "ending"
                      ? "Ending…"
                      : "Start talking"}
              </span>
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                status === "live"
                  ? "bg-emerald-400"
                  : status === "connecting" || status === "ending"
                    ? "bg-amber-300"
                    : status === "error"
                      ? "bg-rose-400"
                      : "bg-blue-200/50"
              }`}
            />
            <span className="text-blue-100/85">{STATUS_LABEL[status]}</span>
            <span className="font-mono text-blue-100/70">{formatDuration(elapsedSeconds)}</span>
          </div>

          {status === "live" ? (
            <div className="mt-5 w-full space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-8 items-end gap-1">
                  {Array.from({ length: 7 }).map((_, index) =>
                    assistantSpeaking ? (
                      <span key={index} className="wave-bar h-8 w-1.5 rounded-full" />
                    ) : (
                      <span key={index} className="h-1.5 w-1.5 rounded-full bg-blue-200/30" />
                    )
                  )}
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-blue-100/70">
                  {assistantSpeaking ? "Assistant speaking" : "Listening to you"}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-blue-100/60">
                  <span>Your mic</span>
                  {muted ? <span className="text-rose-300">Muted</span> : null}
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400 transition-[width] duration-100"
                    style={{ width: `${Math.round((muted ? 0 : micLevel) * 100)}%` }}
                  />
                </div>
              </div>

              <button type="button" onClick={toggleMute} className="btn-secondary w-full justify-center">
                {muted ? "Unmute microphone" : "Mute microphone"}
              </button>
            </div>
          ) : null}

          {errorMessage ? (
            <p className="mt-5 rounded-xl border border-rose-400/35 bg-rose-500/10 p-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div className="glass-card flex h-[26rem] flex-col rounded-2xl p-6 lg:h-[34rem]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
            Live transcript
          </p>
          {turns.length > 0 ? (
            <button
              type="button"
              onClick={copyTranscript}
              className="text-xs text-blue-200/80 underline underline-offset-4 hover:text-white"
            >
              Copy
            </button>
          ) : null}
        </div>

        <div
          ref={transcriptRef}
          onScroll={onTranscriptScroll}
          className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1"
        >
          {turns.length === 0 && !partial ? (
            <p className="text-sm text-blue-100/55">
              {status === "live"
                ? "Say hello — the transcript appears here as you talk."
                : `Start a call to hear the ${selectedOption.name} assistant.`}
            </p>
          ) : null}

          {turns.map((turn) => (
            <div
              key={turn.id}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                turn.role === "user"
                  ? "ml-auto bg-[#4e68ff]/25 text-white"
                  : "bg-white/8 text-blue-50/90"
              }`}
            >
              <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-blue-100/55">
                {turn.role === "user" ? "You" : selectedOption.name}
              </p>
              {turn.text}
            </div>
          ))}

          {partial ? (
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm italic opacity-60 ${
                partial.role === "user"
                  ? "ml-auto bg-[#4e68ff]/15 text-white"
                  : "bg-white/5 text-blue-50/80"
              }`}
            >
              {partial.text}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
