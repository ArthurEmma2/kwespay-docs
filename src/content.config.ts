import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				description: z.string().min(40, 'Every published page needs a real description for search and link previews.'),
				ogImage: z.string().optional(),
				ogImageAlt: z.string().optional(),
			}),
		}),
	}),
};
