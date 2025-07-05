import type { CreateDestinationApiInput, Destination as DestinationData } from "@notipal/common";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";
export interface CreateDestinationInput {
    webhookUrl: string;
    name?: string;
    userId: string;
}
export interface CreateDestinationOutput {
    id: string;
    webhookUrl: string;
    name?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const createCreateDestinationUseCase: (dependencies: {
    destinationRepository: DestinationRepository;
}) => (input: CreateDestinationApiInput & {
    userId: string;
}) => Promise<DestinationData>;
