"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTokensTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const User_1 = require("./User");
exports.resetPasswordTokensTable = (0, pg_core_1.pgTable)("reset_password_tokens", {
    user_id: (0, pg_core_1.uuid)()
        .references(() => User_1.usersTable.id)
        .primaryKey(),
    reset_token: (0, pg_core_1.text)().notNull().unique(),
    created_at: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: "date" })
        .notNull()
        .defaultNow(),
});
