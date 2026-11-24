
import { useState } from "react";
import { supabase } from "../../supabase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();

    setErro("");
    setMensagem("");
    setCarregando(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha incorretos.");
      setCarregando(false);
      return;
    }

    if (data.user?.app_metadata?.role === "admin") {
      window.location.assign("/admin");
      return;
    }

    const { data: usuario, error: erroUsuario } = await supabase
      .from("usuarios")
      .select("tipo")
      .eq("id", data.user.id)
      .maybeSingle();

    if (erroUsuario || usuario?.tipo !== "cliente") {
      await supabase.auth.signOut();
      setErro(
        "Não foi possível identificar seu cadastro. Entre em contato com o restaurante."
      );
      setCarregando(false);
      return;
    }

    juntarCarrinhoVisitante(data.user.id);

    const voltar = new URLSearchParams(window.location.search).get("voltar");

    const destinoSeguro =
      voltar && voltar.startsWith("/") && !voltar.startsWith("//")
        ? voltar
        : "/";

    window.location.assign(destinoSeguro);
  }

  async function recuperarSenha(e) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Digite seu e-mail para recuperar sua senha.");
      return;
    }

    setEnviandoRecuperacao(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      }
    );

    if (error) {
      setErro("Não foi possível enviar o e-mail. Tente novamente.");
    } else {
      setMensagem(
        "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha. Verifique também sua caixa de spam."
      );
    }

    setEnviandoRecuperacao(false);
  }

  function juntarCarrinhoVisitante(usuarioId) {
    try {
      const visitante = JSON.parse(
        localStorage.getItem("carrinho_visitante") || "[]"
      );

      if (visitante.length === 0) return;

      const chaveUsuario = `carrinho_${usuarioId}`;
      const carrinhoUsuario = JSON.parse(
        localStorage.getItem(chaveUsuario) || "[]"
      );

      for (const item of visitante) {
        const existente = carrinhoUsuario.find(
          (atual) => atual.id === item.id
        );

        if (existente) {
          existente.quantidade =
            Number(existente.quantidade) + Number(item.quantidade);
        } else {
          carrinhoUsuario.push(item);
        }
      }

      localStorage.setItem(
        chaveUsuario,
        JSON.stringify(carrinhoUsuario)
      );

      localStorage.removeItem("carrinho_visitante");
    } catch (error) {
      console.error("Erro ao juntar carrinho:", error);
    }
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
        <section id="inicio" className="inicio">
          <div className="apresentacao">
            <span>RANGO DOS GURI</span>
            <h2>Bem-vindo!</h2>
            <p>Entre na sua conta para aproveitar nosso restaurante.</p>

            <img
              src="/mascote3.png"
              alt="Mascote Rango dos Guri"
              className="login-mascote"
            />
          </div>

          <div id="autenticacao" className="autenticacao">
            <div className="autenticacao-cabecalho">
              <h2>Entrar</h2>
              <p>Acesse sua conta de cliente ou administrador.</p>
            </div>

            <form onSubmit={fazerLogin}>
              <div className="campo">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="login-recuperar">
                <button
                  type="button"
                  onClick={recuperarSenha}
                  disabled={enviandoRecuperacao}
                >
                  {enviandoRecuperacao
                    ? "ENVIANDO LINK..."
                    : "ESQUECEU SUA SENHA? →"}
                </button>
              </div>

              {erro && (
                <p className="login-mensagem erro">
                  {erro}
                </p>
              )}

              {mensagem && (
                <p className="login-mensagem sucesso">
                  {mensagem}
                </p>
              )}

              <button type="submit" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p>
              Ainda não tem uma conta?{" "}
              <a href="/cadastro">Cadastre-se</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
