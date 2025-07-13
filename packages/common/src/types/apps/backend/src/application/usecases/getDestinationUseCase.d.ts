import type { Destination as DestinationData } from "@notipal/common";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";
export interface GetDestinationInput {
    id: string;
    userId: string;
}
export type GetDestinationOutput = DestinationData | null;
export declare const createGetDestinationUseCase: (dependencies: {
    destinationRepository: DestinationRepository;
}) => (input: GetDestinationInput) => Promise<GetDestinationOutput>;
