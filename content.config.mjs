// src/content/config.ts
import { defineCollection, z } from "astro:content";

const dealerGuides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.date().optional(),
  }),
});

export const collections = {
  "dealer-guides": dealerGuides,
};
