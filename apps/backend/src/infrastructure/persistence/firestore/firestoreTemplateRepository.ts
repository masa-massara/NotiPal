import { templateSchema } from "@notipal/common";
// initializeApp, cert, getApps は main.ts で一元管理するのでここでは不要
import {
	type Firestore,
	type QueryDocumentSnapshot,
	getFirestore,
} from "firebase-admin/firestore";
// src/infrastructure/persistence/firestore/firestoreTemplateRepository.ts
import type { Template } from "../../../domain/entities/template";
import type { TemplateRepository } from "../../../domain/repositories/templateRepository";

// Firestoreのコレクション名
const TEMPLATES_COLLECTION = "templates";

export const createFirestoreTemplateRepository = (): TemplateRepository => {
	const db: Firestore = getFirestore();
	const collection = db.collection(TEMPLATES_COLLECTION);

	const findById = async (
		id: string,
		userId: string,
	): Promise<Template | null> => {
		const docSnap = await collection.doc(id).get();
		if (!docSnap.exists) return null;
		const data = docSnap.data();
		if (data?.userId !== userId) return null;
		return templateSchema.parse(data);
	};

	const save = async (template: Template): Promise<void> => {
		await collection.doc(template.id).set(template);
	};

	const findAll = async (userId: string): Promise<Template[]> => {
		const snapshot = await collection.where("userId", "==", userId).get();
		return snapshot.docs.map((doc) => templateSchema.parse(doc.data()));
	};

	const findAllByNotionDatabaseId = async (
		notionDatabaseId: string,
	): Promise<Template[]> => {
		const snapshot = await collection
			.where("notionDatabaseId", "==", notionDatabaseId)
			.get();
		return snapshot.docs.map((doc) => templateSchema.parse(doc.data()));
	};

	const findByNotionDatabaseId = async (
		notionDatabaseId: string,
		userId: string,
	): Promise<Template[]> => {
		const snapshot = await collection
			.where("notionDatabaseId", "==", notionDatabaseId)
			.where("userId", "==", userId)
			.get();
		return snapshot.docs.map((doc) => templateSchema.parse(doc.data()));
	};

	const deleteById = async (id: string, userId: string): Promise<void> => {
		const doc = await findById(id, userId);
		if (doc) {
			await collection.doc(id).delete();
		}
	};

	return {
		findById,
		save,
		findAll,
		findAllByNotionDatabaseId,
		findByNotionDatabaseId,
		deleteById,
	};
};
