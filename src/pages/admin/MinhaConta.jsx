
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function MinhaContaAdmin() {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarUsuario() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setErro("Não foi possível carregar os dados da conta.");
      } else {
        setEmail(data.user.email || "");
      }

      setCarregando(false);
    }

    buscarUsuario();
  }, []);

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

    setSalvando(true);

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

    setSalvando(false);
  }

  if (carregando) {
    return <p>Carregando dados da conta...</p>;
  }

  return (
    <>
      <header>
        <h1>Minha Conta Administrativa</h1>
        <p>RANGO DOS GURI</p>
      </header>

      <nav>
        <a href="/admin">Painel</a>
        <a href="/">Início</a>
      </nav>

      <main className="minha-conta-admin">
        <h2>Dados da conta</h2>

        <section>
          <h3>E-mail cadastrado</h3>
          <p>{email}</p>
        </section>

        <section>
          <h2>Alterar senha</h2>
          <p>Cadastre uma nova senha para sua conta administrativa.</p>

          <form onSubmit={alterarSenha}>
            <label htmlFor="nova-senha">Nova senha</label>
            <input
              id="nova-senha"
              type="password"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
              placeholder="Digite a nova senha"
              minLength={6}
              required
            />

            <label htmlFor="confirmar-senha">Confirmar nova senha</label>
            <input
              id="confirmar-senha"
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              placeholder="Digite novamente a nova senha"
              minLength={6}
              required
            />

            {erro && <p role="alert">{erro}</p>}
            {mensagem && <p role="status">{mensagem}</p>}

            <button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Alterar senha"}
            </button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default MinhaContaAdmin;
