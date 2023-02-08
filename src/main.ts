import { Bot } from "grammy/mod.ts";
import { config } from "dotenv";

// Configuracion de los tokens
const bot = new Bot(config().BOT_TOKEN);

bot.on("message:text", (ctx) => {
  ctx.reply("Este es un mensaje que avisa sobre el mantemiento del bot");
  ctx.reply(
    "En unos momentos regresamos, por favor no mandes mensajes hasta que ya se pueda para evitar que se sature el bot",
  );
  ctx.reply("No olvides presentar las quejas/sugerencias en el wasap c:");
});

console.log("El bot comenzara a ejecutarse 😸");
bot.start();
