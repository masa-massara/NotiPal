import { z } from "zod";

export const notionDatabaseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const notionPropertySchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	options: z.array(z.object({
		id: z.string(),
		name: z.string(),
		color: z.string().optional(),
	})).optional(),
});
