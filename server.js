const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔴 BANCO EM MEMÓRIA (Render Friendly)
let vendas = [];

// ==============================
// GET - LISTAR VENDAS
// ==============================
app.get('/vendas', (req, res) => {
  res.json(vendas);
});

// ==============================
// POST - CRIAR VENDA
// ==============================
app.post('/vendas', (req, res) => {
  const novaVenda = {
    id: Date.now(),
    ...req.body
  };

  vendas.push(novaVenda);

  res.status(201).json(novaVenda);
});

// ==============================
// PUT - ATUALIZAR VENDA
// ==============================
app.put('/vendas/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = vendas.findIndex(v => v.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Venda não encontrada' });
  }

  vendas[index] = { ...vendas[index], ...req.body };

  res.json(vendas[index]);
});

// ==============================
// DELETE - REMOVER VENDA
// ==============================
app.delete('/vendas/:id', (req, res) => {
  const id = Number(req.params.id);
  vendas = vendas.filter(v => v.id !== id);
  res.json({ ok: true });
});

// ==============================
// START
// ==============================
app.listen(PORT, () => {
  console.log('🚀 Servidor rodando na Render');
});
