"use client";

import PageHeader from "@/components/layout/PageHeader";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useApiClient } from "@/hooks/useApiClient"; // getDestinations に渡すため
import { getDestinations } from "@/services/destinationService"; // これはuseApiClient経由なので修正不要
import { deleteTemplate, getTemplates } from "@/services/templateService";
import { getUserNotionIntegrations } from "@/services/userNotionIntegrationService"; // これはatom経由なので修正不要
import { idTokenAtom } from "@/store/globalAtoms"; // idToken取得のため
import type {
	Destination,
	UserNotionIntegration as NotionIntegration,
	Template,
} from "@notipal/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai"; // idToken取得のため
import Link from "next/link";
import React from "react";

function TemplatesDashboardPage() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = React.useState<
		string | null
	>(null);
	const currentIdToken = useAtomValue(idTokenAtom); // IDトークンを取得
	const apiClient = useApiClient(); // getDestinations と getUserNotionIntegrations (もし使うなら) のため

	const {
		data: templates,
		isLoading: isLoadingTemplates,
		error: errorTemplates,
	} = useQuery<Template[], Error>({
		queryKey: ["templates", currentIdToken], // queryKeyにidTokenを含めて再取得をトリガー
		queryFn: async () => {
			if (!currentIdToken) {
				throw new Error("ID token not available.");
			}
			return getTemplates(currentIdToken); // 修正されたサービス関数を呼ぶ
		},
		enabled: !!currentIdToken, // トークンがある場合のみ実行
	});

	// NotionIntegrations と Destinations はIDトークンに直接依存せず、
	// useQuery 内で api クライアントや Jotai atom 経由で取得しているので、
	// ここの queryFn の修正は不要か、または既に userNotionIntegrationAtoms 経由で取得している
	const { data: notionIntegrations } = useQuery<NotionIntegration[], Error>({
		queryKey: ["notionIntegrations", currentIdToken], // ここも念のため currentIdToken に依存させる
		queryFn: async () => {
			// getUserNotionIntegrations も idToken を取るように修正した場合
			if (!currentIdToken)
				throw new Error("ID token not available for Notion Integrations.");
			return getUserNotionIntegrations(currentIdToken);
		},
		enabled: !!currentIdToken,
		staleTime: Number.POSITIVE_INFINITY,
	});
	// または userNotionIntegrationAtoms.ts で定義された atom を useAtomValue で読む

	const { data: destinations } = useQuery<Destination[], Error>({
		queryKey: ["destinations"], // useApiClient を使うので idToken を key に含めなくても良い
		queryFn: () => getDestinations(apiClient), // useApiClient を使うので修正不要
		enabled: !!apiClient, // apiClient が利用可能な場合
		staleTime: Number.POSITIVE_INFINITY,
	});

	const notionIntegrationMap = React.useMemo(() => {
		if (!notionIntegrations) return new Map();
		return new Map(notionIntegrations.map((ni) => [ni.id, ni.integrationName]));
	}, [notionIntegrations]);

	const destinationMap = React.useMemo(() => {
		if (!destinations) return new Map();
		return new Map(
			destinations.map((d) => [
				d.id,
				d.name || `${d.webhookUrl.substring(0, 30)}...`,
			]),
		);
	}, [destinations]);

	const deleteMutation = useMutation({
		mutationFn: async (templateIdToDelete: string) => {
			// mutationFn も idToken を使うように
			if (!currentIdToken) {
				throw new Error("ID token not available for delete operation.");
			}
			return deleteTemplate(currentIdToken, templateIdToDelete);
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Notification template deleted successfully.",
			});
			queryClient.invalidateQueries({
				queryKey: ["templates", currentIdToken],
			});
			setShowDeleteDialog(false);
			setSelectedTemplateId(null);
		},
		onError: (err: Error) => {
			toast({
				title: "Error",
				description: err.message || "Failed to delete template.",
				variant: "destructive",
			});
			setShowDeleteDialog(false);
			setSelectedTemplateId(null);
		},
	});

	const handleDeleteClick = (templateId: string) => {
		setSelectedTemplateId(templateId);
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (selectedTemplateId) {
			deleteMutation.mutate(selectedTemplateId);
		}
	};

	// ...以降のJSX部分は変更なし...
	if (isLoadingTemplates) {
		return (
			<>
				<PageHeader title="Notification Templates" />
				<div className="flex justify-center items-center">
					<p>Loading templates...</p>
				</div>
			</>
		);
	}

	if (errorTemplates) {
		return (
			<>
				<PageHeader title="Notification Templates" />
				<div className="text-red-500">
					Error fetching templates: {errorTemplates.message}
				</div>
			</>
		);
	}

	return (
		<>
			<PageHeader
				title="Notification Templates"
				actions={
					<Link href="/templates/new">
						<Button>New Template</Button>
					</Link>
				}
			/>
			{templates && templates.length > 0 ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Template Name</TableHead>
							<TableHead>Notion Integration</TableHead>
							<TableHead>Target Notion DB ID</TableHead>
							<TableHead>Destination</TableHead>
							<TableHead>Last Updated</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{templates.map((template) => (
							<TableRow key={template.id}>
								<TableCell>{template.name}</TableCell>
								<TableCell>
									{notionIntegrationMap.get(template.userNotionIntegrationId) ||
										template.userNotionIntegrationId}
								</TableCell>
								<TableCell>{template.notionDatabaseId}</TableCell>
								<TableCell>
									{destinationMap.get(template.destinationId) ||
										template.destinationId}
								</TableCell>
								<TableCell>
									{template.updatedAt
										? new Date(template.updatedAt).toLocaleDateString()
										: "N/A"}
								</TableCell>
								<TableCell className="text-right space-x-2">
									<Link href={`/templates/${template.id}/edit`}>
										<Button variant="outline" size="sm">
											Edit
										</Button>
									</Link>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDeleteClick(template.id)}
										disabled={
											deleteMutation.isPending &&
											selectedTemplateId === template.id
										}
									>
										{deleteMutation.isPending &&
										selectedTemplateId === template.id
											? "Deleting..."
											: "Delete"}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="py-10 text-center">
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="mx-auto w-12 h-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="1"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h3 className="mt-2 font-medium text-gray-900 text-sm">
						No notification templates found.
					</h3>
					<p className="mt-1 text-gray-500 text-sm">
						Get started by creating a new template.
					</p>
					<div className="mt-6">
						<Link href="/templates/new">
							<Button>New Template</Button>
						</Link>
					</div>
				</div>
			)}

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							notification template.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedTemplateId(null)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							disabled={deleteMutation.isPending}
							className="bg-red-600 hover:bg-red-700"
						>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default TemplatesDashboardPage;
