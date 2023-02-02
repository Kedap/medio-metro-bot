import { config } from "dotenv";
import { OpenAI } from "openai";

export class Peticion {
  instancia: OpenAI;
  constructor(token?: string) {
    if (token) {
      this.instancia = new OpenAI(token);
    } else {
      this.instancia = new OpenAI(config().OPENAI_TOKEN);
    }
  }

  async completado(entrada: string) {
    const complete = await this.instancia.createCompletion({
      model: "text-curie-001",
      prompt: `${entrada}`,
      max_tokens: 100,
      temperature: 0.1,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: "",
    });
    return complete.choices[0].text;
  }
}
