"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Eye, Truck, ShieldCheck, Award } from "lucide-react";

const items = [
  {
    tab: "Item 1",
    badge: "Sale Arrival",
    category: "Home & Living",
    name: "Handmade Ceramic Pour-Over Set",
    price: 92,
    originalPrice: 118,
    stock: 9,
    description:
      "Stoneware carafe and dripper, hand-thrown and glazed in small batches. Pairs beautifully with morning light.",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    variants: [
      { label: "Handmade", price: 92 },
      { label: "Matte", price: 22 },
      { label: "Linen", price: 74 },
    ],
    activeVariant: 0,
  },
  {
    tab: "Item 2",
    badge: "Restocked",
    category: "Kitchen",
    name: "Washed Linen Table Runner",
    price: 22,
    originalPrice: 34,
    stock: 21,
    description:
      "Pre-washed European linen, stone-dyed in warm earth tones. Softens beautifully with every use.",
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    variants: [
      { label: "Handmade", price: 92 },
      { label: "Matte", price: 22 },
      { label: "Linen", price: 74 },
    ],
    activeVariant: 1,
  },
  {
    tab: "Item 3",
    badge: "Limited Run",
    category: "Apparel",
    name: "Linen Weekend Duffel Bag",
    price: 74,
    originalPrice: 95,
    stock: 14,
    description:
      "Spacious heavyweight canvas and washed linen travel holdall with vegetable-tanned leather handles and solid brass hardware.",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    variants: [
      { label: "Handmade", price: 92 },
      { label: "Matte", price: 22 },
      { label: "Linen", price: 74 },
    ],
    activeVariant: 2,
  },
];

export default function FeaturedSpotlight() {
  const [activeItem, setActiveItem] = useState(2);
  const [activeVariant, setActiveVariant] = useState(items[2].activeVariant);
  const item = items[activeItem];

  const handleTabChange = (index: number) => {
    setActiveItem(index);
    setActiveVariant(items[index].activeVariant);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-brass/20 bg-gradient-to-br from-white to-cream shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-brass/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className="h-2 w-2 rounded-full bg-rust" />
          <span className="rounded-full bg-brass/20 px-3 py-1 text-brass">
            Featured Collection Lookbook
          </span>
          <span className="hidden text-ink/40 sm:inline">
            • Interactive Preview
          </span>
        </div>
        <div className="flex gap-2">
          {items.map((i, idx) => (
            <button
              key={i.tab}
              onClick={() => handleTabChange(idx)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeItem === idx
                  ? "bg-ink text-cream"
                  : "bg-white text-ink/60 hover:text-ink"
              }`}
            >
              {i.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
       
        <div className="relative">
          <img
            src={item.img}
            alt={item.name}
            className="h-72 w-full object-cover md:h-full"
          />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span className="w-fit rounded-full bg-brass px-3 py-1 text-xs font-semibold text-ink">
              {item.badge}
            </span>
            <span className="w-fit rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">
              {item.category}
            </span>
          </div>
          <button
            aria-label="Add to wishlist"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-colors hover:text-rust"
          >
            <Heart size={16} />
          </button>
        </div>

        <div className="flex flex-col justify-center gap-4 px-6 py-8 md:px-10">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
            <span className="text-ink/50">Spotlight Item #{activeItem + 1}</span>
            <span className="text-green-700">
              ⚡ In Stock ({item.stock} left)
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-2xl italic text-ink md:text-3xl">
            {item.name}
          </h3>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-ink">${item.price}.00</span>
            <span className="text-sm text-ink/40 line-through">
              ${item.originalPrice}.00
            </span>
            <span className="rounded-full bg-brass/20 px-2.5 py-1 text-xs font-semibold text-brass">
              Save ${item.originalPrice - item.price}
            </span>
          </div>

          <p className="text-sm text-ink/60">{item.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-rust">
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            <button className="flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-rust hover:text-rust">
              <Eye size={16} />
              Full Details
            </button>
          </div>

          <div className="mt-2 border-t border-brass/20 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
              Select item to preview
            </p>
            <div className="grid grid-cols-3 gap-3">
              {item.variants.map((v, idx) => (
                <button
                  key={v.label}
                  onClick={() => setActiveVariant(idx)}
                  className={`rounded-xl border px-3 py-2 text-center transition-colors ${
                    activeVariant === idx
                      ? "border-rust bg-white"
                      : "border-brass/20 bg-white/60 hover:border-brass"
                  }`}
                >
                  <p className="text-xs font-semibold text-ink">{v.label}</p>
                  <p className="text-xs text-ink/50">${v.price}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 border-t border-brass/20 pt-4 text-xs text-ink/60">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-rust" /> Free Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-rust" /> 2-Year Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={14} className="text-rust" /> Artisan Crafted
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 bg-ink px-6 py-3 text-xs text-cream sm:flex-row">
        <span>
          <span className="rounded-full bg-brass px-2 py-0.5 font-semibold text-ink">
            Coupon Code
          </span>{" "}
          Use <span className="font-semibold text-brass">WELCOME10</span> at
          checkout for 10% off your entire cart
        </span>
        <a href="/products" className="font-medium text-brass hover:underline">
          Browse All 24+ Curated Products →
        </a>
      </div>
    </div>
  );
}