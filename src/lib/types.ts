export type Species = "cat" | "dog" | "bird" | "other";
export type Gender = "female" | "male";
export type Intent = "mate" | "available";
export type VerificationStatus = "none" | "pending" | "verified";

/** Placeholder photo — in the mocks every pet photo is an emoji on a warm
 * gradient; real uploads replace this with storage URLs later. */
export interface PhotoPlaceholder {
  gradient: string; // CSS gradient
  emoji: string;
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

export interface Conversation {
  id: string; // = candidate id
  candidateId: string;
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
