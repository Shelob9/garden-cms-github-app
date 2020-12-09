import { Probot } from "probot";
const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const privateKey = require("../private-key.pem");

import { createAppAuth } from "@octokit/auth-app";
const auth = createAppAuth({
	appId: 92086,
	privateKey,
	installationId: 123,
	clientId,
	clientSecret,
});
//@ts-ignore
export = ({ app, getRouter }: { app: Probot }) => {
	app.on("issues.opened", async (context) => {
		const issueComment = context.issue({
			body: "Hi Roy.",
		});
		await context.octokit.issues.createComment(issueComment);
	});
	// Get an express router to expose new HTTP endpoints
	const router = getRouter("/api");

	// Use any middleware
	router.use(require("express").static("public"));

	// Add a new route
	//@ts-ignore
	router.get("/hi", (req, res) => {
		res.send("Roy");
	});
	//@ts-ignore

	router.get("/login", async (req, res) => {
		const oauthAuthentication = await auth({ type: "oauth", code: "123456" });
		console.log(oauthAuthentication);
		res.send("aa");
	});
};
