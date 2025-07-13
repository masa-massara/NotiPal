import { type Firestore } from "firebase-admin/firestore";
import type { TemplateRepository } from "../../../domain/repositories/templateRepository";
export declare const createFirestoreTemplateRepository: (db: Firestore) => TemplateRepository;
