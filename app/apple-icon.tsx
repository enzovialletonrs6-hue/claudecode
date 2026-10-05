import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffd84a",
        }}
      >
        <svg width="130" height="130" viewBox="0 0 32 32">
          <path
            d="M16 4.5C10.2 4.5 6.5 8.7 6.5 14.4V27.5l3.2-2.4 3.1 2.4 3.2-2.4 3.2 2.4 3.1-2.4 3.2 2.4V14.4C25.5 8.7 21.8 4.5 16 4.5Z"
            fill="#1b1a17"
          />
          <circle cx="12.4" cy="14" r="1.9" fill="#ffd84a" />
          <circle cx="19.6" cy="14" r="1.9" fill="#ffd84a" />
        </svg>
      </div>
    ),
    size,
  );
}
