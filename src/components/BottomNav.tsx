"use client";

import { Flame, Heart, MessageCircle, PawPrint } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/discover", label: "აღმოჩენა", Icon: Flame },
  { href: "/matches", label: "დამთხვევები", Icon: Heart },
  { href: "/chats", label: "ჩატები", Icon: MessageCircle },
  { href: "/pets", label: "ჩემი", Icon: PawPrint },
];

/** Persistent tab bar on the four top-level destinations. */
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-line-nav bg-surface px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5">
      <div className="flex items-center justify-around">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-[3px] ${active ? "text-primary" : "text-ink-disabled"}`}
            >
              <Icon size={21} strokeWidth={2.2} fill={active ? "currentColor" : "none"} />
              <span className={`text-[11px] ${active ? "font-extrabold" : "font-bold"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
