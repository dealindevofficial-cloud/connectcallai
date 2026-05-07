import Link from "next/link";

/** Generic notice when blog content cannot be loaded. */
export function MongoNotConfiguredNotice() {
  return (
    <div className="rounded-2xl border border-amber-400/35 bg-amber-950/35 px-5 py-6 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <h2 className="text-lg font-semibold text-white">Blog temporarily unavailable</h2>
      <p className="mt-2 text-sm leading-relaxed text-blue-100/85">
        We cannot load blog posts right now. Please try again in a little while.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/" className="font-medium text-cyan-300 hover:text-cyan-200">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
