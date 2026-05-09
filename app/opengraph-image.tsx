import { ImageResponse } from "next/og";

export const alt = "CCAI AI voice agent platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(1200px 520px at 12% 15%, #1d4ed8 0%, #0b1f66 40%, #070b3a 100%)",
          color: "#f8fafc",
          padding: "64px 72px",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 1.2 }}>CCAI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 950 }}>
            AI Voice Agents for Real Customer Conversations
          </div>
          <div style={{ fontSize: 30, opacity: 0.92, maxWidth: 980 }}>
            Automate support, sales, and operations with secure, production-ready call workflows.
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.82 }}>connectcallai.com</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
