
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { formatarMoeda } from "../../utils";
import "./MinhaConta.css";

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

  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

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

  // Alterar senha do cliente
  async function alterarSenha(event) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setErro("Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErro("A confirmação da nova senha não corresponde.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setErro("A nova senha precisa ser diferente da senha atual.");
      return;
    }

    setSalvandoSenha(true);

    // Verifica a senha atual
    const { error: verificacaoError } =
      await supabase.auth.signInWithPassword({
        email,
        password: senhaAtual,
      });

    if (verificacaoError) {
      setErro("A senha atual está incorreta.");
      setSalvandoSenha(false);
      return;
    }

    // Atualiza a senha no Supabase
    const { error: atualizacaoError } =
      await supabase.auth.updateUser({
        password: novaSenha,
      });

    if (atualizacaoError) {
      setErro(
        "Não foi possível alterar sua senha: " +
          atualizacaoError.message
      );
    } else {
      setMensagem("Sua senha foi alterada com sucesso!");

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
    }

    setSalvandoSenha(false);
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function classeStatus(status) {
    const valor = (status || "").toLowerCase();

    if (valor.includes("pendente")) return "conta-status pendente";
    if (valor.includes("preparo")) return "conta-status preparo";
    if (valor.includes("entrega")) return "conta-status entrega";
    if (valor.includes("entregue")) return "conta-status entregue";
    if (valor.includes("cancelado")) return "conta-status cancelado";

    return "conta-status";
  }

  async function sairDaConta() {
    await supabase.auth.signOut();
    window.location.replace("/");
  }

  if (carregando) {
    return (
      <div className="conta-carregando">
        <div className="conta-spinner"></div>
        <h2>CARREGANDO SUA CONTA...</h2>
        <p>Estamos preparando tudo para você!</p>
      </div>
    );
  }

  return (
    <div className="conta-page">
      <header className="home-header">
        <a href="/" className="home-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>

        <nav className="home-nav">
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/carrinho">Carrinho</a>
          <a href="/contato">Contato</a>
          <a href="/minha-conta" className="home-login">
            Minha Conta
          </a>
        </nav>
      </header>

      <main className="conta-main">
        <section className="conta-banner">
          <div className="conta-banner-texto">
            <span className="conta-etiqueta">
              ★ ÁREA DO CLIENTE
            </span>

            <h1>
              SEJA BEM-VINDO
              <br />
              <span>
                {nome ? nome.split(" ")[0].toUpperCase() : "AO RANGO"}!
              </span>
            </h1>

            <p>
              Aqui você acompanha seus pedidos e mantém seus dados
              sempre atualizados.
            </p>

            <div className="conta-banner-frase">
              SUA CONTA. SEUS PEDIDOS. SEU RANGO!
            </div>
          </div>

          <div className="conta-banner-destaque">
            <span>🍔</span>
            <strong>RANGO</strong>
            <small>DOS GURI</small>
          </div>
        </section>

        {erro && (
          <div className="conta-alerta erro">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="conta-alerta sucesso">
            {mensagem}
          </div>
        )}

        {/* Dados pessoais */}
        <section className="conta-secao">
          <div className="conta-titulo-secao">
            <div>
              <span className="conta-subtitulo">SEUS DADOS</span>
              <h2>MINHA CONTA</h2>
            </div>
            <span className="conta-icone-secao">👤</span>
          </div>

          <div className="conta-dados-card">
            <div className="conta-card-topo">
              <span>✦</span>
              <h3>MEUS DADOS PESSOAIS</h3>
            </div>

            <form onSubmit={salvarDados} className="conta-formulario">
              <div className="conta-campo">
                <label>Nome completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="conta-campo">
                <label>E-mail cadastrado</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                />
                <small>O e-mail não pode ser alterado por aqui.</small>
              </div>

              <div className="conta-campo">
                <label>Telefone / WhatsApp</label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Seu telefone"
                  required
                />
              </div>

              <div className="conta-campo campo-completo">
                <label>Meu endereço CASA</label>
                <textarea
                  value={enderecoCasa}
                  onChange={(e) => setEnderecoCasa(e.target.value)}
                  placeholder="Digite seu endereço completo"
                  rows="3"
                />
              </div>

              <div className="conta-acoes campo-completo">
                <button type="submit" disabled={salvando}>
                  {salvando ? "SALVANDO..." : "SALVAR ALTERAÇÕES →"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Alteração de senha */}
        <section className="conta-secao">
          <div className="conta-titulo-secao">
            <div>
              <span className="conta-subtitulo">SEGURANÇA DA CONTA</span>
              <h2>ALTERAR SENHA</h2>
            </div>
            <span className="conta-icone-secao">🔒</span>
          </div>

          <div className="conta-dados-card">
            <div className="conta-card-topo">
              <span>✦</span>
              <h3>ATUALIZE SUA SENHA</h3>
            </div>

            <form onSubmit={alterarSenha} className="conta-formulario">
              <div className="conta-campo campo-completo">
                <label>Senha atual</label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="conta-campo">
                <label>Nova senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite a nova senha"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <div className="conta-campo">
                <label>Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirmarNovaSenha}
                  onChange={(e) =>
                    setConfirmarNovaSenha(e.target.value)
                  }
                  placeholder="Confirme sua nova senha"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <div className="conta-acoes campo-completo">
                <button type="submit" disabled={salvandoSenha}>
                  {salvandoSenha
                    ? "ALTERANDO..."
                    : "ALTERAR MINHA SENHA →"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Histórico de pedidos */}
        <section className="conta-secao">
          <div className="conta-titulo-secao">
            <div>
              <span className="conta-subtitulo">
                ACOMPANHE SEUS RANGOS
              </span>
              <h2>MEUS PEDIDOS</h2>
            </div>
            <span className="conta-icone-secao">🛍️</span>
          </div>

          <div className="conta-resumo-pedidos">
            <div>
              <span>TOTAL DE PEDIDOS</span>
              <strong>{pedidos.length}</strong>
            </div>
            <p>Obrigado por escolher o Rango dos Guri!</p>
          </div>

          {pedidos.length === 0 ? (
            <div className="conta-sem-pedidos">
              <span>🍔</span>
              <h3>AINDA NÃO TEM RANGO POR AQUI!</h3>
              <p>
                Você ainda não realizou nenhum pedido.
                Que tal conferir nosso cardápio?
              </p>
              <a href="/cardapio">VER CARDÁPIO →</a>
            </div>
          ) : (
            <div className="conta-pedidos-grid">
              {pedidos.map((pedido) => (
                <article className="conta-pedido-card" key={pedido.id}>
                  <div className="conta-pedido-topo">
                    <div>
                      <span>PEDIDO</span>
                      <h3>#{pedido.id}</h3>
                    </div>

                    <span className={classeStatus(pedido.status)}>
                      {pedido.status}
                    </span>
                  </div>

                  <div className="conta-pedido-info">
                    <p>
                      <strong>Data:</strong>{" "}
                      {formatarData(pedido.created_at)}
                    </p>

                    <p>
                      <strong>Valor:</strong>{" "}
                      {formatarMoeda(pedido.valor_total)}
                    </p>

                    <p>
                      <strong>📍 Endereço:</strong>{" "}
                      {pedido.endereco || "Não informado"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Sair da conta */}
        <section className="conta-sair">
          <div>
            <h3>VAI SAIR AGORA?</h3>
            <p>Você poderá entrar novamente quando quiser.</p>
          </div>

          <button type="button" onClick={sairDaConta}>
            SAIR DA CONTA ↗
          </button>
        </section>
      </main>

      <footer className="home-footer">
        <a href="/" className="home-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>
        <p>© 2026 RANGO DOS GURI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default MinhaConta;
