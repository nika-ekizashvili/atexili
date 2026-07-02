import { prisma } from "@/server/db";
import { destroySession } from "@/server/auth";
import { handler, json, requireUser } from "@/server/http";
import { serializeOwner, serializeSettings } from "@/server/serialize";

/** Update owner profile fields and/or settings toggles. */
export const PATCH = handler(async (req: Request) => {
  const user = await requireUser();
  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of [
    "name",
    "location",
    "about",
    "phone",
    "notifyMatch",
    "notifyMessage",
    "notifyTips",
    "shareLocation",
  ]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return json({ owner: serializeOwner(updated), settings: serializeSettings(updated) });
});

/** Irreversible account deletion — cascades pets, matches, messages, documents. */
export const DELETE = handler(async () => {
  const user = await requireUser();
  await prisma.user.delete({ where: { id: user.id } });
  await destroySession();
  return json({ ok: true });
});
