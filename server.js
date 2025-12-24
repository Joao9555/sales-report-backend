// ========================================
// IMPORTANDO AS BIBLIOTECAS
// ========================================

// Express: framework que facilita criar o servidor
const express = require('express');

// FS (File System): permite ler e escrever arquivos
const fs = require('fs');

// Path: trabalha com caminhos de arquivos
const path = require('path');

// CORS: permite que o HTML converse com o servidor
const cors = require('cors');


// ========================================
// CRIANDO O SERVIDOR
// ========================================

const app = express(); // Cria o servidor
const PORT = 3000; // Porta onde o servidor vai rodar (localhost:3000)


// ========================================
// CONFIGURAÇÕES DO SERVIDOR
// ========================================

// Permite receber dados em JSON do frontend
app.use(express.json());

// Permite que qualquer página acesse o servidor (sem bloqueio de segurança)
app.use(cors());


// ========================================
// CAMINHO DO ARQUIVO DE DADOS
// ========================================

// Onde os dados serão salvos (um arquivo JSON)
const DATABASE_FILE = path.join(__dirname, 'vendas.json');


// ========================================
// FUNÇÃO: LER DADOS DO ARQUIVO
// ========================================

function lerDados() {
  try {
    // Tenta ler o arquivo vendas.json
    const dados = fs.readFileSync(DATABASE_FILE, 'utf-8');
    
    // Converte de texto (JSON) para objeto JavaScript
    return JSON.parse(dados);
    
  } catch (error) {
    // Se o arquivo não existir, retorna array vazio
    return [];
  }
}


// ========================================
// FUNÇÃO: SALVAR DADOS NO ARQUIVO
// ========================================

function salvarDados(dados) {
  // Converte objeto JavaScript para texto (JSON formatado)
  const json = JSON.stringify(dados, null, 2);
  
  // Escreve no arquivo vendas.json
  fs.writeFileSync(DATABASE_FILE, json, 'utf-8');
}


// ========================================
// ROTA 1: BUSCAR TODAS AS VENDAS
// ========================================

// Quando alguém acessar GET /vendas
app.get('/vendas', (req, res) => {
  
  // Lê todas as vendas do arquivo
  const vendas = lerDados();
  
  // Envia as vendas de volta para quem pediu
  res.json(vendas);
  
  console.log('✅ Vendas buscadas com sucesso!');
});


// ========================================
// ROTA 2: CRIAR UMA NOVA VENDA
// ========================================

// Quando alguém enviar POST /vendas
app.post('/vendas', (req, res) => {
  
  // Pega os dados da venda que vieram do formulário
  const novaVenda = req.body;
  
  // Lê todas as vendas existentes
  const vendas = lerDados();
  
  // Gera um ID único para a nova venda
  novaVenda.id = Date.now(); // Usa timestamp como ID
  
  // Adiciona a nova venda na lista
  vendas.push(novaVenda);
  
  // Salva tudo de volta no arquivo
  salvarDados(vendas);
  
  // Retorna a venda criada (com ID)
  res.json(novaVenda);
  
  console.log('✅ Venda criada:', novaVenda.nome);
});


// ========================================
// ROTA 3: ATUALIZAR UMA VENDA
// ========================================

// Quando alguém enviar PUT /vendas/123
app.put('/vendas/:id', (req, res) => {
  
  // Pega o ID da URL (exemplo: /vendas/123 → id = 123)
  const id = parseInt(req.params.id);
  
  // Pega os novos dados da venda
  const dadosAtualizados = req.body;
  
  // Lê todas as vendas
  let vendas = lerDados();
  
  // Procura a venda pelo ID
  const index = vendas.findIndex(v => v.id === id);
  
  if (index !== -1) {
    // Atualiza a venda (mantém o ID, muda o resto)
    vendas[index] = { ...vendas[index], ...dadosAtualizados };
    
    // Salva tudo de volta
    salvarDados(vendas);
    
    // Retorna a venda atualizada
    res.json(vendas[index]);
    
    console.log('✅ Venda atualizada:', vendas[index].nome);
  } else {
    // Se não encontrou, retorna erro 404
    res.status(404).json({ erro: 'Venda não encontrada' });
  }
});


// ========================================
// ROTA 4: DELETAR UMA VENDA
// ========================================

// Quando alguém enviar DELETE /vendas/123
app.delete('/vendas/:id', (req, res) => {
  
  // Pega o ID da URL
  const id = parseInt(req.params.id);
  
  // Lê todas as vendas
  let vendas = lerDados();
  
  // Filtra, removendo a venda com esse ID
  vendas = vendas.filter(v => v.id !== id);
  
  // Salva tudo de volta
  salvarDados(vendas);
  
  // Retorna sucesso
  res.json({ mensagem: 'Venda deletada com sucesso' });
  
  console.log('🗑️ Venda deletada ID:', id);
});


// ========================================
// INICIAR O SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════╗
  ║   🚀 SERVIDOR RODANDO!            ║
  ║   📍 http://localhost:${PORT}      ║
  ║   ✅ Pronto para receber vendas!  ║
  ╚════════════════════════════════════╝
  `);
});