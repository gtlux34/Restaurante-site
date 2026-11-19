
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Home from "./pages/Public/Home";
import Cardapio from "./pages/Public/Cardapio";
import Categorias from "./pages/Public/Categorias";
import Contato from "./pages/Public/Contato";
import Produto from "./pages/Public/Produto";
import Login from "./pages/Public/Login";
import Cadastro from "./pages/Public/Cadastro";
import Carrinho from "./pages/Public/Carrinho";
import FinalizarPedido from "./pages/Public/FinalizarPedido";
import MinhaConta from "./pages/Public/MinhaConta";

import Admin from "./pages/admin/Index";
import CategoriasAdmin from "./pages/admin/Categorias";
import Clientes from "./pages/admin/Clientes";
import Mensagens from "./pages/admin/Mensagens";
import Pedidos from "./pages/admin/Pedidos";
import Produtos from "./pages/admin/Produtos";
import MinhaContaAdmin from "./pages/admin/MinhaConta";

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
  // Verifica se a navegação veio de outra página
  const [carregando, setCarregando] = useState(() => {
    const veioDeOutraPagina =
      sessionStorage.getItem("transicaoPagina") === "sim";

    if (veioDeOutraPagina) {
      sessionStorage.removeItem("transicaoPagina");
    }

    return veioDeOutraPagina;
  });

  // Remove a tela de carregamento após a transição
  useEffect(() => {
    if (!carregando) return;

    const temporizador = setTimeout(() => {
      setCarregando(false);
    }, 450);

    return () => clearTimeout(temporizador);
  }, [carregando]);

  // Detecta cliques em links internos
  useEffect(() => {
    function detectarNavegacao(event) {
      const link = event.target.closest("a");

      if (!link) return;

      // Ignora links que abrem em outra aba ou downloads
      if (
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const destino = new URL(link.href, window.location.href);

      // Ignora links externos
      if (destino.origin !== window.location.origin) return;

      // Ignora links para a própria página
      if (destino.pathname === window.location.pathname) return;

      sessionStorage.setItem("transicaoPagina", "sim");
    }

    document.addEventListener("click", detectarNavegacao);

    return () => {
      document.removeEventListener("click", detectarNavegacao);
    };
  }, []);

  const pagina = window.location.pathname;

  let conteudo;

  if (pagina === "/") conteudo = <Home />;
  else if (pagina === "/cardapio") conteudo = <Cardapio />;
  else if (pagina === "/categorias") conteudo = <Categorias />;
  else if (pagina === "/contato") conteudo = <Contato />;
  else if (pagina === "/produto") conteudo = <Produto />;
  else if (pagina === "/login") conteudo = <Login />;
  else if (pagina === "/cadastro") conteudo = <Cadastro />;
  else if (pagina === "/carrinho") conteudo = <Carrinho />;
  else if (pagina === "/finalizar-pedido") conteudo = <FinalizarPedido />;
  else if (pagina === "/minha-conta") conteudo = <MinhaConta />;

  else if (pagina === "/admin")
    conteudo = <ProtecaoAdmin><Admin /></ProtecaoAdmin>;

  else if (pagina === "/admin/categorias")
    conteudo = <ProtecaoAdmin><CategoriasAdmin /></ProtecaoAdmin>;

  else if (pagina === "/admin/clientes")
    conteudo = <ProtecaoAdmin><Clientes /></ProtecaoAdmin>;

  else if (pagina === "/admin/mensagens")
    conteudo = <ProtecaoAdmin><Mensagens /></ProtecaoAdmin>;

  else if (pagina === "/admin/pedidos")
    conteudo = <ProtecaoAdmin><Pedidos /></ProtecaoAdmin>;

  else if (pagina === "/admin/produtos")
    conteudo = <ProtecaoAdmin><Produtos /></ProtecaoAdmin>;

  else if (pagina === "/admin/minha-conta")
    conteudo = <ProtecaoAdmin><MinhaContaAdmin /></ProtecaoAdmin>;

  else conteudo = <h1>Página não encontrada</h1>;

  return (
    <>
      {conteudo}

      {carregando && (
        <div className="transicao-carregamento">
          <div className="transicao-conteudo">
            <div className="transicao-spinner"></div>
            <h2>RANGO DOS GURI</h2>
            <p>VEM PRO RANGO!</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
