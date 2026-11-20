import { supabase } from "./supabase";

// Formata um número como moeda brasileira (ex.: R$ 12,50)
export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Encerra a sessão do usuário e volta para a página inicial
export async function sairConta() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    alert("Não foi possível sair da conta.");
    return;
  }

  window.location.replace("/");
}
