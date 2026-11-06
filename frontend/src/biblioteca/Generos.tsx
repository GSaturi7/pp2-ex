import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Genre } from './types';
import { listarGeneros, criarGenero, atualizarGenero, removerGenero } from './api';
import ItemGenero from './ItemGenero';

export default function Generos() {
  const [generos, setGeneros] = useState<Genre[]>([]);
  const [name, setName] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  useEffect(() => {
    let ativo = true;
    listarGeneros().then(lista => { if (ativo) setGeneros(lista); })
      .catch((e: Error) => { if (ativo) setErro(e.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);
  async function executar(acao: () => Promise<void>) {
    setErro(null);
    try { await acao(); return true; }
    catch (e) { setErro((e as Error).message); return false; }
  }
  async function criar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setEnviando(true);
    try {
      const ok = await executar(async () => {
        const novo = await criarGenero(name);
        setGeneros(atual => [...atual, novo]);
      });
      if (ok) setName('');
    } finally { setEnviando(false); }
  }
  function renomear(id: number, nome: string) {
    return executar(async () => {
      const novo = await atualizarGenero(id, nome);
      setGeneros(atual => atual.map(g => g.id === id ? novo : g));
    });
  }
  function remover(id: number) {
    return executar(async () => {
      await removerGenero(id);
      setGeneros(atual => atual.filter(g => g.id !== id));
    });
  }
  if (carregando) return <p role="status">Carregando...</p>;
  return <section className="painel">
    <h2>Gêneros</h2>
    <p className="muted">Organize os livros por gênero. Ao remover um gênero, os livros são mantidos.</p>
    <form onSubmit={criar} noValidate>
      <fieldset className="linha" disabled={enviando}>
        <label>Novo gênero<input value={name} onChange={e => setName(e.target.value)} /></label>
        <button type="submit" className="principal">{enviando ? 'Adicionando...' : 'Adicionar gênero'}</button>
      </fieldset>
    </form>
    {erro && <p role="alert" className="erro">Erro: {erro}</p>}
    {!generos.length ? <p>Nenhum gênero.</p> : <ul className="lista">{generos.map(g => <ItemGenero key={g.id} genero={g} onRenomear={nome => renomear(g.id, nome)} onRemover={() => remover(g.id)} />)}</ul>}
  </section>;
}
