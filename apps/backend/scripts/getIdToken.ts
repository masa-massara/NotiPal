import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import readline from "node:readline/promises";

// --- Firebase設定を環境変数から読み込む ---
let firebaseConfig: FirebaseOptions;
const nodeEnv = process.env.NODE_ENV || "development"; // デフォルトは開発環境

if (nodeEnv === "production") {
	console.log("getIdToken.ts: Initializing Firebase for PRODUCTION.");
	firebaseConfig = {
		apiKey: process.env.FIREBASE_API_KEY_PROD,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN_PROD,
		projectId: process.env.FIREBASE_PROJECT_ID_PROD,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET_PROD,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID_PROD,
		appId: process.env.FIREBASE_APP_ID_PROD,
		measurementId: process.env.FIREBASE_MEASUREMENT_ID_PROD, // Optional
	};
} else {
	console.log("getIdToken.ts: Initializing Firebase for DEVELOPMENT.");
	firebaseConfig = {
		apiKey: process.env.FIREBASE_API_KEY_DEV,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN_DEV,
		projectId: process.env.FIREBASE_PROJECT_ID_DEV,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET_DEV,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID_DEV,
		appId: process.env.FIREBASE_APP_ID_DEV,
		measurementId: process.env.FIREBASE_MEASUREMENT_ID_DEV, // Optional
	};
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
	console.error(
		`Error: Firebase configuration is missing for NODE_ENV='${nodeEnv}'.
Please ensure the following environment variables are set:
For development: FIREBASE_API_KEY_DEV, FIREBASE_PROJECT_ID_DEV, etc.
For production: FIREBASE_API_KEY_PROD, FIREBASE_PROJECT_ID_PROD, etc.`,
	);
	process.exit(1);
}

const emailFromEnv = process.env.TEST_USER_EMAIL;
const passwordFromEnv = process.env.TEST_USER_PASSWORD;

async function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const email =
		emailFromEnv || (await rl.question("Enter your test user email: "));
	const password =
		passwordFromEnv || (await rl.question("Enter your test user password: "));

	rl.close();

	if (!email || !password) {
		console.error("Email and password are required.");
		process.exit(1);
	}

	try {
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);

		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;

		if (user) {
			const idToken = await user.getIdToken(/* forceRefresh */ true);
			process.stdout.write(idToken); // IDトークンだけを標準出力に書き出す
		} else {
			console.error("Failed to get user object after sign in.");
			process.exit(1);
		}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		let errorMessage = `Authentication failed for user ${email}: `;
		if (error.message) errorMessage += error.message;
		if (error.code) errorMessage += ` (Code: ${error.code})`;
		console.error(errorMessage);
		// Firebaseの具体的なエラーコードに基づいて、より分かりやすいメッセージを出すことも可能
		if (
			error.code === "auth/invalid-credential" ||
			error.code === "auth/user-not-found" ||
			error.code === "auth/wrong-password"
		) {
			console.error(
				"Please double-check your email and password, and ensure the user exists in the target Firebase project.",
			);
		}
		if (
			error.code === "auth/project-not-found" ||
			(error.code === "auth/internal-error" &&
				error.message.includes("PROJECT_NOT_FOUND"))
		) {
			console.error(
				`Ensure the Firebase project ID "${firebaseConfig.projectId}" used for environment "${nodeEnv}" is correct and the project exists.`,
			);
		}
		process.exit(1);
	}
}

main().catch((err) => {});
