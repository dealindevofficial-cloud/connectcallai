export function Footer() {
  return (
    <footer className="footer-shell relative z-10 py-9 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="footer-detail text-xs uppercase tracking-[0.2em]">Crafted with AI Voice</p>

        <a
          href="https://dealindev.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-title text-xl font-semibold uppercase sm:text-2xl"
          aria-label="Visit Deal in Dev website"
        >
          Deal in Dev 2026
        </a>

        <p className="footer-detail text-xs uppercase tracking-[0.2em]">Fast. Smart. Reliable.</p>
      </div>
      <p className="footer-subline mt-4 text-center text-[11px] sm:text-xs">
        Build conversations that convert.
      </p>
    </footer>
  );
}
