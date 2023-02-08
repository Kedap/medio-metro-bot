import { Bot } from 'grammy';
import * as dotenv from 'dotenv';
dotenv.config();

// Configuracion de los tokens
let botToken = process.env.BOT_TOKEN;
if (!botToken) {
  botToken = '';
}
const bot = new Bot(botToken);

bot.on('message:text', async (ctx) => {
  ctx.reply('Este es un mensaje que avisa sobre el mantemiento del bot');
  ctx.reply(
    'En unos momentos regresamos, por favor no mandes mensajes hasta que ya se pueda para evitar que se sature el bot'
  );
});

console.log('El bot comenzara a ejecutarse 😸');
bot.start();
