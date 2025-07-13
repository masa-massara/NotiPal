import type { Destination } from "@notipal/common";
import type { Context } from "hono";
export declare const createDestinationHandlerFactory: (createDestinationUseCase: (input: Destination & {
    userId: string;
}) => Promise<Destination>) => (c: Context) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}, 201, "json">>;
export declare const getDestinationByIdHandlerFactory: (getDestinationUseCase: (input: {
    id: string;
    userId: string;
}) => Promise<Destination | null>) => (c: Context) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}, import("hono/utils/http-status").ContentfulStatusCode, "json">>;
export declare const listDestinationsHandlerFactory: (listDestinationsUseCase: (input: {
    userId: string;
}) => Promise<Destination[]>) => (c: Context) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}[], import("hono/utils/http-status").ContentfulStatusCode, "json">>;
export declare const updateDestinationHandlerFactory: (updateDestinationUseCase: (input: Destination & {
    id: string;
    userId: string;
}) => Promise<Destination>) => (c: Context) => Promise<Response & import("hono").TypedResponse<{
    id: string;
    userId: string;
    webhookUrl: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
}, import("hono/utils/http-status").ContentfulStatusCode, "json">>;
export declare const deleteDestinationHandlerFactory: (deleteDestinationUseCase: (input: {
    id: string;
    userId: string;
}) => Promise<void>) => (c: Context) => Promise<Response & import("hono").TypedResponse<null, 204, "body">>;
