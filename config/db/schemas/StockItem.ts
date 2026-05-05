import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const stockItemsTable = pgTable("stock_items", {
  id: uuid("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(), // 'clothing' | 'books'
  title: text("title").notNull(),
  description: text("description"),
  condition: varchar("condition", { length: 50 }).notNull(), // 'new' | 'gently-used' | 'used'
  quantity: integer("quantity").notNull().default(0),
  availability: varchar("availability", { length: 50 }).notNull().default("available"), // 'available' | 'low-stock' | 'out-of-stock'
  visibility: varchar("visibility", { length: 50 }).notNull().default("listed"), // 'listed' | 'hidden'
  location_bucket: text("location_bucket"),
  // Clothing specific
  clothing_type: varchar("clothing_type", { length: 100 }),
  clothing_age_group: varchar("clothing_age_group", { length: 100 }),
  gender_fit: varchar("gender_fit", { length: 50 }),
  // Book specific
  book_type: varchar("book_type", { length: 100 }),
  education_level: varchar("education_level", { length: 100 }),
  subject: varchar("subject", { length: 100 }),
  // Photos stored as comma-separated Cloudinary URLs (simple approach)
  photos: text("photos").default(""),
  // Track origin
  source: varchar("source", { length: 50 }).notNull().default("admin"), // 'admin' | 'contribution'
  contribution_id: uuid("contribution_id"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
