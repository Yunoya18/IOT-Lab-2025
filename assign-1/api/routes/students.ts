import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allStudents = await drizzle.select().from(students);
  return c.json(allStudents);
});

studentsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.students.findFirst({
    where: eq(students.id, id)
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});

studentsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      surname: z.string().min(1),
      dob: z.string().min(1),
      gender: z.string().min(1)
    })
  ),
  async (c) => {
    const { name, surname, dob, gender } = c.req.valid("json");
    const result = await drizzle
      .insert(students)
      .values({
        name,
        surname,
        dob,
        gender
      })
      .returning();
    return c.json({ success: true, student: result[0] }, 201);
  }
);

studentsRouter.put(
  "/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      surname: z.string().min(1),
      dob: z.string().min(1),
      gender: z.string().min(1)
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle.update(students).set(data).where(eq(students.id, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, student: updated[0] });
  }
);

studentsRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(students).where(eq(students.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, student: deleted[0] });
});

export default studentsRouter;
