import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Genre } from './types';

interface Props {
  genero: Genre;
  onRenomear: (name: string) => Promise<boolean>;
  onRemover: () => Promise<boolean>;
}

export default function ItemGenero({ genero, onRenomear, onRemover }: Props) {
  const [editando, setEditando] = useState(false);
  const [name, setName] = useState(genero.name);
  const [ocupado, setOcupado] = useState(false);
  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setOcupado(true);
    try { if (await onRenomear(name)) setEditando(false); }
    finally { setOcupado(false); }
  }
  async function remover() {
    setOcupado(true);
    try { await onRemover(); } finally { setOcupado(false); }
  }
  return <li className="genero">
    {editando ? <form onSubmit={salvar} noValidate>
      <fieldset disabled={ocupado} className="linha">
        <label>Nome do gênero<input value={name} onChange={e => setName(e.target.value)} /></label>
        <button type="submit">Salvar</button><button type="button" onClick={() => setEditando(false)}>Cancelar</button>
      </fieldset>
    </form> : <>
      <span>{genero.name}</span><div className="acoes">
        <button disabled={ocupado} onClick={() => { setName(genero.name); setEditando(true); }}>Editar</button>
        <button className="remover" disabled={ocupado} onClick={remover}>Remover</button>
      </div>
    </>}
  </li>;
}
