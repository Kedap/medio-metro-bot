import { Bot } from "grammy/mod.ts";
import { config } from "dotenv";
import { Configuracion, Respuesta, Usuarios } from "./db.ts";
import { Peticion } from "./openai.ts";
import { EJEMPLOS } from "./ejemplos.ts";

// Configuracion de los tokens
const bot = new Bot(config().BOT_TOKEN);
const db = new Usuarios();
const ahora = new Date();

bot.command("start", (ctx) => {
  ctx.reply("EEeeee medioMetroooo");
  let nombre = ctx.from?.first_name;
  if (!nombre) {
    nombre = "";
  }
  const configuracion: Configuracion = {
    id: ctx.chat.id,
    nombre: nombre,
    tipo: "medio",
  };
  db.agregar_conf(configuracion);
});

bot.command("config", (ctx) => {
  let nuevaConfig = ctx.message?.text.split(" ")[1];
  let config = db.obtener_conf(ctx.chat.id);
  let nombre = ctx.from?.first_name;
  if (!nuevaConfig) {
    nuevaConfig = "medio";
  }
  if (!nombre) {
    nombre = "";
  }
  config = {
    id: ctx.chat.id,
    nombre: nombre,
    tipo: nuevaConfig,
  };
  db.agregar_conf(config);
  ctx.reply("Simon se puso en " + nuevaConfig);
});

bot.command("ejemplo", (ctx) => {
  let nombre = ctx.message?.text.split(" ")[1];
  if (!nombre || nombre === "") {
    nombre = "ayuda";
  }
  ctx.reply(EJEMPLOS[nombre.toLowerCase()]);
});

bot.on("message:text", async (ctx) => {
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
