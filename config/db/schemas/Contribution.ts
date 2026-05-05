import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const contributionsTable = pgTable("contributions", {
  id: uuid("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(), // 'clothing' | 'books'
  status: varchar("status", { length: 50 }).notNull().default("submitted"), // 'submitted' | 'scheduled' | 'received' | 'completed' | 'declined'
  donor_name: text("donor_name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  contact_channel: varchar("contact_channel", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  handover_method: varchar("handover_method", { length: 50 }).notNull(), // 'pickup' | 'drop-off'
  assigned_time_block_id: uuid("assigned_time_block_id"),
  internal_notes: text("internal_notes"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
