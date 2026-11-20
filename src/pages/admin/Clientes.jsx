
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, telefone, endereco_casa, tipo")
      .eq("tipo", "cliente")
      .order("nome", { ascending: true });

    if (error) {
      console.error(error);
      setErro("Não foi possível carregar os clientes: " + error.message);
      setClientes([]);
    } else {
      setClientes(data || []);
    }

    setCarregando(false);
  }

  async function sairConta() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Não foi possível sair da conta.");
      return;
    }

    window.location.replace("/");
  }

  return (
    <>
      <header>
        <h1>Clientes - RANGO DOS GURI</h1>
        <a href="/admin">Voltar ao painel</a>
      </header>

      <nav>
        <a href="/admin">Painel</a>
        <a href="/admin/produtos">Produtos</a>
        <a href="/admin/categorias">Categorias</a>
        <a href="/admin/pedidos">Pedidos</a>
        <a href="/admin/clientes">Clientes</a>
        <a href="/admin/mensagens">Mensagens</a>
        <a href="/admin/minha-conta">Minha Conta</a>

        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            sairConta();
          }}
        >
          Sair
        </a>
      </nav>

      <main>
        <h2>Gerenciar Clientes</h2>
        <p>Visualize os clientes cadastrados no restaurante.</p>

        <h3>Total de clientes: {clientes.length}</h3>

        <button
          type="button"
          onClick={carregarClientes}
          disabled={carregando}
        >
          {carregando ? "Carregando..." : "Atualizar clientes"}
        </button>

        {erro && (
          <p style={{ color: "#dc2626" }}>
            {erro}
          </p>
        )}

        {carregando ? (
          <p>Carregando clientes...</p>
        ) : clientes.length === 0 ? (
          <p>Nenhum cliente cadastrado.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "20px" }}>
            <table border="1" cellPadding="10" width="100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nome || "Não informado"}</td>
                    <td>{cliente.telefone || "Não informado"}</td>
                    <td>{cliente.endereco_casa || "Não informado"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setClienteSelecionado(cliente)}
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {clienteSelecionado && (
          <section
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginTop: "25px",
              borderRadius: "8px",
            }}
          >
            <h2>Detalhes do cliente</h2>

            <p><strong>ID:</strong> {clienteSelecionado.id}</p>
            <p><strong>Nome:</strong> {clienteSelecionado.nome || "Não informado"}</p>
            <p><strong>Telefone:</strong> {clienteSelecionado.telefone || "Não informado"}</p>
            <p><strong>Endereço:</strong> {clienteSelecionado.endereco_casa || "Não informado"}</p>
            <p><strong>Tipo de conta:</strong> {clienteSelecionado.tipo}</p>

            <button
              type="button"
              onClick={() => setClienteSelecionado(null)}
            >
              Fechar detalhes
            </button>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 Restaurante RANGO DOS GURI</p>
      </footer>
    </>
  );
}

export default Clientes;
