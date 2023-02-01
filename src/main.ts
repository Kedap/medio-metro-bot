import { Bot } from 'grammy/mod.ts';
import { config } from 'dotenv';
import { Usuarios, Respuesta } from './db.ts';

// Configuracion de los tokens
const bot = new Bot(config().BOT_TOKEN);
const db = new Usuarios();
const ahora = new Date();

bot.command('start', (ctx) => ctx.reply('Hola mundo!'));
bot.on('message:text', (ctx) => {
  // const hora = `${ahora.getDay}/${ahora.getMonth}/${ahora.getFullYear}-${ahora.getHours}:${ahora.getMinutes}:${ahora.getSeconds}`;
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
  const respuesta: Respuesta = {
    id: autor.id,
    nombre: autor.first_name,
    hora: hora,
    respuesta: '',
    entrada: ctx.update.message.text,
  };
  ctx.reply('No entiendo: ' + ctx.update.message.text);
  db.agregar_resp(respuesta);
});

bot.start();
