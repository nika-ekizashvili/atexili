import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";
import { serializeMatch } from "@/server/serialize";

/**
 * Record a like/nope. A like creates a match when it's mutual — either the
 * target's owner already liked back, or the target is a demo pet flagged
 * `mutualLike` (the scripted match).
 */
export const POST = handler(async (req: Request) => {
  const user = await requireUser();
  const { petId, targetPetId, liked } = await req.json();

  const myPet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!myPet || myPet.ownerId !== user.id) return error("pet not found", 404);
  const target = await prisma.pet.findUnique({ where: { id: targetPetId } });
  if (!target || target.ownerId === user.id) return error("target not found", 404);

  await prisma.swipe.upsert({
    where: { petId_targetPetId: { petId, targetPetId } },
    create: { userId: user.id, petId, targetPetId, liked: !!liked },
    update: { liked: !!liked },
  });

  if (!liked) return json({ matched: false });

  const reciprocal = await prisma.swipe.findUnique({
    where: { petId_targetPetId: { petId: targetPetId, targetPetId: petId } },
  });
  const isMutual = target.mutualLike || (reciprocal?.liked ?? false);
  if (!isMutual) return json({ matched: false });

  const existing = await prisma.match.findFirst({
    where: {
      OR: [
        { petAId: petId, petBId: targetPetId },
        { petAId: targetPetId, petBId: petId },
      ],
    },
  });
  const match =
    existing ??
    (await prisma.match.create({ data: { petAId: petId, petBId: targetPetId } }));

  const full = await prisma.match.findUniqueOrThrow({
    where: { id: match.id },
    include: {
      petA: { include: { owner: true } },
      petB: { include: { owner: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return json({ matched: true, match: serializeMatch(full, user.id) });
});
