import type { Destination as DestinationData } from "@notipal/common";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";
export interface ListDestinationsInput {
    userId: string;
}
export type ListDestinationsOutput = DestinationData[];
export declare const createListDestinationsUseCase: (dependencies: {
    destinationRepository: DestinationRepository;
}) => (input: ListDestinationsInput) => Promise<ListDestinationsOutput>;
