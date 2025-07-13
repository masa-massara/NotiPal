import type { Firestore } from "@google-cloud/firestore";
import type { UserNotionIntegrationRepository } from "../../../domain/repositories/userNotionIntegrationRepository";
export declare const createFirestoreUserNotionIntegrationRepository: (db: Firestore) => UserNotionIntegrationRepository;
