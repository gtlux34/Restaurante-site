
import { useState } from "react";
import { supabase } from "../../supabase";

function FinalizarPedido() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [carrinho, setCarrinho] = useState(() => {
    return JSON.parse(localStorage.getItem("carrinho") || "[]");
  });

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [pedidoId, setPedidoId] = useState(null);

  const total = carrinho.reduce(
    (soma, item) => soma + Number(item.preco) * item.quantidade,
    0
  );

  async function finalizarPedido(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (carrinho.length === 0) {
      setErro("Seu carrinho está vazio.");
      return;
    }

    setEnviando(true);

    try {
      const { data, error } = await supabase.rpc("criar_pedido", {
        p_nome_cliente: nome,
        p_telefone: telefone,
        p_endereco: endereco,
        p_observacao: observacao,
        p_itens: carrinho.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantidade,
        })),
      });

      if (error) {
        throw error;
      }

      setPedidoId(data);
      setSucesso("Pedido realizado com sucesso!");

      localStorage.removeItem("carrinho");
      setCarrinho([]);

      setNome("");
      setTelefone("");
      setEndereco("");
      setObservacao("");
    } catch (error) {
      setErro(error.message || "Não foi possível finalizar seu pedido.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <header>
        <h1>RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/carrinho">Carrinho</a>
        </nav>
      </header>

      <main>
        <h2>Finalizar pedido</h2>

        {sucesso && (
          <section>
            <h2 style={{ color: "green" }}>{sucesso}</h2>
            <p>Número do pedido: {pedidoId}</p>
            <p>Obrigado por comprar no RANGO DOS GURI!</p>
            <a href="/cardapio">Voltar ao cardápio</a>
          </section>
        )}

        {!sucesso && (
          <>
            <h3>Resumo da compra</h3>

            {carrinho.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {carrinho.map((item) => (
                  <p key={item.id}>
                    {item.nome} — {item.quantidade}x — R${" "}
                    {(Number(item.preco) * item.quantidade)
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                ))}

                <h3>
                  Total: R$ {total.toFixed(2).replace(".", ",")}
                </h3>
              </>
            )}

            {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}

            {carrinho.length > 0 && (
              <form onSubmit={finalizarPedido}>
                <h3>Seus dados</h3>

                <p>
                  <label>Nome completo</label><br />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </p>

                <p>
                  <label>Telefone / WhatsApp</label><br />
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                </p>

                <p>
                  <label>Endereço de entrega</label><br />
                  <textarea
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                  />
                </p>

                <p>
                  <label>Observações do pedido</label><br />
                  <textarea
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                </p>

                <button type="submit" disabled={enviando}>
                  {enviando ? "Enviando pedido..." : "Confirmar pedido"}
                </button>
              </form>
            )}
          </>
        )}
      </main>

      <footer>
        <p>© 2026 RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default FinalizarPedido;
