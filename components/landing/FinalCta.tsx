import Link from "next/link";

export function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#18227f] to-[#2a1e77] p-10 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(167,184,255,0.35),transparent_50%)]" />
        <div className="relative space-y-5">
          <h2 className="text-3xl font-semibold text-white md:text-5xl">
            Ready to upgrade every customer call?
          </h2>
          <p className="mx-auto max-w-2xl text-blue-100/85">
            Move from missed opportunities to always-on conversations that
            book, confirm, and convert.
          </p>
          <Link href="/#demo" className="btn-primary inline-flex">
            Book my setup
          </Link>
        </div>
      </div>
    </section>
  );
}
