import Ollama from "../services/Ollama";
import { buildFailedResult, buildSuccessResult } from "../libs/helpers";

export const generateChat = async (ctx: any) => {
	return Ollama.generateChat({
		prompt: ctx.query.prompt,
		contextId: ctx.query?.context_id,
		token: ctx.headers["x-auth-header"],
	})
		.then((res) =>
			buildSuccessResult({
				prompt: ctx.query.prompt,
				reply: res,
			})
		)
		.catch((err) => buildFailedResult(err));
};
