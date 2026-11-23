
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function ImagemProduto({ imagem, nome }) {
  const [erroImagem, setErroImagem] = useState(false);

  if (!imagem || erroImagem) {
    return (
      <div className="cardapio-imagem-vazia">
        <span>Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div className="cardapio-imagem-container">
      <img
        src={imagem}
        alt={nome}
        className="cardapio-imagem"
        loading="lazy"
        onError={() => setErroImagem(true)}
      />
    </div>
  );
}

function Cardapio() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Categoria escolhida na página de Categorias (ex.: /cardapio?categoria=2)
  const categoriaFiltro = new URLSearchParams(window.location.search).get(
    "categoria"
  );

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
    <div className="pagina-cardapio">
      <header>
        <h1>Restaurante RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>
        </nav>
      </header>

      <main className="cardapio-conteudo">
        <h2>Nosso Cardápio</h2>

        {categoriaFiltro && (
          <p>
            Mostrando apenas a categoria{" "}
            <strong>
              {categorias.find(
                (categoria) => String(categoria.id) === categoriaFiltro
              )?.nome || "selecionada"}
            </strong>
            . <a href="/cardapio">Ver cardápio completo</a>
          </p>
        )}

        {categorias
          .filter(
            (categoria) =>
              !categoriaFiltro || String(categoria.id) === categoriaFiltro
          )
          .map((categoria) => {
          const produtosDaCategoria = produtos.filter(
            (produto) =>
              Number(produto.categoria_id) === Number(categoria.id)
          );

          return (
            <section
              key={categoria.id}
              className="cardapio-categoria"
            >
              <h3>{categoria.nome}</h3>

              {produtosDaCategoria.length === 0 ? (
                <p>Nenhum produto disponível nesta categoria.</p>
              ) : (
                <div className="cardapio-grade">
                  {produtosDaCategoria.map((produto) => (
                    <article
                      key={produto.id}
                      className="cardapio-produto"
                    >
                      <ImagemProduto
                        imagem={produto.imagem}
                        nome={produto.nome}
                      />

                      <div className="cardapio-produto-info">
                        <h4>{produto.nome}</h4>

                        <p className="cardapio-descricao">
                          {produto.descricao}
                        </p>

                        <p className="cardapio-preco">
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
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </div>
  );
}

export default Cardapio;
