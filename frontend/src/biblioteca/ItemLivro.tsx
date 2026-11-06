import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AtualizaLivro, Book } from './types';

interface Props {
  livro: Book;
  onAtualizar: (dados: AtualizaLivro) => Promise<boolean>;
  onRemover: () => Promise<boolean>;
}

export default function ItemLivro({ livro, onAtualizar, onRemover }: Props) {
  const [editando, setEditando] = useState(false);
  const [title, setTitle] = useState(livro.title);
  const [author, setAuthor] = useState(livro.author);
  const [ocupado, setOcupado] = useState(false);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOcupado(true);
    try {
      if (await onAtualizar({ title, author })) setEditando(false);
    } finally { setOcupado(false); }
  }
  async function executar(acao: () => Promise<boolean>) {
    setOcupado(true);
    try { await acao(); } finally { setOcupado(false); }
  }
  function editar() {
    setTitle(livro.title); setAuthor(livro.author); setEditando(true);
  }

  return <li className="livro">
    {editando ? <form onSubmit={salvar} noValidate>
      <fieldset disabled={ocupado}>
        <div className="campos">
          <label>Título da edição<input value={title} onChange={e => setTitle(e.target.value)} /></label>
          <label>Autor da edição<input value={author} onChange={e => setAuthor(e.target.value)} /></label>
        </div>
        <div className="acoes"><button type="submit">Salvar</button><button type="button" onClick={() => setEditando(false)}>Cancelar</button></div>
      </fieldset>
    </form> : <>
      <label className="leitura"><input type="checkbox" checked={livro.read} disabled={ocupado} aria-label={`Marcar ${livro.title} como ${livro.read ? 'não lido' : 'lido'}`} onChange={e => executar(() => onAtualizar({ read: e.target.checked }))} /><span>{livro.read ? 'Lido' : 'Não lido'}</span></label>
      <div className="detalhes"><h3>{livro.title}</h3><p>{livro.author}</p><p className="muted">{livro.genre?.name ?? 'Sem gênero'}{livro.pages !== null && ` · ${livro.pages} páginas`}</p></div>
      <div className="acoes"><button disabled={ocupado} onClick={editar}>Editar</button><button className="remover" disabled={ocupado} onClick={() => executar(onRemover)}>Remover</button></div>
    </>}
  </li>;
}
