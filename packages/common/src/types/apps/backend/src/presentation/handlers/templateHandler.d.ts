import type { Context } from "hono";
import type { InitializedUseCases } from "../../di";
export declare const createTemplateHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
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
        value?: undefined;
    }[];
    destinationId: string;
}, 201, "json">>;
export declare const getTemplateByIdHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
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
        value?: undefined;
    }[];
    destinationId: string;
}, 200, "json">>;
export declare const listTemplatesHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    success: true;
    data: {
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
            value?: undefined;
        }[];
        destinationId: string;
    }[];
}, 200, "json">>;
export declare const updateTemplateHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
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
        value?: undefined;
    }[];
    destinationId: string;
}, 200, "json">>;
export declare const deleteTemplateHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<null, 204, "body">>;
