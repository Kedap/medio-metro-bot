import { Configuracion, Usuarios } from "./db.ts";

const usuarios = new Usuarios();
const config: Configuracion = {
  id: 10,
  nombre: "Daniel",
  tipo: "medio",
};

await new Promise((r) => setTimeout(r, 15000));
usuarios.agregar_conf(config);
const resultado = usuarios.db.prepare("SELECT * FROM config WHERE id = 10");
if (resultado.get()) {
  console.log("Existe");
} else {
  console.log("No existe");
}
