import { ollama, generateText } from "modelfusion";

class Ollama {
	private static LLM = ollama;
	private static MODEL = "mistral";

	public static async generateChat(prompt: string) {
		return await generateText({
			model: this.LLM.ChatTextGenerator({
				model: this.MODEL,
			}).withTextPrompt(),
			prompt,
		});
	}

	public static async generateChatByImage(prompt: string, img: File) {}
}

export default Ollama;
