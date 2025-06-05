"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { updateDestinationApiSchema } from "@notipal/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

// AppLayout is now applied by the group's layout.tsx
import PageHeader from "@/components/layout/PageHeader";
// import withAuth from "@/components/auth/withAuth"; // HOC Removed
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
import { useToast } from "@/hooks/use-toast";
import { useApiClient } from "@/hooks/useApiClient"; // Added import
import {
	getDestination,
	updateDestination,
} from "@/services/destinationService";
import type { Destination } from "@notipal/common";

const formSchema = updateDestinationApiSchema;
type FormData = z.infer<typeof formSchema>;

function EditDestinationPage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const api = useApiClient(); // Instantiate useApiClient

	const {
		data: destination,
		isLoading: isLoadingDestination,
		error: fetchError,
	} = useQuery<Destination, Error>({
		queryKey: ["destination", id],
		queryFn: () => getDestination(api, id as string), // Updated queryFn
		enabled: !!api && !!id, // Updated enabled flag
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			webhookUrl: "",
		},
	});

	useEffect(() => {
		if (destination) {
			reset({
				name: destination.name || "",
				webhookUrl: destination.webhookUrl ?? "",
			});
		}
	}, [destination, reset]);

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			updateDestination(api, id as string, {
				...formData,
				webhookUrl: formData.webhookUrl ?? "",
			}),
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Destination updated successfully.",
			});
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
			queryClient.invalidateQueries({ queryKey: ["destination", id] });
			router.push("/destinations");
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: error.message || "Failed to update destination.",
				variant: "destructive",
			});
		},
	});

	const onSubmit = async (data: FormData) => {
		mutation.mutate(data);
	};

	if (isLoadingDestination) {
		return (
			<>
				<PageHeader title="Edit Destination" />
				<div className="flex justify-center items-center">
					<p>Loading destination details...</p>
				</div>
			</>
		);
	}

	if (fetchError) {
		return (
			<>
				<PageHeader title="Edit Destination" />
				<div className="text-red-500">
					Error fetching destination: {fetchError.message}
				</div>
			</>
		);
	}

	if (!destination) {
		// Handle case where destination is not found after loading
		return (
			<>
				<PageHeader title="Edit Destination" />
				<div className="text-center">
					<p>Destination not found.</p>
					<Button variant="link" onClick={() => router.push("/destinations")}>
						Back to Destinations
					</Button>
				</div>
			</>
		);
	}

	return (
		<>
			<PageHeader
				title={`Edit Destination: ${destination?.name || "Details"}`}
			/>
			<div className="flex justify-center">
				<Card className="w-full max-w-lg">
					<CardHeader>
						<CardTitle>Update Destination Details</CardTitle>
						<CardDescription>
							Modify the name or webhook URL for your destination.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Destination Name (Optional)</Label>
								<Input
									id="name"
									placeholder="e.g., My Slack Channel"
									{...register("name")}
								/>
								{typeof errors.name?.message === "string" && (
									<p className="text-red-600 text-sm">{errors.name.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="webhookUrl">Webhook URL</Label>
								<Input
									id="webhookUrl"
									placeholder="https://hooks.example.com/..."
									{...register("webhookUrl")}
								/>
								{typeof errors.webhookUrl?.message === "string" && (
									<p className="text-red-600 text-sm">
										{errors.webhookUrl.message}
									</p>
								)}
								<p className="text-muted-foreground text-xs">
									Ensure this URL is correct. Changes will affect where
									notifications are sent.
								</p>
							</div>
							<div className="flex justify-end space-x-2 pt-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.push("/destinations")}
									disabled={isSubmitting || mutation.isPending}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting || mutation.isPending}
								>
									{isSubmitting || mutation.isPending
										? "Saving..."
										: "Save Changes"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export default EditDestinationPage; // HOC Removed
