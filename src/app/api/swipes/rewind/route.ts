import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";

/** Undo the most recent swipe of the given pet. */
export const POST = handler(async (req: Request) => {
  const user = await requireUser();
  const { petId } = await req.json();
  const myPet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!myPet || myPet.ownerId !== user.id) return error("pet not found", 404);

  const last = await prisma.swipe.findFirst({
    where: { petId },
    orderBy: { createdAt: "desc" },
  });
  if (last) await prisma.swipe.delete({ where: { id: last.id } });
  return json({ ok: true });
});
