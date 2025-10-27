// src/content/config.ts
import { defineCollection, z } from "astro:content";

const dealerGuides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(), // Make this required
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  }),
});

export const collections = {
  "dealer-guides": dealerGuides,
};
