import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";

type Ctx = { params: Promise<{ id: string }> };

/** Mark the other side's messages as read. */
export const POST = handler(async (_req: Request, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: { petA: true, petB: true },
  });
  if (!match || (match.petA.ownerId !== user.id && match.petB.ownerId !== user.id))
    return error("not found", 404);

  await prisma.message.updateMany({
    where: { matchId: id, senderUserId: { not: user.id }, readAt: null },
    data: { readAt: new Date() },
  });
  return json({ ok: true });
});
