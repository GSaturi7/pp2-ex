# Backend da Biblioteca (livros e gêneros)

API usada na lista de exercícios de React. Mesma arquitetura do backend de tasks
(routes -> controllers -> services -> repositories), porta **3001**.

## Como rodar
1. Crie um banco vazio chamado `biblioteca` no PostgreSQL.
2. Copie `.env.example` para `.env` e ajuste usuário e senha.
3. No terminal, nesta pasta:
   ```
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```
4. Abra http://localhost:3001/books (deve mostrar `[]`).

## Rotas
`/books` e `/genres`: GET (lista), GET /:id, POST, PUT /:id, DELETE /:id.
Erros vêm como `{ "message": "..." }`. Apagar um gênero deixa `genreId = null` nos livros.
