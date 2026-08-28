import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const configured = process.env["NEXT_PUBLIC_SITE_URL"]?.trim();
  if (!configured) return [];

  let origin: string;
  try {
    origin = new URL(configured).origin;
  } catch {
    return [];
  }

  const staticPaths = ["/", "/shop", "/about"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path, index) => ({
    url: `${origin}${path}`,
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${origin}/product/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
