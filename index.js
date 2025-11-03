import express from "express";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = "0.0.0.0";
const port = 3000;

const server = express();


// Servir a pasta public (onde ficam os arquivos HTML e CSS)
server.use(express.static(path.join(__dirname, "public")));

// Servir arquivos estáticos da raiz (onde estão index.html, style.css e script.js)
server.use(express.static(__dirname));

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, host, () => {
  console.log(
    `Servidor rodando em http://${host}:${port} \n Servidor rodando em http://localhost:${port}`
  );
});
