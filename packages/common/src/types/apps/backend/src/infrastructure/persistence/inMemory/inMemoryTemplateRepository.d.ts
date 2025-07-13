import type { Template } from "@notipal/common";
import type { TemplateRepository } from "../../../domain/repositories/templateRepository";
export declare class InMemoryTemplateRepository implements TemplateRepository {
    private readonly templates;
    save(template: Template): Promise<void>;
    findById(id: string, userId: string): Promise<Template | null>;
    findByNotionDatabaseId(notionDatabaseId: string, userId: string): Promise<Template[]>;
    findAllByNotionDatabaseId(notionDatabaseId: string): Promise<Template[]>;
    deleteById(id: string, userId: string): Promise<void>;
    findAll(userId: string): Promise<Template[]>;
    clear(): void;
}
