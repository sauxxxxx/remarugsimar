import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Remar Ugsimar — Custom software and websites for your business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const services = ["CRM & lead generation", "Business systems", "AI tools", "Websites"];

// Matches the homepage hero: black, a light Geist-style headline, mint accents, and the portrait.
export default async function OpenGraphImage() {
  // Satori cannot decode WebP, so the card uses a PNG crop of the About portrait.
  const portrait = await readFile(join(process.cwd(), "public/v2/remar-studio-portrait-og.png"));
  const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;
  const geist = await readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#000000",
          color: "#f2f1ed",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 0 52px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#c3c6c4", fontSize: 22 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#8bdbc9" }} />
            Remar Ugsimar · Cebu, Philippines
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 72, fontWeight: 400, letterSpacing: "-0.045em", lineHeight: 1.02 }}>
              Custom software and websites for your business.
            </span>
            <span style={{ marginTop: 26, color: "#a9aeab", fontSize: 25, lineHeight: 1.45 }}>
              Built around how you work, from the first idea to launch.
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {services.map((service) => (
              <span
                key={service}
                style={{
                  display: "flex",
                  padding: "7px 14px",
                  border: "1px solid rgba(139, 219, 201, 0.35)",
                  borderRadius: 999,
                  color: "#8bdbc9",
                  fontSize: 18,
                }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", padding: "16px 16px 16px 48px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img alt="" height={598} src={portraitSrc} style={{ borderRadius: 18, objectFit: "cover" }} width={380} />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: geist, weight: 400, style: "normal" }] },
  );
}
