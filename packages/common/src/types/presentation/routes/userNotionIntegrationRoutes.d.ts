import type { InitializedUseCases } from "../../di";
export declare const createUserNotionIntegrationRoutes: (useCases: InitializedUseCases) => import("hono/hono-base").HonoBase<{
    Variables: {
        userId: string;
    };
}, {
    "/": {
        $post: {
            input: {};
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
                id: string;
                userId: string;
                createdAt: string;
                updatedAt: string;
                integrationName: string;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
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
            output: null;
            outputFormat: "body";
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
                [x: number]: {
                    id: string;
                    name: string;
                };
                length: number;
                toString: null;
                toLocaleString: null;
                pop: null;
                push: {};
                concat: {};
                join: {};
                reverse: null;
                shift: null;
                slice: {};
                sort: {};
                splice: {};
                unshift: {};
                indexOf: {};
                lastIndexOf: {};
                every: {};
                some: {};
                forEach: {};
                map: {};
                filter: {};
                reduce: {};
                reduceRight: {};
                find: {};
                findIndex: {};
                fill: {};
                copyWithin: {};
                entries: null;
                keys: null;
                values: null;
                includes: {};
                flatMap: {};
                flat: {};
                at: {};
                findLast: {};
                findLastIndex: {};
                toReversed: null;
                toSorted: {};
                toSpliced: {};
                with: {};
                [Symbol.iterator]: null;
                readonly [Symbol.unscopables]: {
                    [x: number]: boolean | undefined;
                    length?: boolean | undefined;
                    toString?: boolean | undefined;
                    toLocaleString?: boolean | undefined;
                    pop?: boolean | undefined;
                    push?: boolean | undefined;
                    concat?: boolean | undefined;
                    join?: boolean | undefined;
                    reverse?: boolean | undefined;
                    shift?: boolean | undefined;
                    slice?: boolean | undefined;
                    sort?: boolean | undefined;
                    splice?: boolean | undefined;
                    unshift?: boolean | undefined;
                    indexOf?: boolean | undefined;
                    lastIndexOf?: boolean | undefined;
                    every?: boolean | undefined;
                    some?: boolean | undefined;
                    forEach?: boolean | undefined;
                    map?: boolean | undefined;
                    filter?: boolean | undefined;
                    reduce?: boolean | undefined;
                    reduceRight?: boolean | undefined;
                    find?: boolean | undefined;
                    findIndex?: boolean | undefined;
                    fill?: boolean | undefined;
                    copyWithin?: boolean | undefined;
                    entries?: boolean | undefined;
                    keys?: boolean | undefined;
                    values?: boolean | undefined;
                    includes?: boolean | undefined;
                    flatMap?: boolean | undefined;
                    flat?: boolean | undefined;
                    at?: boolean | undefined;
                    findLast?: boolean | undefined;
                    findLastIndex?: boolean | undefined;
                    toReversed?: boolean | undefined;
                    toSorted?: boolean | undefined;
                    toSpliced?: boolean | undefined;
                    with?: boolean | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
