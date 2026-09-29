function Cardapio() {
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
        <h2>Nosso Cardápio</h2>

        <section>
          <h3>Hambúrgueres</h3>

          <article>
            <h4>Rango Burger</h4>
            <p>Hambúrguer artesanal, queijo, alface, tomate e molho especial.</p>
            <p>R$ 29,90</p>
            <a href="/produto">Ver detalhes</a>
          </article>

          <article>
            <h4>Guri Bacon</h4>
            <p>Hambúrguer artesanal, queijo, bacon crocante e molho da casa.</p>
            <p>R$ 34,90</p>
            <a href="/produto">Ver detalhes</a>
          </article>
        </section>

        <section>
          <h3>Bebidas</h3>

          <article>
            <h4>Refrigerante</h4>
            <p>Refrigerante lata 350ml.</p>
            <p>R$ 6,00</p>
            <a href="/produto">Ver detalhes</a>
          </article>
        </section>

        <section>
          <h3>Sobremesas</h3>

          <article>
            <h4>Brownie</h4>
            <p>Brownie de chocolate com cobertura especial.</p>
            <p>R$ 12,00</p>
            <a href="/produto">Ver detalhes</a>
          </article>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Cardapio;