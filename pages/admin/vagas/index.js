
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

export default function AdminVagas() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vagas, setVagas] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar se está autenticado
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      carregarVagasReais()
    }
    setLoading(false)
  }, [])

  const carregarVagasReais = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Carregando vagas reais no painel admin (mesmas da home)...')

      // Usar EXATAMENTE a mesma API da página principal com cache busting
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/fetch-jobs?t=${timestamp}&admin=true`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data && Array.isArray(data.data)) {
        setVagas(data.data)
        setLastUpdate(new Date())
        console.log(`✅ ${data.data.length} vagas reais carregadas no painel admin (mesmas da home)`)
        console.log('📊 Fontes das vagas:', data.data.map(v => v.source).filter((v, i, a) => a.indexOf(v) === i))
      } else {
        console.error('Erro na resposta da API:', data.message || 'Dados inválidos')
        setError(data.message || 'Dados inválidos recebidos')
        setVagas([])
      }
    } catch (error) {
      console.error('Erro ao carregar vagas reais:', error)
      setError(`Erro ao carregar vagas: ${error.message}`)
      setVagas([])
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Data inválida'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Carregando vagas reais...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Gestão de Vagas - Admin</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Vagas Reais do Site</h2>
                <p className="text-slate-400 mt-1">
                  Estas são exatamente as mesmas vagas exibidas na página principal
                </p>
                {lastUpdate && (
                  <p className="text-sm text-slate-500 mt-1">
                    Última atualização: {lastUpdate.toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
              <div className="space-x-3">
                <button 
                  onClick={carregarVagasReais}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? '🔄 Atualizando...' : '🔄 Atualizar Vagas'}
                </button>
                <button 
                  onClick={() => router.push('/admin/vagas/nova')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  + Nova Vaga
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded-lg">
                <p className="text-red-400 text-sm">❌ {error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-400 mt-2">Sincronizando com a página principal...</p>
              </div>
            ) : vagas.length > 0 ? (
              <>
                <div className="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-lg">
                  <p className="text-green-400 text-sm">
                    ✅ {vagas.length} vagas reais sendo exibidas na home e aqui no painel
                  </p>
                  <p className="text-green-300 text-xs mt-1">
                    Fontes: {vagas.map(v => v.source).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="pb-3 text-slate-300 font-medium">Título</th>
                        <th className="pb-3 text-slate-300 font-medium">Empresa</th>
                        <th className="pb-3 text-slate-300 font-medium">Localização</th>
                        <th className="pb-3 text-slate-300 font-medium">Salário</th>
                        <th className="pb-3 text-slate-300 font-medium">Tipo</th>
                        <th className="pb-3 text-slate-300 font-medium">Fonte</th>
                        <th className="pb-3 text-slate-300 font-medium">Publicação</th>
                        <th className="pb-3 text-slate-300 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vagas.map((vaga, index) => (
                        <tr key={vaga.id || index} className="border-b border-slate-700 hover:bg-slate-700/30">
                          <td className="py-3 text-white font-medium">{vaga.title || 'N/A'}</td>
                          <td className="py-3 text-slate-300">{vaga.company?.name || 'N/A'}</td>
                          <td className="py-3 text-slate-300">{vaga.location || 'N/A'}</td>
                          <td className="py-3 text-slate-300">{vaga.salary || 'A combinar'}</td>
                          <td className="py-3 text-slate-300">{vaga.type || 'N/A'}</td>
                          <td className="py-3 text-slate-300 text-xs">
                            <span className="px-2 py-1 bg-slate-600 rounded text-xs">
                              {vaga.source || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400 text-xs">
                            {vaga.publishedDate ? formatarData(vaga.publishedDate) : 'N/A'}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                              Ativa
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    ℹ️ Estas vagas são atualizadas em tempo real e são idênticas às exibidas na página principal
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-slate-400 mb-4 text-lg">Nenhuma vaga real encontrada</p>
                <p className="text-slate-500 text-sm mb-6">
                  As vagas podem estar sendo carregadas ou houve um problema na sincronização
                </p>
                <button 
                  onClick={carregarVagasReais}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  🔄 Tentar Novamente
                </button>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
