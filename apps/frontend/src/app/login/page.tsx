"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailPassword } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react"; // Added
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Added
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
	password: z.string().min(1, { message: "Password is required." }), // Min 1 for login, can be more specific
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [showPassword, setShowPassword] = useState(false); // Added
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: FormData) => {
		try {
			await signInWithEmailPassword(data.email, data.password);
			toast({
				title: "Login Successful",
				description: "You have been successfully logged in.",
			});
			router.push("/"); // Redirect to dashboard (home for now)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error(error);
			toast({
				title: "Login Failed",
				description: error.message || "An unexpected error occurred.",
				variant: "destructive",
			});
		}
	};

	return (
		<AppLayout>
			<div className="flex justify-center items-center min-h-screen">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>
							Enter your email and password to access your account.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-red-600 text-sm">{errors.email.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative flex items-center">
									{" "}
									{/* Added wrapper */}
									<Input
										id="password"
										type={showPassword ? "text" : "password"} // Updated type
										{...register("password")}
										className="pr-10" // Added padding for icon
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="right-0 absolute px-3" // Positioned button
										onClick={() => setShowPassword(!showPassword)}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</Button>
								</div>
								{errors.password && (
									<p className="text-red-600 text-sm">
										{errors.password.message}
									</p>
								)}
							</div>
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Logging In..." : "Login"}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex flex-col items-start space-y-2 text-sm">
						<div>
							Don't have an account?&nbsp;
							<Link href="/signup" className="underline">
								Sign Up
							</Link>
						</div>
						<div>
							<Link href="/reset-password" className="underline">
								Forgot Password?
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</AppLayout>
	);
}
