
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { sairConta } from "../../utils";

const formularioVazio = { nome: "", email: "", mensagem: "" };

function Mensagens() {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);

  // Formulário de cadastro / edição
  const [formulario, setFormulario] = useState(formularioVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarMensagens();
  }, []);

  async function buscarMensagens() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("mensagens")
      .select("id, nome, email, mensagem, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErro("Não foi possível carregar as mensagens.");
    } else {
      setMensagens(data || []);
    }

    setCarregando(false);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function prepararEdicao(item) {
    setEditandoId(item.id);
    setFormulario({
      nome: item.nome || "",
      email: item.email || "",
      mensagem: item.mensagem || "",
    });
    setErro("");
    setSucesso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormulario(formularioVazio);
  }

  async function salvarMensagem(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    const dados = {
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
      mensagem: formulario.mensagem.trim(),
    };

    if (!dados.nome || !dados.email || !dados.mensagem) {
      setErro("Preencha nome, e-mail e mensagem.");
      return;
    }

    setSalvando(true);

    try {
      if (editandoId) {
        const { data, error } = await supabase
          .from("mensagens")
          .update(dados)
          .eq("id", editandoId)
          .select();

        if (error) throw error;

        if (!data || data.length === 0) {
          throw new Error(
            "O banco não permitiu editar esta mensagem. Verifique as permissões (RLS) da tabela mensagens."
          );
        }

        setMensagens((atuais) =>
          atuais.map((item) => (item.id === editandoId ? data[0] : item))
        );

        if (mensagemSelecionada?.id === editandoId) {
          setMensagemSelecionada(data[0]);
        }

        setSucesso("Mensagem atualizada com sucesso!");
      } else {
        // Registra uma mensagem recebida por outro canal (telefone, balcão...)
        const { error } = await supabase.from("mensagens").insert([dados]);

        if (error) throw error;

        setSucesso("Mensagem cadastrada com sucesso!");
        await buscarMensagens();
      }

      cancelarEdicao();
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível salvar a mensagem.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirMensagem(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta mensagem?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("mensagens")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Não foi possível excluir a mensagem.");
      return;
    }

    setMensagens((atuais) =>
      atuais.filter((mensagem) => mensagem.id !== id)
    );

    if (mensagemSelecionada?.id === id) {
      setMensagemSelecionada(null);
    }

    if (editandoId === id) {
      cancelarEdicao();
    }
  }

  function formatarData(data) {
    if (!data) return "Data não disponível";

    return new Date(data).toLocaleString("pt-BR");
  }

  return (
    <>
      <header>
        <h1>Mensagens</h1>
        <a href="/admin">Voltar ao painel</a>
      </header>

      <nav>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
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
        <h2>Mensagens recebidas</h2>

        <section>
          <h3>{editandoId ? "Editar mensagem" : "Cadastrar mensagem"}</h3>

          {!editandoId && (
            <p>
              Use para registrar mensagens recebidas por telefone, WhatsApp ou
              no balcão.
            </p>
          )}

          <form onSubmit={salvarMensagem}>
            <p>
              <label>Nome *</label>
              <br />
              <input
                type="text"
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                required
              />
            </p>

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
              <label>Mensagem *</label>
              <br />
              <textarea
                name="mensagem"
                value={formulario.mensagem}
                onChange={atualizarCampo}
                rows={4}
                required
              />
            </p>

            <button type="submit" disabled={salvando}>
              {salvando
                ? "Salvando..."
                : editandoId
                  ? "Salvar alterações"
                  : "Cadastrar mensagem"}
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

        <p>
          Total de mensagens: <strong>{mensagens.length}</strong>
        </p>

        <button onClick={buscarMensagens} disabled={carregando}>
          {carregando ? "Carregando..." : "Atualizar mensagens"}
        </button>

        {carregando ? (
          <p>Carregando mensagens...</p>
        ) : mensagens.length === 0 ? (
          <p>Nenhuma mensagem recebida.</p>
        ) : (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {mensagens.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.email}</td>
                  <td>{formatarData(item.created_at)}</td>
                  <td>
                    <button
                      onClick={() => setMensagemSelecionada(item)}
                    >
                      Visualizar
                    </button>{" "}
                    <button onClick={() => prepararEdicao(item)}>
                      Editar
                    </button>{" "}
                    <button onClick={() => excluirMensagem(item.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {mensagemSelecionada && (
          <section>
            <h2>Detalhes da mensagem</h2>

            <p>
              <strong>Nome:</strong> {mensagemSelecionada.nome}
            </p>

            <p>
              <strong>E-mail:</strong> {mensagemSelecionada.email}
            </p>

            <p>
              <strong>Data:</strong>{" "}
              {formatarData(mensagemSelecionada.created_at)}
            </p>

            <p>
              <strong>Mensagem:</strong>
            </p>

            <p>{mensagemSelecionada.mensagem}</p>

            <button onClick={() => setMensagemSelecionada(null)}>
              Fechar
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

export default Mensagens;
