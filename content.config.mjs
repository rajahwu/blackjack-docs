// src/content/config.ts
import { defineCollection, z } from "astro:content";

const dealerGuides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.date().optional(),
    // Add these for better metadata
    author: z.string().default("Nico"),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  }),
});

export const collections = {
  "dealer-guides": dealerGuides,
};