
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
      <style>{`
        /* CATEGORIAS */

        .home-page .home-categorias {
          margin-top: 65px;
          padding: 38px;
          background: rgba(255, 255, 255, 0.55);
          border: 2px solid rgba(11, 11, 11, 0.12);
          border-radius: 20px;
        }

        .home-page .home-categorias .home-titulo-secao {
          margin-bottom: 28px;
        }

        .home-page .home-categorias-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .home-page .home-categoria-card {
          min-height: 135px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 15px;
          background: #ffffff;
          border: 2px solid #0b0b0b;
          border-radius: 13px;
          box-shadow: 5px 5px 0 #0b0b0b;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .home-page .home-categoria-card:hover {
          background: #0b0b0b;
          transform: translateY(-4px);
          box-shadow: 5px 8px 0 #e10600;
        }

        .home-page .home-categoria-card h3 {
          margin: 0;
          padding-left: 13px;
          border-left: 5px solid #ffd700;
          color: #e10600;
          font-family: 'Lilita One', sans-serif;
          font-size: 21px;
          line-height: 1.2;
        }

        .home-page .home-categoria-card strong {
          color: #555555;
          font-size: 11px;
          font-weight: 1000;
          letter-spacing: 0.7px;
        }

        .home-page .home-categoria-card:hover h3 {
          color: #ffd700;
        }

        .home-page .home-categoria-card:hover strong {
          color: #ffffff;
        }

        .home-page .home-link-categorias {
          width: fit-content;
          min-height: 45px;
          margin: 30px auto 0;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e10600;
          border: 2px solid #0b0b0b;
          border-radius: 8px;
          color: #ffffff !important;
          font-family: 'Lilita One', sans-serif;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition: 0.2s;
        }

        .home-page .home-link-categorias:hover {
          background: #ffd700;
          color: #0b0b0b !important;
          transform: translateY(-3px);
        }

        /* BANNER FINAL */

        .home-page .home-chamada {
          position: relative;
          margin-top: 65px;
          padding: 55px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #0b0b0b;
          border: 2px solid #0b0b0b;
          border-radius: 20px;
          box-shadow: 6px 6px 0 #e10600;
          overflow: hidden;
        }

        .home-page .home-chamada::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: #ffd700;
        }

        .home-page .home-chamada h2 {
          max-width: 750px;
          margin: 0;
          color: #ffd700;
          font-family: 'Lilita One', sans-serif;
          font-size: clamp(27px, 3vw, 38px);
          line-height: 1.2;
        }

        .home-page .home-chamada p {
          margin: 15px 0 25px;
          color: #e5e5e5;
          font-size: 15px;
          line-height: 1.6;
        }

        .home-page .home-chamada .home-botao {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 25px;
          background: #e10600;
          border: 2px solid #e10600;
          border-radius: 9px;
          color: #ffffff;
          font-family: 'Lilita One', sans-serif;
          font-size: 15px;
          text-decoration: none;
          transition: 0.2s;
        }

        .home-page .home-chamada .home-botao:hover {
          background: #ffd700;
          border-color: #ffd700;
          color: #0b0b0b;
          transform: translateY(-3px);
        }

        /* RESPONSIVIDADE */

        @media (max-width: 900px) {
          .home-page .home-categorias-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .home-page .home-categorias {
            padding: 25px 16px;
            margin-top: 50px;
          }

          .home-page .home-categorias-grid {
            gap: 14px;
          }

          .home-page .home-categoria-card {
            min-height: 110px;
            padding: 18px 13px;
          }

          .home-page .home-categoria-card h3 {
            font-size: 17px;
          }

          .home-page .home-chamada {
            margin-top: 45px;
            padding: 42px 20px;
          }

          .home-page .home-chamada h2 {
            font-size: 27px;
          }

          .home-page .home-chamada p {
            font-size: 14px;
          }
        }

        @media (max-width: 360px) {
          .home-page .home-categorias-grid {
            grid-template-columns: 1fr;
          }
        }

        /* PADRONIZAÇÃO DOS CARDS DE PRODUTOS */

        .home-page .home-produtos-grid {
          align-items: stretch;
        }

        .home-page .home-produto-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .home-page .home-produto-imagem {
          flex-shrink: 0;
        }

        .home-page .home-produto-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .home-page .home-produto-info h3 {
          min-height: 26px;
        }

        .home-page .home-produto-info > p {
          min-height: 42px;
          max-height: 42px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .home-page .home-produto-rodape {
          margin-top: auto;
          min-height: 42px;
          flex-shrink: 0;
          align-items: center;
        }
      `}</style>

      <header className="home-header">
        <a href="/" className="home-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>

        <nav className="home-nav">
          <a href="/" className="ativo">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/carrinho">Carrinho</a>
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
        {/* PARTE SUPERIOR ORIGINAL */}
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

        {/* CATEGORIAS REFORMULADAS */}
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

        {/* BANNER FINAL REFORMULADO */}
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
