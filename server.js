const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Protege a chave via variável de ambiente
const FREEPAY_SECRET_KEY = process.env.FREEPAY_SECRET_KEY;

app.use(cors());
app.use(express.json());

app.post('/gerar-pix', async (req, res) => {
  const { nome, documento, email, telefone, valor } = req.body;

  try {
    const resposta = await fetch("https://api.freepay.com.br/pix/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FREEPAY_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
  valor: valor / 100, // converte de centavos para reais
  nome,
  documento,
  email,
  telefone
})
    });

    const dados = await resposta.json();

   if (!resposta.ok) {
  console.error("Resposta da FreePay:", dados);
  return res.status(resposta.status).json({ erro: dados });
}

    return res.json(dados);

  } catch (erro) {
    console.error("Erro ao conectar com FreePay:", erro);
    return res.status(500).json({ erro: "Erro interno ao gerar Pix." });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor da FreePay ativo 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
