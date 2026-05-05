import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { requestsTable } from "./Request";
import { stockItemsTable } from "./StockItem";

export const requestItemsTable = pgTable("request_items", {
  id: uuid("id").primaryKey(),
  request_id: uuid("request_id")
    .notNull()
    .references(() => requestsTable.id, { onDelete: "cascade" }),
  stock_item_id: uuid("stock_item_id")
    .notNull()
    .references(() => stockItemsTable.id),
  quantity: integer("quantity").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
