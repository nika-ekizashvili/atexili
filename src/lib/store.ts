"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiError } from "./api";
import type {
  Candidate,
  Filters,
  MatchView,
  Message,
  Owner,
  Pet,
  ReportReason,
  Settings,
  Species,
  VerificationStatus,
} from "./types";

interface BootstrapPayload {
  owner: Owner;
  settings: Settings;
  pets: Pet[];
  matches: MatchView[];
  blockedCount: number;
}

interface AddPetInput {
  name: string;
  species: Species;
  breed: string;
  gender: "female" | "male";
  birthdate: string; // ISO
  bio: string;
  photos: Pet["photos"];
  health: Pet["health"];
  healthTags: string[];
  intent: Pet["intent"];
}

interface AppState {
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // local-only launch flags
  agePassed: boolean;
  introSeen: boolean;
  notifPrimed: boolean;
  passAgeGate: () => void;
  finishIntro: () => void;
  primeNotifications: () => void;

  // session
  authed: boolean;
  bootstrapped: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  /** Fetches everything after login / on app load. */
  loadBootstrap: () => Promise<void>;

  // owner
  owner: Owner;
  verification: VerificationStatus;
  settings: Settings;
  blockedCount: number;
  updateOwner: (patch: Partial<Owner>) => Promise<void>;
  setSetting: (key: keyof Settings, value: boolean) => void;
  submitVerification: () => Promise<void>;

  // pets
  pets: Pet[];
  activePetId: string | null;
  addPet: (input: AddPetInput) => Promise<void>;
  updatePet: (id: string, patch: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  setActivePet: (id: string) => void;

  // deck
  deck: Candidate[];
  deckIndex: number;
  deckLoading: boolean;
  fetchDeck: () => Promise<void>;
  likeCurrent: (candidate: Candidate) => Promise<MatchView | null>;
  nopeCurrent: (candidate: Candidate) => Promise<void>;
  rewindDeck: () => Promise<void>;

  // filters
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;

  // matches & chat
  matches: MatchView[];
  sendMessage: (
    matchId: string,
    input: Pick<Message, "kind" | "text" | "photo" | "place">,
  ) => Promise<void>;
  markRead: (matchId: string) => void;

  // safety
  block: (candidatePetId: string) => Promise<void>;
  report: (candidatePetId: string, reason: ReportReason) => Promise<void>;
}

const emptyOwner: Owner = {
  name: "",
  location: "თბილისი, საქართველო",
  about: "",
  verification: "none",
};

const defaultSettings: Settings = {
  notifyMatch: true,
  notifyMessage: true,
  notifyTips: false,
  shareLocation: true,
};

export const defaultFiltersFor = (pet?: Pet | null): Filters => ({
  species: pet?.species ?? "cat",
  openToCompatibleBreeds: false,
  gender: pet ? (pet.gender === "female" ? "male" : "female") : "male",
  distanceKm: 10,
  ageRange: [1, 6],
  verifiedOnly: true,
});

function deckParams(petId: string, f: Filters): string {
  return new URLSearchParams({
    petId,
    species: f.species,
    gender: f.gender,
    distanceKm: String(f.distanceKm),
    ageMin: String(f.ageRange[0]),
    ageMax: String(f.ageRange[1]),
    verifiedOnly: String(f.verifiedOnly),
  }).toString();
}

const loggedOutState = {
  authed: false,
  bootstrapped: false,
  owner: emptyOwner,
  verification: "none" as VerificationStatus,
  settings: defaultSettings,
  blockedCount: 0,
  pets: [],
  activePetId: null,
  deck: [],
  deckIndex: 0,
  matches: [],
  filters: defaultFiltersFor(null),
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      agePassed: false,
      introSeen: false,
      notifPrimed: false,
      passAgeGate: () => set({ agePassed: true }),
      finishIntro: () => set({ introSeen: true }),
      primeNotifications: () => set({ notifPrimed: true }),

      authed: false,
      bootstrapped: false,

      login: async (email, password) => {
        await api("/api/auth/login", { method: "POST", body: { email, password } });
        set({ authed: true });
        await get().loadBootstrap();
      },

      register: async (name, email, password) => {
        await api("/api/auth/register", { method: "POST", body: { name, email, password } });
        set({ authed: true, notifPrimed: false });
        await get().loadBootstrap();
      },

      logout: async () => {
        await api("/api/auth/logout", { method: "POST" }).catch(() => {});
        set(loggedOutState);
      },

      deleteAccount: async () => {
        await api("/api/me", { method: "DELETE" });
        set({ ...loggedOutState, introSeen: false, notifPrimed: false });
      },

      loadBootstrap: async () => {
        try {
          const data = await api<BootstrapPayload>("/api/bootstrap");
          const keepActive = data.pets.some((p) => p.id === get().activePetId);
          const activePetId = keepActive ? get().activePetId : (data.pets[0]?.id ?? null);
          const activePet = data.pets.find((p) => p.id === activePetId) ?? null;
          set({
            authed: true,
            bootstrapped: true,
            owner: data.owner,
            verification: data.owner.verification,
            settings: data.settings,
            blockedCount: data.blockedCount,
            pets: data.pets,
            activePetId,
            matches: data.matches,
            ...(keepActive ? {} : { filters: defaultFiltersFor(activePet) }),
          });
          await get().fetchDeck();
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) set(loggedOutState);
          else throw e;
        }
      },

      owner: emptyOwner,
      verification: "none",
      settings: defaultSettings,
      blockedCount: 0,

      updateOwner: async (patch) => {
        const data = await api<{ owner: Owner }>("/api/me", { method: "PATCH", body: patch });
        set({ owner: data.owner });
      },

      setSetting: (key, value) => {
        set((s) => ({ settings: { ...s.settings, [key]: value } }));
        api("/api/me", { method: "PATCH", body: { [key]: value } }).catch(() => {});
      },

      submitVerification: async () => {
        const data = await api<{ verification: VerificationStatus }>("/api/me/verification", {
          method: "POST",
        });
        set({ verification: data.verification, owner: { ...get().owner, verification: data.verification } });
      },

      pets: [],
      activePetId: null,

      addPet: async (input) => {
        const data = await api<{ pet: Pet }>("/api/pets", { method: "POST", body: input });
        const first = get().pets.length === 0;
        set((s) => ({
          pets: [...s.pets, data.pet],
          ...(first ? { activePetId: data.pet.id, filters: defaultFiltersFor(data.pet) } : {}),
        }));
        if (first) await get().fetchDeck();
      },

      updatePet: async (id, patch) => {
        const data = await api<{ pet: Pet }>(`/api/pets/${id}`, { method: "PATCH", body: patch });
        set((s) => ({ pets: s.pets.map((p) => (p.id === id ? data.pet : p)) }));
      },

      deletePet: async (id) => {
        await api(`/api/pets/${id}`, { method: "DELETE" });
        const pets = get().pets.filter((p) => p.id !== id);
        const activePetId = get().activePetId === id ? (pets[0]?.id ?? null) : get().activePetId;
        set({ pets, activePetId });
        if (get().activePetId !== null) await get().fetchDeck();
        else set({ deck: [], deckIndex: 0 });
      },

      setActivePet: (id) => {
        const pet = get().pets.find((p) => p.id === id);
        set({ activePetId: id, filters: defaultFiltersFor(pet), deckIndex: 0 });
        void get().fetchDeck();
      },

      deck: [],
      deckIndex: 0,
      deckLoading: false,

      fetchDeck: async () => {
        const { activePetId, filters } = get();
        if (!activePetId) {
          set({ deck: [], deckIndex: 0 });
          return;
        }
        set({ deckLoading: true });
        try {
          const data = await api<{ candidates: Candidate[] }>(
            `/api/deck?${deckParams(activePetId, filters)}`,
          );
          set({ deck: data.candidates, deckIndex: 0 });
        } finally {
          set({ deckLoading: false });
        }
      },

      likeCurrent: async (candidate) => {
        set((s) => ({ deckIndex: s.deckIndex + 1 }));
        const data = await api<{ matched: boolean; match?: MatchView }>("/api/swipes", {
          method: "POST",
          body: { petId: get().activePetId, targetPetId: candidate.id, liked: true },
        });
        if (data.matched && data.match) {
          const match = data.match;
          set((s) => ({
            matches: s.matches.some((m) => m.id === match.id)
              ? s.matches
              : [match, ...s.matches],
          }));
          return match;
        }
        return null;
      },

      nopeCurrent: async (candidate) => {
        set((s) => ({ deckIndex: s.deckIndex + 1 }));
        await api("/api/swipes", {
          method: "POST",
          body: { petId: get().activePetId, targetPetId: candidate.id, liked: false },
        }).catch(() => {});
      },

      rewindDeck: async () => {
        if (get().deckIndex === 0) return;
        set((s) => ({ deckIndex: Math.max(0, s.deckIndex - 1) }));
        await api("/api/swipes/rewind", {
          method: "POST",
          body: { petId: get().activePetId },
        }).catch(() => {});
      },

      filters: defaultFiltersFor(null),
      setFilters: (patch) => {
        set((s) => ({ filters: { ...s.filters, ...patch }, deckIndex: 0 }));
        void get().fetchDeck();
      },

      matches: [],

      sendMessage: async (matchId, input) => {
        const data = await api<{ message: Message }>(`/api/matches/${matchId}/messages`, {
          method: "POST",
          body: input,
        });
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId
              ? { ...m, messages: [...m.messages, data.message], lastTime: "ახლა" }
              : m,
          ),
        }));
      },

      markRead: (matchId) => {
        const match = get().matches.find((m) => m.id === matchId);
        if (!match || match.unread === 0) return;
        set((s) => ({
          matches: s.matches.map((m) => (m.id === matchId ? { ...m, unread: 0 } : m)),
        }));
        api(`/api/matches/${matchId}/read`, { method: "POST" }).catch(() => {});
      },

      block: async (candidatePetId) => {
        await api("/api/blocks", { method: "POST", body: { targetPetId: candidatePetId } });
        set((s) => ({
          matches: s.matches.filter((m) => m.candidate.id !== candidatePetId),
          deck: s.deck.filter((c) => c.id !== candidatePetId),
          blockedCount: s.blockedCount + 1,
        }));
      },

      report: async (candidatePetId, reason) => {
        await api("/api/reports", { method: "POST", body: { targetPetId: candidatePetId, reason } });
      },
    }),
    {
      name: "atexili-store",
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      // only launch flags + session hints persist locally; data comes from the API
      partialize: (s) => ({
        agePassed: s.agePassed,
        introSeen: s.introSeen,
        notifPrimed: s.notifPrimed,
        authed: s.authed,
        activePetId: s.activePetId,
      }),
    },
  ),
);

/** Find a candidate we already know about (deck or matches) without a fetch. */
export function findKnownCandidate(
  s: Pick<AppState, "deck" | "matches">,
  petId: string,
): Candidate | undefined {
  return s.deck.find((c) => c.id === petId) ?? s.matches.find((m) => m.candidate.id === petId)?.candidate;
}
