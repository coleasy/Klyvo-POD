import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configured = process.env["NEXT_PUBLIC_SITE_URL"]?.trim();
  let origin: string | null = null;

  if (configured) {
    try {
      origin = new URL(configured).origin;
    } catch {
      origin = null;
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/sign-in", "/sign-up", "/sso-callback"],
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml`, host: origin } : {}),
  };
}
