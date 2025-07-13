import type { Context } from "hono";
import type { InitializedUseCases } from "../../di";
export declare const createIntegrationHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    integrationName: string;
}, 201, "json">>;
export declare const listIntegrationsHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    success: true;
    data: {
        id: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
        integrationName: string;
    }[];
}, 200, "json">>;
export declare const deleteIntegrationHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<null, 204, "body">>;
export declare const listUserAccessibleDatabasesHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    success: true;
    data: {
        id: string;
        name: string;
    }[];
}, 200, "json">>;
