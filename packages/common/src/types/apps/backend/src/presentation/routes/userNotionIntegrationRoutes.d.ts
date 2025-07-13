import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
export declare const createUserNotionIntegrationRoutes: (useCases: InitializedUseCases) => OpenAPIHono<{
    Variables: {
        userId: string;
    };
}, {
    "/": {
        $post: {
            input: {
                json: {
                    integrationName: string;
                    notionIntegrationToken: string;
                };
            };
            output: {
                id: string;
                userId: string;
                createdAt: string;
                updatedAt: string;
                integrationName: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/": {
        $get: {
            input: {};
            output: {
                success: true;
                data: {
                    id: string;
                    userId: string;
                    createdAt: string;
                    updatedAt: string;
                    integrationName: string;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:integrationId": {
        $delete: {
            input: {
                param: {
                    integrationId: string;
                };
            };
            output: {};
            outputFormat: string;
            status: 204;
        };
    };
} & {
    "/:integrationId/databases": {
        $get: {
            input: {
                param: {
                    integrationId: string;
                };
            };
            output: {
                error: string;
                details: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    integrationId: string;
                };
            };
            output: {
                success: true;
                data: {
                    name: string;
                    id: string;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
