import { z } from "zod";
export declare const userNotionIntegrationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    integrationName: z.ZodString;
    createdAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
    updatedAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    integrationName: string;
}, {
    id: string;
    userId: string;
    integrationName: string;
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
export declare const internalUserNotionIntegrationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    integrationName: z.ZodString;
    createdAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
    updatedAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
} & {
    notionIntegrationToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    integrationName: string;
    notionIntegrationToken: string;
}, {
    id: string;
    userId: string;
    integrationName: string;
    notionIntegrationToken: string;
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
export declare const createUserNotionIntegrationApiSchema: z.ZodObject<{
    integrationName: z.ZodString;
    notionIntegrationToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    integrationName: string;
    notionIntegrationToken: string;
}, {
    integrationName: string;
    notionIntegrationToken: string;
}>;
export type UserNotionIntegration = z.infer<typeof userNotionIntegrationSchema>;
export type InternalUserNotionIntegration = z.infer<typeof internalUserNotionIntegrationSchema>;
export type CreateUserNotionIntegrationApiInput = z.infer<typeof createUserNotionIntegrationApiSchema>;
