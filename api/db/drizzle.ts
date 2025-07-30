import { drizzle as drizzlePgsql } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema.js";
import dotenv from "dotenv";
dotenv.config();

const drizzle = drizzlePgsql({
  casing: "snake_case",
  schema,
});

export default drizzle;
