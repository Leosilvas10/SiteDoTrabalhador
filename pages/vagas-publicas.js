import React from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const VagasPublicas = () => {
  const router = useRouter()
  
  useEffect(() => {
    // Redirecionar para a página principal de vagas
    router.push('/vagas')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-govblue-600 mb-4">
          Redirecionando...
        </h1>
        <p className="text-govgray-600">
          Você será redirecionado para as vagas em instantes.
        </p>
      </div>
    </div>
  )
}

export default VagasPublicas