import {
	type Destination as DestinationData,
	destinationSchema,
} from "@notipal/common";
// initializeApp, cert, getApps は main.ts で一元管理するのでここでは不要
import {
	type Firestore,
	type QueryDocumentSnapshot, // QueryDocumentSnapshot は findAll で使うので残す
	getFirestore,
} from "firebase-admin/firestore";
// src/infrastructure/persistence/firestore/firestoreDestinationRepository.ts
import { Destination } from "../../../domain/entities/destination";
import type { DestinationRepository } from "../../../domain/repositories/destinationRepository";

const DESTINATIONS_COLLECTION = "destinations";

export const createFirestoreDestinationRepository =
	(): DestinationRepository => {
		const db: Firestore = getFirestore();
		const collection = db.collection(DESTINATIONS_COLLECTION);

		const findById = async (
			id: string,
			userId: string,
		): Promise<DestinationData | null> => {
			const docSnap = await collection.doc(id).get();
			if (!docSnap.exists) return null;
			const data = docSnap.data();
			if (data?.userId !== userId) return null;
			// スキーマで型安全にパース
			return destinationSchema.parse(data);
		};

		const save = async (destination: DestinationData): Promise<void> => {
			await collection.doc(destination.id).set(destination);
		};

		const findAll = async (userId: string): Promise<DestinationData[]> => {
			const snapshot = await collection.where("userId", "==", userId).get();
			return snapshot.docs.map((doc) => destinationSchema.parse(doc.data()));
		};

		const deleteById = async (id: string, userId: string): Promise<void> => {
			const doc = await findById(id, userId); // findByIdで所有者確認
			if (doc) {
				await collection.doc(id).delete();
			}
		};

		return {
			findById,
			save,
			findAll,
			deleteById,
		};
	};
