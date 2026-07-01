"use client";

import ConversationList from "@/components/ConversationList";
import { useApp } from "@/lib/store";

/** Chats tab — conversation list. Empty → nt4. */
export default function ChatsPage() {
  const { conversations } = useApp();
  const hasThreads = conversations.some((c) => c.messages.length > 0);

  return (
    <div className="flex flex-1 flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="px-[22px] pb-1.5 pt-2">
        <h2 className="text-[30px] font-extrabold text-ink">ჩატები</h2>
      </div>
      {hasThreads ? (
        <div className="mt-3.5 flex-1 rounded-t-[26px] bg-surface px-[22px] pt-5 shadow-[0_-6px_20px_-12px_rgba(82,31,18,0.16)]">
          <ConversationList />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-[34px] text-center">
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-[30px] bg-chip-green text-[50px]">
            💬
          </div>
          <div>
            <h3 className="text-[22px] font-extrabold text-ink">ჯერ მიმოწერა არ არის</h3>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
              დამთხვევის შემდეგ აქ გამოჩნდება საუბრები. პირველი ნაბიჯი შენზეა 🙂
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
