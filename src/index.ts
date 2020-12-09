import { Probot } from "probot";
const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const privateKey = require("../private-key.pem");

import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
const auth = createAppAuth({
	appId: 92086,
	privateKey,
	installationId: 123,
	clientId,
	clientSecret,
});

function getOctokit(authToken: string) {
	return new Octokit({
		auth: authToken,
	});
}

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

	let redirect = "http://localhost:3000/login/after";
	//@ts-ignore
	router.get("/login/start", async (req, res) => {
		res.redirect(
			301,
			`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
				redirect
			)}`
		);
	});
	//@ts-ignore
	router.get("/login/after", async (req, res) => {
		const { code } = req.query;
		try {
			const oauthAuthentication = await auth({ type: "oauth", code });
			const { token } = oauthAuthentication;
			let octokit = getOctokit(token);
			let repos = await octokit.apps.listInstallationsForAuthenticatedUser();
			res.json({ token, repos });
		} catch (error) {
			res.status(400).json({ error });
		}
	});
};
