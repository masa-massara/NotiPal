declare module "hono" {
    interface ContextVariableMap {
        userId: string;
    }
}
declare const app: import("hono/hono-base").HonoBase<{
    Variables: {
        userId: string;
    };
}, ((({
    "*": {
        $get: {
            input: {};
            output: {};
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} | import("hono/types").MergeSchemaPath<{
    "/notion": {
        $post: {
            input: {
                json: unknown;
            };
            output: {
                error: string;
                details: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                json: unknown;
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/webhooks">) & {
    "/": {
        $get: {
            input: {};
            output: "NotiPal App is running!";
            outputFormat: "text";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}) & {
    "/doc": {
        $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}) | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                success: true;
                data: {
                    id: string;
                    userId: string;
                    webhookUrl: string;
                    createdAt: string;
                    updatedAt: string;
                    name?: string | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    webhookUrl: string;
                    name?: string | undefined;
                };
            };
            output: {
                id: string;
                userId: string;
                webhookUrl: string;
                createdAt: string;
                updatedAt: string;
                name?: string | undefined;
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
                id: string;
                userId: string;
                webhookUrl: string;
                createdAt: string;
                updatedAt: string;
                name?: string | undefined;
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
                    webhookUrl?: string | undefined;
                };
            };
            output: {
                id: string;
                userId: string;
                webhookUrl: string;
                createdAt: string;
                updatedAt: string;
                name?: string | undefined;
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
}, "/destinations"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
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
            };
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
}, "/templates"> | import("hono/types").MergeSchemaPath<{
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
}, "/me/notion-integrations"> | import("hono/types").MergeSchemaPath<{
    "/:databaseId/properties": {
        $get: {
            input: {
                param: {
                    databaseId: string;
                };
            } & {
                query: {
                    integrationId: string;
                };
            };
            output: {
                type: string;
                name: string;
                id: string;
                options?: {
                    name: string;
                    id: string;
                    color?: string | undefined;
                }[] | undefined;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
}, "/notion-databases">, "/">;
export { app };
export type AppType = typeof app;
