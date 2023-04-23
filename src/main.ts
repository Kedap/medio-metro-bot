import { Bot } from 'grammy';
import * as dotenv from 'dotenv';
dotenv.config();
import { Configuracion, Respuesta, Usuarios } from './db';
import { Peticion } from './openai';
import { EJEMPLOS } from './ejemplos';

// Configuracion de los tokens
let botToken = process.env.BOT_TOKEN;
if (!botToken) {
  botToken = '';
}
const bot = new Bot(botToken);
const db = new Usuarios();
const ahora = new Date();
let memorizar = false;
let contexto =
  'La siguiente es una conversación con un asistente de IA. El asistente es útil, creativo, inteligente y muy amable.\nHumano: ';

bot.command('start', (ctx) => {
  ctx.reply('EEeeee medioMetroooo');
  let nombre = ctx.from?.first_name;
  if (!nombre) {
    nombre = '';
  }
  const configuracion: Configuracion = {
    id: ctx.chat.id,
    nombre: nombre,
    tipo: 'medio',
  };
  db.agregar_conf(configuracion);
});

bot.command('config', async (ctx) => {
  let nuevaConfig = ctx.message?.text.split(' ')[1];
  let config = await db.obtener_conf(ctx.chat.id);
  let nombre = ctx.from?.first_name;
  if (!nuevaConfig) {
    nuevaConfig = 'medio';
  }
  if (!nombre) {
    nombre = '';
  }
  config = {
    id: ctx.chat.id,
    nombre: nombre,
    tipo: nuevaConfig,
  };
  db.agregar_conf(config);
  ctx.reply('Simon se puso en ' + nuevaConfig);
});

bot.command('ejemplo', (ctx) => {
  let nombre = ctx.message?.text.split(' ')[1];
  if (!nombre || nombre === '') {
    nombre = 'ayuda';
  }
  ctx.reply(EJEMPLOS[nombre.toLowerCase()]);
});

bot.command('memorizar', (ctx) => {
  let cmd = ctx.message?.text.split(' ')[1];
  if (!cmd || cmd === '' || cmd != 'activar') {
    memorizar = false;
    contexto =
      'La siguiente es una conversación con un asistente de IA. El asistente es útil, creativo, inteligente y muy amable.\nHumano: ';
  } else {
    memorizar = true;
  }
  ctx.reply(
    memorizar ? 'Esta activado la memorizacion' : 'Se desactivo la memorizacion'
  );
});

bot.on('message:text', async (ctx) => {
  if (memorizar) {
    contexto += ctx.update.message.text + '\nAI: ';
  }
  const hora: string =
    ahora.getDay() +
    '/' +
    ahora.getDate().toString() +
    '/' +
    ahora.getMonth() +
    '/' +
    ahora.getFullYear().toString() +
    ':' +
    ahora.getHours().toString() +
    ':' +
    ahora.getMinutes().toString() +
    ':' +
    ahora.getSeconds().toString();

  const autor = ctx.update.message.from;
  const peticion = new Peticion();
  const config = await db.obtener_conf(autor.id);
  let response = '';
  if (memorizar) {
    response = await peticion.completado(contexto, config);
  } else {
    response = await peticion.completado(ctx.update.message.text, config);
  }
  const respuesta: Respuesta = {
    id: autor.id,
    nombre: autor.first_name,
    hora: hora,
    respuesta: response,
    entrada: ctx.update.message.text,
  };
  ctx.reply(response);
  db.agregar_resp(respuesta);
  if (memorizar) {
    contexto += response + '\nHumano: ';
  }
});

console.log('El bot comenzara a ejecutarse 😸');
bot.start();
