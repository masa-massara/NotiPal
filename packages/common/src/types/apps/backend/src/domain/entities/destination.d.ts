export declare class Destination {
    readonly id: string;
    name?: string;
    webhookUrl: string;
    readonly userId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(id: string, webhookUrl: string, userId: string, name?: string, // name はオプションなので ? をつけて、引数の最後の方にしとくとええで
    createdAt?: Date, updatedAt?: Date);
    private isValidHttpUrl;
    updateName(newName?: string): void;
    updateWebhookUrl(newWebhookUrl: string): void;
}
