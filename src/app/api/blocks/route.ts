import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";

/**
 * Block the owner of a pet. Blocks hide both parties from each other's decks
 * and matches at read time (reversible — nothing is deleted).
 */
export const POST = handler(async (req: Request) => {
  const user = await requireUser();
  const { targetPetId } = await req.json();
  const target = await prisma.pet.findUnique({ where: { id: targetPetId } });
  if (!target || target.ownerId === user.id) return error("not found", 404);

  await prisma.block.upsert({
    where: { blockerId_blockedUserId: { blockerId: user.id, blockedUserId: target.ownerId } },
    create: { blockerId: user.id, blockedUserId: target.ownerId },
    update: {},
  });
  return json({ ok: true }, 201);
});
