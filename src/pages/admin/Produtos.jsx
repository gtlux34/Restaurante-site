function Produtos() {
  return (
    <>
      <header>
        <h1>Produtos</h1>
        <a href="/admin">Voltar ao painel</a>
      </header>

      <nav>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
      </nav>

      <main>
        <h2>Gerenciar Produtos</h2>

        <a href="#">+ Cadastrar Produto</a>

        <section>
          <h3>Produtos cadastrados</h3>

          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Hambúrguer Especial</td>
                <td>Hambúrgueres</td>
                <td>R$ 29,90</td>
                <td>
                  <a href="#">Editar</a>
                  <a href="#">Excluir</a>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Pizza da Casa</td>
                <td>Pizzas</td>
                <td>R$ 49,90</td>
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

export default Produtos;