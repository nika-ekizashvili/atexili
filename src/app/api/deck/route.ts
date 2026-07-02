import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";
import { ageYears, serializeCandidate } from "@/server/serialize";

/**
 * Filtered candidate queue for the active pet.
 * Excludes own pets, already-swiped targets, and blocked users (both ways).
 */
export const GET = handler(async (req: Request) => {
  const user = await requireUser();
  const q = new URL(req.url).searchParams;

  const petId = q.get("petId");
  if (!petId) return error("petId required", 400);
  const myPet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!myPet || myPet.ownerId !== user.id) return error("pet not found", 404);

  const species = q.get("species") ?? myPet.species;
  const gender = q.get("gender") ?? (myPet.gender === "female" ? "male" : "female");
  const distanceKm = Number(q.get("distanceKm") ?? 10);
  const ageMin = Number(q.get("ageMin") ?? 0);
  const ageMax = Number(q.get("ageMax") ?? 30);
  const verifiedOnly = q.get("verifiedOnly") === "true";

  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: user.id }, { blockedUserId: user.id }] },
  });
  const blockedUserIds = blocks.map((b) =>
    b.blockerId === user.id ? b.blockedUserId : b.blockerId,
  );

  const swiped = await prisma.swipe.findMany({ where: { petId }, select: { targetPetId: true } });

  const candidates = await prisma.pet.findMany({
    where: {
      ownerId: { notIn: [user.id, ...blockedUserIds] },
      id: { notIn: swiped.map((s) => s.targetPetId) },
      species,
      ...(gender !== "all" && { gender }),
      distanceKm: { lte: distanceKm },
      ...(verifiedOnly && { verified: true }),
    },
    include: { owner: true },
    orderBy: { distanceKm: "asc" },
  });

  const inAgeRange = candidates.filter((c) => {
    const age = ageYears(c.birthdate);
    return age >= ageMin && age <= ageMax;
  });

  return json({ candidates: inAgeRange.map(serializeCandidate) });
});
