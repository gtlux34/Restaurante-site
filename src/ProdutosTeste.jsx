
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function ProdutosTeste() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    buscarProdutos()
  }, [])

  async function buscarProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      setErro(error.message)
    } else {
      setProdutos(data)
    }

    setCarregando(false)
  }

  if (carregando) {
    return <p>Carregando produtos...</p>
  }

  if (erro) {
    return <p>Erro ao buscar produtos: {erro}</p>
  }

  return (
    <div>
      <h1>Produtos do Restaurante</h1>

      {produtos.map((produto) => (
        <div key={produto.id}>
          <h3>{produto.nome}</h3>
          <p>{produto.descricao}</p>
          <p>R$ {Number(produto.preco).toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

export default ProdutosTeste
