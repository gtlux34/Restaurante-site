
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Mensagens() {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);

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
        <a href="/login">Sair</a>
      </nav>

      <main>
        <h2>Mensagens recebidas</h2>

        <p>
          Total de mensagens: <strong>{mensagens.length}</strong>
        </p>

        <button onClick={buscarMensagens} disabled={carregando}>
          {carregando ? "Carregando..." : "Atualizar mensagens"}
        </button>

        {erro && <p>{erro}</p>}

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
                    </button>

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
