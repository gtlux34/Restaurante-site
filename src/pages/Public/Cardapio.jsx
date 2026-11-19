
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Cardapio() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarCardapio() {
      setCarregando(true);
      setErro("");

      const { data: categoriasData, error: categoriasError } =
        await supabase
          .from("categorias")
          .select("*")
          .order("id");

      const { data: produtosData, error: produtosError } =
        await supabase
          .from("produtos")
          .select("*")
          .eq("disponivel", true)
          .order("id");

      if (categoriasError || produtosError) {
        setErro(categoriasError?.message || produtosError?.message);
      } else {
        setCategorias(categoriasData || []);
        setProdutos(produtosData || []);
      }

      setCarregando(false);
    }

    carregarCardapio();
  }, []);

  if (carregando) {
    return <p>Carregando cardápio...</p>;
  }

  if (erro) {
    return <p>Erro ao carregar cardápio: {erro}</p>;
  }

  return (
    <>
      <header>
        <h1>Restaurante RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>
        </nav>
      </header>

      <main>
        <h2>Nosso Cardápio</h2>

        {categorias.map((categoria) => {
          const produtosDaCategoria = produtos.filter(
            (produto) =>
              Number(produto.categoria_id) === Number(categoria.id)
          );

          return (
            <section key={categoria.id}>
              <h3>{categoria.nome}</h3>

              {produtosDaCategoria.length === 0 ? (
                <p>Nenhum produto disponível nesta categoria.</p>
              ) : (
                produtosDaCategoria.map((produto) => (
                  <article key={produto.id}>
                    {produto.imagem && (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        width="180"
                      />
                    )}

                    <h4>{produto.nome}</h4>

                    <p>{produto.descricao}</p>

                    <p>
                      R${" "}
                      {Number(produto.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>

                    <a href={`/produto?id=${produto.id}`}>
                      <button type="button">
                        Ver detalhes
                      </button>
                    </a>
                  </article>
                ))
              )}
            </section>
          );
        })}
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Cardapio;
