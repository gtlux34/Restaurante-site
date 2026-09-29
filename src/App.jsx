import Home from "./pages/Public/Home";
import Cardapio from "./pages/Public/Cardapio";
import Categorias from "./pages/Public/Categorias";
import Contato from "./pages/Public/Contato";
import Produto from "./pages/Public/Produto";

import Admin from "./pages/admin/Index";
import CategoriasAdmin from "./pages/admin/Categorias";
import Clientes from "./pages/admin/Clientes";
import Mensagens from "./pages/admin/Mensagens";
import Pedidos from "./pages/admin/Pedidos";
import Produtos from "./pages/admin/Produtos";

function App() {
  const pagina = window.location.pathname;

  if (pagina === "/") {
    return <Home />;
  }

  if (pagina === "/cardapio") {
    return <Cardapio />;
  }

  if (pagina === "/categorias") {
    return <Categorias />;
  }

  if (pagina === "/contato") {
    return <Contato />;
  }

  if (pagina === "/produto") {
    return <Produto />;
  }

  if (pagina === "/admin") {
    return <Admin />;
  }

  if (pagina === "/admin/categorias") {
    return <CategoriasAdmin />;
  }

  if (pagina === "/admin/clientes") {
    return <Clientes />;
  }

  if (pagina === "/admin/mensagens") {
    return <Mensagens />;
  }

  if (pagina === "/admin/pedidos") {
    return <Pedidos />;
  }

  if (pagina === "/admin/produtos") {
    return <Produtos />;
  }

  return <h1>Página não encontrada</h1>;
}

export default App;