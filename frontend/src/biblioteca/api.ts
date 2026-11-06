import type { AtualizaLivro, Book, Genre, NovoLivro } from './types';

export const BASE = 'http://localhost:3001';
export const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function requisicao<T>(path: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(`${BASE}${path}`, opcoes);
  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.message ?? 'Não foi possível concluir a requisição.');
  }
  if (resposta.status === 204) return undefined as T;
  return resposta.json();
}

export const listarLivros = () => requisicao<Book[]>('/books');
export const criarLivro = (dados: NovoLivro) => requisicao<Book>('/books', {
  method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(dados),
});
export const atualizarLivro = (id: number, dados: AtualizaLivro) => requisicao<Book>(`/books/${id}`, {
  method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(dados),
});
export const removerLivro = (id: number) => requisicao<void>(`/books/${id}`, { method: 'DELETE' });
export const listarGeneros = () => requisicao<Genre[]>('/genres');
export const criarGenero = (name: string) => requisicao<Genre>('/genres', {
  method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ name }),
});
export const atualizarGenero = (id: number, name: string) => requisicao<Genre>(`/genres/${id}`, {
  method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify({ name }),
});
export const removerGenero = (id: number) => requisicao<void>(`/genres/${id}`, { method: 'DELETE' });
