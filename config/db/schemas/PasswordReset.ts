import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./User";

export const resetPasswordTokensTable = pgTable("reset_password_tokens", {
  user_id: uuid()
    .references(() => usersTable.id)
    .primaryKey(),
  reset_token: text().notNull().unique(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
