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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
          <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
          <DashboardStats />

          {/* Ações Rápidas */}
          <div className="bg-slate-800 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => router.push('/admin/vagas/nova')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span>Nova Vaga</span>
              </button>
              <button 
                onClick={() => router.push('/admin/leads')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>📊</span>
                <span>Ver Leads</span>
              </button>
              <button 
                onClick={() => router.push('/admin/conteudo')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>✏️</span>
                <span>Editar Site</span>
              </button>
              <button 
                onClick={() => router.push('/admin/empresas')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
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