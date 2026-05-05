import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  date,
} from "drizzle-orm/pg-core";

export const timeBlocksTable = pgTable("time_blocks", {
  id: uuid("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'pickup' | 'delivery'
  date: date("date").notNull(),
  start_time: varchar("start_time", { length: 10 }).notNull(),
  end_time: varchar("end_time", { length: 10 }).notNull(),
  capacity: integer("capacity").notNull(),
  booked_count: integer("booked_count").notNull().default(0),
  location_zone: text("location_zone"),
  status: varchar("status", { length: 50 }).notNull().default("open"), // 'open' | 'closed'
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
