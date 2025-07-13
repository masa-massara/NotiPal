import type { Destination as CommonDestination } from "@notipal/common";
import type { DestinationRepository } from "../../../domain/repositories/destinationRepository";
export declare class InMemoryDestinationRepository implements DestinationRepository {
    private readonly destinations;
    save(destination: CommonDestination): Promise<void>;
    findById(id: string, userId: string): Promise<CommonDestination | null>;
    deleteById(id: string, userId: string): Promise<void>;
    findAll(userId: string): Promise<CommonDestination[]>;
    clear(): void;
}
