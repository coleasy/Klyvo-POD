import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { AddToCart } from "@/components/add-to-cart";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <main className="k-container grid gap-10 py-12 md:grid-cols-[1.15fr_.85fr] md:py-16"><div className="relative min-h-[520px] overflow-hidden bg-[#eeeae2] md:min-h-[720px]"><Image src={product.image} alt={product.title} fill priority className="object-cover" sizes="(max-width:760px) 100vw, 60vw"/></div><div className="md:sticky md:top-28 md:self-start"><p className="text-xs font-black uppercase tracking-[.16em] text-black/45">{product.category}</p><h1 className="k-display mt-2 text-5xl md:text-6xl">{product.title}</h1><p className="mt-3 text-sm text-black/55">{product.subtitle}</p><div className="mt-5 text-2xl font-black">${product.price.toFixed(2)}</div><p className="mt-6 border-y border-black/10 py-6 text-sm leading-7 text-black/65">A Klyvo essential built around a relaxed streetwear silhouette, durable print treatment and a premium hand feel. Made for repeat wear, not one-off moments.</p><div className="mt-6"><div className="mb-3 text-xs font-black uppercase tracking-[.14em]">Color</div><div className="flex gap-2">{product.colors.map((color) => <span key={color} className="border border-black/20 px-4 py-3 text-xs font-bold">{color}</span>)}</div></div><AddToCart productId={product.id} sizes={product.sizes}/><div className="mt-6 grid gap-3 text-xs text-black/55"><p>• Free shipping over $75</p><p>• 30-day returns</p><p>• Secure checkout</p></div></div></main>;
}
