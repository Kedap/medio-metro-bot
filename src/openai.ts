import { config } from "dotenv";
import { OpenAI } from "openai";
import { Configuracion } from "./db.ts";

export class Peticion {
  instancia: OpenAI;
  constructor(token?: string) {
    if (token) {
      this.instancia = new OpenAI(token);
    } else {
      this.instancia = new OpenAI(config().OPENAI_TOKEN);
    }
  }

  async completado(entrada: string, config: Configuracion) {
    const c = TIPOS[config.tipo];
    const complete = await this.instancia.createCompletion({
      model: c.modelo,
      prompt: `${entrada}`,
      max_tokens: c.maximo,
      temperature: c.temperatura,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: "",
    });
    return complete.choices[0].text;
  }
}

interface Modelo {
  modelo: string;
  temperatura: number;
  maximo: number;
}

export const TIPOS: Record<string, Modelo> = {
  bajobajo: {
    modelo: "text-ada-001",
    temperatura: 0,
    maximo: 100,
  },
  bajo: {
    modelo: "text-curie-001",
    temperatura: 0.1,
    maximo: 120,
  },
  medio: {
    modelo: "text-curie-001",
    temperatura: 0.75,
    maximo: 400,
  },
  alto: {
    modelo: "text-davinci-003",
    temperatura: 0.7,
    maximo: 175,
  },
  altoalto: {
    modelo: "gpt-3.5-turbo",
    temperatura: 0.78,
    maximo: 356,
  },
};
