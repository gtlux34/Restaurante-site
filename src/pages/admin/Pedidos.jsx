
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { formatarMoeda } from "../../utils";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [atualizando, setAtualizando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);

  const statusDisponiveis = [
    "Pendente",
    "Em preparo",
    "Saiu para entrega",
    "Entregue",
  ];

  async function carregarPedidos() {
    setCarregando(true);
    setErro("");

    try {
      const { data: pedidosData, error: pedidosError } =
        await supabase
          .from("pedidos")
          .select("*")
          .order("created_at", { ascending: false });

      if (pedidosError) throw pedidosError;

      const { data: itensData, error: itensError } =
        await supabase
          .from("itens_pedido")
          .select("*");

      if (itensError) throw itensError;

      const pedidosComItens = pedidosData.map((pedido) => ({
        ...pedido,
        itens: itensData.filter(
          (item) =>
            String(item.pedido_id) === String(pedido.id)
        ),
      }));

      setPedidos(pedidosComItens);
    } catch (error) {
      console.error(error);
      setErro(error.message || "Erro ao carregar pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function alterarStatus(pedidoId, novoStatus) {
    setAtualizando(pedidoId);
    setErro("");

    try {
      const { error } = await supabase
        .from("pedidos")
        .update({ status: novoStatus })
        .eq("id", pedidoId);

      if (error) throw error;

      setPedidos((anteriores) =>
        anteriores.map((pedido) =>
          pedido.id === pedidoId
            ? { ...pedido, status: novoStatus }
            : pedido
        )
      );
    } catch (error) {
      setErro(error.message || "Erro ao atualizar status.");
    } finally {
      setAtualizando(null);
    }
  }

  async function excluirPedido(pedido) {
    const confirmar = window.confirm(
      `Tem certeza que deseja apagar o pedido #${pedido.id}?\n\nEssa ação não poderá ser desfeita.`
    );

    if (!confirmar) return;

    setExcluindo(pedido.id);
    setErro("");

    try {
      // Primeiro apaga os produtos vinculados ao pedido
      const { error: itensError } = await supabase
        .from("itens_pedido")
        .delete()
        .eq("pedido_id", pedido.id);

      if (itensError) throw itensError;

      // Depois apaga o pedido
      const { error: pedidoError } = await supabase
        .from("pedidos")
        .delete()
        .eq("id", pedido.id);

      if (pedidoError) throw pedidoError;

      // Atualiza a lista na tela
      setPedidos((anteriores) =>
        anteriores.filter((item) => item.id !== pedido.id)
      );

      if (pedidoAberto === pedido.id) {
        setPedidoAberto(null);
      }

      alert(`Pedido #${pedido.id} apagado com sucesso!`);
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      setErro(error.message || "Não foi possível apagar o pedido.");
    } finally {
      setExcluindo(null);
    }
  }

  function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  }

  function corStatus(status) {
    const valor = (status || "").toLowerCase();

    if (valor === "pendente") return "#d97706";
    if (valor === "em preparo") return "#2563eb";
    if (valor === "saiu para entrega") return "#9333ea";
    if (valor === "entregue") return "#16a34a";
    if (valor === "cancelado") return "#dc2626";

    return "#555";
  }

  return (
    <>
      <header>
        <h1>Pedidos</h1>
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
        <h2>Gerenciar Pedidos</h2>

        <button onClick={carregarPedidos} disabled={carregando}>
          {carregando ? "Carregando..." : "Atualizar pedidos"}
        </button>

        {carregando && <p>Carregando pedidos...</p>}

        {erro && (
          <p style={{ color: "red" }}>
            Erro: {erro}
          </p>
        )}

        {!carregando && !erro && pedidos.length === 0 && (
          <p>Nenhum pedido encontrado.</p>
        )}

        {!carregando && pedidos.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: "15px" }}>
            <table border="1" cellPadding="10" width="100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>{pedido.nome_cliente}</td>
                    <td>{formatarData(pedido.created_at)}</td>

                    <td>
                      {formatarMoeda(
                        pedido.valor_total ?? pedido.total
                      )}
                    </td>

                    <td>
                      <select
                        value={
                          statusDisponiveis.find(
                            (status) =>
                              status.toLowerCase() ===
                              (pedido.status || "").toLowerCase()
                          ) || "Pendente"
                        }
                        disabled={atualizando === pedido.id}
                        onChange={(e) =>
                          alterarStatus(pedido.id, e.target.value)
                        }
                        style={{
                          padding: "8px",
                          fontWeight: "bold",
                          color: corStatus(pedido.status),
                        }}
                      >
                        {statusDisponiveis.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          setPedidoAberto(
                            pedidoAberto === pedido.id
                              ? null
                              : pedido.id
                          )
                        }
                      >
                        {pedidoAberto === pedido.id
                          ? "Fechar"
                          : "Visualizar"}
                      </button>

                      {" "}

                      <button
                        onClick={() => excluirPedido(pedido)}
                        disabled={excluindo === pedido.id}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          padding: "8px",
                          cursor: "pointer",
                        }}
                      >
                        {excluindo === pedido.id
                          ? "Apagando..."
                          : "Apagar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pedidos.map((pedido) =>
          pedidoAberto === pedido.id ? (
            <section
              key={pedido.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginTop: "20px",
              }}
            >
              <h2>Detalhes do pedido #{pedido.id}</h2>

              <p>
                <strong>Cliente:</strong> {pedido.nome_cliente}
              </p>

              <p>
                <strong>Telefone:</strong> {pedido.telefone}
              </p>

              <p>
                <strong>Endereço:</strong> {pedido.endereco}
              </p>

              <p>
                <strong>Observação:</strong>{" "}
                {pedido.observacao || "Nenhuma"}
              </p>

              <h3>Produtos</h3>

              {pedido.itens.length === 0 ? (
                <p>Nenhum produto encontrado neste pedido.</p>
              ) : (
                pedido.itens.map((item) => (
                  <div key={item.id}>
                    <p>
                      {item.nome_produto} — {item.quantidade}x
                      {" — "}
                      {formatarMoeda(item.subtotal)}
                    </p>
                  </div>
                ))
              )}

              <h3>
                Total:{" "}
                {formatarMoeda(
                  pedido.valor_total ?? pedido.total
                )}
              </h3>

              <h3>Atualizar andamento</h3>

              <select
                value={
                  statusDisponiveis.find(
                    (status) =>
                      status.toLowerCase() ===
                      (pedido.status || "").toLowerCase()
                  ) || "Pendente"
                }
                disabled={atualizando === pedido.id}
                onChange={(e) =>
                  alterarStatus(pedido.id, e.target.value)
                }
                style={{ padding: "10px" }}
              >
                {statusDisponiveis.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <p>
                <button
                  onClick={() => excluirPedido(pedido)}
                  disabled={excluindo === pedido.id}
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                    padding: "10px",
                  }}
                >
                  {excluindo === pedido.id
                    ? "Apagando..."
                    : "Apagar este pedido"}
                </button>
              </p>
            </section>
          ) : null
        )}
      </main>

      <footer>
        <p>© 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Pedidos;
