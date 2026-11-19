
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Produto() {
  const [produto, setProduto] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    async function carregarProduto() {
      const parametros = new URLSearchParams(window.location.search);
      const id = parametros.get("id");

      if (!id) {
        setErro("Nenhum produto foi selecionado.");
        setCarregando(false);
        return;
      }

      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErro("Não foi possível encontrar este produto.");
        setCarregando(false);
        return;
      }

      setProduto(data);

      if (data.categoria_id) {
        const { data: categoriaData } = await supabase
          .from("categorias")
          .select("*")
          .eq("id", data.categoria_id)
          .single();

        setCategoria(categoriaData);
      }

      setCarregando(false);
    }

    carregarProduto();
  }, []);

  function adicionarAoCarrinho() {
    if (!produto || !produto.disponivel) return;

    const carrinhoAtual = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    const produtoExistente = carrinhoAtual.find(
      (item) => Number(item.id) === Number(produto.id)
    );

    let novoCarrinho;

    if (produtoExistente) {
      novoCarrinho = carrinhoAtual.map((item) =>
        Number(item.id) === Number(produto.id)
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      );
    } else {
      novoCarrinho = [
        ...carrinhoAtual,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagem,
          quantidade: quantidade,
        },
      ];
    }

    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

    setMensagem("Produto adicionado ao carrinho com sucesso!");
  }

  if (carregando) {
    return <main><p>Carregando produto...</p></main>;
  }

  if (erro || !produto) {
    return (
      <main>
        <h1>Produto não encontrado</h1>
        <p>{erro}</p>
        <a href="/cardapio">Voltar ao cardápio</a>
      </main>
    );
  }

  return (
    <>
      <header>
        <h1>RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/contato">Contato</a>
          <a href="/carrinho">Meu carrinho</a>
        </nav>
      </header>

      <main>
        <a href="/cardapio">← Voltar ao cardápio</a>

        <section>
          {produto.imagem && (
            <img
              src={produto.imagem}
              alt={produto.nome}
              style={{
                width: "100%",
                maxWidth: "450px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          )}

          <h1>{produto.nome}</h1>

          {categoria && <p>Categoria: {categoria.nome}</p>}

          <p>{produto.descricao}</p>

          <h2>
            R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
          </h2>

          <p>
            {produto.disponivel
              ? "Produto disponível"
              : "Produto indisponível no momento"}
          </p>

          {produto.disponivel && (
            <>
              <label>
                Quantidade:
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(event) =>
                    setQuantidade(
                      Math.max(1, Number(event.target.value) || 1)
                    )
                  }
                />
              </label>

              <p>
                <button type="button" onClick={adicionarAoCarrinho}>
                  Adicionar ao carrinho
                </button>
              </p>
            </>
          )}

          {mensagem && (
            <p style={{ color: "green" }}>{mensagem}</p>
          )}

          <p>
            <a href="/carrinho">Ir para o carrinho</a>
          </p>

          <a href="/cardapio">Ver outros produtos</a>
        </section>
      </main>

      <footer>
        <p>© 2026 RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Produto;
