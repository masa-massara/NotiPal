// Import the functions you need from the SDKs you need
import {
	type FirebaseOptions,
	getApp,
	getApps,
	initializeApp,
} from "firebase/app";
import { getAuth } from "firebase/auth";

let firebaseConfig: FirebaseOptions; // 型を FirebaseOptions に指定

const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV;

if (nodeEnv === "production") {
	console.log(
		"Initializing Firebase Client SDK for PRODUCTION (NotiPal Frontend)",
	);
	firebaseConfig = {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PROD,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD,
		messagingSenderId:
			process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_PROD,
		measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD, // Optional
	};
} else {
	console.log(
		"Initializing Firebase Client SDK for DEVELOPMENT (NotiPal Frontend)",
	);
	firebaseConfig = {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_DEV,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_DEV,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_DEV,
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEV,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_DEV,
		measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_DEV, // Optional
	};
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
	console.error(
		"Firebase config is missing or incomplete for NotiPal Frontend. " +
			"Ensure NEXT_PUBLIC_FIREBASE_API_KEY_DEV/PROD and NEXT_PUBLIC_FIREBASE_PROJECT_ID_DEV/PROD " +
			"are set correctly in your .env.local (for dev) or hosting environment (for prod).",
	);
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
