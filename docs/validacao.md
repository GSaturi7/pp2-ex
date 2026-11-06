# Validação

Conferido no ambiente de desenvolvimento:

- Instalação das dependências do backend, frontend e testes.
- Build do frontend com TypeScript e Vite.
- Teste de interface para os estados de carregamento e erro de conexão, usando Chromium.
- Migração SQL executada em transação descartada no PostgreSQL 17: os dois livros permaneceram com `genreId = NULL` após excluir seu gênero.
- Os arquivos originais do backend foram preservados. Foram adicionados lockfile e migração inicial.

## Verificação pendente

O ambiente bloqueou o download verificado do motor do Prisma em `binaries.prisma.sh` com HTTP 403. Por isso, a geração do cliente, a aplicação da migração pelo Prisma, o build do backend e os testes completos com a API ainda precisam ser executados após liberar esse domínio.

Na raiz, com o banco disponível e o `.env` configurado:

```sh
npm run setup
cd backend
npx prisma migrate deploy
npm run dev
```

Em outro terminal, na raiz:

```sh
npm run build
npm run test:api
CHROMIUM_PATH=/usr/bin/chromium npm run test:ui
```

O caminho do Chromium acima vale para este ambiente Linux. Em outra máquina, instale o navegador com `npx playwright install chromium` e execute `npm run test:ui`.
