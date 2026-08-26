'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";

type CartItem = { productId:string; size:string; quantity:number };

export default function CartPage(){
  const [items,setItems]=useState<CartItem[]>([]);
  useEffect(()=>{ setItems(JSON.parse(localStorage.getItem("klyvo-cart")||"[]")); },[]);
  const rows=items.map(item=>({ ...item, product: products.find(p=>p.id===item.productId)! })).filter(r=>r.product);
  const subtotal=useMemo(()=>rows.reduce((sum,row)=>sum+row.product.price*row.quantity,0),[rows]);
  function persist(next:CartItem[]){ setItems(next); localStorage.setItem("klyvo-cart",JSON.stringify(next)); }
  function remove(index:number){ persist(items.filter((_,i)=>i!==index)); }
  return <main className="k-container py-14 md:py-20"><h1 className="k-display text-6xl md:text-7xl">Your cart</h1>{rows.length===0?<div className="mt-10 border border-black/10 p-8"><p className="text-black/55">Your cart is empty.</p><Link href="/shop" className="k-btn mt-5">Shop Klyvo</Link></div>:<div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]"><div className="divide-y divide-black/10 border-y border-black/10">{rows.map((row,index)=><div key={`${row.productId}-${row.size}`} className="grid grid-cols-[1fr_auto] gap-5 py-6"><div><div className="text-xs uppercase tracking-[.12em] text-black/45">{row.product.category}</div><h2 className="mt-1 font-black uppercase">{row.product.title}</h2><p className="mt-2 text-sm text-black/55">Size {row.size} · Qty {row.quantity}</p></div><div className="text-right"><div className="font-black">${(row.product.price*row.quantity).toFixed(2)}</div><button onClick={()=>remove(index)} className="mt-3 text-xs font-black uppercase underline">Remove</button></div></div>)}</div><aside className="border border-black/10 p-6"><h2 className="text-sm font-black uppercase tracking-[.12em]">Order summary</h2><div className="mt-6 flex justify-between text-sm"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><p className="mt-2 text-xs text-black/45">Shipping and discounts calculated at checkout.</p><Link href="/checkout" className="k-btn mt-6 w-full">Checkout</Link></aside></div>}</main>
}
