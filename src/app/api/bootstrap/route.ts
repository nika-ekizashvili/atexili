import { prisma } from "@/server/db";
import { handler, json, requireUser } from "@/server/http";
import {
  serializeMatch,
  serializeOwner,
  serializePet,
  serializeSettings,
} from "@/server/serialize";

/** Everything the client needs after login: owner, pets, matches, settings. */
export const GET = handler(async () => {
  const user = await requireUser();

  const pets = await prisma.pet.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: user.id }, { blockedUserId: user.id }] },
  });
  const blockedUserIds = new Set(
    blocks.map((b) => (b.blockerId === user.id ? b.blockedUserId : b.blockerId)),
  );

  const petIds = pets.map((p) => p.id);
  const matches = await prisma.match.findMany({
    where: { OR: [{ petAId: { in: petIds } }, { petBId: { in: petIds } }] },
    include: {
      petA: { include: { owner: true } },
      petB: { include: { owner: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const visibleMatches = matches.filter((m) => {
    const otherOwner = m.petA.ownerId === user.id ? m.petB.ownerId : m.petA.ownerId;
    return !blockedUserIds.has(otherOwner);
  });

  // live counters for the My Pets hub
  const petsWithStats = await Promise.all(
    pets.map(async (pet) => {
      const likes = await prisma.swipe.count({
        where: { targetPetId: pet.id, liked: true },
      });
      const petMatches = visibleMatches.filter(
        (m) => m.petAId === pet.id || m.petBId === pet.id,
      );
      const newChats = petMatches.filter((m) =>
        m.messages.some((msg) => msg.senderUserId !== user.id && msg.readAt == null),
      ).length;
      return {
        ...serializePet(pet),
        stats: { likes, matches: petMatches.length, newChats },
      };
    }),
  );

  return json({
    owner: serializeOwner(user),
    settings: serializeSettings(user),
    pets: petsWithStats,
    matches: visibleMatches.map((m) => serializeMatch(m, user.id)),
    blockedCount: blocks.filter((b) => b.blockerId === user.id).length,
  });
});
