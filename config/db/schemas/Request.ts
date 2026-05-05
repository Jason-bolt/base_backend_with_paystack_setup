import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const requestsTable = pgTable("requests", {
  id: uuid("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 50 }).notNull(), // 'self' | 'someone-else' | 'organisation'
  status: varchar("status", { length: 50 }).notNull().default("submitted"),
  requester_name: text("requester_name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  contact_channel: varchar("contact_channel", { length: 50 }).notNull(), // 'sms' | 'whatsapp' | 'call'
  location: varchar("location", { length: 100 }).notNull(),
  handover_method: varchar("handover_method", { length: 50 }).notNull(), // 'pickup' | 'delivery'
  // Someone else
  beneficiary_age_group: varchar("beneficiary_age_group", { length: 100 }),
  beneficiary_gender: varchar("beneficiary_gender", { length: 50 }),
  // Organisation
  org_name: text("org_name"),
  beneficiary_count: varchar("beneficiary_count", { length: 50 }),
  // Admin fields
  assigned_volunteer: text("assigned_volunteer"),
  assigned_time_block_id: uuid("assigned_time_block_id"),
  contact_status: varchar("contact_status", { length: 50 }).default("not-contacted"),
  last_contacted: timestamp("last_contacted", { withTimezone: true }),
  internal_notes: text("internal_notes"),
  decline_reason: text("decline_reason"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
