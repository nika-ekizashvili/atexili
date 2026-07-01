"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { BackButton, SectionLabel, Toggle } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { ReactNode } from "react";

/** st1 — grouped settings. */
export default function SettingsPage() {
  const router = useRouter();
  const { settings, setSetting, blocked, logout } = useApp();

  return (
    <div className="flex min-h-dvh flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="flex items-center gap-3.5 px-[22px] pb-4 pt-2">
        <BackButton />
        <h2 className="text-[26px] font-extrabold text-ink">პარამეტრები</h2>
      </div>

      <div className="flex flex-1 flex-col gap-[22px] px-[22px] pb-10">
        {/* account */}
        <section>
          <SectionLabel>ანგარიში</SectionLabel>
          <Card>
            <Row icon="✉️" label="ელ. ფოსტა" value="nika@example.ge" chevron />
            <Row icon="📱" label="ტელეფონი" value="+995 599···56" chevron />
            <Row icon="🔑" label="პაროლის შეცვლა" chevron last />
          </Card>
        </section>

        {/* notifications */}
        <section>
          <SectionLabel>შეტყობინებები</SectionLabel>
          <Card>
            <Row
              label="ახალი დამთხვევა"
              action={<Toggle small on={settings.notifyMatch} onChange={(v) => setSetting("notifyMatch", v)} />}
            />
            <Row
              label="ახალი მესიჯი"
              action={<Toggle small on={settings.notifyMessage} onChange={(v) => setSetting("notifyMessage", v)} />}
            />
            <Row
              label="რჩევები და სიახლეები"
              action={<Toggle small on={settings.notifyTips} onChange={(v) => setSetting("notifyTips", v)} />}
              last
            />
          </Card>
        </section>

        {/* privacy */}
        <section>
          <SectionLabel>კონფიდენციალურობა</SectionLabel>
          <Card>
            <Row
              label="მდებარეობის გაზიარება"
              action={<Toggle small on={settings.shareLocation} onChange={(v) => setSetting("shareLocation", v)} />}
            />
            <Row icon="🚫" label="დაბლოკილები" value={String(blocked.length)} chevron />
            <Row icon="⬇️" label="ჩემი მონაცემების გადმოწერა" chevron last />
          </Card>
        </section>

        {/* legal */}
        <section>
          <SectionLabel>სამართლებრივი</SectionLabel>
          <Card>
            <Row label="მოხმარების პირობები" chevron />
            <Row label="კონფიდენციალურობის პოლიტიკა" chevron last />
          </Card>
        </section>

        {/* danger zone */}
        <div className="flex flex-col gap-2.5 pb-2">
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="h-[52px] cursor-pointer rounded-2xl border-[1.5px] border-line-strong bg-surface text-base font-bold text-ink-label transition-colors duration-[160ms] hover:bg-cream"
          >
            გასვლა
          </button>
          <Link
            href="/settings/delete"
            className="flex h-[52px] items-center justify-center rounded-2xl text-[15px] font-bold text-danger transition-colors duration-[160ms] hover:bg-danger-soft"
          >
            ანგარიშის წაშლა
          </Link>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-line bg-surface">{children}</div>;
}

function Row({
  icon,
  label,
  value,
  action,
  chevron,
  last,
}: {
  icon?: string;
  label: string;
  value?: string;
  action?: ReactNode;
  chevron?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${last ? "" : "border-b border-fill"}`}
    >
      {icon && (
        <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] bg-fill text-base">
          {icon}
        </span>
      )}
      <span className="flex-1 text-[15px] font-semibold text-ink">{label}</span>
      {value && <span className="text-[13px] font-medium text-ink-faint">{value}</span>}
      {action}
      {chevron && <ChevronRight size={18} className="text-neutral-300" />}
    </div>
  );
}
