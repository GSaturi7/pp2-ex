# Perguntas de revisão

1. **Por que o fetch não fica no corpo do componente?**
   O corpo roda toda vez que o React renderiza. Se a busca atualiza o state, isso causa outra renderização e outra busca, podendo criar um ciclo. O `useEffect` permite controlar quando essa busca acontece.

2. **O que muda nas dependências do useEffect?**
   Com `[]`, o efeito roda na montagem. Com `[x]`, roda na montagem e quando `x` muda. Sem o array, roda depois de toda renderização. Em desenvolvimento, o StrictMode também faz um ciclo extra de montagem e limpeza para ajudar a encontrar problemas.

3. **O fetch lança erro em um 404 ou 500?**
   Não. Ele recebe a resposta normalmente. É preciso conferir `resposta.ok` (ou o status) e lançar um erro. Já uma falha de conexão pode rejeitar a Promise do fetch.

4. **Para que servem JSON.stringify e Content-Type?**
   `JSON.stringify` transforma o objeto em texto JSON, que vai no corpo da requisição. O cabeçalho `Content-Type: application/json` informa ao Express como ler esse texto. Sem converter, o objeto não é enviado como JSON válido. Sem o cabeçalho, o middleware não preenche o corpo como o backend espera; nesta API isso acaba causando 500.

5. **Por que o DELETE tem um caso especial?**
   O sucesso vem com status 204 e nenhum corpo. Chamar `.json()` tenta interpretar algo que não existe e gera erro, mesmo que a exclusão tenha funcionado.

6. **Por que criar outro array em vez de usar push?**
   `push` modifica o array existente. Com `setLivros(atual => [...atual, novo])`, o React recebe uma nova referência, e o estado anterior continua intacto. Para editar e remover, a mesma ideia aparece no `map` e no `filter`.

7. **Por que atualizar a tela só depois do sucesso da API?**
   Assim a lista não mostra uma alteração que o banco recusou. Se o título estiver vazio ou a conexão falhar, os dados anteriores continuam na tela e a mensagem explica o problema.

8. **Quem cria o id do livro?**
   O banco, usando o autoincremento. O backend devolve o livro criado no POST, já com esse id. O frontend adiciona esse objeto ao state e usa o id também como key.

## Troca de aba e SET NULL

As abas montam apenas um componente de cada vez. Ao voltar para Livros, o componente é montado novamente e busca livros e gêneros com `Promise.all`. Isso atualiza tanto os nomes na lista quanto as opções do select. Sem buscar de novo, poderia aparecer um gênero removido ou o nome antigo de um gênero renomeado.

Apagar um gênero não apaga os livros. A chave estrangeira opcional fica `NULL`, então o livro continua na lista e passa a aparecer como “Sem gênero”.

## Desafios escolhidos

- **D1 — Filtrar por gênero:** o select guarda apenas o filtro. A lista visível é calculada com `filter`, sem nova requisição. Incluí também a opção “Sem gênero”.
- **D2 — Busca por título:** o campo busca a cada tecla usando `toLowerCase().includes()`, junto com o filtro de gênero. A tela mostra quantos livros passaram pelo filtro e uma mensagem quando não há resultado.
