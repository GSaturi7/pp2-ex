# Exercício 1 — Exploração da API

Os casos estão automatizados em `tests/api.mjs`. Execute `npm run test:api` com a API e o PostgreSQL ligados para conferir os resultados reais.

| Requisição | Status esperado | Mensagem definida no backend |
| --- | --- | --- |
| POST /genres sem name | 400 | Nome é obrigatório |
| POST /books sem title | 400 | Título é obrigatório |
| POST /books com title, sem author | 400 | Autor é obrigatório |
| POST /books com pages: -5 | 400 | Número de páginas inválido |
| POST /books com gênero inexistente | 404 | Gênero não encontrado |
| GET /books/abc | 400 | Id inválido |
| DELETE de um livro existente | 204 | Sem corpo |
| DELETE do mesmo livro novamente | 404 | Livro não encontrado |
| POST /books sem Content-Type JSON | 500 | Erro interno |

O teste usa o id realmente criado, em vez de presumir que seja 1. Para o gênero inexistente, usa um id alto para evitar conflito com gêneros já cadastrados.

Sem `Content-Type: application/json`, o `express.json()` não interpreta o corpo. O serviço tenta acessar `data.title`, mas `data` está indefinido. Isso gera um erro comum de JavaScript, e não um `AppError` de validação. O middleware de erros transforma esse caso em 500. O backend foi mantido com esse comportamento, como pede a lista.
