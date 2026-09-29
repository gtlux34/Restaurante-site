function CategoriasAdmin() {
  return (
    <>
      <header>
        <h1>Categorias</h1>
        <a href="/admin">Voltar ao painel</a>
        <a href="/">← Voltar para o site</a>
      </header>

      <nav>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
      </nav>

      <main>
        <h2>Gerenciar Categorias</h2>

        <a href="#">+ Cadastrar Categoria</a>

        <section>
          <h3>Categorias cadastradas</h3>

          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Hambúrgueres</td>
                <td>
                  <a href="#">Editar</a>
                  <a href="#">Excluir</a>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Pizzas</td>
                <td>
                  <a href="#">Editar</a>
                  <a href="#">Excluir</a>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Bebidas</td>
                <td>
                  <a href="#">Editar</a>
                  <a href="#">Excluir</a>
                </td>
              </tr>

              <tr>
                <td>4</td>
                <td>Sobremesas</td>
                <td>
                  <a href="#">Editar</a>
                  <a href="#">Excluir</a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default CategoriasAdmin;
