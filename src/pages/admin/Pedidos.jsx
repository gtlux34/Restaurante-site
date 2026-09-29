function Pedidos() {
  return (
    <>
      <header>
        <h1>Pedidos</h1>
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
        <h2>Gerenciar Pedidos</h2>

        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Andre Silva</td>
              <td>28/09/2026</td>
              <td>R$ 79,80</td>
              <td>Em preparo</td>
              <td>
                <a href="#">Visualizar</a>
                <a href="#">Editar</a>
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>Maria Santos</td>
              <td>28/09/2026</td>
              <td>R$ 49,90</td>
              <td>Entregue</td>
              <td>
                <a href="#">Visualizar</a>
                <a href="#">Editar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Pedidos;