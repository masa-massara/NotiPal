import { OpenAPIHono } from "@hono/zod-openapi";
import type { InitializedUseCases } from "../../di";
export declare const createTemplateRoutes: (useCases: InitializedUseCases) => OpenAPIHono<{
    Variables: {
        userId: string;
    };
}, {
    "/": {
        $get: {
            input: {};
            output: {
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
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    name: string;
                    notionDatabaseId: string;
                    userNotionIntegrationId: string;
                    body: string;
                    conditions: {
                        propertyId: string;
                        operator: string;
                        value?: unknown;
                    }[];
                    destinationId: string;
                };
            };
            output: {
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
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
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
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $put: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    notionDatabaseId?: string | undefined;
                    userNotionIntegrationId?: string | undefined;
                    body?: string | undefined;
                    conditions?: {
                        propertyId: string;
                        operator: string;
                        value?: unknown;
                    }[] | undefined;
                    destinationId?: string | undefined;
                };
            };
            output: {
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
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {};
            outputFormat: string;
            status: 204;
        };
    };
}, "/">;
