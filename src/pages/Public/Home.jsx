
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { formatarMoeda } from "../../utils";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const [resultadoProdutos, resultadoCategorias] = await Promise.all([
        supabase
          .from("produtos")
          .select("*")
          .eq("disponivel", true)
          .order("id")
          .limit(4),

        supabase
          .from("categorias")
          .select("*")
          .order("id")
          .limit(4),
      ]);

      if (!resultadoProdutos.error) {
        setProdutos(resultadoProdutos.data || []);
      }

      if (!resultadoCategorias.error) {
        setCategorias(resultadoCategorias.data || []);
      }

      setCarregando(false);
    }

    carregarDados();
  }, []);

  // Verifica se existe um usuário logado
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuarioLogado(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuarioLogado(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <a href="/" className="home-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>

        <nav className="home-nav">
          <a href="/" className="ativo">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>

          {usuarioLogado ? (
            <a href="/minha-conta" className="home-login">
              Minha Conta
            </a>
          ) : (
            <a href="/login" className="home-login">
              Entrar
            </a>
          )}
        </nav>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-conteudo">
            <span className="home-etiqueta">
              ★ O SEU RESTAURANTE FAVORITO
            </span>

            <h1>
              BATEU A FOME?
              <br />
              <span>VEM PRO RANGO!</span>
            </h1>

            <p>
              Sabor de verdade, comida caprichada e aquele gostinho
              que dá vontade de pedir de novo.
            </p>

            <a href="/cardapio" className="home-botao">
              VER NOSSO CARDÁPIO <span>→</span>
            </a>

            <div className="home-frase">
              FEITO COM SABOR. SERVIDO COM CARINHO.
            </div>
          </div>

          <div className="home-hero-mascote">
            <img
              src="/mascote.png"
              alt="Mascote do RANGO DOS GURI"
            />
          </div>
        </section>

        <section className="home-produtos">
          <div className="home-titulo-secao">
            <div>
              <span className="home-subtitulo">ESCOLHAS DELICIOSAS</span>
              <h2>EM DESTAQUE</h2>
            </div>

            <a href="/cardapio">VER CARDÁPIO →</a>
          </div>

          {carregando ? (
            <p className="home-mensagem">Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="home-mensagem">
              Nenhum produto disponível no momento.
            </p>
          ) : (
            <div className="home-produtos-grid">
              {produtos.map((produto) => (
                <article className="home-produto-card" key={produto.id}>
                  <a
                    href={`/produto?id=${produto.id}`}
                    className="home-produto-imagem"
                  >
                    {produto.imagem ? (
                      <img src={produto.imagem} alt={produto.nome} />
                    ) : (
                      <div className="home-sem-imagem">RANGO!</div>
                    )}
                  </a>

                  <div className="home-produto-info">
                    <h3>{produto.nome}</h3>

                    <p>
                      {produto.descricao || "Uma delícia esperando por você!"}
                    </p>

                    <div className="home-produto-rodape">
                      <strong>{formatarMoeda(produto.preco)}</strong>
                      <a href={`/produto?id=${produto.id}`}>
                        Ver detalhes →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="home-categorias">
          <div className="home-titulo-secao">
            <div>
              <span className="home-subtitulo">TEM PRA TODO GOSTO</span>
              <h2>EXPLORE AS CATEGORIAS</h2>
            </div>
          </div>

          {categorias.length === 0 ? (
            <p className="home-mensagem">
              Confira todas as opções no nosso cardápio.
            </p>
          ) : (
            <div className="home-categorias-grid">
              {categorias.map((categoria) => (
                <a
                  href="/categorias"
                  className="home-categoria-card"
                  key={categoria.id}
                >
                  <h3>{categoria.nome}</h3>
                  <strong>CONFERIR →</strong>
                </a>
              ))}
            </div>
          )}

          <a href="/categorias" className="home-link-categorias">
            VER TODAS AS CATEGORIAS →
          </a>
        </section>

        <section className="home-chamada">
          <h2>JÁ ESCOLHEU O SEU RANGO DE HOJE?</h2>
          <p>Não passe vontade. Confira nosso cardápio!</p>
          <a href="/cardapio" className="home-botao">
            FAZER MEU PEDIDO →
          </a>
        </section>
      </main>

      <footer className="home-footer">
        <a href="/" className="home-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>
        <p>© 2026 RANGO DOS GURI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
