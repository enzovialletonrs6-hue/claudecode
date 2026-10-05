"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Barre d'action en bas d'écran sur téléphone : elle n'apparaît que lorsqu'aucun
// autre bouton (ni le pied de page) n'est visible, pour garder l'action sous le pouce.
export function StickyCta({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchors = document.querySelectorAll("[data-cta-anchor]");
    const inView = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      }
      setVisible(inView.size === 0);
    });
    anchors.forEach((anchor) => observer.observe(anchor));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-trait bg-papier px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-200 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <Link
        href={href}
        tabIndex={visible ? 0 : -1}
        data-umami-event="cta-sticky"
        className="bouton w-full"
      >
        {label}
      </Link>
    </div>
  );
}
