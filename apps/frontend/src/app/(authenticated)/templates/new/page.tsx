"use client";

import PageHeader from "@/components/layout/PageHeader";
import ConditionValueInput from "@/components/template/ConditionValueInput"; // ★ 作成したコンポーネントをインポート
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
import { useApiClient } from "@/hooks/useApiClient";
import { getDestinations } from "@/services/destinationService";
import {
	getNotionDatabaseProperties,
	getNotionDatabases,
} from "@/services/notionService";
import { createTemplate } from "@/services/templateService";
import { getUserNotionIntegrations } from "@/services/userNotionIntegrationService";
import { idTokenAtom } from "@/store/globalAtoms";
import type { Destination } from "@/types/destination";
import type {
	NotionDatabase,
	NotionIntegration,
	NotionProperty,
} from "@/types/notionIntegration";
import type { CreateTemplateData } from "@/types/template";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(1, { message: "Template name is required." }),
	userNotionIntegrationId: z
		.string()
		.min(1, { message: "Notion integration is required." }),
	notionDatabaseId: z
		.string()
		.min(1, { message: "Notion Database ID is required." }),
	conditions: z
		.array(
			z.object({
				propertyId: z.string().min(1, "Property selection is required."),
				operator: z.string().min(1, "Operator selection is required."),
				value: z.string().optional(), // 値はオプション、型によって必須チェックを分けるか、常に文字列として扱う
			}),
		)
		.optional(),
	body: z.string().min(1, { message: "Message body is required." }),
	destinationId: z.string().min(1, { message: "Destination is required." }),
});

type FormData = z.infer<typeof formSchema>;

function NewTemplatePage() {
	const router = useRouter();
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const api = useApiClient();
	const currentIdToken = useAtomValue(idTokenAtom);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		setValue,
		// getValues, // 必要に応じて使用
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			userNotionIntegrationId: "",
			notionDatabaseId: "",
			conditions: [],
			body: "",
			destinationId: "",
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "conditions",
	});

	const watchedConditions = watch("conditions");
	const selectedNotionIntegrationId = watch("userNotionIntegrationId");
	const selectedNotionDatabaseId = watch("notionDatabaseId");

	const { data: notionIntegrations, isLoading: isLoadingNotion } = useQuery<
		NotionIntegration[],
		Error
	>({
		queryKey: ["notionIntegrations", currentIdToken],
		queryFn: async () => {
			if (!currentIdToken)
				throw new Error("ID token not available for Notion Integrations.");
			return getUserNotionIntegrations(currentIdToken);
		},
		enabled: !!currentIdToken,
	});

	const { data: destinations, isLoading: isLoadingDestinations } = useQuery<
		Destination[],
		Error
	>({
		queryKey: ["destinations"],
		queryFn: () => getDestinations(api),
		enabled: !!api,
	});

	const {
		data: notionDatabases,
		isLoading: isLoadingNotionDatabases,
		error: errorNotionDatabases,
	} = useQuery<NotionDatabase[], Error>({
		queryKey: ["notionDatabases", selectedNotionIntegrationId],
		queryFn: () => {
			if (!selectedNotionIntegrationId) {
				return Promise.resolve([]);
			}
			return getNotionDatabases(api, selectedNotionIntegrationId);
		},
		enabled: !!api && !!selectedNotionIntegrationId,
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
		queryFn: () => {
			if (!selectedNotionIntegrationId || !selectedNotionDatabaseId) {
				return Promise.resolve([]);
			}
			return getNotionDatabaseProperties(
				api,
				selectedNotionIntegrationId,
				selectedNotionDatabaseId,
			);
		},
		enabled:
			!!api && !!selectedNotionIntegrationId && !!selectedNotionDatabaseId,
	});

	const handlePropertyChange = useCallback(
		(conditionIndex: number) => {
			setValue(`conditions.${conditionIndex}.value`, "", {
				shouldValidate: true,
			});
		},
		[setValue],
	);

	useEffect(() => {
		if (selectedNotionIntegrationId) {
			setValue("notionDatabaseId", "", { shouldValidate: true });
			setValue("conditions", [], { shouldValidate: false });
		}
	}, [selectedNotionIntegrationId, setValue]);

	useEffect(() => {
		if (selectedNotionDatabaseId) {
			setValue("conditions", [], { shouldValidate: false });
		}
	}, [selectedNotionDatabaseId, setValue]);

	const mutation = useMutation({
		mutationFn: (formData: FormData) => {
			if (!currentIdToken) {
				throw new Error("ID token not available for creating template.");
			}
			const templateData: CreateTemplateData = {
				...formData,
				conditions:
					formData.conditions?.map((c) => ({ ...c, value: c.value ?? "" })) ||
					[],
			};
			return createTemplate(currentIdToken, templateData);
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Notification template created successfully.",
			});
			queryClient.invalidateQueries({
				queryKey: ["templates", currentIdToken],
			});
			router.push("/templates");
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: error.message || "Failed to create template.",
				variant: "destructive",
			});
		},
	});

	const onSubmit = async (data: FormData) => {
		mutation.mutate(data);
	};

	return (
		<>
			<PageHeader title="Create New Notification Template" />
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>1. Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Template Name</Label>
							<Input
								id="name"
								placeholder="e.g., New Task Assigned Notification"
								{...register("name")}
							/>
							{errors.name && (
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
												<SelectItem value="loading" disabled>
													Loading...
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
											setValue("conditions", []);
										}}
										value={field.value}
										disabled={
											!selectedNotionIntegrationId ||
											isLoadingNotionDatabases ||
											mutation.isPending
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
											{isLoadingNotionDatabases ? (
												<SelectItem value="loading-db" disabled>
													Loading databases...
												</SelectItem>
											) : errorNotionDatabases ? (
												<SelectItem value="error-db" disabled>
													Error fetching databases:{" "}
													{errorNotionDatabases.message}
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
									could not be loaded. Ensure the integration has access to the
									database.
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
															!selectedNotionDatabaseId
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
																	<SelectItem value="no-props" disabled>
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
														disabled={mutation.isPending || !selectedPropertyId}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select operator" />
														</SelectTrigger>
														<SelectContent>
															{/* TODO: Dynamically filter operators based on property type */}
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
													["is_empty", "is_not_empty"].includes(
														watchedConditions?.[index]?.operator ?? "",
													)
												}
											/>
											{errors.conditions?.[index]?.value && (
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
										disabled={mutation.isPending}
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
								mutation.isPending
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
							placeholder="Type your notification message here... e.g., Page '{PageTitle}' changed status to {Status}."
							rows={5}
							{...register("body")}
						/>
						{errors.body && (
							<p className="text-red-600 text-sm">{errors.body.message}</p>
						)}
						<p className="text-muted-foreground text-xs">
							Use placeholders like{" "}
							<code className="bg-muted px-1 py-0.5 rounded">
								{"{PropertyName}"}
							</code>{" "}
							(e.g.,{" "}
							<code className="bg-muted px-1 py-0.5 rounded">
								{"{Task Name}"}
							</code>
							) for Notion page properties, and{" "}
							<code className="bg-muted px-1 py-0.5 rounded">
								{"{_pageUrl}"}
							</code>{" "}
							for the page URL. Placeholders are case-sensitive and should match
							your Notion property names exactly.
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
									defaultValue={field.value}
									disabled={isLoadingDestinations || mutation.isPending}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a Destination Channel" />
									</SelectTrigger>
									<SelectContent>
										{isLoadingDestinations ? (
											<SelectItem value="loading-dest" disabled>
												Loading destinations...
											</SelectItem>
										) : (
											destinations?.map((destination) => (
												<SelectItem key={destination.id} value={destination.id}>
													{destination.name ||
														// biome-ignore lint/style/useTemplate: <explanation>
														destination.webhookUrl.substring(0, 40) + "..."}
												</SelectItem>
											))
										)}
										{!isLoadingDestinations &&
											(!destinations || destinations.length === 0) && (
												<SelectItem value="no-dest" disabled>
													No destinations found. Please register one first.
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
					<Button type="submit" disabled={isSubmitting || mutation.isPending}>
						{isSubmitting || mutation.isPending
							? "Creating..."
							: "Create Template"}
					</Button>
				</div>
			</form>
		</>
	);
}

export default NewTemplatePage;
