
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { formatarMoeda } from "../../utils";
import "./Produto.css";

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
          quantidade,
        },
      ];
    }

    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    setMensagem("Produto adicionado ao carrinho com sucesso!");
  }

  if (carregando) {
    return (
      <div className="produto-carregando">
        <div className="produto-spinner"></div>
        <h2>CARREGANDO PRODUTO</h2>
        <p>Estamos preparando tudo para você.</p>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="produto-erro">
        <h1>PRODUTO NÃO ENCONTRADO</h1>
        <p>{erro}</p>
        <a href="/cardapio">VOLTAR AO CARDÁPIO</a>
      </div>
    );
  }

  return (
    <div className="produto-page">
      <header className="produto-header">
        <a href="/" className="produto-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>

        <nav className="produto-nav">
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>
          <a href="/minha-conta">Minha Conta</a>
        </nav>
      </header>

      <main className="produto-main">
        <div className="produto-caminho">
          <a href="/">INÍCIO</a>
          <span>/</span>
          <a href="/cardapio">CARDÁPIO</a>
          <span>/</span>
          <strong>{produto.nome}</strong>
        </div>

        <a href="/cardapio" className="produto-voltar">
          ← VOLTAR AO CARDÁPIO
        </a>

        <section className="produto-detalhes">
          <div className="produto-imagem-area">
            {produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="produto-imagem"
              />
            ) : (
              <div className="produto-imagem-vazia">
                <span>RANGO DOS GURI</span>
                <p>Imagem não disponível</p>
              </div>
            )}

            <div className="produto-imagem-etiqueta">
              FEITO COM SABOR
            </div>
          </div>

          <div className="produto-informacoes">
            <span className="produto-etiqueta">
              {categoria?.nome || "NOSSO CARDÁPIO"}
            </span>

            <h1>{produto.nome}</h1>

            <div className="produto-divisor"></div>

            <p className="produto-descricao">
              {produto.descricao ||
                "Uma delícia preparada especialmente para você."}
            </p>

            <div className="produto-preco-area">
              <span>PREÇO</span>
              <strong>{formatarMoeda(produto.preco)}</strong>
            </div>

            <div
              className={`produto-disponibilidade ${
                produto.disponivel ? "disponivel" : "indisponivel"
              }`}
            >
              <span className="produto-status-ponto"></span>
              {produto.disponivel
                ? "Disponível para pedido"
                : "Indisponível no momento"}
            </div>

            {produto.disponivel && (
              <>
                <div className="produto-quantidade">
                  <label htmlFor="quantidade">QUANTIDADE</label>

                  <div className="produto-quantidade-controle">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantidade((atual) => Math.max(1, atual - 1))
                      }
                    >
                      −
                    </button>

                    <input
                      id="quantidade"
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(event) =>
                        setQuantidade(
                          Math.max(1, Number(event.target.value) || 1)
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setQuantidade((atual) => atual + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="produto-adicionar"
                  onClick={adicionarAoCarrinho}
                >
                  ADICIONAR AO CARRINHO
                  <span>→</span>
                </button>
              </>
            )}

            {mensagem && (
              <div className="produto-mensagem-sucesso">
                {mensagem}
                <a href="/carrinho">IR PARA O CARRINHO →</a>
              </div>
            )}

            <div className="produto-observacao">
              <strong>RANGO DOS GURI</strong>
              <p>Seu próximo pedido favorito começa aqui.</p>
            </div>
          </div>
        </section>

        <section className="produto-chamada">
          <div>
            <span>AINDA COM FOME?</span>
            <h2>CONHEÇA MAIS DELÍCIAS!</h2>
          </div>

          <a href="/cardapio">EXPLORAR CARDÁPIO →</a>
        </section>
      </main>

      <footer className="produto-footer">
        <a href="/" className="produto-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>

        <p>© 2026 RANGO DOS GURI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Produto;
