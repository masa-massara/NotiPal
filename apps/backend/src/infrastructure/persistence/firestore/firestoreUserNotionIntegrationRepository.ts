import type { CollectionReference, Firestore } from "@google-cloud/firestore";
import {
	type InternalUserNotionIntegration,
	internalUserNotionIntegrationSchema,
} from "@notipal/common";
import { getFirestore } from "firebase-admin/firestore";
import type { UserNotionIntegrationRepository } from "../../../domain/repositories/userNotionIntegrationRepository";

const INTEGRATIONS_COLLECTION = "userNotionIntegrations";

export const createFirestoreUserNotionIntegrationRepository = (
	db: Firestore,
): UserNotionIntegrationRepository => {
	const collection: CollectionReference = db.collection(
		INTEGRATIONS_COLLECTION,
	);

	const save = async (
		integration: InternalUserNotionIntegration,
	): Promise<void> => {
		await collection.doc(integration.id).set(integration);
	};

	const findById = async (
		id: string,
		userId: string,
	): Promise<InternalUserNotionIntegration | null> => {
		const doc = await collection.doc(id).get();
		if (!doc.exists) return null;
		const data = doc.data();
		if (data?.userId !== userId) return null;
		return internalUserNotionIntegrationSchema.parse(data);
	};

	const findAllByUserId = async (
		userId: string,
	): Promise<InternalUserNotionIntegration[]> => {
		const snapshot = await collection.where("userId", "==", userId).get();
		if (snapshot.empty) return [];
		return snapshot.docs.map((doc) => {
			const data = doc.data();
			// FirestoreのTimestampをDateオブジェクトに変換
			if (data.createdAt && typeof data.createdAt.toDate === "function") {
				data.createdAt = data.createdAt.toDate();
			}
			if (data.updatedAt && typeof data.updatedAt.toDate === "function") {
				data.updatedAt = data.updatedAt.toDate();
			}
			return internalUserNotionIntegrationSchema.parse(data);
		});
	};

	const deleteById = async (id: string, userId: string): Promise<void> => {
		const doc = await findById(id, userId);
		if (doc) {
			await collection.doc(id).delete();
		}
	};

	return { save, findById, findAllByUserId, deleteById };
};
