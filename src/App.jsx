
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Home from "./pages/Public/Home";
import Cardapio from "./pages/Public/Cardapio";
import Categorias from "./pages/Public/Categorias";
import Contato from "./pages/Public/Contato";
import Produto from "./pages/Public/Produto";
import Login from "./pages/Public/Login";
import Carrinho from "./pages/Public/Carrinho";
import FinalizarPedido from "./pages/Public/FinalizarPedido";

import Admin from "./pages/admin/Index";
import CategoriasAdmin from "./pages/admin/Categorias";
import Clientes from "./pages/admin/Clientes";
import Mensagens from "./pages/admin/Mensagens";
import Pedidos from "./pages/admin/Pedidos";
import Produtos from "./pages/admin/Produtos";

// Proteção das páginas administrativas
function ProtecaoAdmin({ children }) {
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function verificarUsuario() {
      const { data, error } = await supabase.auth.getUser();

      if (!ativo) return;

      if (
        !error &&
        data.user &&
        data.user.app_metadata?.role === "admin"
      ) {
        setAutorizado(true);
      } else {
        window.location.replace("/login");
      }

      setVerificando(false);
    }

    verificarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  if (verificando) {
    return <h2>Verificando acesso...</h2>;
  }

  if (!autorizado) {
    return null;
  }

  return children;
}

function App() {
  const pagina = window.location.pathname;

  if (pagina === "/") return <Home />;
  if (pagina === "/cardapio") return <Cardapio />;
  if (pagina === "/categorias") return <Categorias />;
  if (pagina === "/contato") return <Contato />;
  if (pagina === "/produto") return <Produto />;
  if (pagina === "/login") return <Login />;
  if (pagina === "/carrinho") return <Carrinho />;
  if (pagina === "/finalizar-pedido") return <FinalizarPedido />;

  if (pagina === "/admin")
    return <ProtecaoAdmin><Admin /></ProtecaoAdmin>;

  if (pagina === "/admin/categorias")
    return <ProtecaoAdmin><CategoriasAdmin /></ProtecaoAdmin>;

  if (pagina === "/admin/clientes")
    return <ProtecaoAdmin><Clientes /></ProtecaoAdmin>;

  if (pagina === "/admin/mensagens")
    return <ProtecaoAdmin><Mensagens /></ProtecaoAdmin>;

  if (pagina === "/admin/pedidos")
    return <ProtecaoAdmin><Pedidos /></ProtecaoAdmin>;

  if (pagina === "/admin/produtos")
    return <ProtecaoAdmin><Produtos /></ProtecaoAdmin>;

  return <h1>Página não encontrada</h1>;
}

export default App;
