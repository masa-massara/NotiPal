import { app } from "./app";

export default {
	port: process.env.PORT || 8080,
	fetch: app.fetch,
};
