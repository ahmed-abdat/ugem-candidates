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
            backgroundColor: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              maskImage:
                "radial-gradient(ellipse 50% 50% at 50% 50%, black 70%, transparent 100%)",
            }}
          />

          {/* Gradient Blobs */}
          <div
            style={{
              position: "absolute",
              top: "-40%",
              right: "-40%",
              width: "80%",
              height: "80%",
              borderRadius: "9999px",
              background: "rgba(59, 130, 246, 0.05)",
              filter: "blur(100px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30%",
              left: "-30%",
              width: "70%",
              height: "70%",
              borderRadius: "9999px",
              background: "rgba(59, 130, 246, 0.05)",
              filter: "blur(100px)",
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              padding: "40px",
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(59, 130, 246, 0.1)",
            }}
          >
            {/* Logo */}
            <img
              src="https://i.ibb.co/4Lj0c5D/logo.png"
              alt="UGEM Logo"
              style={{
                width: "160px",
                height: "160px",
                marginBottom: "2rem",
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
              }}
            />

            {/* Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  fontSize: "80px",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                  backgroundClip: "text",
                  color: "transparent",
                  margin: 0,
                  lineHeight: 1,
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                }}
              >
                UGEM
              </h1>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "500",
                  color: "#1E293B",
                  margin: 0,
                  maxWidth: "600px",
                  lineHeight: 1.3,
                }}
              >
                Union Générale des Étudiants Mauritaniens
              </p>
              <p
                style={{
                  fontSize: "20px",
                  color: "#64748B",
                  margin: 0,
                  marginTop: "0.5rem",
                }}
              >
                Plateforme d&apos;inscription et de gestion des membres
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`${e}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
