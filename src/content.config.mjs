import { z, defineCollection } from "astro:content";

const dealerGuides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
  }),
});

const trainingLog = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      drill: z.string(),
      duration: z.number().optional(),
      accuracy: z.number().optional(),
      bpm: z.number().optional(),
      streak: z.number().optional(),
      timestamp: z.string(),
    })
  ),
});

export const collections = {
  "dealer-guides": dealerGuides,
  "traininglog": trainingLog,
};
