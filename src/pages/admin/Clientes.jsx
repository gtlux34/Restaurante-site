function Clientes() {
  return (
    <>
      <header>
        <h1>Clientes</h1>
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
        <h2>Gerenciar Clientes</h2>

        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>João Silva</td>
              <td>joao@email.com</td>
              <td>(69) 99999-9999</td>
              <td>
                <a href="#">Visualizar</a>
                <a href="#">Editar</a>
                <a href="#">Excluir</a>
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>Maria Santos</td>
              <td>maria@email.com</td>
              <td>(69) 98888-8888</td>
              <td>
                <a href="#">Visualizar</a>
                <a href="#">Editar</a>
                <a href="#">Excluir</a>
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

export default Clientes;