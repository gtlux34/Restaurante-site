function Home() {
  return (
    <>
      <header>
        <h1>Restaurante RANGO DOS GURI</h1>

        <nav>
          <a href="/">Início</a>
          <a href="/cardapio">Cardápio</a>
          <a href="/categorias">Categorias</a>
          <a href="/contato">Contato</a>
          <a href="/admin">Área Administrativa</a>
        </nav>
      </header>

      <main>
        <section>
          <h2>Bem-vindo ao Restaurante RANGO DOS GURI</h2>

          <p>
            Sabores especiais preparados com ingredientes selecionados
            para tornar sua experiência ainda melhor.
          </p>

          <a href="/cardapio">Ver nosso cardápio</a>
        </section>

        <section>
          <h2>Produtos em destaque</h2>

          <article>
            <h3>Hambúrguer Especial</h3>
            <p>
              Hambúrguer artesanal com queijo, alface, tomate e molho especial.
            </p>
            <p>R$ 29,90</p>
            <a href="/produto">Ver detalhes</a>
          </article>

          <article>
            <h3>Pizza da Casa</h3>
            <p>
              Pizza preparada com massa artesanal e ingredientes selecionados.
            </p>
            <p>R$ 49,90</p>
            <a href="/produto">Ver detalhes</a>
          </article>
        </section>

        <section>
          <h2>Conheça nossas categorias</h2>

          <ul>
            <li>Hambúrgueres</li>
            <li>Pizzas</li>
            <li>Bebidas</li>
            <li>Sobremesas</li>
          </ul>

          <a href="/categorias">Ver todas as categorias</a>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Home;