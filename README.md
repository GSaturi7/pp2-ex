# Biblioteca — Paradigmas de Programação II

Exercícios de React consumindo a API de livros e gêneros. O frontend usa TypeScript, componentes funcionais, `useEffect`, formulários controlados e `fetch`.

## Executar

Pré-requisitos: Node.js 24 LTS, npm e PostgreSQL (ou Docker com Compose). O banco precisa estar disponível na porta 5432.

1. Suba o banco de desenvolvimento na raiz do projeto:
   ```sh
   docker compose up -d --wait
   ```
   Também é possível criar um banco `biblioteca` no PostgreSQL já instalado.
2. Prepare o backend:
   ```sh
   cd backend
   cp .env.example .env
   ```
   Com o banco do Compose, use esta conexão no `.env`:
   ```dotenv
   DATABASE_URL="postgresql://biblioteca:biblioteca@localhost:5432/biblioteca"
   ```
   Esse usuário e senha são apenas para o banco local de desenvolvimento. Se usar outro PostgreSQL, ajuste a conexão.
3. Instale e prepare a API:
   ```sh
   npm ci
   npx prisma generate
   npx prisma migrate deploy
   npm run dev
   ```
   A API responde em `http://localhost:3001`. Os diretórios de migração ficam versionados; não é necessário criar outra migração para rodar o projeto.
4. Em outro terminal, na raiz:
   ```sh
   cd frontend
   npm ci
   npm run dev
   ```
   Abra `http://localhost:5173`. O banco começa vazio: cadastre um gênero e depois os livros.

## O que foi feito

- Listar, criar, editar, marcar como lido e remover livros.
- Listar, criar, renomear e remover gêneros.
- Mensagens de carregamento, lista vazia e erros enviados pelo backend.
- Atualizações com `map`, `filter` e spread, depois da confirmação da API.
- Recarga de livros e gêneros ao trocar de aba. Remover o gênero mantém seus livros, sem gênero.
- **D1:** filtro por gênero, incluindo livros sem gênero.
- **D2:** busca por título e contagem dos resultados, combinadas com o filtro.

## Organização

```text
backend/                         API fornecida no exercício
frontend/src/biblioteca/
  types.ts                       Tipos de dados
  api.ts                         Requisições e tratamento de erros/204
  ListaLivros.tsx                Listagem isolada do exercício 4
  FormLivro.tsx                  Formulário de criação
  ItemLivro.tsx, Livros.tsx       CRUD de livros
  ItemGenero.tsx, Generos.tsx     CRUD de gêneros
frontend/src/App.tsx              Navegação entre as duas telas
```

`ListaLivros` é a etapa isolada com fetch dentro do componente. Para visualizar essa etapa, importe e renderize o componente no `App`; a tela final usa `Livros`, com a camada de API e todas as operações.

As [respostas de revisão](docs/revisao.md) explicam os conceitos e a troca de aba. Os [resultados da exploração da API](docs/exploracao-api.md) correspondem ao exercício 1.

## Conferir

Com a API ligada, execute na raiz:

```sh
npm ci
npm run build
npm run test:api
npx playwright install chromium
npm run test:ui
```

O teste de API cria e remove apenas seus registros. O teste completo de interface espera um **banco de testes vazio**, na conexão configurada no backend. Não execute esse teste em um banco com dados pessoais. O Playwright inicia o Vite; a API e o PostgreSQL devem estar ligados. Se o Chromium já estiver instalado, pode usar `CHROMIUM_PATH=/usr/bin/chromium npm run test:ui`.

Para conferir o relacionamento diretamente no banco:

```sql
SELECT id, title, author, read, "genreId" FROM "Book" ORDER BY id;
```

O [registro de validação](docs/validacao.md) separa as verificações executadas das que dependem da liberação de rede no ambiente.
