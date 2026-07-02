import { prisma } from "@/server/db";
import { createSession, hashPassword } from "@/server/auth";
import { error, handler, json } from "@/server/http";

export const POST = handler(async (req: Request) => {
  const { name, email, password } = await req.json();
  if (!name?.trim() || !email?.includes("@") || (password?.length ?? 0) < 8)
    return error("არასწორი მონაცემები", 400);

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return error("ამ ელ. ფოსტით ანგარიში უკვე არსებობს", 409);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
    },
  });
  await createSession(user.id);
  return json({ ok: true });
});
