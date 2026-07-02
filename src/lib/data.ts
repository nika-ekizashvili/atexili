/* Client-side constants. Seed data lives in prisma/seed.mjs. */

/* Warm gradient placeholders used across the mocks in place of real photos. */
export const GRADIENTS = {
  peachGold: "linear-gradient(135deg,#F5BFA6,#E8A93C)",
  coralRust: "linear-gradient(135deg,#EF9E7B,#C44F2C)",
  coralWarm: "linear-gradient(135deg,#EF9E7B,#E97E54)",
  sandGold: "linear-gradient(135deg,#F5D08A,#E8A93C)",
  sandCoral: "linear-gradient(135deg,#F5D08A,#E97E54)",
  taupe: "linear-gradient(135deg,#C5B4A2,#7F6C58)",
};

export const BREEDS: Record<string, string[]> = {
  cat: ["ბრიტანული მოკლებეწვიანი", "სპარსული", "მაინკუნი", "სიამური", "სფინქსი", "შოტლანდიური"],
  dog: ["ლაბრადორი", "გერმანული ნაგაზი", "ჰასკი", "პუდელი", "კავკასიური ნაგაზი"],
  bird: ["ტალღოვანი თუთიყუში", "კორელა", "კანარი"],
  other: ["სხვა"],
};
