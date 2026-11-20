
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { formatarMoeda } from "../../utils";

function MinhaConta() {
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState("");

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enderecoCasa, setEnderecoCasa] = useState("");

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    carregarConta();
  }, []);

  async function carregarConta() {
    setCarregando(true);
    setErro("");

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      window.location.replace("/login");
      return;
    }

    const usuarioLogado = authData.user;

    if (usuarioLogado.app_metadata?.role === "admin") {
      window.location.replace("/admin");
      return;
    }

    setEmail(usuarioLogado.email || "");

    const { data: perfil, error: perfilError } = await supabase
      .from("usuarios")
      .select("id, nome, telefone, endereco_casa, tipo")
      .eq("id", usuarioLogado.id)
      .single();

    if (perfilError || perfil?.tipo !== "cliente") {
      setErro("Não foi possível carregar seu perfil de cliente.");
      setCarregando(false);
      return;
    }

    setUsuario(usuarioLogado);
    setNome(perfil.nome || "");
    setTelefone(perfil.telefone || "");
    setEnderecoCasa(perfil.endereco_casa || "");

    const { data: listaPedidos, error: pedidosError } = await supabase
      .from("pedidos")
      .select("id, status, valor_total, endereco, created_at")
      .eq("usuario_id", usuarioLogado.id)
      .order("created_at", { ascending: false });

    if (pedidosError) {
      setErro("Não foi possível carregar seu histórico de pedidos.");
    } else {
      setPedidos(listaPedidos || []);
    }

    setCarregando(false);
  }

  async function salvarDados(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!nome.trim() || !telefone.trim()) {
      setErro("Preencha seu nome e telefone.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("usuarios")
      .update({
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco_casa: enderecoCasa.trim(),
      })
      .eq("id", usuario.id);

    if (error) {
      setErro("Não foi possível salvar seus dados: " + error.message);
    } else {
      setMensagem("Seus dados foram atualizados com sucesso!");
    }

    setSalvando(false);
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  if (carregando) {
    return <main><h2>Carregando sua conta...</h2></main>;
  }

  return (
    <>
      <header>
        <h1>RANGO DOS GURI</h1>
        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/carrinho">Carrinho</a>
          <a href="/minha-conta">Minha Conta</a>
        </nav>
      </header>

      <main style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
        <h2>Minha Conta</h2>
        <p>Gerencie seus dados pessoais e acompanhe seus pedidos.</p>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

        <section>
          <h3>Meus dados</h3>

          <form onSubmit={salvarDados}>
            <label>Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <br /><br />

            <label>E-mail cadastrado</label>
            <input
              type="email"
              value={email}
              readOnly
            />

            <br /><br />

            <label>Telefone / WhatsApp</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />

            <br /><br />

            <h3>Meu endereço CASA</h3>

            <label>Endereço salvo</label>
            <textarea
              value={enderecoCasa}
              onChange={(e) => setEnderecoCasa(e.target.value)}
              placeholder="Digite seu endereço completo"
              rows="3"
            />

            <br /><br />

            <button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>

        <hr />

        <section>
          <h3>Meus pedidos</h3>

          <h2>Total de pedidos: {pedidos.length}</h2>

          {pedidos.length === 0 ? (
            <p>Você ainda não realizou nenhum pedido.</p>
          ) : (
            pedidos.map((pedido) => (
              <article
                key={pedido.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              >
                <h4>Pedido #{pedido.id}</h4>
                <p>Data: {formatarData(pedido.created_at)}</p>
                <p>Status: {pedido.status}</p>
                <p>Valor: {formatarMoeda(pedido.valor_total)}</p>
                <p>Endereço: {pedido.endereco}</p>
              </article>
            ))
          )}
        </section>

        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.replace("/");
          }}
        >
          Sair da conta
        </button>
      </main>
    </>
  );
}

export default MinhaConta;
