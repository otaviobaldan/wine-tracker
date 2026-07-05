import "dotenv/config";
import { db } from "../lib/db.js";
import { users } from "../lib/schema.js";
import { hashPassword } from "../lib/auth.js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const seedUsers = [
    {
      email: requireEnv("SEED_OTAVIO_EMAIL"),
      password: requireEnv("SEED_OTAVIO_PASSWORD"),
      displayName: "Otavio",
    },
    {
      email: requireEnv("SEED_WIFE_EMAIL"),
      password: requireEnv("SEED_WIFE_PASSWORD"),
      displayName: requireEnv("SEED_WIFE_NAME"),
    },
  ];

  for (const seedUser of seedUsers) {
    await db
      .insert(users)
      .values({
        email: seedUser.email,
        passwordHash: await hashPassword(seedUser.password),
        displayName: seedUser.displayName,
      })
      .onConflictDoNothing({ target: users.email });

    console.log(`Seeded (or already existed): ${seedUser.email}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
