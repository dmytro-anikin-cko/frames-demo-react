
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* CKO Frames CDN */}
        <Script strategy="beforeInteractive" src="https://cdn.checkout.com/js/framesv2.min.js" />

        {/* Klarna JS SDK */}
        <Script strategy="beforeInteractive" src="https://x.klarnacdn.net/kp/lib/v1/api.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
