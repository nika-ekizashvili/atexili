import { prisma } from "@/server/db";
import { createSession, verifyPassword } from "@/server/auth";
import { error, handler, json } from "@/server/http";

export const POST = handler(async (req: Request) => {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: (email ?? "").toLowerCase() } });
  if (!user || !(await verifyPassword(password ?? "", user.passwordHash)))
    return error("ელ. ფოსტა ან პაროლი არასწორია", 401);
  await createSession(user.id);
  return json({ ok: true });
});
