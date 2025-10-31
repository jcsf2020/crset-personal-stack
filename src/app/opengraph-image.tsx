export const runtime = "edge"; // <- necessario para next/og

import { ImageResponse } from "next/og";
import { site } from "./metadata";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg,#0ea5e9,#1e293b)",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800 }}>{site.name}</div>
        <div style={{ fontSize: 28, marginTop: 16 }}>{site.tagline}</div>
        <div style={{ fontSize: 20, marginTop: 32, opacity: 0.85 }}>
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size
  );
}
