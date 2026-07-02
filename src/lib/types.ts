export type Species = "cat" | "dog" | "bird" | "other";
export type Gender = "female" | "male";
export type Intent = "mate" | "available";
export type VerificationStatus = "none" | "pending" | "verified";

/** A pet photo. Real uploads carry `url` (S3); when absent it renders as the
 * mock's emoji-on-gradient placeholder. */
export interface PhotoPlaceholder {
  gradient: string; // CSS gradient (placeholder / image backdrop while loading)
  emoji: string;
  url?: string; // S3 public URL once uploaded
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  gender: Gender;
  birthLabel: string; // e.g. "მარტი 2024"
  ageYears: number;
  photos: PhotoPlaceholder[];
  bio: string;
  health: { vaccinated: boolean; tested: boolean; docs: boolean };
  healthTags: string[];
  intent: Intent;
  verified: boolean;
  /** own pets only: live counters for the My Pets hub */
  stats?: { likes: number; matches: number; newChats: number };
}

/** A pet in the swipe deck (someone else's animal). */
export interface Candidate extends Pet {
  distanceKm: number;
  ownerName: string;
  ownerVerified: boolean;
  /** mock behavior: this candidate right-swipes you back */
  mutualLike: boolean;
}

export interface Owner {
  name: string;
  location: string;
  about: string;
  verification: VerificationStatus;
  email?: string;
  phone?: string | null;
}

export interface Settings {
  notifyMatch: boolean;
  notifyMessage: boolean;
  notifyTips: boolean;
  shareLocation: boolean;
}

export type MessageKind = "text" | "image" | "location";

export interface Message {
  id: string;
  from: "me" | "them";
  kind: MessageKind;
  text?: string;
  photo?: PhotoPlaceholder;
  place?: { name: string; address: string };
  time: string; // display time, mock data
  read?: boolean;
}

/** A match with its conversation, as served by the API. */
export interface MatchView {
  id: string; // match id
  candidate: Candidate;
  messages: Message[];
  unread: number;
  lastTime: string;
  matchedLabel: string; // e.g. "დღეს"
}

export interface Filters {
  species: Species;
  openToCompatibleBreeds: boolean;
  gender: Gender | "all";
  distanceKm: number;
  ageRange: [number, number];
  verifiedOnly: boolean;
}

export type ReportReason =
  | "fake"
  | "abusive"
  | "spam"
  | "inappropriate"
  | "not_real_animal"
  | "other";
