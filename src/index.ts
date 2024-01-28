import { Elysia } from "elysia";
import { ollama, generateText } from "modelfusion";

const app = new Elysia().get("/", hello).listen(3000);

async function hello() {
	const text = await generateText({
		model: ollama
			.ChatTextGenerator({
				model: "mistral",
			})
			.withTextPrompt(),
		prompt: "What is the best programming language? \n\n",
	});

	return text;
}

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
