
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { sairConta } from "../../utils";

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setErro("Não foi possível carregar as categorias.");
      setCategorias([]);
    } else {
      setCategorias(data || []);
    }

    setCarregando(false);
  }

  async function salvarCategoria(event) {
    event.preventDefault();

    const nomeFormatado = nome.trim();

    if (!nomeFormatado) {
      setErro("Digite o nome da categoria.");
      return;
    }

    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      if (editando !== null) {
        const { error } = await supabase
          .from("categorias")
          .update({ nome: nomeFormatado })
          .eq("id", editando);

        if (error) throw error;

        setSucesso("Categoria atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from("categorias")
          .insert([{ nome: nomeFormatado }]);

        if (error) throw error;

        setSucesso("Categoria cadastrada com sucesso!");
      }

      cancelarEdicao();
      await carregarCategorias();
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível salvar a categoria.");
    } finally {
      setSalvando(false);
    }
  }

  function prepararEdicao(categoria) {
    setEditando(categoria.id);
    setNome(categoria.nome || "");
    setErro("");
    setSucesso("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditando(null);
    setNome("");
  }

  async function excluirCategoria(categoria) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a categoria "${categoria.nome}"?`
    );

    if (!confirmar) return;

    setExcluindo(categoria.id);
    setErro("");
    setSucesso("");

    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoria.id);

      if (error) throw error;

      setCategorias((anteriores) =>
        anteriores.filter((item) => item.id !== categoria.id)
      );

      if (editando === categoria.id) {
        cancelarEdicao();
      }

      setSucesso("Categoria excluída com sucesso!");
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível excluir. Verifique se existem produtos vinculados a esta categoria."
      );
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <>
      <header>
        <h1>Categorias - RANGO DOS GURI</h1>
        <a href="/admin">Voltar ao painel</a>
        <a href="/">Voltar para o site</a>
      </header>

      <nav>
        <a href="/admin">Painel</a>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias" className="ativo">Categorias</a>
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

      <main className="categorias-admin">
        <h2>Gerenciar Categorias</h2>
        <p>Cadastre e organize as categorias do cardápio.</p>

        {erro && (
          <p style={{ color: "#dc2626" }}>
            {erro}
          </p>
        )}

        {sucesso && (
          <p style={{ color: "#15803d" }}>
            {sucesso}
          </p>
        )}

        <section>
          <h3>
            {editando !== null
              ? "Editar categoria"
              : "Cadastrar nova categoria"}
          </h3>

          <form onSubmit={salvarCategoria}>
            <div>
              <label htmlFor="nome-categoria">
                Nome da categoria
              </label>

              <input
                id="nome-categoria"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Ex: Hambúrgueres"
                maxLength={100}
                required
              />
            </div>

            <div>
              <button type="submit" disabled={salvando}>
                {salvando
                  ? "Salvando..."
                  : editando !== null
                    ? "Salvar alterações"
                    : "Cadastrar categoria"}
              </button>

              {editando !== null && (
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h3>
            Categorias cadastradas ({categorias.length})
          </h3>

          <button
            type="button"
            onClick={carregarCategorias}
            disabled={carregando}
          >
            {carregando ? "Carregando..." : "Atualizar categorias"}
          </button>

          {carregando ? (
            <p>Carregando categorias...</p>
          ) : categorias.length === 0 ? (
            <p>Nenhuma categoria cadastrada.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table border="1" cellPadding="10" width="100%">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>{categoria.id}</td>
                      <td>{categoria.nome}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => prepararEdicao(categoria)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => excluirCategoria(categoria)}
                          disabled={excluindo === categoria.id}
                        >
                          {excluindo === categoria.id
                            ? "Excluindo..."
                            : "Excluir"}
                        </button>
                      </td>
                    </tr>
                  ))}
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

export default CategoriasAdmin;
