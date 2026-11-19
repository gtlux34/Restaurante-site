
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(null);

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
    carregarDados();
  }, []);

  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function prepararEdicao(produto) {
    setEditando(produto.id);

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

  return (
    <>
      <header>
        <h1>Produtos - RANGO DOS GURI</h1>
        <a href="/admin">Voltar ao painel</a>
      </header>

      <nav>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
      </nav>

      <main>
        <h2>Gerenciar Produtos</h2>

        <h2 style={{ color: "red" }}>
          TESTE - NOVO PAINEL SUPABASE
        </h2>

        {erro && (
          <p style={{ color: "red" }}>
            {erro}
          </p>
        )}

        <section>
          <h3>{editando !== null ? "Editar produto" : "Cadastrar produto"}</h3>

          <form onSubmit={salvarProduto}>
            <p>
              <label>Nome do produto</label><br />
              <input
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                required
              />
            </p>

            <p>
              <label>Descrição</label><br />
              <textarea
                name="descricao"
                value={formulario.descricao}
                onChange={atualizarCampo}
                required
              />
            </p>

            <p>
              <label>Preço (R$)</label><br />
              <input
                type="number"
                name="preco"
                min="0"
                step="0.01"
                value={formulario.preco}
                onChange={atualizarCampo}
                required
              />
            </p>

            <p>
              <label>URL da imagem</label><br />
              <input
                type="url"
                name="imagem"
                value={formulario.imagem}
                onChange={atualizarCampo}
                placeholder="https://..."
              />
            </p>

            <p>
              <label>Categoria</label><br />
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
            </p>

            <p>
              <label>
                <input
                  type="checkbox"
                  name="disponivel"
                  checked={formulario.disponivel}
                  onChange={atualizarCampo}
                />
                Produto disponível
              </label>
            </p>

            <button type="submit" disabled={salvando}>
              {salvando
                ? "Salvando..."
                : editando !== null
                  ? "Salvar alterações"
                  : "Cadastrar produto"}
            </button>

            {editando !== null && (
              <button type="button" onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </form>
        </section>

        <section>
          <h3>Produtos cadastrados ({produtos.length})</h3>

          {carregando ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>ID</th>
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
                    (item) => Number(item.id) === Number(produto.categoria_id)
                  );

                  return (
                    <tr key={produto.id}>
                      <td>{produto.id}</td>
                      <td>{produto.nome}</td>
                      <td>{categoria?.nome || "Sem categoria"}</td>
                      <td>
                        R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                      </td>
                      <td>
                        {produto.disponivel ? "Disponível" : "Indisponível"}
                      </td>
                      <td>
                        <button onClick={() => prepararEdicao(produto)}>
                          Editar
                        </button>
                        <button onClick={() => excluirProduto(produto.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
