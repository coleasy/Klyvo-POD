export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  compareAt?: number;
  image: string;
  gallery?: string[];
  sizes: string[];
  colors: string[];
  isNew?: boolean;
};

export const products: Product[] = [
  { id: "p1", slug: "klyvo-logo-tee", title: "Klyvo Logo Tee", subtitle: "Heavyweight cotton · Oversized fit", category: "Graphic Tees", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85", sizes: ["S","M","L","XL"], colors: ["Black","White"], isNew: true },
  { id: "p2", slug: "escape-ordinary-hoodie", title: "Escape Ordinary Hoodie", subtitle: "Brushed fleece · Relaxed fit", category: "Hoodies", price: 59.99, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85", sizes: ["S","M","L","XL"], colors: ["Black","Stone"], isNew: true },
  { id: "p3", slug: "night-system-tee", title: "Night System Tee", subtitle: "Midweight cotton · Boxy fit", category: "Graphic Tees", price: 32.99, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=85", sizes: ["S","M","L","XL"], colors: ["Black"], isNew: true },
  { id: "p4", slug: "motion-cap", title: "Motion Cap", subtitle: "Structured crown · Embroidered", category: "Caps", price: 24.99, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85", sizes: ["One Size"], colors: ["Black","Cream"] },
  { id: "p5", slug: "core-sweatshirt", title: "Core Sweatshirt", subtitle: "Premium fleece · Unisex", category: "Sweatshirts", price: 49.99, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85", sizes: ["S","M","L","XL"], colors: ["Black","Grey"] }
];

export const categories = [
  { name: "Graphic Tees", image: products[0].image },
  { name: "Hoodies", image: products[1].image },
  { name: "Caps", image: products[3].image },
  { name: "Sweatshirts", image: products[4].image }
];
