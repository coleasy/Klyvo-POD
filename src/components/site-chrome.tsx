'use client';

import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const authRoutes = ["/sign-in", "/sign-up", "/sso-callback"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) return <>{children}</>;

  return (
    <>
      <div className="bg-black py-2 text-center text-[11px] font-bold uppercase tracking-[.16em] text-white">
        Free shipping on orders over $75
      </div>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="k-container flex min-h-16 items-center justify-between gap-5">
          <Link href="/" className="k-display text-3xl tracking-[-.06em]">KLYVO</Link>
          <nav className="hidden items-center gap-7 text-[12px] font-extrabold uppercase tracking-[.12em] md:flex">
            <Link href="/shop">Shop</Link>
            <Link href="/shop?category=tees">Tees</Link>
            <Link href="/shop?category=hoodies">Hoodies</Link>
            <Link href="/shop?category=caps">Caps</Link>
            <Link href="/about">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Search size={19} />
            <Link href="/sign-in" aria-label="Sign in"><UserRound size={19} /></Link>
            <Link href="/cart" aria-label="Cart"><ShoppingBag size={19} /></Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="bg-black py-14 text-white">
        <div className="k-container grid gap-10 md:grid-cols-[1.2fr_.8fr_.8fr_1.2fr]">
          <div>
            <div className="k-display text-4xl">KLYVO</div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">Independent streetwear for people who would rather make a statement than blend in.</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[.16em]">Shop</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <Link href="/shop">New Arrivals</Link><Link href="/shop">Graphic Tees</Link><Link href="/shop">Hoodies</Link><Link href="/shop">Caps</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[.16em]">Help</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <Link href="/account/orders">Orders</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[.16em]">Join the list</h3>
            <p className="mt-4 text-sm text-white/65">Drops, restocks and members-only offers.</p>
            <form className="mt-4 flex">
              <input aria-label="Email" placeholder="Email address" className="min-w-0 flex-1 border border-white/25 bg-transparent px-4 py-3 text-sm outline-none" />
              <button className="bg-white px-5 text-xs font-black uppercase text-black">Join</button>
            </form>
          </div>
        </div>
      </footer>
    </>
  );
}
