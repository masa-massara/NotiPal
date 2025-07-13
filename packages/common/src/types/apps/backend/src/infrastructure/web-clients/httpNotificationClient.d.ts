import type { NotificationClient, NotificationPayload } from "../../domain/services/notificationClient";
export declare class HttpNotificationClient implements NotificationClient {
    constructor();
    send(webhookUrl: string, payload: NotificationPayload): Promise<void>;
}
