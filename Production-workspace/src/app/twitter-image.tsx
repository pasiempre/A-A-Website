import { ImageResponse } from "next/og";

export const alt = "A&A Cleaning - Austin construction and commercial cleaning";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0A1628 0%, #0f2746 70%, #1f3f68 100%)",
          color: "#FFFFFF",
          padding: "56px",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: -0.8 }}>A&A Cleaning</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 60, lineHeight: 1.07, fontWeight: 600, maxWidth: 980 }}>
            Every Surface. Every Detail. Every Time.
          </div>
          <div style={{ fontSize: 28, color: "#C9A94E", fontWeight: 600 }}>
            Austin metro construction-ready cleaning
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
