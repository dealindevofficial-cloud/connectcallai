import Link from "next/link";
import { AdminLoginForm } from "./ui";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pickFromParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/")) return "/ccai-admin/blog";
  return raw;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const from = pickFromParam(params.from);

  return (
    <main className="relative flex-1 overflow-hidden">
      <section className="landing-section px-6 py-20 sm:px-10">
        <div className="landing-grid pointer-events-none" />
        <div className="landing-noise pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-xl">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Sign in</h1>
            <p className="mt-2 text-sm text-blue-100/85">
              Enter your admin password to manage blog posts.
            </p>

            <AdminLoginForm from={from} />

            <p className="mt-6 text-sm">
              <Link href="/" className="font-medium text-cyan-300 hover:text-cyan-200">
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
