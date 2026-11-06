import assert from 'node:assert/strict';

const BASE = 'http://localhost:3001';
const headers = { 'Content-Type': 'application/json' };
const livros = new Set();
const generos = new Set();
const resultados = [];
async function requisitar(path, method = 'GET', dados, comCabecalho = true) {
  const res = await fetch(`${BASE}${path}`, {
    method, headers: comCabecalho ? headers : {},
    body: dados === undefined ? undefined : JSON.stringify(dados),
  });
  return { status: res.status, body: res.status === 204 ? null : await res.json() };
}
async function caso(nome, path, method, dados, status, mensagem, comCabecalho = true) {
  const r = await requisitar(path, method, dados, comCabecalho);
  assert.equal(r.status, status, nome);
  if (mensagem) assert.equal(r.body.message, mensagem, nome);
  resultados.push({ caso: nome, status: r.status, mensagem: r.body?.message ?? 'Sem corpo' });
  return r.body;
}
try {
  assert.equal((await requisitar('/')).body.status, 'API da Biblioteca no ar');
  assert.ok(Array.isArray((await requisitar('/books')).body));
  assert.ok(Array.isArray((await requisitar('/genres')).body));
  await caso('Gênero sem nome', '/genres', 'POST', {}, 400, 'Nome é obrigatório');
  await caso('Livro sem título', '/books', 'POST', {}, 400, 'Título é obrigatório');
  await caso('Livro sem autor', '/books', 'POST', { title: 'Teste' }, 400, 'Autor é obrigatório');
  await caso('Páginas negativas', '/books', 'POST', { title: 'Teste', author: 'Teste', pages: -5 }, 400, 'Número de páginas inválido');
  // Um id alto evita depender do conteúdo prévio do banco.
  await caso('Gênero inexistente', '/books', 'POST', { title: 'Teste', author: 'Teste', genreId: 2147483647 }, 404, 'Gênero não encontrado');
  await caso('Id inválido', '/books/abc', 'GET', undefined, 400, 'Id inválido');
  await caso('Sem Content-Type JSON', '/books', 'POST', { title: 'Teste', author: 'Teste' }, 500, 'Erro interno', false);

  const genero = await caso('Criar gênero', '/genres', 'POST', { name: 'Gênero de teste' }, 201);
  generos.add(genero.id);
  for (const title of ['Livro de teste A', 'Livro de teste B']) {
    const livro = await caso('Criar livro', '/books', 'POST', { title, author: 'Autor de teste', pages: 256, genreId: genero.id }, 201);
    livros.add(livro.id);
  }
  const [id] = livros;
  const lista = (await requisitar('/books')).body;
  assert.equal(lista.find(l => l.id === id).genre.name, 'Gênero de teste');
  await caso('Título vazio na edição', `/books/${id}`, 'PUT', { title: '' }, 400, 'Título é obrigatório');
  await caso('Autor vazio na edição', `/books/${id}`, 'PUT', { author: '' }, 400, 'Autor é obrigatório');
  await caso('Gênero vazio na edição', `/genres/${genero.id}`, 'PUT', { name: '' }, 400, 'Nome é obrigatório');
  const lido = await caso('Marcar como lido', `/books/${id}`, 'PUT', { read: true }, 200);
  assert.equal(lido.read, true);
  const editado = await caso('Editar livro', `/books/${id}`, 'PUT', { title: 'Novo título', author: 'Outro autor', pages: null }, 200);
  assert.equal(editado.title, 'Novo título'); assert.equal(editado.pages, null);
  await caso('Renomear gênero', `/genres/${genero.id}`, 'PUT', { name: 'Gênero renomeado' }, 200);
  assert.equal((await requisitar(`/books/${id}`)).body.genre.name, 'Gênero renomeado');
  await caso('Remover gênero', `/genres/${genero.id}`, 'DELETE', undefined, 204);
  generos.delete(genero.id);
  for (const livroId of livros) {
    const livro = (await requisitar(`/books/${livroId}`)).body;
    assert.equal(livro.genreId, null); assert.equal(livro.genre, null);
  }
  await caso('Remover livro', `/books/${id}`, 'DELETE', undefined, 204);
  livros.delete(id);
  await caso('Remover livro novamente', `/books/${id}`, 'DELETE', undefined, 404, 'Livro não encontrado');
  console.table(resultados);
  console.log(`${resultados.length} casos passaram; persistência e SET NULL conferidos.`);
} finally {
  for (const id of livros) await requisitar(`/books/${id}`, 'DELETE');
  for (const id of generos) await requisitar(`/genres/${id}`, 'DELETE');
}
