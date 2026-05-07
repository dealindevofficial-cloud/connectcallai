import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Path without query, e.g. `/blog` */
  basePath?: string;
  /** Extra query pairs preserved across pages (e.g. `industry`). */
  extraSearchParams?: Record<string, string | undefined>;
};

function buildHref(
  basePath: string,
  pageNum: number,
  extra?: Record<string, string | undefined>
): string {
  const q = new URLSearchParams();
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) q.set(k, v);
    }
  }
  if (pageNum > 1) q.set("page", String(pageNum));
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function Pagination({
  page,
  totalPages,
  basePath = "/blog",
  extraSearchParams,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefForPage = (p: number) => buildHref(basePath, p, extraSearchParams);

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Blogs pagination"
    >
      {page > 1 ? (
        <Link
          href={hrefForPage(page - 1)}
          className="rounded-lg border border-[#BFDBFE] bg-white px-4 py-2 text-sm font-medium text-[#1E3A8A] transition-colors hover:bg-[#DBEAFE]"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-[#CBD5E1] bg-slate-100 px-4 py-2 text-sm text-slate-400">
          Previous
        </span>
      )}
      <span className="px-3 text-sm text-slate-700">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={hrefForPage(page + 1)}
          className="rounded-lg border border-[#BFDBFE] bg-white px-4 py-2 text-sm font-medium text-[#1E3A8A] transition-colors hover:bg-[#DBEAFE]"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg border border-[#CBD5E1] bg-slate-100 px-4 py-2 text-sm text-slate-400">
          Next
        </span>
      )}
    </nav>
  );
}
