
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function FinalizarPedido() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [enderecoCasa, setEnderecoCasa] = useState("");
  const [tipoEndereco, setTipoEndereco] = useState("outro");
  const [outroEndereco, setOutroEndereco] = useState("");
  const [salvarComoCasa, setSalvarComoCasa] = useState(false);

  const [usuarioId, setUsuarioId] = useState(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const [observacao, setObservacao] = useState("");

  const [carrinho, setCarrinho] = useState(() => {
    return JSON.parse(localStorage.getItem("carrinho") || "[]");
  });

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [pedidoId, setPedidoId] = useState(null);
  const [totalPedido, setTotalPedido] = useState(0);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const { data: sessaoData } = await supabase.auth.getSession();
        const usuario = sessaoData.session?.user;

        if (usuario) {
          setUsuarioId(usuario.id);
          setEmail(usuario.email || "");

          const { data, error } = await supabase
            .from("usuarios")
            .select("nome, telefone, endereco_casa")
            .eq("id", usuario.id)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            setNome(data.nome || "");
            setTelefone(data.telefone || "");
            setEnderecoCasa(data.endereco_casa || "");

            if (data.endereco_casa) {
              setTipoEndereco("casa");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setErro("Não foi possível carregar seus dados. Atualize a página.");
      } finally {
        setCarregandoPerfil(false);
      }
    }

    carregarPerfil();
  }, []);

  const total = carrinho.reduce(
    (soma, item) =>
      soma + Number(item.preco) * Number(item.quantidade),
    0
  );

  async function finalizarPedido(event) {
    event.preventDefault();
    setErro("");

    if (carrinho.length === 0) {
      setErro("Seu carrinho está vazio.");
      return;
    }

    const enderecoFinal =
      tipoEndereco === "casa" && enderecoCasa
        ? enderecoCasa
        : outroEndereco.trim();

    if (!nome.trim() || !telefone.trim() || !enderecoFinal) {
      setErro("Preencha todos os dados obrigatórios.");
      return;
    }

    setEnviando(true);

    try {
      // Salva o endereço como CASA, se o cliente desejar.
      if (usuarioId && salvarComoCasa) {
        const { error: erroEndereco } = await supabase
          .from("usuarios")
          .update({ endereco_casa: outroEndereco.trim() })
          .eq("id", usuarioId);

        if (erroEndereco) throw erroEndereco;

        setEnderecoCasa(outroEndereco.trim());
      }

      const { data, error } = await supabase.rpc("criar_pedido", {
        p_nome_cliente: nome.trim(),
        p_telefone: telefone.trim(),
        p_endereco: enderecoFinal,
        p_observacao: observacao.trim(),
        p_itens: carrinho.map((item) => ({
          produto_id: item.id,
          quantidade: Number(item.quantidade),
        })),
      });

      if (error) throw error;

      if (data === null || data === undefined) {
        throw new Error("O Supabase não retornou o número do pedido.");
      }

      setPedidoId(data);
      setTotalPedido(total);

      localStorage.removeItem("carrinho");
      setCarrinho([]);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      setErro(
        error.message || "Não foi possível finalizar seu pedido."
      );
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
        {pedidoId !== null ? (
          <section>
            <h2>Pedido realizado com sucesso!</h2>

            <p>Seu pedido foi recebido pelo RANGO DOS GURI.</p>

            <h3>Pedido nº {pedidoId}</h3>

            <p><strong>Nome:</strong> {nome}</p>
            <p><strong>Total:</strong> R$ {totalPedido.toFixed(2).replace(".", ",")}</p>
            <p><strong>Status:</strong> Pendente</p>

            <p>Obrigado por comprar com a gente!</p>

            <a href="/cardapio">Voltar ao cardápio</a>
          </section>
        ) : (
          <>
            <h2>Finalizar pedido</h2>

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

            {erro && (
              <p style={{ color: "red" }}>{erro}</p>
            )}

            {carrinho.length > 0 && (
              <form onSubmit={finalizarPedido}>
                <h3>Seus dados</h3>

                {carregandoPerfil ? (
                  <p>Carregando seus dados...</p>
                ) : (
                  <>
                    <p>
                      <label>Nome completo</label>
                      <br />
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </p>

                    <p>
                      <label>E-mail</label>
                      <br />
                      <input
                        type="email"
                        value={email}
                        readOnly
                      />
                    </p>

                    <p>
                      <label>Telefone / WhatsApp</label>
                      <br />
                      <input
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        required
                      />
                    </p>

                    <h3>Endereço de entrega</h3>

                    {enderecoCasa && (
                      <p>
                        <label>
                          <input
                            type="radio"
                            name="tipoEndereco"
                            value="casa"
                            checked={tipoEndereco === "casa"}
                            onChange={() => setTipoEndereco("casa")}
                          />
                          {" "} CASA — {enderecoCasa}
                        </label>
                      </p>
                    )}

                    <p>
                      <label>
                        <input
                          type="radio"
                          name="tipoEndereco"
                          value="outro"
                          checked={tipoEndereco === "outro"}
                          onChange={() => setTipoEndereco("outro")}
                        />
                        {" "} Informar outro endereço
                      </label>
                    </p>

                    {tipoEndereco === "outro" && (
                      <>
                        <textarea
                          value={outroEndereco}
                          onChange={(e) => setOutroEndereco(e.target.value)}
                          placeholder="Digite rua, número, bairro e complemento..."
                          required
                        />

                        {usuarioId && (
                          <p>
                            <label>
                              <input
                                type="checkbox"
                                checked={salvarComoCasa}
                                onChange={(e) =>
                                  setSalvarComoCasa(e.target.checked)
                                }
                              />
                              {" "} Salvar este endereço como CASA
                            </label>
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}

                <h3>Observações do pedido</h3>

                <p>
                  <textarea
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Alguma observação? (opcional)"
                  />
                </p>

                <button
                  type="submit"
                  disabled={enviando || carregandoPerfil}
                >
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
