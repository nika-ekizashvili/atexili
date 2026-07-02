import type { Match, Message, Pet, User } from "@prisma/client";

/* Shapes returned to the client — they match src/lib/types.ts. */

const KA_MONTHS = [
  "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
  "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი",
];

export function ageYears(birthdate: Date | null): number {
  if (!birthdate) return 0;
  return Math.max(0, Math.floor((Date.now() - birthdate.getTime()) / 3.15576e10));
}

function birthLabel(birthdate: Date | null): string {
  if (!birthdate) return "";
  return `${KA_MONTHS[birthdate.getMonth()]} ${birthdate.getFullYear()}`;
}

/** Relative timestamp in Georgian, like the mock's "ახლა / 2 სთ / გუშინ / 2 დღე". */
export function relativeTimeKa(date: Date): string {
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (diffMin < 2) return "ახლა";
  if (diffMin < 60) return `${diffMin} წთ`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} სთ`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "გუშინ";
  return `${diffD} დღე`;
}

function clock(date: Date): string {
  return date.toLocaleTimeString("ka-GE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  });
}

export function serializePet(pet: Pet) {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    gender: pet.gender,
    birthLabel: birthLabel(pet.birthdate),
    ageYears: ageYears(pet.birthdate),
    photos: JSON.parse(pet.photos || "[]"),
    bio: pet.bio,
    health: { vaccinated: pet.vaccinated, tested: pet.tested, docs: pet.docs },
    healthTags: JSON.parse(pet.healthTags || "[]"),
    intent: pet.intent,
    verified: pet.verified,
  };
}

export function serializeCandidate(pet: Pet & { owner: User }) {
  return {
    ...serializePet(pet),
    distanceKm: pet.distanceKm,
    ownerName: pet.owner.name,
    ownerVerified: pet.owner.verification === "verified",
    mutualLike: pet.mutualLike,
  };
}

export function serializeMessage(message: Message, meUserId: string) {
  return {
    id: message.id,
    from: message.senderUserId === meUserId ? ("me" as const) : ("them" as const),
    kind: message.kind,
    text: message.text ?? undefined,
    photo: message.photo ? JSON.parse(message.photo) : undefined,
    place:
      message.placeName != null
        ? { name: message.placeName, address: message.placeAddress ?? "" }
        : undefined,
    time: clock(message.createdAt),
    read: message.readAt != null,
  };
}

export function matchedLabelKa(createdAt: Date): string {
  const diffD = Math.floor((Date.now() - createdAt.getTime()) / 864e5);
  if (diffD < 1) return "დღეს";
  if (diffD < 2) return "გუშინ";
  return `${diffD} დღის წინ`;
}

export function serializeMatch(
  match: Match & { petA: Pet & { owner: User }; petB: Pet & { owner: User }; messages: Message[] },
  meUserId: string,
) {
  const other = match.petA.owner.id === meUserId ? match.petB : match.petA;
  const messages = match.messages.map((m) => serializeMessage(m, meUserId));
  const unread = match.messages.filter(
    (m) => m.senderUserId !== meUserId && m.readAt == null,
  ).length;
  const lastAt =
    match.messages.length > 0
      ? match.messages[match.messages.length - 1].createdAt
      : match.createdAt;
  return {
    id: match.id,
    candidate: serializeCandidate(other),
    messages,
    unread,
    lastTime: relativeTimeKa(lastAt),
    matchedLabel: matchedLabelKa(match.createdAt),
  };
}

export function serializeOwner(user: User) {
  return {
    name: user.name,
    location: user.location,
    about: user.about,
    verification: user.verification,
    email: user.email,
    phone: user.phone,
  };
}

export function serializeSettings(user: User) {
  return {
    notifyMatch: user.notifyMatch,
    notifyMessage: user.notifyMessage,
    notifyTips: user.notifyTips,
    shareLocation: user.shareLocation,
  };
}
