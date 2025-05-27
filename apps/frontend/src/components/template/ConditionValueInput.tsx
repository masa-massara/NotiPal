"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { NotionProperty } from "@/types/notionIntegration";
import { type Control, Controller } from "react-hook-form";

interface ConditionValueInputProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	control: Control<any>; // react-hook-form の control オブジェクト
	conditionIndex: number; // フィールド配列のインデックス
	selectedProperty?: NotionProperty; // 選択されたNotionプロパティの情報
	disabled?: boolean;
}

export default function ConditionValueInput({
	control,
	conditionIndex,
	selectedProperty,
	disabled,
}: ConditionValueInputProps) {
	const fieldName = `conditions.${conditionIndex}.value` as const;

	if (!selectedProperty) {
		return (
			<Input
				placeholder="プロパティを選択してください"
				disabled
				className="bg-muted cursor-not-allowed"
			/>
		);
	}

	switch (selectedProperty.type) {
		case "checkbox":
			return (
				<Controller
					name={fieldName}
					control={control}
					defaultValue="false" // チェックボックスのデフォルト値は false (文字列) が無難かも
					render={({ field }) => (
						<Select
							onValueChange={field.onChange}
							value={field.value?.toString()} // RHFは値を文字列で持つことを想定
							disabled={disabled}
						>
							<SelectTrigger>
								<SelectValue placeholder="値を選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">チェック済み (True)</SelectItem>
								<SelectItem value="false">未チェック (False)</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			);
		case "select":
		case "status":
		case "multi_select": // multi_select は現状、単一選択として扱う
			return (
				<Controller
					name={fieldName}
					control={control}
					render={({ field }) => (
						<Select
							onValueChange={field.onChange}
							value={field.value}
							disabled={disabled || !selectedProperty.options?.length}
						>
							<SelectTrigger>
								<SelectValue placeholder="オプションを選択" />
							</SelectTrigger>
							<SelectContent>
								{selectedProperty.options?.map((option) => (
									// NotionのAPI仕様とDBの持ち方によって、option.id か option.name を送信する値にする
									// ここでは option.name を送信する値と仮定 (表示も name)
									<SelectItem
										key={option.id || option.name}
										value={option.name}
									>
										{option.name}
									</SelectItem>
								))}
								{!selectedProperty.options?.length && (
									<SelectItem value="no-options-placeholder" disabled>
										オプションがありません
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					)}
				/>
			);
		case "date":
		case "created_time":
		case "last_edited_time":
			return (
				<Controller
					name={fieldName}
					control={control}
					render={({ field }) => (
						<Input type="date" {...field} disabled={disabled} />
					)}
				/>
			);
		case "number":
			return (
				<Controller
					name={fieldName}
					control={control}
					render={({ field }) => (
						<Input
							type="number"
							{...field}
							disabled={disabled}
							placeholder="数値を入力"
						/>
					)}
				/>
			);
		// rich_text, title, text, url, email, phone_number など
		// relation, formula, rollup など、より複雑なものは一旦汎用的なテキスト入力で
		default:
			return (
				<Controller
					name={fieldName}
					control={control}
					render={({ field }) => (
						<Input {...field} disabled={disabled} placeholder="値を入力" />
					)}
				/>
			);
	}
}
