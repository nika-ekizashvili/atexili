import { destroySession } from "@/server/auth";
import { handler, json } from "@/server/http";

export const POST = handler(async () => {
  await destroySession();
  return json({ ok: true });
});
