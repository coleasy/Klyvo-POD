import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

const title = "Klyvo — Streetwear without the ordinary";
const description = "Graphic tees, hoodies, caps and sweatshirts designed to stand out.";
const configuredSiteUrl = process.env["NEXT_PUBLIC_SITE_URL"]?.trim();
let metadataBase: URL | undefined;

if (configuredSiteUrl) {
  try {
    metadataBase = new URL(configuredSiteUrl);
  } catch {
    metadataBase = undefined;
  }
}

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  ...(metadataBase ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title,
    description,
    type: "website",
    ...(metadataBase ? { url: "/" } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <SiteChrome>{children}</SiteChrome>
        </ClerkProvider>
      </body>
    </html>
  );
}
