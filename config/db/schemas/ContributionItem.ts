import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { contributionsTable } from "./Contribution";

export const contributionItemsTable = pgTable("contribution_items", {
  id: uuid("id").primaryKey(),
  contribution_id: uuid("contribution_id")
    .notNull()
    .references(() => contributionsTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 100 }).notNull(), // clothing_type or book_type value
  quantity: integer("quantity").notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  photos: text("photos").default(""), // comma-separated Cloudinary URLs
  details: jsonb("details"), // extra taxonomy (age_group, subject, etc.)
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
