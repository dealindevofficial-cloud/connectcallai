import { ImageResponse } from "next/og";

export const alt = "Connect Call AI blogs insights";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function BlogOpenGraphImage() {
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
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
          color: "#f8fafc",
          padding: "64px 72px",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700 }}>CCAI Blogs</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, maxWidth: 900 }}>
            Voice AI Insights, Playbooks, and Product Updates
          </div>
          <div style={{ fontSize: 30, opacity: 0.92, maxWidth: 960 }}>
            Learn how teams scale better customer calls with practical automation patterns.
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.82 }}>connectcallai.com/blog</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
