import { prisma } from "@/server/db";
import { handler, json, requireUser, error } from "@/server/http";
import { serializePet } from "@/server/serialize";

export const POST = handler(async (req: Request) => {
  const user = await requireUser();
  const b = await req.json();
  if (!b.name?.trim() || !b.species || !b.breed) return error("არასწორი მონაცემები", 400);

  const pet = await prisma.pet.create({
    data: {
      ownerId: user.id,
      name: b.name.trim(),
      species: b.species,
      breed: b.breed,
      gender: b.gender === "male" ? "male" : "female",
      birthdate: b.birthdate ? new Date(b.birthdate) : null,
      bio: b.bio ?? "",
      photos: JSON.stringify(b.photos ?? []),
      vaccinated: !!b.health?.vaccinated,
      tested: !!b.health?.tested,
      docs: !!b.health?.docs,
      healthTags: JSON.stringify(b.healthTags ?? []),
      intent: b.intent === "available" ? "available" : "mate",
      distanceKm: 0,
    },
  });
  return json({ pet: serializePet(pet) }, 201);
});
