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
          }}
        >
          {/* Gradient Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
            }}
          />

          {/* Logo */}
          <img
            src="https://i.ibb.co/4Lj0c5D/logo.png"
            alt="UGEM Logo"
            style={{
              width: "180px",
              height: "180px",
              marginBottom: "2rem",
            }}
          />

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "20px",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h1
                style={{
                  fontSize: "72px",
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #1a365d, #2563eb)",
                  backgroundClip: "text",
                  color: "transparent",
                  margin: 0,
                }}
              >
                UGEM
              </h1>
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: "medium",
                  color: "#1a365d",
                  margin: 0,
                }}
              >
                Union Générale des Étudiants Mauritaniens
              </p>
            </div>

            <p
              style={{
                fontSize: "24px",
                color: "#4b5563",
                margin: 0,
                marginTop: "1rem",
              }}
            >
              Plateforme d'inscription et de gestion des membres
            </p>
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
