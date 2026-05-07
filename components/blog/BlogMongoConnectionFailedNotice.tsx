type BlogMongoConnectionFailedNoticeProps = {
  /** Optional technical error text (intentionally not shown to users). */
  technical?: string;
};

/** User-facing fallback when blogs cannot be loaded right now. */
export function BlogMongoConnectionFailedNotice({
  technical: _technical,
}: BlogMongoConnectionFailedNoticeProps) {
  return (
    <div className="rounded-2xl border border-red-400/35 bg-red-950/25 px-5 py-6 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <h2 className="text-lg font-semibold text-white">Blogs temporarily unavailable</h2>
      <p className="mt-2 text-sm leading-relaxed text-blue-100/85">
        We are having trouble loading blogs right now. Please try again in a little while.
      </p>
    </div>
  );
}
