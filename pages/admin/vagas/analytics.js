import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

const AdminVagasAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs-analytics')
      const data = await response.json()

      if (data.success) {
        setAnalytics(data)
      } else {
        console.error('Erro ao carregar analytics:', data.message)
      }
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const forceRefreshJobs = async () => {
    if (!confirm('Tem certeza que deseja substituir as vagas pouco visitadas? Esta ação irá remover vagas com baixo engajamento do sistema de tracking.')) {
      return
    }

    try {
      setRefreshing(true)
      const response = await fetch('/api/jobs-analytics', {
        method: 'PUT'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ Refresh realizado! ${data.jobsReplaced} vagas foram marcadas para substituição.`)
        fetchAnalytics() // Recarregar dados
      } else {
        alert('❌ Erro ao realizar refresh: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao forçar refresh:', error)
      alert('❌ Erro ao realizar refresh')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govblue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando analytics...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Analytics de Vagas - Admin</title>
      </Head>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    📊 Analytics de Vagas
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Monitore o desempenho e engajamento das vagas
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={fetchAnalytics}
                    className="bg-govblue-600 text-white px-4 py-2 rounded-lg hover:bg-govblue-700 transition-colors"
                  >
                    🔄 Atualizar
                  </button>
                  <button
                    onClick={forceRefreshJobs}
                    disabled={refreshing}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {refreshing ? '⏳ Processando...' : '🔄 Substituir Vagas Inativas'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas Gerais */}
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-govblue-100 rounded-lg">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Vagas Monitoradas</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.stats.totalTrackedJobs}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-govgreen-100 rounded-lg">
                      <span className="text-2xl">👀</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Visualizações</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.stats.totalViews}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-govyellow-100 rounded-lg">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Candidaturas</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.stats.totalApplications}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Vagas Inativas</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.stats.lowPerformingJobs}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Sistema */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  🔄 Sistema de Atualização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Última Atualização:</p>
                    <p className="font-medium">{new Date(analytics.stats.lastRefresh).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total de Atualizações:</p>
                    <p className="font-medium">{analytics.stats.refreshCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Vagas Substituídas:</p>
                    <p className="font-medium">{analytics.stats.jobsReplaced}</p>
                  </div>
                </div>
              </div>

              {/* Vagas Candidatas à Substituição */}
              {analytics.jobsToReplace && analytics.jobsToReplace.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      ⚠️ Vagas Candidatas à Substituição
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Vagas com baixo engajamento que serão substituídas na próxima atualização
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vaga
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visualizações
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Candidaturas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dias Inativa
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.jobsToReplace.map((job, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {job.jobId.replace(/_/g, ' ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{job.views}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{job.applications}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-red-600">{job.daysSinceLastView} dias</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Explicação do Sistema */}
              <div className="bg-govblue-50 border border-govblue-200 rounded-lg p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-govblue-800">
                      Como funciona o Sistema de Rotação de Vagas
                    </h3>
                    <div className="mt-2 text-sm text-govblue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Vagas são monitoradas automaticamente para visualizações e candidaturas</li>
                        <li>Vagas com menos de 5 visualizações em 3+ dias são marcadas como inativas</li>
                        <li>O sistema pode substituir automaticamente vagas inativas por novas oportunidades</li>
                        <li>Isso garante que apenas vagas atrativas e relevantes sejam exibidas aos usuários</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  )
}

export default AdminVagasAnalytics
