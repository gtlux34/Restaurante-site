
import { useEffect, useState } from "react";
import { supabase, supabaseCadastro } from "../../supabase";
import { sairConta } from "../../utils";

const formularioVazio = {
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  endereco_casa: "",
};

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // Formulário de cadastro / edição
  const [formulario, setFormulario] = useState(formularioVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, telefone, endereco_casa, tipo")
      .eq("tipo", "cliente")
      .order("nome", { ascending: true });

    if (error) {
      console.error(error);
      setErro("Não foi possível carregar os clientes: " + error.message);
      setClientes([]);
    } else {
      setClientes(data || []);
    }

    setCarregando(false);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function prepararEdicao(cliente) {
    setEditandoId(cliente.id);
    setFormulario({
      ...formularioVazio,
      nome: cliente.nome || "",
      telefone: cliente.telefone || "",
      endereco_casa: cliente.endereco_casa || "",
    });
    setErro("");
    setSucesso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormulario(formularioVazio);
    setErro("");
  }

  async function salvarCliente(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    const nome = formulario.nome.trim();
    const telefone = formulario.telefone.trim();
    const enderecoCasa = formulario.endereco_casa.trim();

    if (!nome || !telefone) {
      setErro("Preencha o nome e o telefone do cliente.");
      return;
    }

    setSalvando(true);

    try {
      if (editandoId) {
        // Edita os dados do cliente
        const { data, error } = await supabase
          .from("usuarios")
          .update({ nome, telefone, endereco_casa: enderecoCasa })
          .eq("id", editandoId)
          .select();

        if (error) throw error;

        if (!data || data.length === 0) {
          throw new Error(
            "O banco não permitiu editar este cliente. Verifique as permissões (RLS) da tabela usuarios."
          );
        }

        setSucesso("Cliente atualizado com sucesso!");
      } else {
        // Cadastra um novo cliente (cria o login no Supabase Auth)
        const email = formulario.email.trim();

        if (!email || formulario.senha.length < 6) {
          throw new Error(
            "Informe o e-mail e uma senha com pelo menos 6 caracteres."
          );
        }

        const { data, error } = await supabaseCadastro.auth.signUp({
          email,
          password: formulario.senha,
          options: {
            data: { nome, telefone },
          },
        });

        if (error) throw error;

        // O Supabase devolve um usuário sem identidades quando o e-mail já existe
        if (!data.user || data.user.identities?.length === 0) {
          throw new Error("Já existe uma conta com este e-mail.");
        }

        // Salva o endereço, se informado
        if (enderecoCasa) {
          await supabase
            .from("usuarios")
            .update({ endereco_casa: enderecoCasa })
            .eq("id", data.user.id);
        }

        setSucesso(
          data.session
            ? "Cliente cadastrado com sucesso!"
            : "Cliente cadastrado! Ele precisa confirmar o e-mail antes de entrar."
        );
      }

      cancelarEdicao();
      await carregarClientes();
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível salvar o cliente.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirCliente(cliente) {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o cliente "${cliente.nome || cliente.id}"?\n\nEssa ação não poderá ser desfeita.`
    );

    if (!confirmar) return;

    setExcluindo(cliente.id);
    setErro("");
    setSucesso("");

    try {
      const { data, error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", cliente.id)
        .select();

      if (error) {
        // 23503 = o cliente ainda possui pedidos vinculados
        if (error.code === "23503") {
          throw new Error(
            "Este cliente possui pedidos vinculados. Exclua os pedidos dele antes."
          );
        }
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error(
          "O banco não permitiu excluir este cliente. Verifique as permissões (RLS) da tabela usuarios."
        );
      }

      setClientes((atuais) => atuais.filter((item) => item.id !== cliente.id));

      if (clienteSelecionado?.id === cliente.id) setClienteSelecionado(null);
      if (editandoId === cliente.id) cancelarEdicao();

      setSucesso("Cliente excluído com sucesso!");
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível excluir o cliente.");
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <>
      <header>
        <h1>Clientes - RANGO DOS GURI</h1>
        <a href="/admin">Voltar ao painel</a>
      </header>

      <nav>
        <a href="/admin">Painel</a>
        <a href="/admin/produtos">Produtos</a>
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

      <main>
        <h2>Gerenciar Clientes</h2>
        <p>Cadastre, visualize, edite e exclua os clientes do restaurante.</p>

        <section
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            margin: "20px 0",
            borderRadius: "8px",
          }}
        >
          <h3>{editandoId ? "Editar cliente" : "Cadastrar novo cliente"}</h3>

          <form onSubmit={salvarCliente}>
            <p>
              <label>Nome completo *</label>
              <br />
              <input
                type="text"
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                required
              />
            </p>

            {!editandoId && (
              <>
                <p>
                  <label>E-mail *</label>
                  <br />
                  <input
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={atualizarCampo}
                    required
                  />
                </p>

                <p>
                  <label>Senha inicial * (mínimo 6 caracteres)</label>
                  <br />
                  <input
                    type="password"
                    name="senha"
                    value={formulario.senha}
                    onChange={atualizarCampo}
                    minLength={6}
                    required
                  />
                </p>
              </>
            )}

            <p>
              <label>Telefone *</label>
              <br />
              <input
                type="tel"
                name="telefone"
                value={formulario.telefone}
                onChange={atualizarCampo}
                required
              />
            </p>

            <p>
              <label>Endereço</label>
              <br />
              <input
                type="text"
                name="endereco_casa"
                value={formulario.endereco_casa}
                onChange={atualizarCampo}
              />
            </p>

            <button type="submit" disabled={salvando}>
              {salvando
                ? "Salvando..."
                : editandoId
                  ? "Salvar alterações"
                  : "Cadastrar cliente"}
            </button>

            {editandoId && (
              <>
                {" "}
                <button type="button" onClick={cancelarEdicao}>
                  Cancelar edição
                </button>
              </>
            )}
          </form>
        </section>

        {erro && <p style={{ color: "#dc2626" }}>{erro}</p>}
        {sucesso && <p style={{ color: "#16a34a" }}>{sucesso}</p>}

        <h3>Total de clientes: {clientes.length}</h3>

        <button
          type="button"
          onClick={carregarClientes}
          disabled={carregando}
        >
          {carregando ? "Carregando..." : "Atualizar clientes"}
        </button>

        {carregando ? (
          <p>Carregando clientes...</p>
        ) : clientes.length === 0 ? (
          <p>Nenhum cliente cadastrado.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "20px" }}>
            <table border="1" cellPadding="10" width="100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nome || "Não informado"}</td>
                    <td>{cliente.telefone || "Não informado"}</td>
                    <td>{cliente.endereco_casa || "Não informado"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setClienteSelecionado(cliente)}
                      >
                        Visualizar
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => prepararEdicao(cliente)}
                      >
                        Editar
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => excluirCliente(cliente)}
                        disabled={excluindo === cliente.id}
                        style={{ backgroundColor: "#dc2626", color: "white" }}
                      >
                        {excluindo === cliente.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {clienteSelecionado && (
          <section
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginTop: "25px",
              borderRadius: "8px",
            }}
          >
            <h2>Detalhes do cliente</h2>

            <p><strong>ID:</strong> {clienteSelecionado.id}</p>
            <p><strong>Nome:</strong> {clienteSelecionado.nome || "Não informado"}</p>
            <p><strong>Telefone:</strong> {clienteSelecionado.telefone || "Não informado"}</p>
            <p><strong>Endereço:</strong> {clienteSelecionado.endereco_casa || "Não informado"}</p>
            <p><strong>Tipo de conta:</strong> {clienteSelecionado.tipo}</p>

            <button
              type="button"
              onClick={() => setClienteSelecionado(null)}
            >
              Fechar detalhes
            </button>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Clientes;
