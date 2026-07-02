"use client";

import { useRouter } from "next/navigation";
import { BackButton, Banner, Button, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";
import { useBootstrapped } from "@/lib/useBootstrapped";

/** st2 — irreversible account deletion. */
export default function DeleteAccountPage() {
  const router = useRouter();
  const ready = useBootstrapped();
  const { pets, matches, deleteAccount } = useApp();

  if (!ready) return null;

  return (
    <Screen>
      <div className="mb-2 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-[22px] mt-2 flex flex-col items-center text-center">
        <div className="flex h-[84px] w-[84px] items-center justify-center rounded-3xl bg-danger-soft text-[38px]">
          ⚠️
        </div>
        <h2 className="mt-[18px] text-[26px] font-extrabold text-ink">ანგარიშის წაშლა</h2>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-label">
          ეს მოქმედება <b>შეუქცევადია</b>. წაიშლება სამუდამოდ:
        </p>
      </div>
      <div className="flex-1">
        <div className="rounded-2xl border border-line bg-surface px-4 py-1.5">
          <DeleteRow icon="🐾" label="ცხოველების პროფილები" count={pets.length} />
          <DeleteRow icon="💛" label="დამთხვევები" count={matches.length} />
          <DeleteRow icon="💬" label="მიმოწერა და ისტორია" />
          <DeleteRow icon="📄" label="ატვირთული დოკუმენტები" last />
        </div>
        <div className="mt-3.5">
          <Banner icon="ℹ️">
            კანონის შესაბამისად, მონაცემები 30 დღეში სრულად იშლება სერვერებიდანაც.
          </Banner>
        </div>
      </div>
      <Button
        variant="destructive"
        className="mt-4"
        onClick={() => {
          void deleteAccount().then(() => router.replace("/"));
        }}
      >
        სამუდამოდ წაშლა
      </Button>
      <Button variant="ghost" className="mt-1" onClick={() => router.back()}>
        გაუქმება
      </Button>
    </Screen>
  );
}

function DeleteRow({
  icon,
  label,
  count,
  last,
}: {
  icon: string;
  label: string;
  count?: number;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 py-3 ${last ? "" : "border-b border-fill"}`}>
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-[15px] font-semibold text-ink">{label}</span>
      {count !== undefined && <span className="text-sm font-semibold text-ink-faint">{count}</span>}
    </div>
  );
}
