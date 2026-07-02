// Seeds the demo dataset: the showcase account (nika@example.ge / 123456789)
// with ლუნა + ბობი, four candidate pets owned by other users, existing
// matches and the თომა chat thread — mirroring the design-handoff fixtures.
import prismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Load .env for local runs (`npm run db:seed`); in containers DATABASE_URL
// comes from the real environment and there's no .env file.
try {
  process.loadEnvFile();
} catch {
  // no .env — rely on process.env (e.g. docker-compose)
}

const { PrismaClient } = prismaPkg;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const G = {
  peachGold: "linear-gradient(135deg,#F5BFA6,#E8A93C)",
  coralRust: "linear-gradient(135deg,#EF9E7B,#C44F2C)",
  coralWarm: "linear-gradient(135deg,#EF9E7B,#E97E54)",
  sandGold: "linear-gradient(135deg,#F5D08A,#E8A93C)",
  sandCoral: "linear-gradient(135deg,#F5D08A,#E97E54)",
  taupe: "linear-gradient(135deg,#C5B4A2,#7F6C58)",
};

const photos = (list) => JSON.stringify(list);
const tags = (list) => JSON.stringify(list);
const daysAgo = (d, h = 0) => new Date(Date.now() - d * 864e5 - h * 36e5);

async function main() {
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.report.deleteMany();
  await prisma.block.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456789", 10);

  const nika = await prisma.user.create({
    data: {
      email: "nika@example.ge",
      passwordHash: password,
      name: "ნიკა",
      phone: "+995 599 12 34 56",
      about: "ცხოველების მოყვარული, ლუნას მფლობელი. ვეძებ საიმედო და ჯანმრთელ პარტნიორს.",
      verification: "verified",
    },
  });

  const luna = await prisma.pet.create({
    data: {
      ownerId: nika.id,
      name: "ლუნა",
      species: "cat",
      breed: "ბრიტანული მოკლებეწვიანი",
      gender: "female",
      birthdate: new Date("2024-03-15"),
      bio: "მეგობრული და მოსიყვარულე კატა, უყვარს თევზი და გრძელი ძილი მზეზე ☀️",
      photos: photos([
        { gradient: G.peachGold, emoji: "🐈" },
        { gradient: G.coralWarm, emoji: "🐈" },
        { gradient: G.sandGold, emoji: "🐾" },
      ]),
      vaccinated: true,
      tested: true,
      docs: false,
      healthTags: tags(["ვაქცინირებული", "დეჰელმინთიზაცია"]),
      intent: "mate",
      verified: true,
      distanceKm: 0,
    },
  });

  await prisma.pet.create({
    data: {
      ownerId: nika.id,
      name: "ბობი",
      species: "dog",
      breed: "ლაბრადორი",
      gender: "male",
      birthdate: new Date("2022-06-15"),
      bio: "ენერგიული და ერთგული ლაბრადორი, უყვარს გასეირნება და თამაში.",
      photos: photos([{ gradient: G.taupe, emoji: "🐕" }]),
      vaccinated: true,
      tested: false,
      docs: true,
      healthTags: tags(["ვაქცინირებული"]),
      intent: "available",
      verified: false,
      distanceKm: 0,
    },
  });

  const mkOwner = (email, name, verification = "none") =>
    prisma.user.create({ data: { email, passwordHash: password, name, verification } });

  const giorgi = await mkOwner("giorgi@example.ge", "გიორგი", "verified");
  const ana = await mkOwner("ana@example.ge", "ანა");
  const dato = await mkOwner("dato@example.ge", "დათო", "verified");
  const tamari = await mkOwner("tamari@example.ge", "თამარი");

  const toma = await prisma.pet.create({
    data: {
      ownerId: giorgi.id,
      name: "თომა",
      species: "cat",
      breed: "ბრიტანული მოკლებეწვიანი",
      gender: "male",
      birthdate: new Date("2023-05-10"),
      bio: "მშვიდი და ჯენტლმენი ბრიტანელი. უყვარს ფანჯარასთან ჯდომა, თევზი და გრძელი ძილი. პირველი ნაგავი ჯანმრთელი და აქტიური იყო.",
      photos: photos([
        { gradient: G.peachGold, emoji: "🐈" },
        { gradient: G.sandGold, emoji: "🐈" },
        { gradient: G.coralWarm, emoji: "🐾" },
      ]),
      vaccinated: true,
      tested: true,
      docs: true,
      healthTags: tags(["ვაქცინა", "ტესტები"]),
      intent: "mate",
      verified: true,
      distanceKm: 2.4,
      mutualLike: true,
    },
  });

  const leo = await prisma.pet.create({
    data: {
      ownerId: ana.id,
      name: "ლეო",
      species: "cat",
      breed: "სპარსული",
      gender: "male",
      birthdate: new Date("2024-02-01"),
      bio: "ენერგიული და ცნობისმოყვარე. სათამაშოების დიდი მოყვარული.",
      photos: photos([{ gradient: G.coralRust, emoji: "🐈" }]),
      vaccinated: true,
      healthTags: tags(["ვაქცინა"]),
      intent: "mate",
      verified: true,
      distanceKm: 4.1,
    },
  });

  const simoni = await prisma.pet.create({
    data: {
      ownerId: dato.id,
      name: "საიმონი",
      species: "cat",
      breed: "მაინკუნი",
      gender: "male",
      birthdate: new Date("2022-07-20"),
      bio: "დიდი, ფუმფულა და მშვიდი გიგანტი. საუკეთესო კომპანიონი.",
      photos: photos([{ gradient: G.sandCoral, emoji: "🐈" }]),
      vaccinated: true,
      tested: true,
      healthTags: tags(["ვაქცინა", "ჩიპი"]),
      intent: "available",
      verified: true,
      distanceKm: 5.7,
    },
  });

  const nia = await prisma.pet.create({
    data: {
      ownerId: tamari.id,
      name: "ნია",
      species: "cat",
      breed: "ბრიტანული მოკლებეწვიანი",
      gender: "male",
      birthdate: new Date("2023-10-05"),
      bio: "მშვიდი ხასიათი, სუფთა წარმომავლობა. კარგად ეწყობა სხვა კატებს.",
      photos: photos([{ gradient: G.taupe, emoji: "🐈" }]),
      vaccinated: true,
      docs: true,
      healthTags: tags(["ვაქცინა"]),
      intent: "mate",
      verified: false,
      distanceKm: 7.2,
    },
  });

  // Incoming likes on ლუნა (drives the My Pets counters).
  await prisma.swipe.createMany({
    data: [
      { userId: giorgi.id, petId: toma.id, targetPetId: luna.id, liked: true },
      { userId: ana.id, petId: leo.id, targetPetId: luna.id, liked: true },
      { userId: tamari.id, petId: nia.id, targetPetId: luna.id, liked: true },
    ],
  });

  // Existing matches for the demo account (candidates stay in the demo user's
  // own deck — no swipes *by* ლუნა are seeded, so the deck is full on login).
  const msg = (matchId, sender, kind, data, createdAt, read = true) =>
    prisma.message.create({
      data: {
        matchId,
        senderUserId: sender.id,
        kind,
        ...data,
        createdAt,
        readAt: read ? new Date(createdAt.getTime() + 60_000) : null,
      },
    });

  const mToma = await prisma.match.create({
    data: { petAId: luna.id, petBId: toma.id, createdAt: daysAgo(0, 9) },
  });
  await msg(mToma.id, giorgi, "text", { text: "გამარჯობა! ლუნა ნამდვილად ლამაზია 😍" }, daysAgo(0, 8));
  await msg(mToma.id, nika, "text", { text: "მადლობა! თომაც ძალიან მოხდენილია 🙂 სად ხართ?" }, daysAgo(0, 7.5));
  await msg(mToma.id, giorgi, "text", { text: "ვაკეში. შეგვიძლია ჯერ ვეტერინართან შევხვდეთ, ყველაფერი წესრიგში იყოს." }, daysAgo(0, 7), false);
  await msg(mToma.id, nika, "text", { text: "შესანიშნავი იდეაა. ორივე ვაქცინირებულია და ტესტებიც გავიარეთ." }, daysAgo(0, 6.5));
  await msg(mToma.id, giorgi, "text", { text: "მშვენიერია, მოდი ხვალ ☀️" }, daysAgo(0, 0.05), false);

  const mLeo = await prisma.match.create({
    data: { petAId: luna.id, petBId: leo.id, createdAt: daysAgo(1, 5) },
  });
  await msg(mLeo.id, nika, "text", { text: "გამარჯობა! ლეო ძალიან საყვარელია 🐾" }, daysAgo(1, 3));
  await msg(mLeo.id, ana, "text", { text: "წავიდა სასეირნოდ? 🐾" }, daysAgo(0, 2));

  const mSimoni = await prisma.match.create({
    data: { petAId: luna.id, petBId: simoni.id, createdAt: daysAgo(1, 8) },
  });
  await msg(mSimoni.id, dato, "text", { text: "მადლობა მოწონებისთვის!" }, daysAgo(1, 6));

  await prisma.match.create({
    data: { petAId: luna.id, petBId: nia.id, createdAt: daysAgo(2, 1) },
  });

  console.log("Seeded:", {
    users: await prisma.user.count(),
    pets: await prisma.pet.count(),
    matches: await prisma.match.count(),
    messages: await prisma.message.count(),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
