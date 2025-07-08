import type { Context } from "hono";
import type { InitializedUseCases } from "../../di";
export declare const getNotionDatabasePropertiesHandler: (c: Context, useCases: InitializedUseCases) => Promise<Response & import("hono").TypedResponse<{
    options?: {
        id: string;
        name: string;
        color?: string | undefined;
    }[] | undefined;
    type: string;
    name: string;
    id: string;
}[], 200, "json">>;
