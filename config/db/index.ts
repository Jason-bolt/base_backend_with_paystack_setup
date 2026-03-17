import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import schemas from "./schemas";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema: schemas });

export type DB = typeof db;
export default db;
