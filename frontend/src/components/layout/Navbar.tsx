"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Heart, ShoppingBag, Search } from "lucide-react";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/#deals" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brass/30 bg-cream/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl italic tracking-tight text-ink"
        >
          Auric
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink/80 transition-colors hover:text-rust"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-brass/30 bg-white px-4 py-2 lg:flex">
          <Search size={16} className="text-ink/40" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
          />
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/login" className="text-sm font-medium text-ink/80 hover:text-rust">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-rust"
          >
            Sign up
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="text-ink/80 hover:text-rust">
            <Heart size={20} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="text-ink/80 hover:text-rust">
            <ShoppingBag size={20} />
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-brass/30 bg-cream px-6 pb-6 md:hidden">
          <div className="mt-4 flex items-center gap-2 rounded-full border border-brass/30 bg-white px-4 py-2">
            <Search size={16} className="text-ink/40" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
          </div>
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink/80 hover:text-rust"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className="text-sm font-medium text-ink/80 hover:text-rust">
                Log in
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="inline-block rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream"
              >
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}