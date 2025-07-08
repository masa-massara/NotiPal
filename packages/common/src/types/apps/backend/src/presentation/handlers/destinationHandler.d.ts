import type { Context } from "hono";
import type { InitializedUseCases } from "../../di";
export declare const createDestinationHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}, 201, "json">>;
export declare const getDestinationByIdHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}, 200, "json">>;
export declare const listDestinationsHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}[], 200, "json">>;
export declare const updateDestinationHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}, 200, "json">>;
export declare const deleteDestinationHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<null, 204, "body">>;
