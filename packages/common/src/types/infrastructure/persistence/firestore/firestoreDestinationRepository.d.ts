import { type Firestore } from "firebase-admin/firestore";
import type { DestinationRepository } from "../../../domain/repositories/destinationRepository";
export declare const createFirestoreDestinationRepository: (db: Firestore) => DestinationRepository;
