import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klyvo — Streetwear without the ordinary",
  description: "Graphic tees, hoodies, caps and sweatshirts designed to stand out."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SiteChrome>{children}</SiteChrome>
        </body>
      </html>
    </ClerkProvider>
  );
}
