
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { sairConta } from "../../utils";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(null);
  const [imagemErro, setImagemErro] = useState(false);

  const formularioInicial = {
    nome: "",
    descricao: "",
    preco: "",
    imagem: "",
    categoria_id: "",
    disponivel: true,
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    const [produtosResponse, categoriasResponse] = await Promise.all([
      supabase.from("produtos").select("*").order("id"),
      supabase.from("categorias").select("*").order("id"),
    ]);

    if (produtosResponse.error) {
      setErro("Erro nos produtos: " + produtosResponse.error.message);
    } else if (categoriasResponse.error) {
      setErro("Erro nas categorias: " + categoriasResponse.error.message);
    } else {
      setProdutos(produtosResponse.data || []);
      setCategorias(categoriasResponse.data || []);
    }

    setCarregando(false);
  }

  useEffect(() => {
    // Aplica o mesmo fundo bege das outras páginas
    const fundoAnterior = {
      cor: document.body.style.backgroundColor,
      imagem: document.body.style.backgroundImage,
      tamanho: document.body.style.backgroundSize,
    };

    document.body.style.backgroundColor = "#f4e7c1";
    document.body.style.backgroundImage =
      "radial-gradient(rgba(107, 63, 29, 0.09) 1.2px, transparent 1.2px)";
    document.body.style.backgroundSize = "22px 22px";

    carregarDados();

    return () => {
      document.body.style.backgroundColor = fundoAnterior.cor;
      document.body.style.backgroundImage = fundoAnterior.imagem;
      document.body.style.backgroundSize = fundoAnterior.tamanho;
    };
  }, []);

  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;

    if (name === "imagem") {
      setImagemErro(false);
    }

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function prepararEdicao(produto) {
    setEditando(produto.id);
    setImagemErro(false);

    setFormulario({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      preco: produto.preco ?? "",
      imagem: produto.imagem || "",
      categoria_id: produto.categoria_id ?? "",
      disponivel: produto.disponivel ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditando(null);
    setFormulario({ ...formularioInicial });
    setImagemErro(false);
  }

  async function salvarProduto(event) {
    event.preventDefault();

    setSalvando(true);
    setErro("");

    const dados = {
      nome: formulario.nome.trim(),
      descricao: formulario.descricao.trim(),
      preco: Number(formulario.preco),
      imagem: formulario.imagem.trim() || null,
      categoria_id: Number(formulario.categoria_id),
      disponivel: formulario.disponivel,
    };

    const resposta =
      editando !== null
        ? await supabase.from("produtos").update(dados).eq("id", editando)
        : await supabase.from("produtos").insert([dados]);

    if (resposta.error) {
      setErro(resposta.error.message);
    } else {
      cancelarEdicao();
      await carregarDados();
    }

    setSalvando(false);
  }

  async function excluirProduto(id) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;

    setErro("");

    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      setErro(error.message);
    } else {
      await carregarDados();
    }
  }

  const imagemValida =
    formulario.imagem.trim().startsWith("https://") ||
    formulario.imagem.trim().startsWith("http://");

  return (
    <>
      <header>
        <h1>Produtos - RANGO DOS GURI</h1>
        <a href="/">Voltar para o site</a>
      </header>

      <nav>
        <a href="/admin">Painel</a>
        <a href="/admin/produtos" className="ativo">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
        <a href="/admin/minha-conta">Minha Conta</a>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            sairConta();
          }}
        >
          Sair
        </a>
      </nav>

      <main className="produtos-admin" style={{ backgroundColor: "transparent" }}>
        <h2>Gerenciar Produtos</h2>
        <p>Cadastre e organize os produtos do seu cardápio.</p>

        {erro && (
          <div className="produto-mensagem-erro">
            {erro}
          </div>
        )}

        <section className="produto-formulario">
          <h3>
            {editando !== null ? "Editar produto" : "Cadastrar novo produto"}
          </h3>

          <form onSubmit={salvarProduto}>
            <div className="produto-campo">
              <label>Nome do produto</label>
              <input
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder="Ex: X-RANGO"
                required
              />
            </div>

            <div className="produto-campo">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={formulario.descricao}
                onChange={atualizarCampo}
                placeholder="Descreva os ingredientes e detalhes do produto..."
                required
              />
            </div>

            <div className="produto-campo">
              <label>Preço (R$)</label>
              <input
                type="number"
                name="preco"
                min="0"
                step="0.01"
                value={formulario.preco}
                onChange={atualizarCampo}
                placeholder="Ex: 29.90"
                required
              />
            </div>

            <div className="produto-campo">
              <label>URL da imagem</label>
              <input
                type="url"
                name="imagem"
                value={formulario.imagem}
                onChange={atualizarCampo}
                placeholder="Cole aqui o endereço da imagem (https://...)"
              />
              <small>
                Cole o link direto de uma imagem para visualizar a prévia.
              </small>
            </div>

            <div className="produto-preview">
              <div className="produto-preview-topo">
                <strong>Pré-visualização da imagem</strong>
                <span>PRÉVIA</span>
              </div>

              {imagemValida && !imagemErro ? (
                <img
                  src={formulario.imagem.trim()}
                  alt="Prévia do produto"
                  onError={() => setImagemErro(true)}
                />
              ) : (
                <div className="produto-preview-vazio">
                  {imagemErro ? (
                    <>
                      <span>⚠️</span>
                      <p>Não foi possível carregar esta imagem.</p>
                      <small>Confira se o link está correto.</small>
                    </>
                  ) : (
                    <>
                      <span>🍔</span>
                      <p>A imagem do produto aparecerá aqui</p>
                      <small>Adicione uma URL acima</small>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="produto-campo">
              <label>Categoria</label>
              <select
                name="categoria_id"
                value={formulario.categoria_id}
                onChange={atualizarCampo}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <label className="produto-disponivel">
              <input
                type="checkbox"
                name="disponivel"
                checked={formulario.disponivel}
                onChange={atualizarCampo}
              />
              Produto disponível para venda
            </label>

            <div className="produto-botoes">
              <button type="submit" disabled={salvando}>
                {salvando
                  ? "Salvando..."
                  : editando !== null
                    ? "Salvar alterações"
                    : "Cadastrar produto"}
              </button>

              {editando !== null && (
                <button
                  type="button"
                  className="produto-btn-cancelar"
                  onClick={cancelarEdicao}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="produto-lista">
          <h3>Produtos cadastrados ({produtos.length})</h3>

          {carregando ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <div className="produto-tabela-container">
              <table className="produto-tabela">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Disponibilidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {produtos.map((produto) => {
                    const categoria = categorias.find(
                      (item) =>
                        Number(item.id) === Number(produto.categoria_id)
                    );

                    return (
                      <tr key={produto.id}>
                        <td>
                          {produto.imagem ? (
                            <img
                              className="produto-miniatura"
                              src={produto.imagem}
                              alt={produto.nome}
                            />
                          ) : (
                            <span>🍔</span>
                          )}
                        </td>

                        <td>{produto.nome}</td>
                        <td>{categoria?.nome || "Sem categoria"}</td>

                        <td>
                          R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                        </td>

                        <td>
                          <span
                            className={
                              produto.disponivel
                                ? "produto-status disponivel"
                                : "produto-status indisponivel"
                            }
                          >
                            {produto.disponivel
                              ? "Disponível"
                              : "Indisponível"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="produto-btn-editar"
                            onClick={() => prepararEdicao(produto)}
                          >
                            Editar
                          </button>

                          <button
                            className="produto-btn-excluir"
                            onClick={() => excluirProduto(produto.id)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Produtos;
