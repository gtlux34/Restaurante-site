
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { formatarMoeda } from "../../utils";

function MinhaContaAdmin() {
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState("");

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enderecoCasa, setEnderecoCasa] = useState("");

  const [pedidos, setPedidos] = useState([]);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarConta();
  }, []);

  async function carregarConta() {
    setCarregando(true);

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      window.location.replace("/login");
      return;
    }

    const usuarioLogado = authData.user;

    if (usuarioLogado.app_metadata?.role !== "admin") {
      window.location.replace("/login");
      return;
    }

    setUsuario(usuarioLogado);
    setEmail(usuarioLogado.email || "");

    const { data: perfil, error: perfilError } = await supabase
      .from("usuarios")
      .select("id, nome, telefone, endereco_casa")
      .eq("id", usuarioLogado.id)
      .maybeSingle();

    if (perfilError) {
      setErro("Não foi possível carregar seus dados.");
    } else if (perfil) {
      setNome(perfil.nome || "");
      setTelefone(perfil.telefone || "");
      setEnderecoCasa(perfil.endereco_casa || "");
    } else {
      setErro("Perfil administrativo não encontrado na tabela de usuários.");
    }

    const { data: listaPedidos, error: pedidosError } = await supabase
      .from("pedidos")
      .select("id, status, valor_total, endereco, created_at")
      .eq("usuario_id", usuarioLogado.id)
      .order("created_at", { ascending: false });

    if (pedidosError) {
      setErro((atual) =>
        atual
          ? atual + " Não foi possível carregar seus pedidos."
          : "Não foi possível carregar seus pedidos."
      );
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

  async function alterarSenha(event) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    if (novaSenha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não são iguais.");
      return;
    }

    setAlterandoSenha(true);

    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      setErro("Não foi possível alterar a senha: " + error.message);
    } else {
      setMensagem("Senha alterada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
    }

    setAlterandoSenha(false);
  }

  async function sairDaConta() {
    const confirmar = window.confirm(
      "Deseja realmente sair da sua conta administrativa?"
    );

    if (!confirmar) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      setErro("Não foi possível sair da conta.");
      return;
    }

    window.location.replace("/");
  }

  function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function classeStatus(status) {
    const valor = (status || "").toLowerCase();

    if (valor.includes("pendente")) return "conta-status-pendente";
    if (valor.includes("preparo")) return "conta-status-preparo";
    if (valor.includes("entrega")) return "conta-status-entrega";
    if (valor.includes("entregue")) return "conta-status-entregue";
    if (valor.includes("cancelado")) return "conta-status-cancelado";

    return "conta-status-padrao";
  }

  if (carregando) {
    return (
      <main className="conta-admin-carregando">
        <div className="conta-admin-spinner"></div>
        <h2>Carregando sua conta...</h2>
      </main>
    );
  }

  return (
    <div className="minha-conta-admin-page">
      <style>{`
        body:has(.minha-conta-admin-page) {
          background-color: var(--bege);
          background-image: radial-gradient(
            rgba(107, 63, 29, 0.09) 1.2px,
            transparent 1.2px
          );
          background-size: 22px 22px;
        }

        .minha-conta-admin-page {
          min-height: 100vh;
          color: var(--preto);
        }

        /* CABEÇALHO */
        .conta-admin-header {
          background: var(--vermelho);
          border-bottom: 5px solid var(--preto);
          padding: 16px 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .conta-admin-logo {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          line-height: 0.95;
          font-family: var(--fonte-titulo);
        }

        .conta-admin-logo span {
          color: var(--amarelo);
          font-size: 30px;
        }

        .conta-admin-logo strong {
          color: var(--branco);
          font-size: 18px;
        }

        .conta-admin-nav {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 22px;
        }

        .conta-admin-nav a {
          color: var(--branco);
          text-decoration: none;
          font-weight: 800;
          transition: color 0.2s;
        }

        .conta-admin-nav a:hover,
        .conta-admin-nav a.ativo {
          color: var(--amarelo);
        }

        /* CONTEÚDO */
        .conta-admin-conteudo {
          width: min(1050px, 90%);
          margin: 35px auto 70px;
        }

        /* FAIXA AMARELA COM MASCOTE */
        .conta-admin-banner {
          background: var(--amarelo);
          border: 4px solid var(--preto);
          border-radius: 20px;
          box-shadow: 7px 7px 0 var(--preto);
          padding: 30px 35px;
          margin-bottom: 35px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .conta-admin-banner-texto {
          position: relative;
          z-index: 2;
        }

        .conta-admin-etiqueta {
          display: inline-block;
          background: var(--preto);
          color: var(--amarelo);
          padding: 6px 13px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 14px;
        }

        .conta-admin-banner h1 {
          font-family: var(--fonte-titulo);
          font-size: clamp(34px, 5vw, 48px);
          color: var(--preto);
          margin-bottom: 10px;
        }

        .conta-admin-banner p {
          max-width: 570px;
          font-weight: 700;
          color: var(--preto);
          line-height: 1.5;
        }

        .conta-admin-mascote {
          width: 175px;
          max-width: 30%;
          height: 175px;
          object-fit: contain;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .conta-admin-alerta {
          padding: 14px 18px;
          border: 2px solid var(--preto);
          border-radius: 10px;
          margin-bottom: 22px;
          font-weight: 800;
          box-shadow: 3px 3px 0 var(--preto);
        }

        .conta-admin-erro {
          background: #ffdada;
          color: #870000;
        }

        .conta-admin-sucesso {
          background: #d9f2df;
          color: #185c2b;
        }

        .conta-admin-card {
          background: var(--branco);
          border: 3px solid var(--preto);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 5px 5px 0 var(--preto);
        }

        .conta-admin-titulo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .conta-admin-titulo::before {
          content: "";
          display: block;
          width: 8px;
          height: 30px;
          background: var(--vermelho);
          border-radius: 5px;
        }

        .conta-admin-titulo h2 {
          font-size: 25px;
          color: var(--preto);
        }

        .conta-admin-descricao {
          color: var(--cinza-texto);
          font-size: 14px;
          margin: 0 0 25px 20px;
        }

        .conta-admin-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .conta-admin-campo {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 18px;
        }

        .conta-admin-campo label {
          font-size: 14px;
          font-weight: 900;
          color: var(--preto);
        }

        .conta-admin-campo input,
        .conta-admin-campo textarea {
          width: 100%;
          padding: 13px 14px;
          background: #fffdf7;
          color: var(--preto);
          border: 2px solid #d7cdb7;
          border-radius: 9px;
          font-family: var(--fonte-texto);
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .conta-admin-campo input:focus,
        .conta-admin-campo textarea:focus {
          border-color: var(--vermelho);
          box-shadow: 0 0 0 3px rgba(225, 6, 0, 0.10);
        }

        .conta-admin-campo input[readonly] {
          background: #eee9dd;
          color: #6b6255;
          cursor: not-allowed;
        }

        .conta-admin-campo textarea {
          min-height: 100px;
          resize: vertical;
        }

        .conta-admin-botao {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 12px 22px;
          background: var(--vermelho);
          color: var(--branco);
          border: 3px solid var(--preto);
          border-radius: 9px;
          box-shadow: 3px 3px 0 var(--preto);
          font-family: var(--fonte-texto);
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s;
        }

        .conta-admin-botao:hover {
          background: var(--vermelho-escuro);
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 var(--preto);
        }

        .conta-admin-botao:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 3px 3px 0 var(--preto);
        }

        .conta-admin-pedidos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 18px;
        }

        .conta-admin-pedido {
          background: var(--creme);
          border: 2px solid var(--preto);
          border-radius: 12px;
          padding: 20px;
          transition: 0.2s;
        }

        .conta-admin-pedido:hover {
          transform: translateY(-3px);
          box-shadow: 3px 3px 0 var(--preto);
        }

        .conta-admin-pedido h3 {
          font-family: var(--fonte-titulo);
          font-size: 21px;
          margin-bottom: 13px;
          color: var(--vermelho);
        }

        .conta-admin-pedido p {
          color: var(--cinza-texto);
          font-size: 14px;
          margin: 7px 0;
          overflow-wrap: anywhere;
        }

        .conta-admin-valor {
          color: var(--vermelho) !important;
          font-size: 18px !important;
          font-weight: 900;
          margin-top: 12px !important;
        }

        .conta-status {
          display: inline-block;
          padding: 5px 11px;
          border: 2px solid var(--preto);
          border-radius: 30px;
          font-size: 12px;
          font-weight: 900;
          color: var(--preto) !important;
        }

        .conta-status-pendente { background: #fff0b3; }
        .conta-status-preparo { background: #cce5ff; }
        .conta-status-entrega { background: #ead5ff; }
        .conta-status-entregue { background: #c9f2d3; }
        .conta-status-cancelado { background: #ffd0d0; }
        .conta-status-padrao { background: #e5e5e5; }

        .conta-admin-vazio {
          background: var(--creme);
          border: 2px dashed var(--marrom);
          border-radius: 12px;
          padding: 28px;
          text-align: center;
          color: var(--cinza-texto);
          font-weight: 700;
        }

        .conta-admin-sair {
          background: var(--preto);
          color: var(--branco);
          border: 3px solid var(--preto);
          border-radius: 9px;
          padding: 12px 22px;
          font-family: var(--fonte-texto);
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s;
        }

        .conta-admin-sair:hover {
          background: var(--vermelho);
          border-color: var(--preto);
        }

        .conta-admin-rodape {
          background: var(--preto);
          border-top: 5px solid var(--vermelho);
          padding: 25px;
          text-align: center;
          color: var(--branco);
          font-size: 13px;
        }

        .conta-admin-carregando {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .conta-admin-spinner {
          width: 42px;
          height: 42px;
          border: 5px solid var(--bege);
          border-top-color: var(--vermelho);
          border-radius: 50%;
          animation: contaGirar 0.8s linear infinite;
        }

        @keyframes contaGirar {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 700px) {
          .conta-admin-header {
            flex-direction: column;
            padding: 20px;
          }

          .conta-admin-nav {
            justify-content: center;
            gap: 14px;
          }

          .conta-admin-conteudo {
            width: 92%;
            margin-top: 25px;
          }

          .conta-admin-banner {
            padding: 25px 20px;
          }

          .conta-admin-mascote {
            width: 115px;
            height: 115px;
          }

          .conta-admin-banner p {
            font-size: 14px;
          }

          .conta-admin-card {
            padding: 20px;
          }

          .conta-admin-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        @media (max-width: 450px) {
          .conta-admin-banner {
            flex-direction: column-reverse;
            align-items: flex-start;
          }

          .conta-admin-mascote {
            align-self: flex-end;
            width: 105px;
            height: 105px;
            margin-bottom: -10px;
          }
        }
      `}</style>

      <header className="conta-admin-header">
        <a href="/admin" className="conta-admin-logo">
          <span>RANGO</span>
          <strong>DOS GURI</strong>
        </a>

        <nav className="conta-admin-nav">
          <a href="/">Início</a>
          <a href="/admin">Painel</a>
          <a href="/admin/produtos">Produtos</a>
          <a href="/admin/categorias">Categorias</a>
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/clientes">Clientes</a>
          <a href="/admin/mensagens">Mensagens</a>
          <a href="/admin/minha-conta" className="ativo">Minha Conta</a>
          <a href="#" onClick={(event) => {
            event.preventDefault();
            sairDaConta();
          }}>Sair</a>
        </nav>
      </header>

      <main className="conta-admin-conteudo">
        <section className="conta-admin-banner">
          <div className="conta-admin-banner-texto">
            <span className="conta-admin-etiqueta">
              ÁREA ADMINISTRATIVA
            </span>

            <h1>Minha Conta</h1>

            <p>
              Gerencie suas informações pessoais, proteja sua conta
              e acompanhe seus pedidos no RANGO DOS GURI.
            </p>
          </div>

          <img
            src="/mascote2.png"
            alt="Mascote Rango dos Guri"
            className="conta-admin-mascote"
          />
        </section>

        {erro && (
          <div className="conta-admin-alerta conta-admin-erro" role="alert">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="conta-admin-alerta conta-admin-sucesso" role="status">
            {mensagem}
          </div>
        )}

        <section className="conta-admin-card">
          <div className="conta-admin-titulo">
            <h2>Meus dados</h2>
          </div>

          <p className="conta-admin-descricao">
            Mantenha suas informações pessoais atualizadas.
          </p>

          <form onSubmit={salvarDados}>
            <div className="conta-admin-campo">
              <label htmlFor="admin-nome">Nome completo</label>
              <input
                id="admin-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="conta-admin-campo">
              <label htmlFor="admin-email">E-mail cadastrado</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                readOnly
              />
            </div>

            <div className="conta-admin-grid">
              <div className="conta-admin-campo">
                <label htmlFor="admin-telefone">Telefone / WhatsApp</label>
                <input
                  id="admin-telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Digite seu telefone"
                  required
                />
              </div>

              <div className="conta-admin-campo">
                <label htmlFor="admin-endereco">Endereço</label>
                <input
                  id="admin-endereco"
                  type="text"
                  value={enderecoCasa}
                  onChange={(e) => setEnderecoCasa(e.target.value)}
                  placeholder="Digite seu endereço"
                />
              </div>
            </div>

            <button
              className="conta-admin-botao"
              type="submit"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>

        <section className="conta-admin-card">
          <div className="conta-admin-titulo">
            <h2>Segurança da conta</h2>
          </div>

          <p className="conta-admin-descricao">
            Altere sua senha para manter sua conta protegida.
          </p>

          <form onSubmit={alterarSenha}>
            <div className="conta-admin-grid">
              <div className="conta-admin-campo">
                <label htmlFor="admin-nova-senha">Nova senha</label>
                <input
                  id="admin-nova-senha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  minLength={6}
                  required
                />
              </div>

              <div className="conta-admin-campo">
                <label htmlFor="admin-confirmar-senha">
                  Confirmar nova senha
                </label>
                <input
                  id="admin-confirmar-senha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Digite novamente"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              className="conta-admin-botao"
              type="submit"
              disabled={alterandoSenha}
            >
              {alterandoSenha ? "Alterando..." : "Alterar senha"}
            </button>
          </form>
        </section>

        <section className="conta-admin-card">
          <div className="conta-admin-titulo">
            <h2>Meus pedidos</h2>
          </div>

          <p className="conta-admin-descricao">
            Histórico de pedidos vinculados à sua conta.
          </p>

          <h3 style={{ marginBottom: "18px", fontSize: "18px" }}>
            Total de pedidos: {pedidos.length}
          </h3>

          {pedidos.length === 0 ? (
            <div className="conta-admin-vazio">
              Você ainda não possui pedidos vinculados a esta conta.
            </div>
          ) : (
            <div className="conta-admin-pedidos">
              {pedidos.map((pedido) => (
                <article className="conta-admin-pedido" key={pedido.id}>
                  <h3>Pedido #{pedido.id}</h3>

                  <p>Data: {formatarData(pedido.created_at)}</p>

                  <p>
                    Status:{" "}
                    <span className={`conta-status ${classeStatus(pedido.status)}`}>
                      {pedido.status || "Não informado"}
                    </span>
                  </p>

                  <p>Endereço: {pedido.endereco || "Não informado"}</p>

                  <p className="conta-admin-valor">
                    {formatarMoeda(pedido.valor_total)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="conta-admin-card">
          <div className="conta-admin-titulo">
            <h2>Sessão</h2>
          </div>

          <p className="conta-admin-descricao">
            Encerre seu acesso administrativo neste dispositivo.
          </p>

          <button className="conta-admin-sair" onClick={sairDaConta}>
            Sair da conta
          </button>
        </section>
      </main>

      <footer className="conta-admin-rodape">
        <p>© 2026 RANGO DOS GURI — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default MinhaContaAdmin;
