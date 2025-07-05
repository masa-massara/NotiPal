import { z } from "zod";
export declare const templateConditionSchema: z.ZodObject<{
    propertyId: z.ZodString;
    operator: z.ZodString;
    value: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    propertyId: string;
    operator: string;
    value?: any;
}, {
    propertyId: string;
    operator: string;
    value?: any;
}>;
export declare const templateSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    notionDatabaseId: z.ZodString;
    userNotionIntegrationId: z.ZodNullable<z.ZodString>;
    body: z.ZodString;
    conditions: z.ZodArray<z.ZodObject<{
        propertyId: z.ZodString;
        operator: z.ZodString;
        value: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        propertyId: string;
        operator: string;
        value?: any;
    }, {
        propertyId: string;
        operator: string;
        value?: any;
    }>, "many">;
    destinationId: z.ZodString;
    createdAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
    updatedAt: z.ZodEffects<z.ZodEffects<z.ZodDate, string, Date>, string, unknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    notionDatabaseId: string;
    userNotionIntegrationId: string | null;
    body: string;
    conditions: {
        propertyId: string;
        operator: string;
        value?: any;
    }[];
    destinationId: string;
}, {
    name: string;
    id: string;
    userId: string;
    notionDatabaseId: string;
    userNotionIntegrationId: string | null;
    body: string;
    conditions: {
        propertyId: string;
        operator: string;
        value?: any;
    }[];
    destinationId: string;
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
export declare const createTemplateApiSchema: z.ZodObject<{
    name: z.ZodString;
    notionDatabaseId: z.ZodString;
    body: z.ZodString;
    conditions: z.ZodArray<z.ZodObject<{
        propertyId: z.ZodString;
        operator: z.ZodString;
        value: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        propertyId: string;
        operator: string;
        value?: any;
    }, {
        propertyId: string;
        operator: string;
        value?: any;
    }>, "many">;
    destinationId: z.ZodString;
} & {
    userNotionIntegrationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    notionDatabaseId: string;
    userNotionIntegrationId: string;
    body: string;
    conditions: {
        propertyId: string;
        operator: string;
        value?: any;
    }[];
    destinationId: string;
}, {
    name: string;
    notionDatabaseId: string;
    userNotionIntegrationId: string;
    body: string;
    conditions: {
        propertyId: string;
        operator: string;
        value?: any;
    }[];
    destinationId: string;
}>;
export declare const updateTemplateApiSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    notionDatabaseId: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    conditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        propertyId: z.ZodString;
        operator: z.ZodString;
        value: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        propertyId: string;
        operator: string;
        value?: any;
    }, {
        propertyId: string;
        operator: string;
        value?: any;
    }>, "many">>;
    destinationId: z.ZodOptional<z.ZodString>;
    userNotionIntegrationId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    notionDatabaseId?: string | undefined;
    userNotionIntegrationId?: string | undefined;
    body?: string | undefined;
    conditions?: {
        propertyId: string;
        operator: string;
        value?: any;
    }[] | undefined;
    destinationId?: string | undefined;
}, {
    name?: string | undefined;
    notionDatabaseId?: string | undefined;
    userNotionIntegrationId?: string | undefined;
    body?: string | undefined;
    conditions?: {
        propertyId: string;
        operator: string;
        value?: any;
    }[] | undefined;
    destinationId?: string | undefined;
}>;
export type Template = z.infer<typeof templateSchema>;
export type TemplateCondition = z.infer<typeof templateConditionSchema>;
export type CreateTemplateApiInput = z.infer<typeof createTemplateApiSchema>;
export type UpdateTemplateApiInput = z.infer<typeof updateTemplateApiSchema>;
