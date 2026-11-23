
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { formatarMoeda, sairConta } from "../../utils";

const novoPedidoVazio = {
  nome_cliente: "",
  telefone: "",
  endereco: "",
  observacao: "",
};

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [atualizando, setAtualizando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [sucesso, setSucesso] = useState("");

  // Cadastro de pedido pelo administrador
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [mostrandoNovo, setMostrandoNovo] = useState(false);
  const [novoPedido, setNovoPedido] = useState(novoPedidoVazio);
  const [itensNovo, setItensNovo] = useState([]);
  const [produtoEscolhido, setProdutoEscolhido] = useState("");
  const [quantidadeEscolhida, setQuantidadeEscolhida] = useState(1);
  const [criando, setCriando] = useState(false);

  // Edição dos dados de um pedido
  const [edicao, setEdicao] = useState(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

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

    // Produtos que o admin pode escolher ao cadastrar um pedido
    async function carregarProdutos() {
      const { data, error } = await supabase
        .from("produtos")
        .select("id, nome, preco")
        .eq("disponivel", true)
        .order("nome");

      if (error) {
        console.error("Erro ao carregar produtos:", error);
        return;
      }

      setProdutosDisponiveis(data || []);
    }

    carregarProdutos();
  }, []);

  function atualizarNovoPedido(event) {
    const { name, value } = event.target;
    setNovoPedido((atual) => ({ ...atual, [name]: value }));
  }

  function adicionarItemNovo() {
    const produto = produtosDisponiveis.find(
      (item) => String(item.id) === String(produtoEscolhido)
    );
    const quantidade = Number(quantidadeEscolhida);

    if (!produto || !quantidade || quantidade < 1) return;

    setItensNovo((atuais) => {
      const existente = atuais.find((item) => item.id === produto.id);

      if (existente) {
        return atuais.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }

      return [...atuais, { ...produto, quantidade }];
    });

    setProdutoEscolhido("");
    setQuantidadeEscolhida(1);
  }

  function removerItemNovo(id) {
    setItensNovo((atuais) => atuais.filter((item) => item.id !== id));
  }

  const totalNovo = itensNovo.reduce(
    (soma, item) => soma + Number(item.preco) * item.quantidade,
    0
  );

  function fecharNovoPedido() {
    setMostrandoNovo(false);
    setNovoPedido(novoPedidoVazio);
    setItensNovo([]);
    setProdutoEscolhido("");
    setQuantidadeEscolhida(1);
  }

  async function cadastrarPedido(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (
      !novoPedido.nome_cliente.trim() ||
      !novoPedido.telefone.trim() ||
      !novoPedido.endereco.trim()
    ) {
      setErro("Preencha cliente, telefone e endereço do pedido.");
      return;
    }

    if (itensNovo.length === 0) {
      setErro("Adicione pelo menos um produto ao pedido.");
      return;
    }

    setCriando(true);

    try {
      // Usa a mesma função do banco usada pelo site do cliente,
      // que calcula os preços no servidor.
      const { data, error } = await supabase.rpc("criar_pedido", {
        p_nome_cliente: novoPedido.nome_cliente.trim(),
        p_telefone: novoPedido.telefone.trim(),
        p_endereco: novoPedido.endereco.trim(),
        p_observacao: novoPedido.observacao.trim(),
        p_itens: itensNovo.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantidade,
        })),
      });

      if (error) throw error;

      setSucesso(`Pedido #${data} cadastrado com sucesso!`);
      fecharNovoPedido();
      await carregarPedidos();
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
      setErro(error.message || "Não foi possível cadastrar o pedido.");
    } finally {
      setCriando(false);
    }
  }

  function abrirEdicao(pedido) {
    setEdicao({
      id: pedido.id,
      nome_cliente: pedido.nome_cliente || "",
      telefone: pedido.telefone || "",
      endereco: pedido.endereco || "",
      observacao: pedido.observacao || "",
    });
    setErro("");
    setSucesso("");
  }

  function atualizarEdicao(event) {
    const { name, value } = event.target;
    setEdicao((atual) => ({ ...atual, [name]: value }));
  }

  async function salvarEdicao(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    const dados = {
      nome_cliente: edicao.nome_cliente.trim(),
      telefone: edicao.telefone.trim(),
      endereco: edicao.endereco.trim(),
      observacao: edicao.observacao.trim(),
    };

    if (!dados.nome_cliente || !dados.telefone || !dados.endereco) {
      setErro("Cliente, telefone e endereço são obrigatórios.");
      return;
    }

    setSalvandoEdicao(true);

    try {
      const { data, error } = await supabase
        .from("pedidos")
        .update(dados)
        .eq("id", edicao.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "O banco não permitiu editar este pedido. Verifique as permissões (RLS) da tabela pedidos."
        );
      }

      setPedidos((anteriores) =>
        anteriores.map((pedido) =>
          pedido.id === edicao.id ? { ...pedido, ...dados } : pedido
        )
      );

      setSucesso(`Pedido #${edicao.id} atualizado com sucesso!`);
      setEdicao(null);
    } catch (error) {
      console.error("Erro ao editar pedido:", error);
      setErro(error.message || "Não foi possível editar o pedido.");
    } finally {
      setSalvandoEdicao(false);
    }
  }

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
        <h2>Gerenciar Pedidos</h2>

        <button onClick={carregarPedidos} disabled={carregando}>
          {carregando ? "Carregando..." : "Atualizar pedidos"}
        </button>{" "}
        <button
          onClick={() =>
            mostrandoNovo ? fecharNovoPedido() : setMostrandoNovo(true)
          }
        >
          {mostrandoNovo ? "Cancelar novo pedido" : "Cadastrar novo pedido"}
        </button>

        {sucesso && <p style={{ color: "#16a34a" }}>{sucesso}</p>}

        {mostrandoNovo && (
          <section
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginTop: "20px",
            }}
          >
            <h3>Novo pedido</h3>
            <p>
              Use para registrar pedidos feitos por telefone, WhatsApp ou no
              balcão.
            </p>

            <form onSubmit={cadastrarPedido}>
              <p>
                <label>Cliente *</label>
                <br />
                <input
                  type="text"
                  name="nome_cliente"
                  value={novoPedido.nome_cliente}
                  onChange={atualizarNovoPedido}
                  required
                />
              </p>

              <p>
                <label>Telefone *</label>
                <br />
                <input
                  type="tel"
                  name="telefone"
                  value={novoPedido.telefone}
                  onChange={atualizarNovoPedido}
                  required
                />
              </p>

              <p>
                <label>Endereço *</label>
                <br />
                <input
                  type="text"
                  name="endereco"
                  value={novoPedido.endereco}
                  onChange={atualizarNovoPedido}
                  required
                />
              </p>

              <p>
                <label>Observação</label>
                <br />
                <textarea
                  name="observacao"
                  value={novoPedido.observacao}
                  onChange={atualizarNovoPedido}
                />
              </p>

              <h4>Produtos</h4>

              <p>
                <select
                  value={produtoEscolhido}
                  onChange={(e) => setProdutoEscolhido(e.target.value)}
                >
                  <option value="">Selecione um produto</option>
                  {produtosDisponiveis.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} — {formatarMoeda(produto.preco)}
                    </option>
                  ))}
                </select>{" "}
                <input
                  type="number"
                  min="1"
                  value={quantidadeEscolhida}
                  onChange={(e) => setQuantidadeEscolhida(e.target.value)}
                  style={{ width: "70px" }}
                />{" "}
                <button
                  type="button"
                  onClick={adicionarItemNovo}
                  disabled={!produtoEscolhido}
                >
                  Adicionar
                </button>
              </p>

              {itensNovo.length === 0 ? (
                <p>Nenhum produto adicionado.</p>
              ) : (
                <>
                  {itensNovo.map((item) => (
                    <p key={item.id}>
                      {item.nome} — {item.quantidade}x —{" "}
                      {formatarMoeda(Number(item.preco) * item.quantidade)}{" "}
                      <button
                        type="button"
                        onClick={() => removerItemNovo(item.id)}
                      >
                        Remover
                      </button>
                    </p>
                  ))}

                  <p>
                    <strong>Total: {formatarMoeda(totalNovo)}</strong>
                  </p>
                </>
              )}

              <button type="submit" disabled={criando}>
                {criando ? "Cadastrando..." : "Cadastrar pedido"}
              </button>
            </form>
          </section>
        )}

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
                        onClick={() => {
                          setPedidoAberto(pedido.id);
                          abrirEdicao(pedido);
                        }}
                      >
                        Editar
                      </button>

                      {" "}

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

              {edicao?.id === pedido.id ? (
                <form onSubmit={salvarEdicao}>
                  <p>
                    <label>Cliente *</label>
                    <br />
                    <input
                      type="text"
                      name="nome_cliente"
                      value={edicao.nome_cliente}
                      onChange={atualizarEdicao}
                      required
                    />
                  </p>

                  <p>
                    <label>Telefone *</label>
                    <br />
                    <input
                      type="tel"
                      name="telefone"
                      value={edicao.telefone}
                      onChange={atualizarEdicao}
                      required
                    />
                  </p>

                  <p>
                    <label>Endereço *</label>
                    <br />
                    <input
                      type="text"
                      name="endereco"
                      value={edicao.endereco}
                      onChange={atualizarEdicao}
                      required
                    />
                  </p>

                  <p>
                    <label>Observação</label>
                    <br />
                    <textarea
                      name="observacao"
                      value={edicao.observacao}
                      onChange={atualizarEdicao}
                    />
                  </p>

                  <button type="submit" disabled={salvandoEdicao}>
                    {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
                  </button>{" "}
                  <button type="button" onClick={() => setEdicao(null)}>
                    Cancelar edição
                  </button>
                </form>
              ) : (
                <>
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

                  <button onClick={() => abrirEdicao(pedido)}>
                    Editar dados do pedido
                  </button>
                </>
              )}

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
