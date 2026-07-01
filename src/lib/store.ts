"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultFilters,
  seedCandidates,
  seedConversations,
  seedOwner,
  seedPets,
} from "./data";
import type {
  Candidate,
  Conversation,
  Filters,
  Message,
  Owner,
  Pet,
  ReportReason,
  VerificationStatus,
} from "./types";

interface Settings {
  notifyMatch: boolean;
  notifyMessage: boolean;
  notifyTips: boolean;
  shareLocation: boolean;
}

interface AppState {
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // gate / session
  agePassed: boolean;
  introSeen: boolean;
  authed: boolean;
  notifPrimed: boolean;
  passAgeGate: () => void;
  finishIntro: () => void;
  /** Demo login — seeds the showcase account (Luna, matches, chats). */
  login: () => void;
  /** Fresh registration — empty account, walks through onboarding. */
  register: (name: string) => void;
  logout: () => void;
  deleteAccount: () => void;
  primeNotifications: () => void;

  // owner
  owner: Owner;
  updateOwner: (patch: Partial<Owner>) => void;
  verification: VerificationStatus;
  submitVerification: () => void;

  // pets
  pets: Pet[];
  activePetId: string | null;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  setActivePet: (id: string) => void;

  // deck
  deckIndex: number;
  likes: string[];
  advanceDeck: () => void;
  rewindDeck: () => void;
  likeCurrent: (candidate: Candidate) => boolean; // returns true on mutual match
  resetDeck: () => void;

  // filters
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;

  // matches & chat
  matches: string[]; // candidate ids
  conversations: Conversation[];
  sendMessage: (conversationId: string, message: Message) => void;
  markRead: (conversationId: string) => void;

  // safety
  blocked: string[];
  reports: { candidateId: string; reason: ReportReason }[];
  block: (candidateId: string) => void;
  unblock: (candidateId: string) => void;
  report: (candidateId: string, reason: ReportReason) => void;

  settings: Settings;
  setSetting: (key: keyof Settings, value: boolean) => void;
}

const freshOwner: Owner = { name: "", location: "თბილისი, საქართველო", about: "", verification: "none" };

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      agePassed: false,
      introSeen: false,
      authed: false,
      notifPrimed: false,
      passAgeGate: () => set({ agePassed: true }),
      finishIntro: () => set({ introSeen: true }),
      login: () =>
        set({
          authed: true,
          owner: seedOwner,
          verification: seedOwner.verification,
          pets: seedPets,
          activePetId: seedPets[0].id,
          matches: seedConversations.map((c) => c.candidateId),
          conversations: seedConversations,
          deckIndex: 0,
          likes: [],
          blocked: [],
          reports: [],
          filters: defaultFilters,
        }),
      register: (name) =>
        set({
          authed: true,
          owner: { ...freshOwner, name },
          verification: "none",
          pets: [],
          activePetId: null,
          matches: [],
          conversations: [],
          deckIndex: 0,
          likes: [],
          blocked: [],
          reports: [],
          filters: defaultFilters,
        }),
      logout: () => set({ authed: false }),
      deleteAccount: () =>
        set({
          authed: false,
          introSeen: false,
          notifPrimed: false,
          owner: freshOwner,
          verification: "none",
          pets: [],
          activePetId: null,
          matches: [],
          conversations: [],
          deckIndex: 0,
          likes: [],
          blocked: [],
          reports: [],
          filters: defaultFilters,
        }),
      primeNotifications: () => set({ notifPrimed: true }),

      owner: freshOwner,
      updateOwner: (patch) => set({ owner: { ...get().owner, ...patch } }),
      verification: "none",
      submitVerification: () => set({ verification: "pending" }),

      pets: [],
      activePetId: null,
      addPet: (pet) =>
        set((s) => ({
          pets: [...s.pets, pet],
          activePetId: s.activePetId ?? pet.id,
        })),
      updatePet: (id, patch) =>
        set((s) => ({ pets: s.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deletePet: (id) =>
        set((s) => {
          const pets = s.pets.filter((p) => p.id !== id);
          return {
            pets,
            activePetId: s.activePetId === id ? (pets[0]?.id ?? null) : s.activePetId,
          };
        }),
      setActivePet: (id) => set({ activePetId: id, deckIndex: 0 }),

      deckIndex: 0,
      likes: [],
      advanceDeck: () => set((s) => ({ deckIndex: s.deckIndex + 1 })),
      rewindDeck: () => set((s) => ({ deckIndex: Math.max(0, s.deckIndex - 1) })),
      likeCurrent: (candidate) => {
        const s = get();
        set({ likes: [...s.likes, candidate.id], deckIndex: s.deckIndex + 1 });
        if (candidate.mutualLike) {
          set((st) => ({
            matches: st.matches.includes(candidate.id) ? st.matches : [candidate.id, ...st.matches],
            conversations: st.conversations.some((c) => c.id === candidate.id)
              ? st.conversations
              : [
                  {
                    id: candidate.id,
                    candidateId: candidate.id,
                    messages: [],
                    unread: 0,
                    lastTime: "ახლა",
                    matchedLabel: "დღეს",
                  },
                  ...st.conversations,
                ],
          }));
          return true;
        }
        return false;
      },
      resetDeck: () => set({ deckIndex: 0 }),

      filters: defaultFilters,
      setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch }, deckIndex: 0 })),
      resetFilters: () => set({ filters: defaultFilters, deckIndex: 0 }),

      matches: [],
      conversations: [],
      sendMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, message], lastTime: "ახლა" }
              : c,
          ),
        })),
      markRead: (conversationId) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, unread: 0 } : c,
          ),
        })),

      blocked: [],
      reports: [],
      block: (candidateId) =>
        set((s) => ({
          blocked: [...new Set([...s.blocked, candidateId])],
          matches: s.matches.filter((m) => m !== candidateId),
        })),
      unblock: (candidateId) =>
        set((s) => ({ blocked: s.blocked.filter((b) => b !== candidateId) })),
      report: (candidateId, reason) =>
        set((s) => ({ reports: [...s.reports, { candidateId, reason }] })),

      settings: { notifyMatch: true, notifyMessage: true, notifyTips: false, shareLocation: true },
      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),
    }),
    {
      name: "atexili-store",
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      partialize: (s) =>
        Object.fromEntries(
          Object.entries(s).filter(([k]) => !["hasHydrated"].includes(k)),
        ) as AppState,
    },
  ),
);

/** Candidates for the active pet after filters + blocks. */
export function selectDeck(s: Pick<AppState, "filters" | "blocked">): Candidate[] {
  return seedCandidates.filter((c) => {
    if (s.blocked.includes(c.id)) return false;
    if (c.species !== s.filters.species) return false;
    if (s.filters.gender !== "all" && c.gender !== s.filters.gender) return false;
    if (c.distanceKm > s.filters.distanceKm) return false;
    if (c.ageYears < s.filters.ageRange[0] || c.ageYears > s.filters.ageRange[1]) return false;
    if (s.filters.verifiedOnly && !c.verified) return false;
    return true;
  });
}

export function getCandidate(id: string): Candidate | undefined {
  return seedCandidates.find((c) => c.id === id);
}
