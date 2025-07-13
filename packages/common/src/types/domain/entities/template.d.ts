export type TemplateConditionOperator = "=" | "!=" | "in" | "<" | ">" | "is_empty" | "is_not_empty";
export interface TemplateCondition {
    propertyId: string;
    operator: TemplateConditionOperator;
    value: string | number | string[];
}
