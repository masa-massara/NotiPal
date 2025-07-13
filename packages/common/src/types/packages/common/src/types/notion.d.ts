export type NotionDatabase = {
    id: string;
    name: string;
};
export type NotionProperty = {
    id: string;
    name: string;
    type: string;
    options?: {
        id: string;
        name: string;
        color?: string;
    }[];
};
