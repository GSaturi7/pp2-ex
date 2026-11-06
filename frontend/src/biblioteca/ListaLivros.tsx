import { useEffect, useState } from 'react';
import type { Book } from './types';

// Versão de leitura do exercício 4. A tela com CRUD está em Livros.tsx.
export default function ListaLivros() {
  const [livros, setLivros] = useState<Book[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const resposta = await fetch('http://localhost:3001/books');
        if (!resposta.ok) {
          const dados = await resposta.json();
          throw new Error(dados.message);
        }
        const dados: Book[] = await resposta.json();
        if (ativo) setLivros(dados);
      } catch (e) {
        if (ativo) setErro((e as Error).message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p role="alert">Erro: {erro}</p>;
  if (!livros.length) return <p>Nenhum livro.</p>;
  return <ul>{livros.map(livro => <li key={livro.id}>
    {livro.read ? '[x]' : '[ ]'} {livro.title} — {livro.author}
    {livro.genre && ` · ${livro.genre.name}`}
  </li>)}</ul>;
}
