import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";

import {
	findAccount,
	createAccount,
	deleteAccount,
	refreshToken,
} from "./controllers/AccountController";
import { login, logout } from "./controllers/AuthenticationController";
import {
	if_user_login,
	if_user_token_valid,
	if_user_exist,
} from "./middlewares/user.middleware";
import { generateChat, streamChat } from "./controllers/ChatController";

const app = new Elysia()
	.use(
		swagger({
			path: "/v2/api/doc",
		})
	)
	.use(
		jwt({
			name: "jwt",
			secret: Bun.env.JWT_SECRET!,
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
						})
						.post("/logout", logout, {
							body: t.Object({
								id: t.String(),
							}),
						})
			)
			.guard(
				{
					beforeHandle: if_user_exist,
				},
				(app) =>
					app
						.get("/get", findAccount, {
							query: t.Object({
								username: t.Optional(t.String()),
								id: t.Optional(t.String()),
							}),
						})
						.delete("/delete", deleteAccount, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								id: t.String(),
							}),
						})
						.post("token/refresh", refreshToken, {
							beforeHandle: if_user_token_valid,
							body: t.Object({
								id: t.String(),
								token: t.String(),
							}),
						})
			)
	)
	.guard(
		{
			beforeHandle: if_user_login,
		},
		(app) =>
			app.group("/chat", (app) =>
				app
					.get("/", generateChat, {
						query: t.Object({
							prompt: t.String(),
						}),
					})
					.ws("/stream", {
						message: streamChat,
					})
			)
	)
	.get("/", () => "Hello world")
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
