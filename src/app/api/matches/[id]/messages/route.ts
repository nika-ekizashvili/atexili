import { prisma } from "@/server/db";
import { error, handler, json, requireUser } from "@/server/http";
import { serializeMessage } from "@/server/serialize";

type Ctx = { params: Promise<{ id: string }> };

export const POST = handler(async (req: Request, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: { petA: true, petB: true },
  });
  if (!match || (match.petA.ownerId !== user.id && match.petB.ownerId !== user.id))
    return error("not found", 404);

  const b = await req.json();
  if (!["text", "image", "location"].includes(b.kind)) return error("bad kind", 400);
  if (b.kind === "text" && !b.text?.trim()) return error("empty message", 400);

  const message = await prisma.message.create({
    data: {
      matchId: id,
      senderUserId: user.id,
      kind: b.kind,
      text: b.text ?? null,
      photo: b.photo ? JSON.stringify(b.photo) : null,
      placeName: b.place?.name ?? null,
      placeAddress: b.place?.address ?? null,
    },
  });
  return json({ message: serializeMessage(message, user.id) }, 201);
});
