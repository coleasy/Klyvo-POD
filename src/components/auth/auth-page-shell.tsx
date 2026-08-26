import Image from "next/image";
import Link from "next/link";

const AUTH_IMAGE = "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=90";

export default function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative isolate flex min-h-[100svh] overflow-hidden bg-[#11100e] text-white">
      <aside className="relative hidden min-h-[100svh] w-[53%] shrink-0 overflow-hidden bg-[#c9c0b1] lg:block">
        <Image
          src={AUTH_IMAGE}
          alt="Klyvo streetwear editorial"
          fill
          priority
          sizes="53vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-[#11100e]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
        <Link href="/" aria-label="Klyvo home" className="absolute left-8 top-8 z-10 k-display text-5xl tracking-[-.06em] text-white drop-shadow-lg">
          KLYVO
        </Link>
        <div className="absolute bottom-10 left-8 right-8 z-10 max-w-xl">
          <p className="text-[11px] font-black uppercase tracking-[.24em] text-[#c7a16a]">Klyvo / Members</p>
          <p className="k-display mt-3 text-5xl leading-[.92] text-white xl:text-6xl">Be your own<br />standard.</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">Save your details, keep track of orders and get closer to every Klyvo drop.</p>
        </div>
      </aside>

      <section className="relative flex min-h-[100svh] min-w-0 flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full bg-[#b88a52]/12 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[360px] w-[360px] rounded-full bg-white/5 blur-[110px]" />
        <Link href="/" className="absolute left-5 top-5 z-20 k-display text-3xl tracking-[-.05em] text-white lg:hidden">KLYVO</Link>
        <div className="relative z-10 w-full max-w-[520px] rounded-[24px] border border-white/10 bg-[#181612]/92 p-6 shadow-[0_28px_80px_rgba(0,0,0,.38)] backdrop-blur-xl sm:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}
