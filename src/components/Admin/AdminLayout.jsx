import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useSiteContext } from '../../contexts/SiteContext'

const AdminLayout = ({ children, title = 'Painel Administrativo' }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { siteConfig } = useSiteContext()

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
      
      <div className="min-h-screen bg-govgray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl relative border-r border-govgray-200">
          {/* Header do Sidebar */}
          <div className="p-6 border-b border-govgray-200 bg-govblue-600">
            <div className="flex items-center space-x-3">
              {siteConfig?.logoUrl ? (
                <img 
                  src={siteConfig.logoUrl} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-lg object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-govblue-600 font-bold text-sm">ST</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-blue-100 text-sm">Painel Administrativo</p>
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
                      ? 'bg-govblue-600 text-white'
                      : 'text-govgray-700 hover:bg-govblue-50 hover:text-govblue-600'
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
          <div className="absolute bottom-0 w-64 p-4 border-t border-govgray-200 bg-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-govgreen-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <div>
                <p className="text-govgray-800 text-sm font-medium">
                  {user?.name || 'Administrador'}
                </p>
                <p className="text-govgray-600 text-xs">Admin</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={navigateToHome}
                className="w-full flex items-center px-3 py-2 text-govgray-700 hover:bg-govblue-50 hover:text-govblue-600 rounded-lg transition-colors duration-200"
              >
                <span className="mr-2">🏠</span>
                <span className="text-sm">Ver Site</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
              >
                <span className="mr-2">🚪</span>
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-govgray-50">
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminLayout
