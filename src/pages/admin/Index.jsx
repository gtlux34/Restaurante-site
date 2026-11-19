
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarPedidos();
  }, []);

  async function buscarPedidos() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("pedidos")
      .select("id, status, valor_total, total, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErro("Não foi possível carregar os pedidos.");
      setPedidos([]);
    } else {
      setPedidos(data || []);
    }

    setCarregando(false);
  }

  function normalizarStatus(status) {
    return (status || "").toLowerCase().trim();
  }

  function classeStatus(status) {
    const statusNormalizado = normalizarStatus(status);

    const classes = {
      "pendente": "status-pendente",
      "em preparo": "status-preparo",
      "saiu para entrega": "status-entrega",
      "entregue": "status-entregue",
      "cancelado": "status-cancelado",
    };

    return classes[statusNormalizado] || "status-padrao";
  }

  function valorPedido(pedido) {
    return Number(pedido.valor_total ?? pedido.total ?? 0);
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
  }

  const totalPedidos = pedidos.length;

  const pedidosPendentes = pedidos.filter(
    (p) => normalizarStatus(p.status) === "pendente"
  ).length;

  const pedidosEntregues = pedidos.filter(
    (p) => normalizarStatus(p.status) === "entregue"
  ).length;

  const faturamento = pedidos.reduce((total, pedido) => {
    if (normalizarStatus(pedido.status) === "cancelado") {
      return total;
    }

    return total + valorPedido(pedido);
  }, 0);

  const ultimosSeteDias = Array.from({ length: 7 }, (_, i) => {
    const data = new Date();
    data.setHours(0, 0, 0, 0);
    data.setDate(data.getDate() - (6 - i));

    const chave = [
      data.getFullYear(),
      String(data.getMonth() + 1).padStart(2, "0"),
      String(data.getDate()).padStart(2, "0"),
    ].join("-");

    const vendas = pedidos.reduce((total, pedido) => {
      if (normalizarStatus(pedido.status) === "cancelado") {
        return total;
      }

      const dataPedido = new Date(pedido.created_at);

      const chavePedido = [
        dataPedido.getFullYear(),
        String(dataPedido.getMonth() + 1).padStart(2, "0"),
        String(dataPedido.getDate()).padStart(2, "0"),
      ].join("-");

      return chavePedido === chave
        ? total + valorPedido(pedido)
        : total;
    }, 0);

    return {
      chave,
      dia: data.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
      }),
      vendas,
    };
  });

  const maiorVenda = Math.max(
    ...ultimosSeteDias.map((dia) => dia.vendas),
    1
  );

  return (
    <>
      <header>
        <h1>Painel Administrativo</h1>
        <p>Restaurante RANGO DOS GURI</p>
      </header>

      <nav>
        <a href="/">Início</a>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
        <a href="/admin/minha-conta">Minha Conta</a>
        <a href="/login">Sair</a>
      </nav>

      <main>
        <h2>Bem-vindo ao Painel Administrativo</h2>
        <p>Acompanhe os resultados e gerencie o restaurante.</p>

        {carregando ? (
          <p>Carregando informações...</p>
        ) : erro ? (
          <p>{erro}</p>
        ) : (
          <>
            <section>
              <h2>Resumo do restaurante</h2>

              <div className="dashboard-cards">
                <article>
                  <h3>Total de pedidos</h3>
                  <p>{totalPedidos}</p>
                </article>

                <article>
                  <h3>Faturamento</h3>
                  <p>{formatarMoeda(faturamento)}</p>
                </article>

                <article>
                  <h3>Pedidos pendentes</h3>
                  <p>{pedidosPendentes}</p>
                </article>

                <article>
                  <h3>Pedidos entregues</h3>
                  <p>{pedidosEntregues}</p>
                </article>
              </div>

              <button onClick={buscarPedidos}>
                Atualizar informações
              </button>
            </section>

            <section>
              <h2>Vendas dos últimos 7 dias</h2>

              <div className="grafico-vendas">
                {ultimosSeteDias.map((dia) => (
                  <div className="grafico-coluna" key={dia.chave}>
                    <strong>{formatarMoeda(dia.vendas)}</strong>

                    <div className="grafico-barra-area">
                      <div
                        className="grafico-barra"
                        style={{
                          height: `${(dia.vendas / maiorVenda) * 100}%`,
                        }}
                      />
                    </div>

                    <span>{dia.dia}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2>Pedidos recentes</h2>

              {pedidos.length === 0 ? (
                <p>Nenhum pedido encontrado.</p>
              ) : (
                pedidos.slice(0, 5).map((pedido) => (
                  <article key={pedido.id}>
                    <h3>Pedido #{pedido.id}</h3>

                    <p>
                      Data: {formatarData(pedido.created_at)}
                    </p>

                    <p>
                      Valor: {formatarMoeda(valorPedido(pedido))}
                    </p>

                    <p className="status-linha">
                      Status:
                      <span className={`status-pedido ${classeStatus(pedido.status)}`}>
                        {pedido.status || "Não informado"}
                      </span>
                    </p>

                    <a href="/admin/pedidos">
                      Visualizar pedidos
                    </a>
                  </article>
                ))
              )}
            </section>
          </>
        )}

        <section>
          <h2>Gerenciamento</h2>

          <article>
            <h3>Produtos</h3>
            <p>Cadastre, visualize, edite e exclua produtos.</p>
            <a href="/admin/produtos">Gerenciar produtos</a>
          </article>

          <article>
            <h3>Categorias</h3>
            <p>Gerencie as categorias dos produtos.</p>
            <a href="/admin/categorias">Gerenciar categorias</a>
          </article>

          <article>
            <h3>Pedidos</h3>
            <p>Visualize e gerencie os pedidos realizados.</p>
            <a href="/admin/pedidos">Gerenciar pedidos</a>
          </article>

          <article>
            <h3>Clientes</h3>
            <p>Visualize e gerencie os clientes cadastrados.</p>
            <a href="/admin/clientes">Gerenciar clientes</a>
          </article>

          <article>
            <h3>Mensagens</h3>
            <p>Visualize as mensagens recebidas pelo formulário de contato.</p>
            <a href="/admin/mensagens">Ver mensagens</a>
          </article>

          <article>
            <h3>Minha Conta</h3>
            <p>Visualize seu Gmail e altere sua senha de administrador.</p>
            <a href="/admin/minha-conta">Acessar minha conta</a>
          </article>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Admin;
