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

// Rota GET que lista todos os produtos (usa um for para montar as linhas)
server.get("/listar", (req, res) => {
  // monta HTML simples com tabela
  let html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8"/>
        <title>Lista de Produtos</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <style>
          body { font-family: Arial, sans-serif; background:#f6f8fb; padding:20px; color:#111; }
          table { width:100%; border-collapse:collapse; background:white; box-shadow:0 6px 20px rgba(16,24,40,0.06); }
          th, td { padding:10px 12px; border-bottom:1px solid #eee; text-align:left; font-size:14px; }
          th { background:#1976d2; color:#fff; position:sticky; top:0; }
          tr:hover { background:#f3f6ff; }
          .actions { margin-top:12px; }
          .btn { padding:8px 12px; border-radius:8px; text-decoration:none; color:#fff; background:#2196f3; }
        </style>
      </head>
      <body>
        <h2>Produtos cadastrados (${listaDeProdutos.length})</h2>
  `;

  // se não tiver produtos
  if (listaDeProdutos.length === 0) {
    html += `<p>Nenhum produto cadastrado ainda. <a href="/cadastro" class="btn">Cadastrar produto</a></p>`;
    html += `</body></html>`;
    return res.send(html);
  }

  // inicia tabela
  html += `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Marca</th>
          <th>Categoria</th>
          <th>Preço (R$)</th>
          <th>Qtd</th>
          <th>Validade</th>
          <th>Fornecedor</th>
          <th>Controlado</th>
          <th>Receita</th>
        </tr>
      </thead>
      <tbody>
  `;

  // usa for para criar as linhas 
  for (let i = 0; i < listaDeProdutos.length; i++) {
    const p = listaDeProdutos[i];
    html += `
      <tr>
        <td>${p.nome}</td>
        <td>${p.marca}</td>
        <td>${p.categoria}</td>
        <td>${Number(p.preco).toFixed(2)}</td>
        <td>${p.quantidade}</td>
        <td>${p.validade}</td>
        <td>${p.fornecedor}</td>
        <td>${p.controlado}</td>
        <td>${p.receita}</td>
      </tr>
    `;
  }

  // fecha tabela e adiciona botões
  html += `
      </tbody>
    </table>
    <div class="actions">
      <a href="/cadastro" class="btn">⬅ Cadastrar novo</a>
      <a href="/" style="margin-left:8px; color:#1976d2; text-decoration: none;">🏠 Voltar</a>
    </div>
    </body>
    </html>
  `;

  res.send(html);
});


server.listen(port, host, () => {
  console.log(
    `Servidor rodando em http://${host}:${port} \n Servidor rodando em http://localhost:${port}`
  );
});
