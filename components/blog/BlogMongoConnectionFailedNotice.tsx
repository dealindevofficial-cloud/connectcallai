type BlogMongoConnectionFailedNoticeProps = {
  /** Optional raw error message (shown in monospace for support/debugging). */
  technical?: string;
};

/** Shown when MongoDB is configured but the driver cannot connect (DNS, IP allowlist, paused cluster, etc.). */
export function BlogMongoConnectionFailedNotice({
  technical,
}: BlogMongoConnectionFailedNoticeProps) {
  const dnsRelated =
    technical?.includes("querySrv") ||
    technical?.includes("ECONNREFUSED") ||
    technical?.includes("ENOTFOUND");

  return (
    <div className="rounded-2xl border border-red-400/35 bg-red-950/25 px-5 py-6 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <h2 className="text-lg font-semibold text-white">Could not reach MongoDB</h2>
      <p className="mt-2 text-sm leading-relaxed text-blue-100/85">
        Your app has a <code className="rounded-md bg-black/35 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-200">MONGODB_URI</code>
        , but the server could not connect. Common fixes:
      </p>
      <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-blue-100/80">
        <li>
          <strong className="text-blue-100">Atlas IP access:</strong> Security → IP Access List → allow your IP or{" "}
          <code className="rounded bg-black/30 px-1 font-mono text-xs text-cyan-200">0.0.0.0/0</code> for dev.
        </li>
        <li>
          <strong className="text-blue-100">Cluster running:</strong> Database → cluster must not be{" "}
          <strong>Paused</strong>.
        </li>
        {dnsRelated ? (
          <li>
            <strong className="text-blue-100">DNS / network:</strong> Errors like{" "}
            <code className="rounded bg-black/30 px-1 font-mono text-xs">querySrv</code> or{" "}
            <code className="rounded bg-black/30 px-1 font-mono text-xs">ECONNREFUSED</code> often mean DNS or VPN/firewall is blocking{" "}
            <code className="rounded bg-black/30 px-1 font-mono text-xs">mongodb+srv</code>. Try another network, turn off VPN, run{" "}
            <code className="rounded bg-black/30 px-1 font-mono text-xs">ipconfig /flushdns</code>, or use Atlas&apos;s{" "}
            <strong>standard</strong> <code className="rounded bg-black/30 px-1 font-mono text-xs">mongodb://</code> connection string instead of{" "}
            <code className="rounded bg-black/30 px-1 font-mono text-xs">mongodb+srv://</code>.
          </li>
        ) : null}
        <li>
          <strong className="text-blue-100">Password:</strong> Special characters in the password must be URL-encoded in the URI.
        </li>
      </ul>
      {technical ? (
        <p className="mt-4 break-all rounded-lg bg-black/30 px-3 py-2 font-mono text-[11px] leading-relaxed text-red-200/90">
          {technical}
        </p>
      ) : null}
      <p className="mt-4 text-xs text-blue-200/55">
        After changing Atlas or <code className="rounded bg-black/30 px-1">.env.local</code>, restart{" "}
        <code className="rounded bg-black/30 px-1">npm run dev</code>.
      </p>
    </div>
  );
}
