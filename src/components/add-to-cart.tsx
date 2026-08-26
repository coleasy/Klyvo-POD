'use client';

import { useState } from "react";

export function AddToCart({ productId, sizes }: { productId: string; sizes: string[] }) {
  const [size, setSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);
  function add() {
    const current = JSON.parse(localStorage.getItem("klyvo-cart") || "[]") as Array<{productId:string;size:string;quantity:number}>;
    const found = current.find((item) => item.productId === productId && item.size === size);
    if (found) found.quantity += 1; else current.push({ productId, size, quantity: 1 });
    localStorage.setItem("klyvo-cart", JSON.stringify(current));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }
  return <div><div className="mt-8"><div className="mb-3 text-xs font-black uppercase tracking-[.14em]">Size</div><div className="flex flex-wrap gap-2">{sizes.map((item) => <button key={item} onClick={() => setSize(item)} className={`min-w-12 border px-4 py-3 text-xs font-black ${size===item ? "border-black bg-black text-white" : "border-black/20"}`}>{item}</button>)}</div></div><button onClick={add} className="k-btn mt-6 w-full">{added ? "Added to cart" : "Add to cart"}</button></div>;
}
