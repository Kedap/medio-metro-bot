import { Database } from "sqlite";
import { ensureFile } from "std/fs/mod.ts";

export interface Configuracion {
  id: number;
  nombre: string;
  modelo: string;
  temperatura: number;
}

export interface Respuesta {
  id: number;
  nombre: string;
  hora: string;
  respuesta: string;
  entrada: string;
}

export function obtener_conn(archivo: string) {
  return new Database(archivo);
}

function query(q: string, db: Database) {
  db.exec(q);
}

function existe_schema() {
  const db = new Database("usuarios.db");
  const tablas = db
    .prepare(
      `SELECT name FROM sqlite_schema
WHERE type='table'
ORDER BY name`,
    )
    .all();

  try {
    return tablas[0].name == "config" && tablas[1].name == "respuestas";
  } catch {
    return false;
  }
  // return tablas[0].name == 'config' && tablas[0].name == 'config';
}

export class Usuarios {
  db: Database;
  constructor(
    db_path?: string,
    configuracion?: Configuracion,
    entrada?: Respuesta,
  ) {
    const config = `
     CREATE TABLE config (
     id INTEGER PRIMARY KEY,
     nombre TEXT NOT NULL,
     modelo TEXT NOT NULL,
     temperatura REAL NOT NULL
    );`;
    const respuestas = `
     CREATE TABLE respuestas (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     id_chat INTEGER,
     nombre TEXT NOT NULL,
     hora TEXT NOT NULL,
     respuesta TEXT NOT NULL,
     entrada TEXT NOT NULL
    );`;

    if (!db_path) {
      db_path = "usuarios.db";
    }
    ensureFile(db_path);
    const db = new Database(db_path);
    this.db = db;
    if (existe_schema()) {
      return this;
    }
    query(config, db);
    query(respuestas, db);

    if (configuracion) {
      this.agregar_conf(configuracion);
    }
    if (entrada) {
      this.agregar_resp(entrada);
    }

    return this;
  }

  agregar_conf(c: Configuracion) {
    const consulta = `
      INSERT INTO config (id, nombre, modelo, temperatura)
      VALUES ('${c.id}', '${c.nombre}', '${c.modelo}', '${c.temperatura}')
    `;
    query(consulta, this.db);
  }

  agregar_resp(r: Respuesta) {
    const consulta = `
      INSERT INTO respuestas (id_chat, nombre, hora, respuesta, entrada)
      VALUES ('${r.id}', '${r.nombre}', '${r.hora}', '${r.respuesta}', '${r.entrada}')
    `;
    query(consulta, this.db);
  }
}
