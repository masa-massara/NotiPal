"use client";

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
import { createDestination } from "@/services/destinationService";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDestinationApiSchema } from "@notipal/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = createDestinationApiSchema;
type FormData = z.infer<typeof formSchema>;

function NewDestinationPage() {
	const router = useRouter();
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		// reset, // reset was not used, removing
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			// Added default values
			name: "",
			webhookUrl: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: FormData) => createDestination(data), // Updated mutationFn
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Destination registered successfully.",
			});
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
			router.push("/destinations");
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description: error.message || "Failed to register destination.",
				variant: "destructive",
			});
		},
	});

	const onSubmit = async (data: FormData) => {
		mutation.mutate(data);
	};

	return (
		<>
			<PageHeader title="Register New Destination" />
			<div className="flex justify-center">
				<Card className="w-full max-w-lg">
					<CardHeader>
						<CardTitle>Destination Details</CardTitle>
						<CardDescription>
							Provide an optional name and the webhook URL for your destination.
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
									This is the URL that will receive notification data. Ensure
									it's correct. For services like Slack or Discord, find this in
									the channel/server settings under "Integrations" or
									"Webhooks".
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
										? "Registering..."
										: "Register"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export default NewDestinationPage; // HOC Removed
