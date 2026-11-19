
import { useState } from "react";
import { supabase } from "../../supabase";
import "./Login.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          telefone,
        },
      },
    });

    if (error) {
      setErro(error.message);
      setCarregando(false);
      return;
    }

    if (data.session) {
      window.location.href = "/";
      return;
    }

    setSucesso(
      "Cadastro realizado! Verifique seu e-mail para confirmar sua conta."
    );
    setCarregando(false);
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
            <li><a href="/login">Entrar</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="inicio" className="inicio">
          <div className="apresentacao">
            <span>RANGO DOS GURI</span>
            <h2>Crie sua conta</h2>
            <p>Cadastre-se para fazer seus pedidos!</p>
          </div>

          <div id="autenticacao" className="autenticacao">
            <div className="autenticacao-cabecalho">
              <h2>Cadastrar</h2>
              <p>Preencha seus dados para criar sua conta.</p>
            </div>

            <form onSubmit={cadastrar}>
              <div className="campo">
                <label htmlFor="nome">Nome completo</label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Digite seu telefone"
                />
              </div>

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
                  placeholder="Crie uma senha"
                  minLength={6}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="confirmarSenha">Confirmar senha</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              {erro && <p style={{ color: "red" }}>{erro}</p>}

              {sucesso && (
                <p style={{ color: "green" }}>{sucesso}</p>
              )}

              <button type="submit" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Criar minha conta"}
              </button>
            </form>

            <p>
              Já tem uma conta? <a href="/login">Entrar</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Cadastro;
