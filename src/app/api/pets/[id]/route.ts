import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";
import { serializeCandidate, serializePet } from "@/server/serialize";

type Ctx = { params: Promise<{ id: string }> };

/** Candidate view of any pet (used by the profile-detail screen). */
export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireUser();
  const { id } = await params;
  const pet = await prisma.pet.findUnique({ where: { id }, include: { owner: true } });
  if (!pet) return error("not found", 404);
  return json({ candidate: serializeCandidate(pet) });
});

export const PATCH = handler(async (req: Request, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet || pet.ownerId !== user.id) return error("not found", 404);

  const b = await req.json();
  const updated = await prisma.pet.update({
    where: { id },
    data: {
      ...(b.name !== undefined && { name: b.name }),
      ...(b.bio !== undefined && { bio: b.bio }),
      ...(b.intent !== undefined && { intent: b.intent }),
      ...(b.photos !== undefined && { photos: JSON.stringify(b.photos) }),
      ...(b.breed !== undefined && { breed: b.breed }),
      ...(b.gender !== undefined && { gender: b.gender }),
      ...(b.health !== undefined && {
        vaccinated: !!b.health.vaccinated,
        tested: !!b.health.tested,
        docs: !!b.health.docs,
      }),
      ...(b.healthTags !== undefined && { healthTags: JSON.stringify(b.healthTags) }),
    },
  });
  return json({ pet: serializePet(updated) });
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet || pet.ownerId !== user.id) return error("not found", 404);
  await prisma.pet.delete({ where: { id } });
  return json({ ok: true });
});
