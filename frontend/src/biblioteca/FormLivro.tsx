import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Genre, NovoLivro } from './types';

interface Props {
  generos: Genre[];
  onCriar: (dados: NovoLivro) => Promise<void>;
}

export default function FormLivro({ generos, onCriar }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [genreId, setGenreId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await onCriar({ title, author, pages: pages === '' ? undefined : Number(pages), genreId: genreId === '' ? undefined : Number(genreId) });
      setTitle(''); setAuthor(''); setPages(''); setGenreId('');
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return <section className="painel">
    <h2>Novo livro</h2>
    <form onSubmit={enviar} noValidate>
      <fieldset disabled={enviando}>
        <div className="campos">
          <label>Título<input value={title} onChange={e => setTitle(e.target.value)} /></label>
          <label>Autor<input value={author} onChange={e => setAuthor(e.target.value)} /></label>
          <label>Páginas<input type="number" value={pages} onChange={e => setPages(e.target.value)} /></label>
          <label>Gênero<select value={genreId} onChange={e => setGenreId(e.target.value)}>
            <option value="">Sem gênero</option>
            {generos.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select></label>
        </div>
        <button type="submit" className="principal">{enviando ? 'Adicionando...' : 'Adicionar livro'}</button>
      </fieldset>
      {erro && <p role="alert" className="erro">{erro}</p>}
    </form>
  </section>;
}
