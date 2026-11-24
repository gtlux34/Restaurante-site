# 🍔 RANGO DOS GURI

### Sistema Web para Pedidos e Gerenciamento de Restaurante

O **RANGO DOS GURI** é um projeto acadêmico desenvolvido para simular o funcionamento de um restaurante online. A plataforma permite que os clientes visualizem o cardápio, escolham produtos, adicionem itens ao carrinho e realizem pedidos.

O sistema também conta com um painel administrativo para o gerenciamento dos produtos, categorias e pedidos.

---

## 🚀 Funcionalidades

### 👤 Área do Cliente

- Cadastro e login de usuários.
- Autenticação integrada ao Supabase.
- Recuperação de senha por e-mail.
- Visualização do cardápio.
- Navegação por categorias.
- Detalhes dos produtos.
- Adição e remoção de produtos do carrinho.
- Finalização de pedidos.
- Escolha de formas de pagamento para demonstração.
- Gerenciamento dos dados da própria conta.

### ⚙️ Painel Administrativo

- Acesso exclusivo para administradores.
- Cadastro, edição e exclusão de produtos.
- Gerenciamento de categorias.
- Visualização e gerenciamento de pedidos.
- Gerenciamento da conta administrativa.

### 🛒 Sistema de Pedidos

- Carrinho de compras.
- Identificação dos dados do cliente.
- Cadastro de endereço e telefone.
- Resumo dos produtos e valores.
- Registro dos pedidos no banco de dados.

> **Observação:** as opções de pagamento são demonstrativas. O sistema não realiza transações financeiras reais.

---

## 💻 Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| React | Construção das interfaces |
| Vite | Ambiente de desenvolvimento |
| JavaScript | Lógica da aplicação |
| CSS | Estilização das páginas |
| Supabase | Banco de dados e autenticação |
| Git | Controle de versão |
| GitHub | Hospedagem do repositório e colaboração |

---

## 📂 Estrutura do Projeto

```text
Restaurante-site/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── Admin/
│   │   └── Public/
│   ├── App.jsx
│   ├── main.jsx
│   ├── supabase.js
│   └── utils.js
├── index.html
├── package.json
└── README.md