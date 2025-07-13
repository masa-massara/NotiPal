import { z } from "zod";
export declare const destinationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodString;
    createdAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
    updatedAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}, {
    id: string;
    userId: string;
    webhookUrl: string;
    name?: string | undefined;
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
export declare const createDestinationApiSchema: z.ZodObject<Pick<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodString;
    createdAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
    updatedAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
}, "name" | "webhookUrl">, "strip", z.ZodTypeAny, {
    webhookUrl: string;
    name?: string | undefined;
}, {
    webhookUrl: string;
    name?: string | undefined;
}>;
export declare const updateDestinationApiSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    webhookUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    webhookUrl?: string | undefined;
}, {
    name?: string | undefined;
    webhookUrl?: string | undefined;
}>;
export type Destination = z.infer<typeof destinationSchema>;
export type CreateDestinationApiInput = z.infer<typeof createDestinationApiSchema>;
export type UpdateDestinationApiInput = z.infer<typeof updateDestinationApiSchema>;
