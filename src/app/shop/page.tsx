import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const visible = category ? products.filter((p) => p.category.toLowerCase().includes(category.toLowerCase().replace("tees","tee"))) : products;
  return <main className="k-container py-14 md:py-20"><div className="mb-10"><p className="text-xs font-black uppercase tracking-[.18em]">Klyvo collection</p><h1 className="k-display mt-2 text-6xl md:text-7xl">Shop all</h1><p className="mt-3 max-w-xl text-sm leading-6 text-black/55">Graphic essentials, heavyweight layers and accessories built for everyday rotation.</p></div><div className="k-grid k-grid-4">{visible.map((product) => <Link key={product.id} href={`/product/${product.slug}`} className="group"><div className="relative aspect-[4/5] overflow-hidden bg-[#eceae5]"><Image src={product.image} alt={product.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width:760px) 100vw, 25vw"/></div><div className="pt-4"><div className="text-[11px] uppercase tracking-[.12em] text-black/45">{product.category}</div><div className="mt-1 flex justify-between gap-3"><h2 className="text-sm font-black uppercase">{product.title}</h2><span className="text-sm font-black">${product.price.toFixed(2)}</span></div><p className="mt-1 text-xs text-black/45">{product.subtitle}</p></div></Link>)}</div></main>;
}
