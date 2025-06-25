import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../src/components/Admin/AdminLayout'
import DashboardStats from '../../src/components/Admin/DashboardStats'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('admin_token')
      const adminUser = localStorage.getItem('admin_user')

      console.log('Verificando autenticação no dashboard...', { adminToken, adminUser })

      if (!adminToken || adminToken !== 'admin_authenticated') {
        console.log('Token inválido, redirecionando...')
        router.push('/admin/login')
        return
      }

      if (adminUser) {
        try {
          const userData = JSON.parse(adminUser)
          if (userData.authenticated) {
            setUser(userData)
            setIsAuthenticated(true)
            setLoading(false)
            console.log('Usuário autenticado com sucesso!')
          } else {
            router.push('/admin/login')
          }
        } catch (e) {
          console.error('Erro no parse dos dados:', e)
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    }

    // Pequeno delay para garantir que o localStorage está disponível
    setTimeout(checkAuth, 100)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-govgray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-12 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govblue-600 mx-auto mb-4"></div>
          <p className="text-govgray-600 font-medium">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Head>
        <title>Dashboard Admin - Site do Trabalhador</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-govblue-600 mb-2">Dashboard Administrativo</h1>
            <p className="text-govgray-600">Bem-vindo ao painel de controle do Site do Trabalhador</p>
          </div>
          
          <DashboardStats />

          {/* Ações Rápidas */}
          <div className="bg-white rounded-xl p-6 mt-8 shadow-lg border border-govgray-200">
            <h2 className="text-xl font-semibold text-govblue-600 mb-6 flex items-center">
              <span className="mr-2">⚡</span>
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => router.push('/admin/vagas/nova')}
                className="bg-govblue-600 hover:bg-govblue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <span>+</span>
                <span>Nova Vaga</span>
              </button>
              <button 
                onClick={() => router.push('/admin/leads')}
                className="bg-govgreen-600 hover:bg-govgreen-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <span>📊</span>
                <span>Ver Leads</span>
              </button>
              <button 
                onClick={() => router.push('/admin/conteudo')}
                className="bg-govyellow-500 hover:bg-govyellow-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <span>✏️</span>
                <span>Editar Site</span>
              </button>
              <button 
                onClick={() => router.push('/admin/empresas')}
                className="bg-govgray-600 hover:bg-govgray-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <span>🏢</span>
                <span>Empresas</span>
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}