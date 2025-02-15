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
                "radial-gradient(ellipse at center, rgba(246, 142, 59, 0.15), transparent 70%)",
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
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 24px",
                  background:
                    "linear-gradient(to right, rgba(246, 142, 59, 0.1), rgba(246, 142, 59, 0.1))",
                  borderRadius: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#F68E3B",
                  }}
                >
                  UGEM
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
                Union Générale des Étudiants Mauritaniens
              </div>

              <div
                style={{
                  fontSize: "28px",
                  color: "#94a3b8",
                  lineHeight: 1.4,
                }}
              >
                Plateforme d'inscription et de gestion des membres
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
                  "linear-gradient(135deg, rgba(246, 142, 59, 0.1), rgba(246, 142, 59, 0.1))",
                border: "1px solid rgba(246, 142, 59, 0.2)",
              }}
            >
              <img
                src="https://i.ibb.co/4Lj0c5D/logo.png"
                alt="UGEM Logo"
                style={{
                  width: "180px",
                  height: "180px",
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
                "linear-gradient(to right, rgba(246, 142, 59, 0.1), rgba(246, 142, 59, 0.1))",
              color: "#F68E3B",
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
  } catch (error) {
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
          Union Générale des Étudiants Mauritaniens - UGEM
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
