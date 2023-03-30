import * as dotenv from 'dotenv';
dotenv.config();
import { Configuration, OpenAIApi } from 'openai';
import { Configuracion } from './db';

export class Peticion {
  instancia: OpenAIApi;
  constructor(token?: string) {
    if (token) {
      const configuration = new Configuration({
        apiKey: token,
      });
      this.instancia = new OpenAIApi(configuration);
    } else {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_TOKEN,
      });
      this.instancia = new OpenAIApi(configuration);
    }
  }

  async completado(entrada: string, config: Configuracion) {
    const c = TIPOS[config.tipo];
    let resultado: string | undefined = undefined;
    if (c.modelo != 'gpt-3.5-turbo') {
      const complete = await this.instancia.createCompletion({
        model: c.modelo,
        prompt: `${entrada}`,
        max_tokens: c.maximo,
        temperature: c.temperatura,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
        stop: '',
      });
      resultado = complete.data.choices[0].text;
    } else {
      const { data } = await this.instancia.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `${entrada}` }],
        temperature: 0,
        top_p: 0.1,
        max_tokens: c.maximo,
      });
      resultado = data.choices[0].message?.content;
    }
    if (!resultado) {
      resultado =
        'No puedo responder a esto, perdona e intenta con otra cosa :c';
    }
    return resultado;
  }
}

interface Modelo {
  modelo: string;
  temperatura: number;
  maximo: number;
}

export const TIPOS: Record<string, Modelo> = {
  bajobajo: {
    modelo: 'text-ada-001',
    temperatura: 0,
    maximo: 100,
  },
  bajo: {
    modelo: 'text-curie-001',
    temperatura: 0.1,
    maximo: 120,
  },
  medio: {
    modelo: 'text-curie-001',
    temperatura: 0.75,
    maximo: 400,
  },
  alto: {
    modelo: 'text-davinci-003',
    temperatura: 0.78,
    maximo: 356,
  },
  altoalto: {
    modelo: 'gpt-3.5-turbo',
    temperatura: 0,
    maximo: 200,
  },
};
