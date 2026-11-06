import { useState } from 'react';
import Livros from './biblioteca/Livros';
import Generos from './biblioteca/Generos';

export default function App() {
  const [aba, setAba] = useState('livros');
  return (
    <main>
      <header><p className="subtitulo">PARADIGMAS DE PROGRAMAÇÃO II</p><h1>Minha biblioteca</h1><p>Livros que quero ler e histórias que já conheci.</p></header>
      <nav aria-label="Seções da biblioteca">
        <button aria-pressed={aba === 'livros'} onClick={() => setAba('livros')}>Livros</button>
        <button aria-pressed={aba === 'generos'} onClick={() => setAba('generos')}>Gêneros</button>
      </nav>
      {aba === 'livros' ? <Livros /> : <Generos />}
    </main>
  );
}
