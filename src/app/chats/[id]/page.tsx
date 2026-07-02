"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Plus, SendHorizontal } from "lucide-react";
import PetPhoto from "@/components/PetPhoto";
import Sheet from "@/components/Sheet";
import BlockDialog from "@/components/BlockDialog";
import { BackButton, VerifiedBadge } from "@/components/ui";
import { GRADIENTS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { uploadPhoto } from "@/lib/upload";
import { useBootstrapped } from "@/lib/useBootstrapped";
import type { Message } from "@/lib/types";

/** ch2 — chat thread, plus ca1/ca2 — attachment sheet & rich messages. */
export default function ChatThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const ready = useBootstrapped();
  const s = useApp();
  const conversation = s.matches.find((m) => m.id === id);
  const candidate = conversation?.candidate;
  const [text, setText] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) s.markRead(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, conversation !== undefined]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, [conversation?.messages.length]);

  if (!ready) return null;
  if (!conversation || !candidate) return null;

  const send = (msg: Pick<Message, "kind" | "text" | "photo" | "place">) => {
    void s.sendMessage(id, msg);
    setAttachOpen(false);
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* header */}
      <div className="flex flex-none items-center gap-3 border-b border-line-nav bg-surface px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
        <BackButton onClick={() => router.back()} className="h-[38px] w-[38px] rounded-[11px]" />
        <PetPhoto photo={candidate.photos[0]} emojiSize={22} className="h-11 w-11 flex-none rounded-full" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[5px]">
            <span className="text-[17px] font-extrabold text-ink">{candidate.name}</span>
            {candidate.verified && <VerifiedBadge size={16} />}
          </div>
          <div className="text-xs font-semibold text-ink-muted">
            მფლობელი · {candidate.ownerName}
          </div>
        </div>
        <button
          aria-label="მეტი"
          onClick={() => setMenuOpen(true)}
          className="flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-full text-ink-faint hover:bg-fill"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* messages */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-[18px] pb-2 pt-[18px]">
        <div className="my-0.5 mb-2.5 text-center">
          <span className="inline-block rounded-full bg-terracotta-100 px-3.5 py-[7px] text-xs font-bold text-primary-hover">
            💛 თქვენ დაემთხვიეთ · {conversation.matchedLabel}
          </span>
        </div>
        {conversation.messages.map((m, i) => {
          const mine = m.from === "me";
          const lastMineIdx = conversation.messages.reduce(
            (acc, msg, j) => (msg.from === "me" ? j : acc),
            -1,
          );
          const showReceipt = mine && i === lastMineIdx;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              {m.kind === "text" && (
                <div
                  className={`max-w-[76%] px-[15px] py-[11px] text-[15px] leading-[1.4] ${
                    mine
                      ? "rounded-[18px] rounded-br-[5px] bg-primary text-white"
                      : "rounded-[18px] rounded-bl-[5px] bg-line text-ink"
                  }`}
                >
                  {m.text}
                </div>
              )}
              {m.kind === "image" && m.photo && (
                <div
                  className={`max-w-[70%] overflow-hidden shadow-[0_8px_18px_-10px_rgba(82,31,18,0.3)] ${
                    mine ? "rounded-[18px] rounded-br-[5px]" : "rounded-[18px] rounded-bl-[5px]"
                  }`}
                >
                  <PetPhoto photo={m.photo} emojiSize={76} className="h-[180px] w-[220px]" />
                </div>
              )}
              {m.kind === "location" && m.place && (
                <div
                  className={`max-w-[74%] overflow-hidden border border-line bg-surface shadow-[0_6px_14px_-8px_rgba(82,31,18,0.24)] ${
                    mine ? "rounded-[18px] rounded-br-[5px]" : "rounded-[18px] rounded-bl-[5px]"
                  }`}
                >
                  <div
                    className="relative flex h-[110px] items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#DDE8DA,#C3D6C9)" }}
                  >
                    <span className="text-[34px]">📍</span>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 22px), repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 22px)",
                      }}
                    />
                  </div>
                  <div className="px-3.5 py-[11px]">
                    <div className="text-sm font-bold text-ink">{m.place.name}</div>
                    <div className="mt-0.5 text-xs font-medium text-ink-muted">{m.place.address}</div>
                  </div>
                </div>
              )}
              {showReceipt ? (
                <span className="mt-1 text-[11px] font-semibold text-ink-faint">
                  {m.read ? `წაკითხულია · ${m.time}` : m.time}
                </span>
              ) : (
                m.kind !== "text" &&
                mine && (
                  <span className="mt-1 text-[11px] font-semibold text-ink-faint">{m.time}</span>
                )
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* input bar */}
      <div className="flex flex-none items-center gap-2.5 border-t border-line-nav bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
        <button
          aria-label="დანართი"
          onClick={() => setAttachOpen(!attachOpen)}
          className={`flex h-[42px] w-[42px] flex-none cursor-pointer items-center justify-center rounded-full transition-all duration-[220ms] ${
            attachOpen ? "rotate-45 bg-primary text-white" : "bg-fill text-ink-muted"
          }`}
        >
          <Plus size={22} />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              send({ kind: "text", text: text.trim() });
              setText("");
            }
          }}
          placeholder="მესიჯი..."
          className="h-[46px] min-w-0 flex-1 rounded-full bg-fill px-[18px] text-[15px] text-ink outline-none"
        />
        <button
          aria-label="გაგზავნა"
          onClick={() => {
            if (!text.trim()) return;
            send({ kind: "text", text: text.trim() });
            setText("");
          }}
          className="flex h-[46px] w-[46px] flex-none cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_14px_-6px_rgba(226,100,59,0.6)] transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
        >
          <SendHorizontal size={20} />
        </button>
      </div>

      {/* ca1 — attachment sheet */}
      <Sheet open={attachOpen} onClose={() => setAttachOpen(false)}>
        <div className="grid grid-cols-2 gap-3">
          <AttachTile
            icon="🖼️"
            iconBg="bg-terracotta-100"
            label="ფოტოები"
            onFile={(file) =>
              void uploadPhoto(file, { gradient: GRADIENTS.peachGold, emoji: "🐈" }).then((photo) =>
                send({ kind: "image", photo }),
              )
            }
          />
          <AttachTile
            icon="📷"
            iconBg="bg-chip-green"
            label="კამერა"
            capture
            onFile={(file) =>
              void uploadPhoto(file, { gradient: GRADIENTS.coralWarm, emoji: "🐈" }).then((photo) =>
                send({ kind: "image", photo }),
              )
            }
          />
          <AttachTile
            icon="📄"
            iconBg="bg-chip-gold"
            label="ჯანმ. დოკუმენტი"
            onClick={() => send({ kind: "text", text: "📄 ჯანმრთელობის დოკუმენტი — ვაქცინაციის ბარათი" })}
          />
          <AttachTile
            icon="📍"
            iconBg="bg-location-soft"
            label="შეხვედრის ადგილი"
            onClick={() =>
              send({
                kind: "location",
                place: { name: "ვეტ-კლინიკა „ჯანმო“", address: "ვაკე, ჭავჭავაძის 42 · 2.1 კმ" },
              })
            }
          />
        </div>
        <button
          onClick={() => setAttachOpen(false)}
          className="mt-3 h-[52px] w-full cursor-pointer rounded-2xl border border-line bg-surface text-base font-bold text-ink-muted"
        >
          გაუქმება
        </button>
      </Sheet>

      {/* ⋯ menu → report / block action sheet */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-40 mx-auto max-w-[430px]">
            <motion.div
              className="absolute inset-0 bg-[rgba(28,23,18,0.55)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="absolute inset-x-4 bottom-10 flex flex-col gap-2.5"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.34, 1.2, 0.64, 1] }}
            >
              <div className="overflow-hidden rounded-[18px] bg-white">
                <div className="border-b border-[#F0E7DD] p-3.5 text-center text-[13px] font-semibold text-ink-muted">
                  {candidate.name} · {candidate.ownerName}
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(`/report/${candidate.id}`);
                  }}
                  className="w-full cursor-pointer border-b border-[#F0E7DD] p-4 text-center text-base font-bold text-primary-hover hover:bg-cream"
                >
                  ⚑ საჩივრის დაფიქსირება
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setBlockOpen(true);
                  }}
                  className="w-full cursor-pointer p-4 text-center text-base font-extrabold text-danger hover:bg-cream"
                >
                  🚫 დაბლოკვა
                </button>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer rounded-[18px] bg-white p-4 text-center text-base font-bold text-ink"
              >
                გაუქმება
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* sf2 — block confirm */}
      <AnimatePresence>
        {blockOpen && (
          <BlockDialog
            name={candidate.name}
            onCancel={() => setBlockOpen(false)}
            onBlock={() => {
              void s.block(candidate.id).then(() => router.replace("/matches"));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AttachTile({
  icon,
  iconBg,
  label,
  onClick,
  onFile,
  capture,
}: {
  icon: string;
  iconBg: string;
  label: string;
  onClick?: () => void;
  /** when set, the tile opens a file picker instead of firing onClick */
  onFile?: (file: File) => void;
  capture?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      onClick={() => (onFile ? inputRef.current?.click() : onClick?.())}
      className="flex cursor-pointer items-center gap-3.5 rounded-[18px] border border-line bg-surface p-4 text-left transition-colors duration-[160ms] hover:border-terracotta-200"
    >
      <span className={`flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[13px] text-[22px] ${iconBg}`}>
        {icon}
      </span>
      <span className="text-[15px] font-bold leading-tight text-ink">{label}</span>
      {onFile && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          {...(capture ? { capture: "environment" } : {})}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      )}
    </button>
  );
}
