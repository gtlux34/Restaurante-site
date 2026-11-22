
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Carrinho() {
  const [itens, setItens] = useState([]);
  const [chaveCarrinho, setChaveCarrinho] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    function carregarCarrinho(user) {
      const chave = user
        ? `carrinho_${user.id}`
        : "carrinho_visitante";

      const salvos = localStorage.getItem(chave);

      setChaveCarrinho(chave);
      setItens(salvos ? JSON.parse(salvos) : []);
      setCarregando(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      carregarCarrinho(session?.user || null);
    });

    async function verificarUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      carregarCarrinho(user);
    }

    verificarUsuario();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function salvarCarrinho(novosItens) {
    setItens(novosItens);

    if (chaveCarrinho) {
      localStorage.setItem(
        chaveCarrinho,
        JSON.stringify(novosItens)
      );
    }
  }

  function alterarQuantidade(id, quantidade) {
    if (quantidade < 1) {
      removerProduto(id);
      return;
    }

    const novosItens = itens.map((item) =>
      item.id === id ? { ...item, quantidade } : item
    );

    salvarCarrinho(novosItens);
  }

  function removerProduto(id) {
    const novosItens = itens.filter((item) => item.id !== id);
    salvarCarrinho(novosItens);
  }

  const total = itens.reduce(
    (soma, item) => soma + Number(item.preco) * item.quantidade,
    0
  );

  if (carregando) {
    return <p>Carregando carrinho...</p>;
  }

  return (
    <>
      <header>
        <h1>RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/carrinho">Carrinho</a>
        </nav>
      </header>

      <main>
        <h2>Meu carrinho</h2>

        {itens.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            {itens.map((item) => (
              <article key={item.id}>
                <h3>{item.nome}</h3>

                <p>
                  Preço: R$ {Number(item.preco).toFixed(2).replace(".", ",")}
                </p>

                <label>
                  Quantidade:
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(event) =>
                      alterarQuantidade(item.id, Number(event.target.value))
                    }
                  />
                </label>

                <p>
                  Subtotal: R${" "}
                  {(Number(item.preco) * item.quantidade)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>

                <button onClick={() => removerProduto(item.id)}>
                  Remover
                </button>
              </article>
            ))}

            <h2>
              Total: R$ {total.toFixed(2).replace(".", ",")}
            </h2>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/finalizar-pedido";
              }}
            >
              Finalizar pedido
            </button>
          </>
        )}

        <p>
          <a href="/cardapio">Continuar comprando</a>
        </p>
      </main>

      <footer>
        <p>© 2026 RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Carrinho;
