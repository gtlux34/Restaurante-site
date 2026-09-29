import "./App.css";
function App() {
  return (
    <>
      <header>
        <h1>Restaurante RANGO DOS GURI</h1>

        <nav>
          <a href="index.html">Início</a>
          <a href="cardapio.html">Cardápio</a>
          <a href="categorias.html">Categorias</a>
          <a href="contato.html">Contato</a>
        </nav>
      </header>

      <main>

        <section>
          <h2>Bem-vindo ao Restaurante RANGO DOS GURI</h2>

          <p>
            Sabores especiais preparados com ingredientes selecionados
            para tornar sua experiência ainda melhor.
          </p>

          <a href="cardapio.html">Ver nosso cardápio</a>
        </section>

        <section>
          <h2>Produtos em destaque</h2>

          <article>
            <h3>Hambúrguer Especial</h3>

            <p>
              Hambúrguer artesanal com queijo, alface, tomate e molho especial.
            </p>

            <p>R$ 29,90</p>

            <a href="produto.html">Ver detalhes</a>
          </article>

          <article>
            <h3>Pizza da Casa</h3>

            <p>
              Pizza preparada com massa artesanal e ingredientes selecionados.
            </p>

            <p>R$ 49,90</p>

            <a href="produto.html">Ver detalhes</a>
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

          <a href="categorias.html">Ver todas as categorias</a>
        </section>

      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  )
}

export default App

