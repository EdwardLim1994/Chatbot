import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { html } from "@elysiajs/html";
import jwt from "@elysiajs/jwt";

import {
	findAccount,
	createAccount,
	deleteAccount,
	updateAccount,
	refreshToken,
} from "./controllers/AccountController";
import { login, logout } from "./controllers/AuthenticationController";
import {
	if_user_login,
	if_user_token_valid,
	if_user_exist,
} from "./middlewares/user.middleware";
import { generateChat } from "./controllers/ChatController";
import {
	createContext,
	deleteContext,
	deselectContext,
	findContexts,
	selectContext,
	updateContext,
} from "./controllers/ContextController";

const app = new Elysia()
	.use(html())
	.use(
		swagger({
			documentation: {
				tags: [
					{
						name: "User",
						description:
							"Manage user API including create, update, delete and find many or single user. Except create-user API, the rest will need an JWT token in order to access",
					},
					{
						name: "Auth",
						description:
							"Manage user authentication by verifying password. Once verified password, a JWT token will be saved into database and return to client. Logout is to simply remove the current JWT token in database.",
					},
					{
						name: "Chat",
						description:
							"This is the main entrypoint to communicate with Ollama, which delivering a prompt and it will return its reply. It is possible to use custom context to modify the chatbot behavior",
					},
					{
						name: "Chat Context",
						description:
							"Manage chat context for modifying the chatbot behavior. User may create multiple contexts, and only use one context at a time. These API require JWT token to access",
					},
				],
				info: {
					title: "Chatbot REST API Server",
					description:
						"This chatbot is powered by ElysiaJS, a Bun based Express-like library to build backend service. The chat feature is powered by Ollama via ModelFusion library. It utilises REST API for the communication, and require to create a user to retrieve JWT token for using the service",
					version: "1.0.0",
				},
			},
		})
	)
	.use(
		jwt({
			name: "jwt",
			secret: Bun.env.JWT_SECRET!,
			exp: "7d",
		})
	)
	.group("/user", (app) =>
		app
			.post("/create", createAccount, {
				body: t.Object({
					name: t.String(),
					keyword: t.String(),
					password: t.String(),
				}),
				detail: {
					tags: ["User"],
				},
			})
			.guard(
				{
					beforeHandle: if_user_exist,
				},
				(app) =>
					app
						.post("/login", login, {
							body: t.Object({
								username: t.String(),
								password: t.String(),
							}),
							detail: {
								tags: ["Auth"],
							},
						})
						.post("/logout", logout, {
							body: t.Object({
								id: t.String(),
							}),
							detail: {
								tags: ["Auth"],
							},
						})
						.get("/get", findAccount, {
							query: t.Object({
								username: t.Optional(t.String()),
								id: t.Optional(t.String()),
							}),
							detail: {
								tags: ["User"],
							},
						})
						.patch("/update", updateAccount, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								id: t.String(),
								data: t.Object({
									username: t.Optional(t.String()),
									password: t.Optional(t.String()),
									keyword: t.Optional(t.String()),
								}),
							}),
							detail: {
								tags: ["User"],
							},
						})
						.delete("/delete", deleteAccount, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								id: t.String(),
							}),
							detail: {
								tags: ["User"],
							},
						})
						.post("token/refresh", refreshToken, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								id: t.String(),
								token: t.String(),
							}),
							detail: {
								tags: ["Auth"],
							},
						})
			)
	)
	.guard(
		{
			beforeHandle: if_user_login,
		},
		(app) =>
			app
				.group("/chat", (app) =>
					app.get("/", generateChat, {
						beforeHandle: if_user_token_valid,
						query: t.Object({
							contextId: t.Optional(t.String()),
							prompt: t.String(),
						}),
						detail: {
							tags: ["Chat Generation"],
						},
					})
				)
				.group("/context", (app) =>
					app
						.get("/get", findContexts, {
							beforeHandle: if_user_token_valid,
							detail: { tags: ["Chat Context"] },
						})
						.post("/create", createContext, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								name: t.String(),
								context: t.String(),
								user_id: t.String(),
							}),
							detail: { tags: ["Chat Context"] },
						})
						.patch("/update", updateContext, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								id: t.String(),
								data: t.Object({
									name: t.Optional(t.String()),
									context: t.Optional(t.String()),
								}),
							}),
							detail: { tags: ["Chat Context"] },
						})
						.delete("/delete", deleteContext, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								id: t.String(),
							}),
							detail: { tags: ["Chat Context"] },
						})
						.post("/select", selectContext, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								user_id: t.String(),
								context_id: t.String(),
							}),
							detail: { tags: ["Chat Context"] },
						})
						.post("/deselect", deselectContext, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								user_id: t.String(),
							}),
							detail: { tags: ["Chat Context"] },
						})
				)
	)
	.get("/", () => (
		<>
			<h1>Chatbot REST API Server</h1>
			<br />
			<p>
				Welcome to Chatbot, powered by Ollama and built using ElysiaJS,
				a Bun based backend server that delivers extra-ordinary
				performance and even faster than Expressjs. Open{" "}
				<a href='/swagger'>this link</a> to refer the API.
			</p>
		</>
	))
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
