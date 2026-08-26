import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { categories, products } from "@/data/products";

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[640px] overflow-hidden bg-[#c9c3b7] md:min-h-[720px]">
        <Image src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1800&q=90" alt="Klyvo streetwear editorial" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 top-[9%] text-center text-white/95"><p className="k-display k-outline text-[16vw] leading-none md:text-[11vw]">BREAK THE</p></div>
        <div className="relative k-container flex min-h-[640px] items-end pb-16 md:min-h-[720px] md:pb-20">
          <div className="max-w-xl text-white">
            <p className="mb-3 text-xs font-black uppercase tracking-[.22em]">Klyvo / Drop 01</p>
            <h1 className="k-display text-6xl leading-[.88] sm:text-7xl md:text-8xl">Wear the<br/>unexpected.</h1>
            <p className="mt-6 max-w-md text-sm leading-6 text-white/78 md:text-base">Streetwear made for late nights, loud ideas and people who never needed permission to stand out.</p>
            <Link href="/shop" className="k-btn k-btn-light mt-7 gap-3">Shop the drop <ArrowRight size={17}/></Link>
          </div>
        </div>
      </section>

      <section className="bg-[#efeee8] py-20">
        <div className="k-container">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em]">Find your lane</p><h2 className="k-display mt-2 text-5xl md:text-6xl">Shop by category</h2></div><Link href="/shop" className="hidden text-xs font-black uppercase tracking-[.12em] md:flex">View all →</Link></div>
          <div className="k-grid k-grid-4">{categories.map((category) => <Link key={category.name} href={`/shop?category=${encodeURIComponent(category.name)}`} className="group relative aspect-[3/4] overflow-hidden bg-neutral-300"><Image src={category.image} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 760px) 100vw, 25vw"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/><div className="absolute bottom-0 p-5 text-white"><div className="k-display text-3xl">{category.name}</div><div className="mt-1 text-[11px] font-bold uppercase tracking-[.14em]">Explore collection</div></div></Link>)}</div>
        </div>
      </section>

      <section className="py-20">
        <div className="k-container">
          <div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em]">Fresh online</p><h2 className="k-display mt-2 text-5xl md:text-6xl">New arrivals</h2></div><Link href="/shop" className="hidden text-xs font-black uppercase tracking-[.12em] md:block">Shop all →</Link></div>
          <div className="k-grid k-grid-4">{products.slice(0,4).map((product) => <Link key={product.id} href={`/product/${product.slug}`} className="group"><div className="relative aspect-[4/5] overflow-hidden bg-[#eceae5]"><Image src={product.image} alt={product.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width: 760px) 100vw, 25vw"/>{product.isNew && <span className="absolute left-3 top-3 bg-black px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-white">New</span>}</div><div className="pt-4"><div className="text-xs uppercase tracking-[.1em] text-black/45">{product.category}</div><div className="mt-1 flex justify-between gap-4"><h3 className="text-sm font-black uppercase">{product.title}</h3><span className="text-sm font-black">${product.price.toFixed(2)}</span></div><p className="mt-1 text-xs text-black/45">{product.subtitle}</p></div></Link>)}</div>
        </div>
      </section>

      <section className="bg-[#d9f0eb] py-20">
        <div className="k-container grid gap-10 md:grid-cols-2 md:items-center"><div className="relative min-h-[420px] overflow-hidden bg-black"><Image src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85" alt="Klyvo manifesto" fill className="object-cover opacity-85" sizes="50vw"/></div><div className="md:pl-8"><p className="text-xs font-black uppercase tracking-[.2em]">Our statement</p><h2 className="k-display mt-3 text-6xl leading-[.9] md:text-7xl">Ordinary<br/>is optional.</h2><p className="mt-6 max-w-lg text-base leading-7 text-black/65">Klyvo turns everyday essentials into wearable statements. Strong silhouettes, graphic energy and small-batch drops keep every piece intentional.</p><Link href="/about" className="mt-7 inline-flex items-center gap-2 border-b-2 border-black pb-1 text-xs font-black uppercase tracking-[.14em]">Meet Klyvo <ArrowRight size={15}/></Link></div></div>
      </section>

      <section className="border-b border-black/10 py-11"><div className="k-container grid gap-8 md:grid-cols-3">{[[Truck,"Free shipping","On orders over $75"],[RotateCcw,"Easy returns","30-day return window"],[ShieldCheck,"Secure checkout","Protected customer data"]].map(([Icon,title,text]) => { const I = Icon as typeof Truck; return <div key={String(title)} className="flex items-center gap-4"><I size={28}/><div><div className="text-xs font-black uppercase tracking-[.12em]">{String(title)}</div><div className="mt-1 text-sm text-black/45">{String(text)}</div></div></div>})}</div></section>
    </main>
  );
}
