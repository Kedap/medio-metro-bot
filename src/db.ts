import { Database } from 'sqlite3';
import { ensureFile } from 'fs-extra';

export interface Configuracion {
  id: number;
  nombre: string;
  tipo: string;
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

function existe_schema(): boolean {
  const db = new Database('usuarios.db');
  let resultado = false;
  db.all(
    `SELECT name FROM sqlite_schema WHERE name = ? OR name = ?`,
    ['config', 'respuestas'],
    (_e, row) => {
      resultado = row.length == 2;
    }
  );
  return resultado;
}

export class Usuarios {
  db: Database;
  constructor(
    db_path?: string,
    configuracion?: Configuracion,
    entrada?: Respuesta
  ) {
    const config = `
     CREATE TABLE config (
     id INTEGER PRIMARY KEY,
     nombre TEXT NOT NULL,
     tipo TEXT NOT NULL
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
      db_path = 'usuarios.db';
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
    const existe = this.db.prepare('SELECT * FROM config WHERE id = ' + c.id);
    let consulta: string;
    if (existe.get()) {
      consulta = `
      UPDATE config
      SET tipo = '${c.tipo}'
      WHERE id = ${c.id}
    `;
    } else {
      consulta = `
      INSERT INTO config (id, nombre, tipo)
      VALUES ('${c.id}', '${c.nombre}', '${c.tipo}')
    `;
    }
    query(consulta, this.db);
  }

  agregar_resp(r: Respuesta) {
    const consulta = `
      INSERT INTO respuestas (id_chat, nombre, hora, respuesta, entrada)
      VALUES ('${r.id}', '${r.nombre}', '${r.hora}', '${r.respuesta}', '${r.entrada}')
    `;
    query(consulta, this.db);
  }

  obtener_conf(id: number): Configuracion {
    let consultas: Configuracion = {
      id: 0,
      nombre: '',
      tipo: '',
    };
    this.db.get('SELECT * FROM config WHERE id = ' + id, (_e, row) => {
      consultas.id = row.id;
      consultas.nombre = row.nombre;
      consultas.tipo = row.tipo;
    });

    return consultas;
  }
}
