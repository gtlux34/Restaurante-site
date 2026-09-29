function Contato() {
  return (
    <>
      <header>
        <h1>Restaurante RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>
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

          <form action="enviar_contato.php" method="POST">
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="mensagem">Mensagem:</label>
            <textarea id="mensagem" name="mensagem" required></textarea>

            <button type="submit">Enviar</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Contato;