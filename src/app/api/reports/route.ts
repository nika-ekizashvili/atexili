import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";

const REASONS = ["fake", "abusive", "spam", "inappropriate", "not_real_animal", "other"];

/** Anonymous report of a pet profile. */
export const POST = handler(async (req: Request) => {
  const user = await requireUser();
  const { targetPetId, reason } = await req.json();
  if (!REASONS.includes(reason)) return error("bad reason", 400);
  const target = await prisma.pet.findUnique({ where: { id: targetPetId } });
  if (!target) return error("not found", 404);

  await prisma.report.create({
    data: { reporterId: user.id, targetPetId, reason },
  });
  return json({ ok: true }, 201);
});
