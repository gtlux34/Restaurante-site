
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "./Login.css";

// Página aberta pelo link "Esqueceu sua senha?" enviado por e-mail.
// O Supabase lê o link automaticamente e cria uma sessão temporária,
// que permite trocar a senha com updateUser.
function RedefinirSenha() {
  const [linkValido, setLinkValido] = useState(null); // null = verificando
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (evento === "PASSWORD_RECOVERY" || session) {
        setLinkValido(true);
      }
    });

    // Dá tempo para o Supabase processar o link antes de considerar inválido
    const temporizador = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setLinkValido(!!data.session);
    }, 1500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(temporizador);
    };
  }, []);

  async function salvarNovaSenha(event) {
    event.preventDefault();
    setErro("");

    if (novaSenha.length < 6) {
      setErro("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase.auth.updateUser({ password: novaSenha });

    if (error) {
      setErro("Não foi possível alterar a senha: " + error.message);
      setSalvando(false);
      return;
    }

    // Encerra a sessão temporária para o usuário entrar com a nova senha
    await supabase.auth.signOut();

    setSucesso(true);
    setSalvando(false);
  }

  return (
    <div className="login-page">
      <header>
        <h1>RANGO DOS GURI</h1>

        <nav>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/cardapio">Cardápio</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="inicio">
          <div className="apresentacao">
            <span>RANGO DOS GURI</span>
            <h2>Nova senha</h2>
            <p>Crie uma nova senha para voltar a aproveitar nosso restaurante.</p>

            <img
              src="/mascote3.png"
              alt="Mascote Rango dos Guri"
              className="login-mascote"
            />
          </div>

          <div className="autenticacao">
            <div className="autenticacao-cabecalho">
              <h2>Redefinir senha</h2>
            </div>

            {sucesso ? (
              <>
                <p className="login-mensagem sucesso">
                  Senha alterada com sucesso! Entre com a sua nova senha.
                </p>
                <p>
                  <a href="/login">Ir para o login</a>
                </p>
              </>
            ) : linkValido === null ? (
              <p>Verificando o link...</p>
            ) : !linkValido ? (
              <>
                <p className="login-mensagem erro">
                  Este link é inválido ou expirou. Peça um novo link na tela de
                  login, em "Esqueceu sua senha?".
                </p>
                <p>
                  <a href="/login">Voltar para o login</a>
                </p>
              </>
            ) : (
              <form onSubmit={salvarNovaSenha}>
                <div className="campo">
                  <label htmlFor="nova-senha">Nova senha</label>
                  <input
                    type="password"
                    id="nova-senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="confirmar-senha">Confirmar nova senha</label>
                  <input
                    type="password"
                    id="confirmar-senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Digite a nova senha novamente"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>

                {erro && <p className="login-mensagem erro">{erro}</p>}

                <button type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar nova senha"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default RedefinirSenha;
