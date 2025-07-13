import type { InternalUserNotionIntegration } from "@notipal/common";
export interface UserNotionIntegrationRepository {
    save(integration: InternalUserNotionIntegration): Promise<void>;
    findById(id: string, userId: string): Promise<InternalUserNotionIntegration | null>;
    findAllByUserId(userId: string): Promise<InternalUserNotionIntegration[]>;
    deleteById(id: string, userId: string): Promise<void>;
}
