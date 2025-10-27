// This file defines the schema for your "dealer-guides" collection
// based on the drill template you provided.
import { z, defineCollection } from 'astro:content';

const dealerGuidesCollection = defineCollection({
  type: 'content', // 'content' for MD/MDX
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  }),
});

export const collections = {
  'dealer-guides': dealerGuidesCollection,
};
