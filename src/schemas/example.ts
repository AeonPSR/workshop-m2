import { z } from "zod";

// Example schema - customize as needed
export const exampleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  createdAt: z.string().datetime().optional(),
});

export type ExampleType = z.infer<typeof exampleSchema>;
