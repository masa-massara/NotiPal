// まずは、条件を表す型を定義しとこか
// （これはエンティティとは別に、値オブジェクトとして src/domain/value-objects/ とかに置いてもええかもな）
export type TemplateConditionOperator =
	| "="
	| "!="
	| "in"
	| "<"
	| ">"
	| "is_empty"
	| "is_not_empty";

export interface TemplateCondition {
	propertyId: string; // NotionのプロパティID (名前やなくてIDで管理する方が確実)
	operator: TemplateConditionOperator;
	value: string | number | string[]; // 値。演算子によって型が変わるかもしれんな
}
