# Jogo da Cobrinha Multiplayer

Este é um jogo da cobrinha multiplayer utilizando Node.js, Express e Socket.io.

## Como Iniciar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   npm start
   ```

3. Acesse no navegador:
   - Jogo: `http://localhost:5000`
   - Controle Remoto: `http://localhost:5000/control`

## Estrutura do Projeto

- `public/`: Arquivos estáticos (HTML, CSS, JS do frontend)
- `src/`: Código fonte do servidor (Node.js)
- `src/server.js`: Ponto de entrada da aplicação
- `src/routes/`: Definição das rotas Express
