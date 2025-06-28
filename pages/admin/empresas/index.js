import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

export default function AdminEmpresas() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [solicitacoes, setSolicitacoes] = useState([])

  useEffect(() => {
    // Verificar autenticação
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }
    
    setIsAuthenticated(true)
    fetchEmpresas()
  }, [])

  const fetchEmpresas = async () => {
    try {
      setLoading(true)
      // Buscar leads de empresas da API real
      const response = await fetch('/api/get-leads')
      const data = await response.json()

      if (data.success) {
        // Filtrar apenas leads que são de empresas
        const empresaLeads = data.leads.filter(lead => 
          lead.type === 'empresa' || 
          lead.source === 'formulario_empresas' ||
          lead.nomeEmpresa
        )
        setSolicitacoes(empresaLeads)
      } else {
        console.error('Erro ao carregar empresas:', data.message)
        // Fallback para dados mock se a API falhar
        setSolicitacoes([])
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error)
      // Manter dados mock em caso de erro
      setSolicitacoes([])
    } finally {
      setLoading(false)
    }
  }

  const deleteEmpresa = async (empresaId) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação de empresa?')) {
      return
    }

    try {
      const response = await fetch(`/api/delete-lead?id=${empresaId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ Solicitação de empresa excluída com sucesso!')
        fetchEmpresas() // Recarregar a lista
      } else {
        alert('❌ Erro ao excluir: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao excluir empresa:', error)
      alert('❌ Erro ao excluir solicitação')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const updateStatus = (id, newStatus) => {
    setSolicitacoes(prev => 
      prev.map(sol => 
        sol.id === id ? { ...sol, status: newStatus } : sol
      )
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'aprovada':
        return 'bg-green-100 text-green-800'
      case 'rejeitada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Head>
        <title>Gestão de Empresas - Admin</title>
      </Head>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Solicitações de Empresas</h1>
                  <p className="mt-1 text-sm text-gray-500">Gerencie as solicitações de publicação de vagas enviadas pelas empresas</p>
                </div>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-govblue-600">{solicitacoes.length}</span> solicitações
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {solicitacoes.filter(s => s.status === 'pendente').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {solicitacoes.filter(s => s.status === 'aprovada').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {solicitacoes.filter(s => s.status === 'rejeitada').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de solicitações */}
          <div className="space-y-6">
            {solicitacoes.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {solicitacao.nomeEmpresa}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Solicitação enviada em {formatDate(solicitacao.dataEnvio)}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(solicitacao.status)}`}>
                    {solicitacao.status.charAt(0).toUpperCase() + solicitacao.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">CNPJ</div>
                    <div className="text-gray-900">{solicitacao.cnpj}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-gray-900">{solicitacao.email}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Telefone</div>
                    <div className="text-gray-900">{solicitacao.telefone}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Cidade</div>
                    <div className="text-gray-900">{solicitacao.cidade}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Segmento</div>
                    <div className="text-gray-900 capitalize">{solicitacao.segmento.replace('-', ' ')}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Cargo</div>
                    <div className="text-gray-900">{solicitacao.cargo}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-gray-900 font-medium mb-2">Detalhes da Vaga</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Área:</span>
                      <span className="text-gray-900 ml-2 capitalize">{solicitacao.area.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contrato:</span>
                      <span className="text-gray-900 ml-2">{solicitacao.tipoContrato}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Salário:</span>
                      <span className="text-gray-900 ml-2">{solicitacao.salario}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex space-x-3">
                  {solicitacao.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => updateStatus(solicitacao.id, 'aprovada')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✅ Aprovar
                      </button>
                      <button
                        onClick={() => updateStatus(solicitacao.id, 'rejeitada')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ❌ Rejeitar
                      </button>
                    </>
                  )}
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    📧 Contatar
                  </button>
                  
                  <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                    👁️ Ver Detalhes
                  </button>

                  <button
                    onClick={() => deleteEmpresa(solicitacao.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {solicitacoes.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Nenhuma solicitação encontrada</h3>
              <p>Quando empresas enviarem solicitações, elas aparecerão aqui.</p>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
