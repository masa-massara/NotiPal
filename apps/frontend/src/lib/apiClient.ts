let BASE_URL: string;
const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV;

if (nodeEnv === "production") {
	BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_PROD || "";
	if (!BASE_URL) {
	}
} else {
	BASE_URL =
		process.env.NEXT_PUBLIC_API_BASE_URL_DEV || "http://localhost:8080/api/v1";
	console.log(
		"API Client (NotiPal Frontend) using DEVELOPMENT base URL:",
		BASE_URL,
	);
}

export interface FetchOptions extends RequestInit {
	// Export FetchOptions
	// You can add custom options here if needed
}

export const fetchApiClient = async (
	url: string,
	idToken: string | null, // Added idToken argument
	options: FetchOptions = {},
): Promise<Response> => {
	// Removed: const idToken = store.get(idTokenAtom);

	const headers = new Headers(options.headers);

	if (idToken) {
		headers.append("Authorization", `Bearer ${idToken}`);
	}

	const fullUrl = `${BASE_URL}${url}`;

	try {
		const response = await fetch(fullUrl, {
			...options,
			headers,
		});

		if (!response.ok) {
			// Handle HTTP errors (e.g., 4xx, 5xx)
			const errorData = await response.json().catch(() => ({})); // Try to parse error response
			console.error("API Error:", response.status, errorData);
			throw new Error(`API request failed with status ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error("Fetch API Client Error:", error);
		throw error; // Re-throw the error to be caught by TanStack Query
	}
};

// Example usage (optional, for testing purposes):
// fetchApiClient("/users", { method: "GET" })
//   .then(response => response.json())
//   .then(data => console.log("Fetched data:", data))
//   .catch(error => console.error("Error fetching data:", error));
