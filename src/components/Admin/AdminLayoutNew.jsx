import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const AdminLayout = ({ children, title = 'Painel Administrativo' }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('admin_token')
      const adminUser = localStorage.getItem('admin_user')

      console.log('Verificando autenticação...', { adminToken, adminUser })

      if (!adminToken || adminToken !== 'admin_authenticated') {
        console.log('Token inválido, redirecionando para login')
        router.push('/admin/login')
        return
      }

      if (adminUser) {
        try {
          const userData = JSON.parse(adminUser)
          console.log('Dados do usuário:', userData)
          if (userData.authenticated) {
            setUser(userData)
            setLoading(false)
          } else {
            console.log('Usuário não autenticado')
            router.push('/admin/login')
          }
        } catch (e) {
          console.error('Erro ao parsear dados do usuário:', e)
          router.push('/admin/login')
        }
      } else {
        console.log('Dados do usuário não encontrados')
        router.push('/admin/login')
      }
    }

    // Pequeno delay para garantir que o localStorage está disponível
    setTimeout(checkAuth, 100)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    console.log('Logout realizado')
    router.push('/admin/login')
  }

  const navigateToHome = () => {
    router.push('/')
  }

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin', active: router.pathname === '/admin' },
    { name: 'Vagas', icon: '💼', path: '/admin/vagas', active: router.pathname.includes('/admin/vagas') },
    { name: 'Leads', icon: '👥', path: '/admin/leads', active: router.pathname === '/admin/leads' },
    { name: 'Empresas', icon: '🏢', path: '/admin/empresas', active: router.pathname === '/admin/empresas' },
    { name: 'Usuários', icon: '👤', path: '/admin/usuarios', active: router.pathname === '/admin/usuarios' },
    { name: 'Conteúdo', icon: '📝', path: '/admin/conteudo', active: router.pathname === '/admin/conteudo' },
    { name: 'Configurações', icon: '⚙️', path: '/admin/configuracoes', active: router.pathname === '/admin/configuracoes' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{title} - Site do Trabalhador</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-slate-900 flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 shadow-xl relative">
          {/* Header do Sidebar */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-slate-400 text-sm">Painel Administrativo</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                    item.active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-auto text-xs">↗</span>
                </button>
              ))}
            </div>
          </nav>

          {/* User Info & Actions */}
          <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {user?.name || 'Administrador'}
                </p>
                <p className="text-slate-400 text-xs">Admin</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={navigateToHome}
                className="w-full flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200"
              >
                <span className="mr-2">🏠</span>
                <span className="text-sm">Ver Site</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
              >
                <span className="mr-2">🚪</span>
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Admin Header sem nav menu */}
          <header className="bg-slate-800 shadow-sm border-b border-slate-700">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ST</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <p className="text-slate-400 text-sm mt-1">
                      Painel Administrativo - Site do Trabalhador
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={navigateToHome}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-2">🏠</span>
                    Ver Site
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-8 overflow-y-auto bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminLayout
