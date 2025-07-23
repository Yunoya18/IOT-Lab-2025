import * as t from "drizzle-orm/pg-core";

export const students = t.pgTable("students", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  surname: t.text("name").notNull(),
  dob: t.date("dob").notNull(),
  gender: t.text("gender").notNull()
});