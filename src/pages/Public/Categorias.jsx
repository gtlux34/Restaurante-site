function Categorias() {
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
        <h2>Categorias</h2>

        <section>
          <h3>Hambúrgueres</h3>
          <p>Confira nossos hambúrgueres artesanais preparados com ingredientes selecionados.</p>
          <a href="/cardapio">Ver hambúrgueres</a>
        </section>

        <section>
          <h3>Bebidas</h3>
          <p>Refrigerantes e outras opções para acompanhar sua refeição.</p>
          <a href="/cardapio">Ver bebidas</a>
        </section>

        <section>
          <h3>Sobremesas</h3>
          <p>Opções doces para finalizar sua experiência no RANGO DOS GURI.</p>
          <a href="/cardapio">Ver sobremesas</a>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Categorias;