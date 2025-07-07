"use client";

import PageHeader from "@/components/layout/PageHeader";
import ConditionValueInput from "@/components/template/ConditionValueInput"; // ★ 作成したコンポーネントをインポート
import LoadingSpinner from "@/components/ui/LoadingSpinner"; // ローディング表示用
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient as hc } from "@/lib/apiClient";

import { idTokenAtom } from "@/store/globalAtoms";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
	Destination,
	NotionDatabase,
	UserNotionIntegration as NotionIntegration,
	NotionProperty,
	Template,
	UpdateTemplateApiInput as UpdateTemplateData,
} from "@notipal/common";
import { updateTemplateApiSchema } from "@notipal/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = updateTemplateApiSchema;
type FormData = z.infer<typeof formSchema>;

function EditTemplatePage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const currentIdToken = useAtomValue(idTokenAtom);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
		getValues,
		setValue,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		// defaultValues は useEffect で template データがロードされた後に設定
	});

	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "conditions",
	});

	const watchedConditions = watch("conditions");
	const selectedNotionIntegrationId = watch("userNotionIntegrationId");
	const selectedNotionDatabaseId = watch("notionDatabaseId");

	const {
		data: template,
		isLoading: isLoadingTemplate,
		error: errorTemplate,
	} = useQuery<Template | null, Error>({
		queryKey: ["template", id, currentIdToken],
		queryFn: async () => {
			if (!currentIdToken) throw new Error("ID token not available.");
			const res = await hc.templates[":id"].$get({ param: { id } });
			if (!res.ok) {
				throw new Error("Failed to fetch template");
			}
			const data = await res.json();
			return data;
		},
		enabled: !!id && !!currentIdToken,
	});

	const { data: notionIntegrations, isLoading: isLoadingNotion } = useQuery<
		NotionIntegration[],
		Error
	>({
		queryKey: ["notionIntegrations", currentIdToken],
		queryFn: async () => {
			if (!currentIdToken)
				throw new Error("ID token not available for Notion Integrations.");
			const res = await hc.me["notion-integrations"].$get();
			if (!res.ok) {
				throw new Error("Failed to fetch Notion integrations");
			}
			const data = await res.json();
			return Array.isArray(data) ? data : [];
		},
		enabled: !!currentIdToken,
	});

	const { data: destinations, isLoading: isLoadingDestinations } = useQuery<
		Destination[],
		Error
	>({
		queryKey: ["destinations"],
		queryFn: async () => {
			const res = await hc.destinations.$get();
			if (!res.ok) {
				throw new Error("Failed to fetch destinations");
			}
			const data = await res.json();
			return Array.isArray(data) ? data : [];
		},
	});

	const {
		data: notionDatabases,
		isLoading: isLoadingNotionDatabases,
		error: errorNotionDatabases,
	} = useQuery<NotionDatabase[], Error>({
		queryKey: ["notionDatabases", selectedNotionIntegrationId],
		queryFn: async () => {
			if (!selectedNotionIntegrationId) return [];
			const res = await hc.me["notion-integrations"][
				":integrationId"
			].databases.$get({
				param: { integrationId: selectedNotionIntegrationId },
			});
			if (!res.ok) {
				throw new Error("Failed to fetch Notion databases");
			}
			const data = await res.json();
			if (Array.isArray(data)) {
				return (data as NotionDatabase[]).map((db: NotionDatabase) => ({
					id: db.id,
					name: db.name,
				}));
			}
			return [];
		},
		enabled: !!selectedNotionIntegrationId,
	});

	const {
		data: databaseProperties,
		isLoading: isLoadingDbProperties,
		error: errorDbProperties,
	} = useQuery<NotionProperty[], Error>({
		queryKey: [
			"databaseProperties",
			selectedNotionIntegrationId,
			selectedNotionDatabaseId,
		],
		queryFn: async () => {
			if (!selectedNotionIntegrationId || !selectedNotionDatabaseId) return [];
			const res = await hc["notion-databases"][":databaseId"].properties.$get({
				param: { databaseId: selectedNotionDatabaseId },
			});
			if (!res.ok) {
				throw new Error("Failed to fetch database properties");
			}
			const data = await res.json();
			return Array.isArray(data) ? data : [];
		},
		enabled:
			!!selectedNotionIntegrationId &&
			!!selectedNotionDatabaseId &&
			!isLoadingTemplate, // template ロード後
	});

	const handlePropertyChange = useCallback(
		(conditionIndex: number) => {
			setValue(`conditions.${conditionIndex}.value`, "", {
				shouldValidate: true,
			});
		},
		[setValue],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (template) {
			reset({
				name: template.name,
				userNotionIntegrationId: template.userNotionIntegrationId ?? "",
				notionDatabaseId: template.notionDatabaseId,
				conditions:
					template.conditions?.map((c) => ({ ...c, value: c.value ?? "" })) ||
					[], // valueがnull/undefinedなら空文字に
				body: template.body,
				destinationId: template.destinationId,
			});
		}
	}, [template, reset, replace]); // replace を依存配列に追加

	// 連携IDが変更されたらDB IDと条件をクリア
	useEffect(() => {
		if (
			template &&
			selectedNotionIntegrationId &&
			selectedNotionIntegrationId !== template.userNotionIntegrationId
		) {
			setValue("notionDatabaseId", "", { shouldValidate: true });
			setValue("conditions", [], { shouldValidate: false });
		}
	}, [selectedNotionIntegrationId, setValue, template]);

	// DB IDが変更されたら条件をクリア (テンプレートの初期DB IDとの比較も考慮すると良いかも)
	useEffect(() => {
		// このロジックは、ユーザーが手動でDBを変更した場合にのみ条件をクリアするべき
		// 初期ロード時や連携変更によるDBクリア後は、このuseEffectで再度クリアしないように注意
		if (
			template &&
			selectedNotionDatabaseId &&
			selectedNotionDatabaseId !== getValues("notionDatabaseId")
		) {
			// getValuesを使うことで、reset後の値と比較できる
			setValue("conditions", [], { shouldValidate: false });
		}
	}, [selectedNotionDatabaseId, setValue, template, getValues]);

	const mutation = useMutation({
		mutationFn: async (formData: FormData) => {
			if (!currentIdToken) {
				throw new Error("ID token not available for updating template.");
			}
			const templateUpdateData: UpdateTemplateData = {
				...formData,
				conditions:
					formData.conditions?.map((c) => ({ ...c, value: c.value ?? "" })) ||
					[],
			};
			const res = await hc.templates[":id"].$put(
				{
					param: { id },
				},
				templateUpdateData,
			);
			if (!res.ok) {
				throw new Error("Failed to update template");
			}
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Notification template updated successfully.",
			});
			queryClient.invalidateQueries({
				queryKey: ["templates", currentIdToken],
			});
			queryClient.invalidateQueries({
				queryKey: ["template", id, currentIdToken],
			});
			router.push("/templates");
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: error.message || "Failed to update template.",
				variant: "destructive",
			});
		},
	});

	const onSubmit = async (data: FormData) => {
		mutation.mutate(data);
	};

	if (isLoadingTemplate || isLoadingNotion || isLoadingDestinations) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<LoadingSpinner />{" "}
				<span className="ml-2">Loading template data...</span>
			</div>
		);
	}

	if (errorTemplate) {
		return (
			<>
				<PageHeader title="Edit Notification Template" />
				<div className="text-red-500">
					Error fetching template: {errorTemplate.message}
				</div>
				<Link href="/templates">
					<Button variant="link">Back to Templates</Button>
				</Link>
			</>
		);
	}

	if (!template) {
		return (
			<>
				<PageHeader title="Edit Notification Template" />
				<div className="text-center">
					<p>Template not found.</p>
					<Link href="/templates">
						<Button variant="link">Back to Templates</Button>
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<PageHeader title={`Edit Template: ${template?.name || ""}`} />
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>1. Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Template Name</Label>
							<Input id="name" {...register("name")} />
							{typeof errors.name?.message === "string" && (
								<p className="text-red-600 text-sm">{errors.name.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="userNotionIntegrationId">
								Use Notion Integration
							</Label>
							<Controller
								name="userNotionIntegrationId"
								control={control}
								render={({ field }) => (
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											// 連携先が変わったらDBとプロパティもクリア
											setValue("notionDatabaseId", "");
											setValue("conditions", []);
										}}
										value={field.value}
										disabled={isLoadingNotion || mutation.isPending}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a Notion Integration" />
										</SelectTrigger>
										<SelectContent>
											{isLoadingNotion ? (
												<SelectItem value="loading-ni" disabled>
													Loading integrations...
												</SelectItem>
											) : (
												notionIntegrations?.map((integration) => (
													<SelectItem
														key={integration.id}
														value={integration.id}
													>
														{integration.integrationName}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.userNotionIntegrationId && (
								<p className="text-red-600 text-sm">
									{errors.userNotionIntegrationId.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="notionDatabaseId">Target Notion Database</Label>
							<Controller
								name="notionDatabaseId"
								control={control}
								render={({ field }) => (
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											// DBが変わったらプロパティもクリア
											setValue("conditions", []);
										}}
										value={field.value}
										disabled={
											!selectedNotionIntegrationId ||
											isLoadingNotionDatabases ||
											mutation.isPending ||
											isLoadingTemplate // テンプレートの初期値ロード中も無効化
										}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={
													!selectedNotionIntegrationId
														? "Select a Notion Integration first"
														: "Select a Notion Database"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{isLoadingNotionDatabases &&
											selectedNotionIntegrationId ? (
												<SelectItem value="loading-db" disabled>
													Loading databases...
												</SelectItem>
											) : errorNotionDatabases ? (
												<SelectItem value="error-db" disabled>
													Error: {errorNotionDatabases.message}
												</SelectItem>
											) : !isLoadingNotionDatabases &&
												notionDatabases &&
												notionDatabases.length === 0 &&
												selectedNotionIntegrationId ? (
												<SelectItem value="no-db" disabled>
													No databases found for this integration.
												</SelectItem>
											) : (
												notionDatabases?.map((database) => (
													<SelectItem key={database.id} value={database.id}>
														{database.name} (ID: {database.id})
													</SelectItem>
												))
											)}
											{!selectedNotionIntegrationId &&
												!isLoadingNotionDatabases && (
													<SelectItem value="select-integration-first" disabled>
														Select a Notion Integration first
													</SelectItem>
												)}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.notionDatabaseId && (
								<p className="text-red-600 text-sm">
									{errors.notionDatabaseId.message}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>2. Notification Conditions</CardTitle>
						<CardDescription>
							Define conditions based on Notion database properties to trigger
							notifications. (All conditions must be met - AND logic)
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{isLoadingDbProperties && selectedNotionDatabaseId && (
							<p>Loading properties...</p>
						)}
						{errorDbProperties && (
							<p className="text-red-600 text-sm">
								Error loading database properties: {errorDbProperties.message}
							</p>
						)}
						{!isLoadingDbProperties &&
							!errorDbProperties &&
							selectedNotionDatabaseId &&
							(!databaseProperties || databaseProperties.length === 0) && (
								<p className="text-muted-foreground text-sm">
									No properties found for the selected database, or the schema
									could not be loaded.
								</p>
							)}

						{fields.map((field, index) => {
							const selectedPropertyId = watchedConditions?.[index]?.propertyId;
							const currentProperty = databaseProperties?.find(
								(p) => p.id === selectedPropertyId,
							);
							return (
								<div
									key={field.id}
									className="flex items-end space-x-2 bg-stone-50 dark:bg-stone-800/30 p-4 border rounded-lg"
								>
									<div className="flex-1 items-start gap-4 grid grid-cols-1 md:grid-cols-3">
										<div className="space-y-1">
											<Label htmlFor={`conditions.${index}.propertyId`}>
												Property
											</Label>
											<Controller
												name={`conditions.${index}.propertyId`}
												control={control}
												render={({ field: controllerField }) => (
													<Select
														onValueChange={(value) => {
															controllerField.onChange(value);
															handlePropertyChange(index);
														}}
														value={controllerField.value}
														disabled={
															!databaseProperties ||
															isLoadingDbProperties ||
															mutation.isPending ||
															!selectedNotionDatabaseId ||
															isLoadingTemplate
														}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select property" />
														</SelectTrigger>
														<SelectContent>
															{databaseProperties?.map((prop) => (
																<SelectItem key={prop.id} value={prop.id}>
																	{prop.name}{" "}
																	<span className="text-muted-foreground text-xs">
																		({prop.type})
																	</span>
																</SelectItem>
															))}
															{(!databaseProperties ||
																databaseProperties.length === 0) &&
																selectedNotionDatabaseId &&
																!isLoadingDbProperties && (
																	<SelectItem value="no-props-edit" disabled>
																		No properties available
																	</SelectItem>
																)}
														</SelectContent>
													</Select>
												)}
											/>
											{errors.conditions?.[index]?.propertyId && (
												<p className="mt-1 text-red-600 text-xs">
													{errors.conditions[index]?.propertyId?.message}
												</p>
											)}
										</div>

										<div className="space-y-1">
											<Label htmlFor={`conditions.${index}.operator`}>
												Operator
											</Label>
											<Controller
												name={`conditions.${index}.operator`}
												control={control}
												render={({ field: controllerField }) => (
													<Select
														onValueChange={controllerField.onChange}
														value={controllerField.value}
														disabled={
															mutation.isPending ||
															!selectedPropertyId ||
															isLoadingTemplate
														}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select operator" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="equals">Equals</SelectItem>
															<SelectItem value="not_equals">
																Not Equals
															</SelectItem>
															<SelectItem value="contains">Contains</SelectItem>
															<SelectItem value="not_contains">
																Does Not Contain
															</SelectItem>
															<SelectItem value="is_empty">Is Empty</SelectItem>
															<SelectItem value="is_not_empty">
																Is Not Empty
															</SelectItem>
															<SelectItem value="greater_than">
																Greater Than
															</SelectItem>
															<SelectItem value="less_than">
																Less Than
															</SelectItem>
															<SelectItem value="greater_than_or_equal_to">
																Greater Than or Equal To
															</SelectItem>
															<SelectItem value="less_than_or_equal_to">
																Less Than or Equal To
															</SelectItem>
														</SelectContent>
													</Select>
												)}
											/>
											{errors.conditions?.[index]?.operator && (
												<p className="mt-1 text-red-600 text-xs">
													{errors.conditions[index]?.operator?.message}
												</p>
											)}
										</div>

										<div className="space-y-1">
											<Label htmlFor={`conditions.${index}.value`}>Value</Label>
											<ConditionValueInput
												control={control}
												conditionIndex={index}
												selectedProperty={currentProperty}
												disabled={
													mutation.isPending ||
													!selectedPropertyId ||
													!watchedConditions?.[index]?.operator ||
													isLoadingTemplate ||
													["is_empty", "is_not_empty"].includes(
														watchedConditions?.[index]?.operator ?? "",
													)
												}
											/>
											{typeof errors.conditions?.[index]?.value?.message ===
												"string" && (
												<p className="mt-1 text-red-600 text-xs">
													{errors.conditions[index]?.value?.message}
												</p>
											)}
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => remove(index)}
										disabled={mutation.isPending || isLoadingTemplate}
										aria-label="Remove condition"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							);
						})}
						<Button
							type="button"
							onClick={() =>
								append({ propertyId: "", operator: "", value: "" })
							}
							disabled={
								!selectedNotionDatabaseId ||
								isLoadingDbProperties ||
								!!errorDbProperties ||
								!databaseProperties ||
								databaseProperties.length === 0 ||
								mutation.isPending ||
								isLoadingTemplate
							}
							variant="outline"
						>
							Add Condition
						</Button>
						{errors.conditions &&
							!Array.isArray(errors.conditions) &&
							errors.conditions.root && (
								<p className="text-red-600 text-sm">
									{errors.conditions.root.message}
								</p>
							)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>3. Notification Message</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Label htmlFor="body">Message Body</Label>
						<Textarea
							id="body"
							rows={5}
							{...register("body")}
							placeholder="e.g., Page '{PageTitle}' changed status to {Status}."
						/>
						{errors.body && (
							<p className="text-red-600 text-sm">{errors.body.message}</p>
						)}
						<p className="text-muted-foreground text-xs">
							Use placeholders like{" "}
							<code className="bg-muted px-1 py-0.5 rounded">
								{"{PropertyName}"}
							</code>{" "}
							and{" "}
							<code className="bg-muted px-1 py-0.5 rounded">
								{"{_pageUrl}"}
							</code>
							. Placeholders are case-sensitive.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>4. Send To</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Label htmlFor="destinationId">Notification Channel</Label>
						<Controller
							name="destinationId"
							control={control}
							render={({ field }) => (
								<Select
									onValueChange={field.onChange}
									value={field.value}
									disabled={
										isLoadingDestinations ||
										mutation.isPending ||
										isLoadingTemplate
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a Destination Channel" />
									</SelectTrigger>
									<SelectContent>
										{isLoadingDestinations ? (
											<SelectItem value="loading-dest-edit" disabled>
												Loading destinations...
											</SelectItem>
										) : (
											destinations?.map((destination) => (
												<SelectItem key={destination.id} value={destination.id}>
													{destination.name ||
														`${destination.webhookUrl.substring(0, 40)}...`}
												</SelectItem>
											))
										)}
										{!isLoadingDestinations &&
											(!destinations || destinations.length === 0) && (
												<SelectItem value="no-dest-edit" disabled>
													No destinations found.
												</SelectItem>
											)}
									</SelectContent>
								</Select>
							)}
						/>
						{errors.destinationId && (
							<p className="text-red-600 text-sm">
								{errors.destinationId.message}
							</p>
						)}
					</CardContent>
				</Card>

				<div className="flex justify-end space-x-2 pt-4">
					<Link href="/templates" passHref>
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting || mutation.isPending}
						>
							Cancel
						</Button>
					</Link>
					<Button
						type="submit"
						disabled={isSubmitting || mutation.isPending || isLoadingTemplate}
					>
						{isSubmitting || mutation.isPending
							? "Updating..."
							: "Update Template"}
					</Button>
				</div>
			</form>
		</>
	);
}

export default EditTemplatePage;
