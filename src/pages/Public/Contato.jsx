import { useState } from "react";
import { supabase } from "../../supabase";

function Contato() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [retorno, setRetorno] = useState("");

  async function enviarMensagem(event) {
    event.preventDefault();
    setEnviando(true);
    setRetorno("");

    const { error } = await supabase
      .from("mensagens")
      .insert([{ nome, email, mensagem }]);

    if (error) {
      console.error(error);
      setRetorno("Não foi possível enviar sua mensagem.");
    } else {
      setRetorno("Mensagem enviada com sucesso!");
      setNome("");
      setEmail("");
      setMensagem("");
    }

    setEnviando(false);
  }

  return (
    <>
      <header>
        <h1>Restaurante RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>
          <a href="/login">Entrar</a>
        </nav>
      </header>

      <main>
        <h2>Contato</h2>

        <section>
          <h3>Informações de Contato</h3>
          <p>Email: contato@rangodosguri.com.br</p>
          <p>Telefone: (69) 6767-6969</p>
          <p>Endereço: Caixa prego, 123 - Cacoal/RO</p>
        </section>

        <section>
          <h3>Formulário de Contato</h3>

          <form onSubmit={enviarMensagem}>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="mensagem">Mensagem:</label>
            <textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
            />

            <button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>

          {retorno && <p>{retorno}</p>}
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Contato;
