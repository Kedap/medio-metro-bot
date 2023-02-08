# Medio Metro Bot

Un bot de Telegram que interactua con la API de chatgpt

![medio metro](img/icon.jpg)

## Escrito con TypeScript y Deno!

Es tan facil de ejecutar con los siguientes pasos:

1. Copiar el archivo [.env](./.env-ejemplo) a un archivo `.env` editando los
   tokens que requieren (Telegram y OpenAI)

   ```sh
   cp .env-ejemplo .env
   vim .env
   ```

2. Ejecutar con:

```sh
deno task run
```

## Tambien con node!

Si quiere ejecutar la version de node lo puede hacer cambiando a la rama `node`
e instalando las dependencias:

```sh
git checkout node
npm install
npm run build
npm run start
```
