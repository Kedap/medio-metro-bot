import { Bot } from "grammy/mod.ts";
import { config } from "dotenv";
import { Respuesta, Usuarios } from "./db.ts";
import { Peticion } from "./openai.ts";

// Configuracion de los tokens
const bot = new Bot(config().BOT_TOKEN);
const db = new Usuarios();
const ahora = new Date();

bot.command("start", (ctx) => ctx.reply("Hola mundo!"));
bot.on("message:text", async (ctx) => {
  // const hora = `${ahora.getDay}/${ahora.getMonth}/${ahora.getFullYear}-${ahora.getHours}:${ahora.getMinutes}:${ahora.getSeconds}`;
  const hora: string = ahora.getDay() +
    "/" +
    ahora.getDate().toString() +
    "/" +
    ahora.getMonth() +
    "/" +
    ahora.getFullYear().toString() +
    ":" +
    ahora.getHours().toString() +
    ":" +
    ahora.getMinutes().toString() +
    ":" +
    ahora.getSeconds().toString();

  const autor = ctx.update.message.from;
  const peticion = new Peticion();
  const response = await peticion.completado(ctx.update.message.text);
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
