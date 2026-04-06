import { ImageResponse } from "next/og";

export const alt = "A&A Cleaning - Construction-ready cleaning in Austin";
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0A1628 0%, #0f2746 65%, #1f3f68 100%)",
          color: "#FFFFFF",
          padding: "56px",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: -1 }}>A&A Cleaning</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 600, maxWidth: 960 }}>
            Construction-ready cleaning across the Austin metro.
          </div>
          <div style={{ fontSize: 30, color: "#C9A94E", fontWeight: 600 }}>
            Post-Construction • Commercial • Turnovers
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
