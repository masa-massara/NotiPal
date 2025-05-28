"use client"; // Ensure it's a client component

// AppLayout is now applied by the group's layout.tsx
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
	deleteUserNotionIntegrationMutationAtom, // 正しいatomをインポート
	userNotionIntegrationsQueryAtom, // クエリ用のatomもインポート
} from "@/store/userNotionIntegrationAtoms";
import type { NotionIntegration } from "@/types/notionIntegration";
import { useAtom } from "jotai";
// useAtomValue は userNotionIntegrationsAtom を直接読む場合は不要になる可能性があります
// import { useAtomValue } from "jotai";
import { PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

// Skeleton loader for the table
const TableSkeleton = () => (
	<div className="space-y-2">
		<Skeleton className="w-full h-10" /> {/* Header */}
		{[...Array(3)].map((_, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
			<Skeleton key={i} className="w-full h-12" /> /* Rows */
		))}
	</div>
);

function NotionIntegrationsPage() {
	const { toast } = useToast();
	const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
	const [selectedIntegration, setSelectedIntegration] =
		React.useState<NotionIntegration | null>(null);

	const [queryResult, queryDispatch] = useAtom(userNotionIntegrationsQueryAtom);

	// ★★★ atomWithMutation の使い方を修正 ★★★
	const [deleteMutationResult, _setDeleteAtomConfig] = useAtom( // _setDeleteAtomConfig は通常使わない
		deleteUserNotionIntegrationMutationAtom,
	);
	// deleteMutationResult から必要な状態と関数を取り出す
	const {
		mutate: actualDeleteIntegration, // これがミューテーションを実行する関数
		isPending: isDeletePending,
		isSuccess: isDeleteSuccess,
		isError: isDeleteError,
		error: deleteErrorData, // error という名前の変数が queryResult にもあるのでリネーム
	} = deleteMutationResult;
	// ★★★ ここまで修正 ★★★

	const {
		data,
		isLoading,
		isError: isQueryError, // deleteMutationResult.isError と区別するためにリネーム
		error: queryErrorData, // deleteMutationResult.error と区別するためにリネーム
		refetch,
	} = queryResult;

	console.log("Fetched Notion Integrations Data:", data); // ログのメッセージを少し具体的に

	React.useEffect(() => {
		// ★★★ 状態の参照を修正 ★★★
		if (isDeleteSuccess) {
			toast({
				title: "成功",
				description: "Notion連携を削除しました。",
			});
			setShowDeleteDialog(false);
			setSelectedIntegration(null);
			// Query invalidation is handled by the atom's onSuccess in userNotionIntegrationAtoms.ts
		} else if (isDeleteError && deleteErrorData) {
			toast({
				title: "エラー",
				description:
					(deleteErrorData as Error).message || "Notion連携の削除に失敗しました。",
				variant: "destructive",
			});
			setShowDeleteDialog(false);
			setSelectedIntegration(null);
		}
	}, [isDeleteSuccess, isDeleteError, deleteErrorData, toast]);
	// ★★★ ここまで修正 ★★★

	const handleDeleteClick = (integration: NotionIntegration) => {
		setSelectedIntegration(integration);
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (selectedIntegration && actualDeleteIntegration) { // ★★★ actualDeleteIntegration を確認 ★★★
			// ★★★ ミューテーション実行関数の呼び出し方を修正 ★★★
			actualDeleteIntegration(selectedIntegration.id); // 引数は variables オブジェクトではなく、直接IDを渡す
		}
	};

	const handleRetry = () => {
		if (typeof refetch === "function") {
			refetch();
		} else {
			// queryDispatch({ type: "refetch" }); // queryDispatch が refetch アクションをサポートしているか確認が必要
			// 通常は useQuery の refetch 関数が使えるはず
			console.warn(
				"refetch function is not available directly, attempting dispatch.",
			);
			// Jotai-TanStack-Query v0.8.0 以降、atom の dispatch 関数で "refetch" は直接サポートされない可能性あり
			// queryClient.invalidateQueries を使うのが一般的
		}
	};

	if (isLoading) {
		return (
			<>
				<PageHeader
					title="Notion連携管理"
					actions={
						<Link href="/notion-integrations/new">
							<Button>
								<PlusCircle className="mr-2 w-4 h-4" />
								新しいNotion連携を登録
							</Button>
						</Link>
					}
				/>
				<TableSkeleton />
			</>
		);
	}

	if (isQueryError) { // ★★★ isError を isQueryError に変更 ★★★
		return (
			<>
				<PageHeader
					title="Notion連携管理"
					actions={
						<Link href="/notion-integrations/new">
							<Button>
								<PlusCircle className="mr-2 w-4 h-4" />
								新しいNotion連携を登録
							</Button>
						</Link>
					}
				/>
				<div className="py-10 text-center">
					<p className="mb-4 text-red-500">
						エラーが発生しました: {queryErrorData?.message || "不明なエラー"} {/* ★★★ error を queryErrorData に変更 ★★★ */}
					</p>
					<Button onClick={handleRetry}>
						<RefreshCw className="mr-2 w-4 h-4" />
						再試行
					</Button>
				</div>
			</>
		);
	}

	return (
		<>
			<PageHeader
				title="Notion連携管理"
				actions={
					<Link href="/notion-integrations/new">
						<Button>
							<PlusCircle className="mr-2 w-4 h-4" />
							新しいNotion連携を登録
						</Button>
					</Link>
				}
			/>
			{data && data.length > 0 ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>連携名</TableHead>
							<TableHead>登録日時</TableHead>
							<TableHead className="text-right">アクション</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((integration) => (
							<TableRow key={integration.id}>
								<TableCell>{integration.integrationName}</TableCell>
								<TableCell>
									{new Date(integration.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell className="text-right">
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDeleteClick(integration)}
										disabled={
											// ★★★ 状態の参照を修正 ★★★
											isDeletePending &&
											selectedIntegration?.id === integration.id
										}
									>
										<Trash2 className="mr-1 w-4 h-4" />
										{
											// ★★★ 状態の参照を修正 ★★★
											isDeletePending &&
											selectedIntegration?.id === integration.id
												? "削除中..."
												: "削除"
										}
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
							d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
						/>
					</svg>
					<h3 className="mt-2 font-medium text-gray-900 text-sm">
						まだNotion連携が登録されていません。
					</h3>
					<p className="mt-1 text-gray-500 text-sm">
						「新しいNotion連携を登録」ボタンから最初の連携を登録しましょう。
					</p>
					<div className="mt-6">
						<Link href="/notion-integrations/new">
							<Button>
								<PlusCircle className="mr-2 w-4 h-4" />
								新しいNotion連携を登録
							</Button>
						</Link>
					</div>
				</div>
			)}

			{selectedIntegration && (
				<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Notion連携の削除</AlertDialogTitle>
							<AlertDialogDescription>
								本当にこのNotion連携を削除しますか？この連携を使用しているテンプレートも機能しなくなります。
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setSelectedIntegration(null)}>
								キャンセル
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={confirmDelete}
								disabled={isDeletePending} // ★★★ 状態の参照を修正 ★★★
								className="bg-red-600 hover:bg-red-700"
							>
								{isDeletePending ? "削除中..." : "削除する"} {/* ★★★ 状態の参照を修正 ★★★ */}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	);
}

export default NotionIntegrationsPage;
