
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Categorias() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuarioLogado(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuarioLogado(!!session);
    });

    // Busca as categorias cadastradas no painel e quantos produtos cada uma tem
    async function carregarCategorias() {
      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("id, nome")
        .order("nome");

      const { data: produtosData, error: produtosError } = await supabase
        .from("produtos")
        .select("categoria_id")
        .eq("disponivel", true);

      if (categoriasError || produtosError) {
        console.error(categoriasError || produtosError);
        setErro("Não foi possível carregar as categorias.");
      } else {
        setCategorias(
          (categoriasData || []).map((categoria) => ({
            ...categoria,
            totalProdutos: (produtosData || []).filter(
              (produto) =>
                Number(produto.categoria_id) === Number(categoria.id)
            ).length,
          }))
        );
      }

      setCarregando(false);
    }

    carregarCategorias();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <header>
        <h1>Restaurante RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>

          {!usuarioLogado && <a href="/login">Entrar</a>}
        </nav>
      </header>

      <main>
        <h2>Categorias</h2>

        {carregando ? (
          <p>Carregando categorias...</p>
        ) : erro ? (
          <p>{erro}</p>
        ) : categorias.length === 0 ? (
          <p>Nenhuma categoria cadastrada.</p>
        ) : (
          categorias.map((categoria) => (
            <section key={categoria.id}>
              <h3>{categoria.nome}</h3>
              <p>
                {categoria.totalProdutos === 1
                  ? "1 produto disponível"
                  : `${categoria.totalProdutos} produtos disponíveis`}
              </p>
              <a href={`/cardapio?categoria=${categoria.id}`}>
                Ver {categoria.nome.toLowerCase()}
              </a>
            </section>
          ))
        )}
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Categorias;
