import { z } from "zod";
export declare const notionDatabaseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export declare const notionPropertySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        color?: string | undefined;
    }, {
        name: string;
        id: string;
        color?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: string;
    name: string;
    id: string;
    options?: {
        name: string;
        id: string;
        color?: string | undefined;
    }[] | undefined;
}, {
    type: string;
    name: string;
    id: string;
    options?: {
        name: string;
        id: string;
        color?: string | undefined;
    }[] | undefined;
}>;
