export interface NotificationPayload {
    content?: string;
    text?: string;
}
export interface NotificationClient {
    /**
     * 指定されたWebhook URLに通知メッセージを送信する
     * @param webhookUrl 通知先のWebhook URL
     * @param payload 送信するメッセージペイロード (NotificationPayload)
     * @returns 送信が成功したかどうか (エラー時は例外を投げる想定なのでvoidでも良い)
     */
    send(webhookUrl: string, payload: NotificationPayload): Promise<void>;
}
