import express from "express";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = "0.0.0.0";
const port = 3000;
var listaDeProdutos = [];

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Servir a pasta public (onde ficam os arquivos HTML e CSS)
server.use(express.static(path.join(__dirname, "public")));

// Servir arquivos estáticos da raiz (onde estão index.html, style.css e script.js)
server.use(express.static(__dirname));

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota de cadastro → mostra o formulário de cadastro de medicamentos e afins
server.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cadastro.html"));
});

// Rota POST que recebe o formulário, cria o objeto e redireciona para /listar
server.post("/resultado", (req, res) => {
  // pega cada campo individualmente (se estiver vazio, coloca string vazia)
  const nome = req.body.nome || "";
  const marca = req.body.marca || "";
  const categoria = req.body.categoria || "";
  const barras = req.body.barras || "";
  const lote = req.body.lote || "";
  const validade = req.body.validade || "";
  const fornecedor = req.body.fornecedor || "";
  const preco = req.body.preco || "0";
  const quantidade = req.body.quantidade || "0";
  const receita = req.body.receita || "não informado";
  // checkbox envia "on" quando marcado; transformamos para Sim/Não
  const controlado = req.body.controlado ? "Sim" : "Não";
  const forma = req.body.forma || "";
  const ingredientes = req.body.ingredientes || "";
  const armazenamento = req.body.armazenamento || "";
  const descricao = req.body.descricao || "";

  // monta o objeto produto
  const produto = {
    nome,
    marca,
    categoria,
    barras,
    lote,
    validade,
    fornecedor,
    preco,
    quantidade,
    receita,
    controlado,
    forma,
    ingredientes,
    armazenamento,
    descricao,
    criadoEm: new Date().toISOString(),
  };

  // adiciona na lista em memória
  listaDeProdutos.push(produto);

  // redireciona para a rota que lista os produtos
  return res.redirect("/listar");
});



server.listen(port, host, () => {
  console.log(
    `Servidor rodando em http://${host}:${port} \n Servidor rodando em http://localhost:${port}`
  );
});
