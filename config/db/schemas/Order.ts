// import {
//   integer,
//   pgTable,
//   timestamp,
//   uuid,
//   varchar,
// } from "drizzle-orm/pg-core";
// import { usersTable } from "./User";

// export const ordersTable = pgTable("orders", {
//   id: uuid().primaryKey(),
//   user_id: uuid().references(() => usersTable.id),
//   // Guest account
//   guest_email: varchar({ length: 255 }),
//   guest_name: varchar({ length: 255 }),
//   // __END_GUEST_ACCOUNT__
//   total_amount: integer().notNull(),
//   status: varchar({ length: 255 }).notNull().default("pending"),
//   created_at: timestamp("created_at").notNull().defaultNow(),
// });
