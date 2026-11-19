
import { useState } from "react";
import { supabase } from "../../supabase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();

    setErro("");
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

    // Verifica se o usuário é administrador
    if (data.user?.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      setErro("Você não tem permissão para acessar o painel administrativo.");
      setCarregando(false);
      return;
    }

    // Acesso autorizado
    window.location.href = "/admin";
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
            <h2>Acesso ao sistema</h2>
            <p>Entre na sua conta para acessar o restaurante.</p>
          </div>

          <div id="autenticacao" className="autenticacao">
            <div className="autenticacao-cabecalho">
              <h2>Entrar</h2>
              <p>Acesse sua conta de administrador</p>
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
                  required
                />
              </div>

              {erro && <p style={{ color: "red" }}>{erro}</p>}

              <button type="submit" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
