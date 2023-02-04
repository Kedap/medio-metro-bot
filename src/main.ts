import { Bot } from 'grammy/mod.ts';
import { config } from 'dotenv';
import { Configuracion, Respuesta, Usuarios } from './db.ts';
import { Peticion } from './openai.ts';

// Configuracion de los tokens
const bot = new Bot(config().BOT_TOKEN);
const db = new Usuarios();
const ahora = new Date();

bot.command('start', (ctx) => {
  ctx.reply('Hola mundo!');
  ctx.reply(
    'Si quieres votar por el nombre del bot puedes hacer como se muestra a continuacion: /votar nombre\n Por ejemplo: /votar mediometro /votar joaquin'
  );
  ctx.reply('Solo debe de ser 2 plabras contando el comando votar y el nombre');
  ctx.reply('/votar juancarlo');
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

bot.command('config', (ctx) => {
  let nuevaConfig = ctx.message?.text.split(' ')[1];
  let config = db.obtener_conf(ctx.chat.id);
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

bot.command('votar', async (ctx) => {
  const nombre = ctx.from?.first_name;
  const votar = ctx.message?.text.split(' ')[1];
  const encoder = new TextEncoder();
  const data = encoder.encode(`${nombre}:${votar}\n`);
  await Deno.writeFile('./votos.txt', data, { append: true });
  ctx.reply('Votaste porque el nombre sea: ' + votar);
});

bot.on('message:text', async (ctx) => {
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
  const config = db.obtener_conf(autor.id);
  const response = await peticion.completado(ctx.update.message.text, config);
  const respuesta: Respuesta = {
    id: autor.id,
    nombre: autor.first_name,
    hora: hora,
    respuesta: response,
    entrada: ctx.update.message.text,
  };
  ctx.reply(response);
  db.agregar_resp(respuesta);
});

bot.start();
