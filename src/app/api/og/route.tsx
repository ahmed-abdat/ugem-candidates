/** @jsxRuntime automatic */
/** @jsxImportSource react */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#020817",
            position: "relative",
          }}
        >
          {/* Glow Effect */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60%",
              height: "512px",
              background:
                "radial-gradient(ellipse at center, rgba(255, 152, 0, 0.15), transparent 70%)",
              opacity: 0.8,
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              display: "flex",
              width: "1000px",
              padding: "48px",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {/* Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                maxWidth: "60%",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 24px",
                  background:
                    "linear-gradient(to right, rgba(255, 152, 0, 0.1), rgba(255, 167, 38, 0.1))",
                  borderRadius: "16px",
                  justifyContent: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#FFA726",
                  }}
                >
                  Plateforme UGEM
                </span>
              </div>

              <div
                style={{
                  fontSize: "56px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.1,
                  marginBottom: "16px",
                }}
              >
                Union Générale
              </div>

              <div
                style={{
                  fontSize: "28px",
                  color: "#94a3b8",
                  lineHeight: 1.4,
                }}
              >
                Des Étudiants Mauritaniens 🎓
              </div>
            </div>

            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "200px",
                height: "200px",
                borderRadius: "24px",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 167, 38, 0.1))",
                border: "1px solid rgba(255, 152, 0, 0.2)",
              }}
            >
              <img
                src="https://i.ibb.co/4Lj0c5D/logo.png"
                alt="UGEM Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          {/* URL */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              padding: "12px 24px",
              borderRadius: "12px",
              background:
                "linear-gradient(to right, rgba(255, 152, 0, 0.1), rgba(255, 167, 38, 0.1))",
              color: "#FFA726",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            ugem-candidates.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: unknown) {
    console.error("OG Image Generation Error:", error);
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#020817",
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          UGEM - Union Générale des Étudiants Mauritaniens
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
