import { ImageResponse } from "next/og";

export const alt = "Remar Ugsimar — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const focusAreas = ["SaaS", "CRM", "Applied AI", "Web"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "58px 64px 52px",
          background: "#f7f7f5",
          color: "#181816",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.3,
            backgroundImage: "radial-gradient(#a6a69f 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage: "linear-gradient(to left, black, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#666661",
            fontSize: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#178f67",
                boxShadow: "0 0 0 5px #d8f3e7",
              }}
            />
            Available for freelance work
          </div>
          <span>CEBU · PH</span>
        </div>

        <div
          style={{
            zIndex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div style={{ display: "flex", maxWidth: 790, flexDirection: "column" }}>
            <span style={{ color: "#666661", fontSize: 26 }}>Full-Stack Developer</span>
            <span
              style={{
                marginTop: 18,
                fontFamily: "sans-serif",
                fontSize: 78,
                fontWeight: 700,
                letterSpacing: "-0.055em",
                lineHeight: 0.95,
              }}
            >
              Remar Ugsimar
            </span>
            <span
              style={{
                maxWidth: 720,
                marginTop: 28,
                color: "#666661",
                fontSize: 21,
                lineHeight: 1.55,
              }}
            >
              Building scalable products, practical AI systems, and modern web experiences.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              minWidth: 220,
              flexDirection: "column",
              gap: 12,
              paddingBottom: 4,
              color: "#666661",
              fontSize: 18,
            }}
          >
            {focusAreas.map((area, index) => (
              <div
                key={area}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderBottom: "1px solid #deded9",
                  paddingBottom: 10,
                }}
              >
                <span style={{ color: "#8a8a84", fontSize: 13 }}>0{index + 1}</span>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 20,
            borderTop: "1px solid #deded9",
            color: "#666661",
            fontSize: 17,
          }}
        >
          <span>remarugsimar.com</span>
          <span>SOFTWARE WITH PURPOSE · 2026</span>
        </div>
      </div>
    ),
    size,
  );
}
