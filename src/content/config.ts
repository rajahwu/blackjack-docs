// src/content/config.ts
import { defineCollection, z } from "astro:content";

const dealerGuides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    author: z.string().optional(),
    date: z.string().optional(),
  }),
});


export const collections = {
  "dealer-guides": dealerGuides,
};
