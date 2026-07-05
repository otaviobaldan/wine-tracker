import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  date,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const wines = pgTable(
  "wines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    winery: text("winery").notNull(),
    year: integer("year"),
    type: text("type").notNull(),
    grape: text("grape").notNull(),
    grapeOrigin: text("grape_origin").notNull(),
    whereTried: text("where_tried").notNull(),
    citySippedIn: text("city_sipped_in"),
    whenTried: date("when_tried"),
    score: numeric("score", { precision: 2, scale: 1, mode: "number" }).notNull(),
    personalFeels: text("personal_feels").notNull(),
    notes: text("notes"),
    descriptionByAi: text("description_by_ai"),
    bottlePhotoUrl: text("bottle_photo_url"),
    price: numeric("price", { precision: 10, scale: 2, mode: "number" }),
    purchaseLocation: text("purchase_location"),
    createdBy: text("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "score_range",
      sql`${table.score} BETWEEN 0.5 AND 5 AND ${table.score} = ROUND(${table.score} * 2) / 2`,
    ),
  ],
);

export type User = typeof users.$inferSelect;
export type Wine = typeof wines.$inferSelect;
export type NewWine = typeof wines.$inferInsert;
