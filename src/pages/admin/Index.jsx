function Admin() {
  return (
    <>
      <header>
        <h1>Painel Administrativo</h1>
        <p>Restaurante RANGO DOS GURI</p>
      </header>

      <nav>
        <a href="/">Início</a>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
      </nav>

      <main>
        <h2>Bem-vindo ao Painel Administrativo</h2>

        <p>
          Utilize o menu acima para administrar as informações
          do restaurante.
        </p>

        <section>
          <h2>Gerenciamento</h2>

          <article>
            <h3>Produtos</h3>
            <p>Cadastre, visualize, edite e exclua produtos.</p>
            <a href="/admin/produtos">Gerenciar produtos</a>
          </article>

          <article>
            <h3>Categorias</h3>
            <p>Gerencie as categorias dos produtos.</p>
            <a href="/admin/categorias">Gerenciar categorias</a>
          </article>

          <article>
            <h3>Pedidos</h3>
            <p>Visualize e gerencie os pedidos realizados.</p>
            <a href="/admin/pedidos">Gerenciar pedidos</a>
          </article>

          <article>
            <h3>Clientes</h3>
            <p>Visualize e gerencie os clientes cadastrados.</p>
            <a href="/admin/clientes">Gerenciar clientes</a>
          </article>

          <article>
            <h3>Mensagens</h3>
            <p>
              Visualize as mensagens recebidas pelo formulário de contato.
            </p>
            <a href="/admin/mensagens">Ver mensagens</a>
          </article>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Admin;