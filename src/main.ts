import { Bot } from "grammy/mod.ts";
import { config } from "dotenv";

const bot = new Bot(config().BOT_TOKEN);
bot.command("start", (ctx) => ctx.reply("Hola mundo!"));
bot.on("message:text", (ctx) => {
  ctx.reply("No es una fototet4 :C");
  ctx.reply("No entiendo: " + ctx.update.message.text);
});

bot.start();
