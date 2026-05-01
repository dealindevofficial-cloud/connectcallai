export function BackgroundFX() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="landing-vignette" />
      <div className="landing-grid" />
      <div className="landing-noise" />
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />
      <div className="glow-orb glow-orb-accent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(83,126,255,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(49,200,255,0.12),transparent_55%)]" />
    </div>
  );
}
