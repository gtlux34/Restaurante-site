import "./Login.css";

function Login() {
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

        <a href="#autenticacao" className="botao-entrar">
          Entrar
        </a>
      </header>

      <main>
        <section id="inicio" className="inicio">

          <div className="apresentacao">
            <span>RANGO DOS GURI</span>

            <h2>Acesso ao sistema</h2>

            <p>
              Entre na sua conta para acessar o restaurante.
            </p>
          </div>

          <div id="autenticacao" className="autenticacao">

            <div className="autenticacao-cabecalho">
              <h2>Entrar</h2>
              <p>Acesse sua conta</p>
            </div>

            <form>

              <div className="campo">
                <label htmlFor="email">E-mail</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="senha">Senha</label>

                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <div className="opcoes-login">
                <label>
                  <input type="checkbox" name="lembrar" />
                  Lembrar-me
                </label>

                <a href="#">Esqueci minha senha</a>
              </div>

              <button type="submit">
                Entrar
              </button>

            </form>

            <div className="cadastro">
              <p>Não possui uma conta?</p>

              <a href="#">
                Criar conta
              </a>
            </div>

          </div>

        </section>

        <section id="cardapio" className="cardapio">
          <a href="/cardapio">
            Cardápio
          </a>
        </section>

        <section id="contato" className="contato">

          <div className="contato-conteudo">
            <span>CONTATO</span>

            <h2>Contato</h2>

            <div className="contato-info">

              <div>
                <strong>Telefone</strong>
                <p>(00) 00000-0000</p>
              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default Login;
