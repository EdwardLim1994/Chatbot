import Ollama from "../services/Ollama";
import { buildFailedResult, buildSuccessResult } from "../libs/helpers";

export const generateChat = async (ctx: any) => {
	return Ollama.generateChat(ctx.query.prompt)
		.then((res) =>
			buildSuccessResult({ prompt: ctx.query.prompt, reply: res })
		)
		.catch((err) => buildFailedResult(err));
};

export const streamChat = async (ctx: any) => {};
