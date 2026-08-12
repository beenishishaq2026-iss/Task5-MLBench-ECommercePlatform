"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const messages = [
  "Free shipping on orders over $50",
  "New seasonal arrivals every week",
  "10% off your first order — code WELCOME10",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem("auric-announcement-dismissed");
    if (dismissed === "true") {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("auric-announcement-dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="relative flex items-center justify-center gap-2 rounded-full border border-brass bg-cream px-10 py-3 text-center text-xs font-semibold tracking-wide text-rust">
        <span className="hidden sm:inline">✦</span>
        <span key={index} className="animate-fade-up">
          {messages[index]}
        </span>
        <span className="hidden sm:inline">✦</span>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-4 text-rust/60 transition-colors hover:text-rust"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}