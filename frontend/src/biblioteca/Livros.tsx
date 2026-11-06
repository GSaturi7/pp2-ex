import { useEffect, useState } from 'react';
import type { AtualizaLivro, Book, Genre, NovoLivro } from './types';
import { listarLivros, listarGeneros, criarLivro, atualizarLivro, removerLivro } from './api';
import FormLivro from './FormLivro';
import ItemLivro from './ItemLivro';

export default function Livros() {
  const [livros, setLivros] = useState<Book[]>([]);
  const [generos, setGeneros] = useState<Genre[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    let ativo = true;
    Promise.all([listarLivros(), listarGeneros()])
      .then(([lista, generos]) => { if (ativo) { setLivros(lista); setGeneros(generos); } })
      .catch((e: Error) => { if (ativo) setErro(e.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  function comGenero(livro: Book): Book {
    return { ...livro, genre: generos.find(g => g.id === livro.genreId) ?? null };
  }
  async function criar(dados: NovoLivro) {
    const novo = await criarLivro(dados);
    setLivros(atual => [...atual, comGenero(novo)]);
  }
  async function executar(acao: () => Promise<void>) {
    setErro(null);
    try { await acao(); return true; }
    catch (e) { setErro((e as Error).message); return false; }
  }
  function atualizar(id: number, dados: AtualizaLivro) {
    return executar(async () => {
      const novo = await atualizarLivro(id, dados);
      setLivros(atual => atual.map(livro => livro.id === id ? comGenero(novo) : livro));
    });
  }
  function remover(id: number) {
    return executar(async () => {
      await removerLivro(id);
      setLivros(atual => atual.filter(livro => livro.id !== id));
    });
  }

  const visiveis = livros.filter(livro =>
    (filtro === 'todos' || (filtro === 'sem' ? livro.genreId === null : livro.genreId === Number(filtro))) &&
    livro.title.toLowerCase().includes(busca.toLowerCase()),
  );

  if (carregando) return <p role="status">Carregando...</p>;
  return <>
    {erro && <p role="alert" className="erro">Erro: {erro}</p>}
    <FormLivro generos={generos} onCriar={criar} />
    <section className="painel">
      <h2>Meus livros</h2>
      <div className="campos filtros">
        <label>Buscar por título<input type="search" value={busca} onChange={e => setBusca(e.target.value)} /></label>
        <label>Filtrar por gênero<select value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="todos">Todos</option><option value="sem">Sem gênero</option>
          {generos.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select></label>
      </div>
      <p className="muted" aria-live="polite">{visiveis.length} de {livros.length} livros</p>
      {!livros.length ? <p>Nenhum livro.</p> : !visiveis.length ? <p>Nenhum livro encontrado com esses filtros.</p> :
        <ul className="lista">{visiveis.map(livro => <ItemLivro key={livro.id} livro={livro} onAtualizar={dados => atualizar(livro.id, dados)} onRemover={() => remover(livro.id)} />)}</ul>}
    </section>
  </>;
}
