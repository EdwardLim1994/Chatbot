import { ollama, generateText } from "modelfusion";
import { GenerateChatType } from "../libs/types";
import { OLLAMA_SETTING } from "../libs/enum";
import Account from "./Account";
import Context from "./Context";
import { isEmpty } from "lodash";

class Ollama {
	private static LLM = ollama;
	private static MODEL = OLLAMA_SETTING.Model;
	private static account: Account = new Account();
	private static context: Context = new Context();

	public static async generateChat(payload: GenerateChatType) {
		const user = await this.account.findSingleAccount({
			token: payload.token,
			selectFields: {
				selectedContext: true,
			},
		});

		let system: string | undefined = OLLAMA_SETTING.Default_System;

		if (!isEmpty(user?.selectedContext!)) {
			const context = await this.context.findContext({
				id: user?.selectedContext ?? undefined,
			});

			system = context[0]?.context;
		}

		return await generateText({
			model: this.LLM.ChatTextGenerator({
				model: this.MODEL,
			}).withInstructionPrompt(),
			prompt: {
				system,
				instruction: payload.prompt,
			},
		});
	}
}

export default Ollama;
