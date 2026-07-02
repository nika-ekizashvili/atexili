import { prisma } from "@/server/db";
import { handler, json, requireUser } from "@/server/http";

/** Submit documents for review → status becomes pending. */
export const POST = handler(async () => {
  const user = await requireUser();
  if (user.verification === "none") {
    await prisma.user.update({ where: { id: user.id }, data: { verification: "pending" } });
  }
  return json({ verification: user.verification === "none" ? "pending" : user.verification });
});
