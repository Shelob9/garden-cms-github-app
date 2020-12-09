import { Probot } from "probot";

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
};
