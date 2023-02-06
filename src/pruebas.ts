import { Database } from 'sqlite3';

const db = new Database('usuarios.db');
let hola = false;
console.log(hola);

db.all(
  //   `SELECT name FROM sqlite_schema
  // WHERE type='table'
  // ORDER BY name`,

  `SELECT name FROM sqlite_schema WHERE name = 'config' OR name = 'respuestas'`,
  (_err, row) => {
    console.log(row.length);
  }
);

console.log(hola);
