
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
    
    // Carregar solicitações (simulando dados)
    const mockSolicitacoes = [
      {
        id: 1,
        nomeEmpresa: 'Hospital São José',
        cnpj: '12.345.678/0001-90',
        email: 'rh@hospitalsaojose.com.br',
        telefone: '(11) 99999-9999',
        segmento: 'saude',
        cidade: 'São Paulo, SP',
        cargo: 'Auxiliar de Limpeza',
        area: 'limpeza',
        tipoContrato: 'CLT',
        salario: 'R$ 1.320,00',
        status: 'pendente',
        dataEnvio: '2024-01-21T10:30:00Z'
      },
      {
        id: 2,
        nomeEmpresa: 'Construtora ABC',
        cnpj: '98.765.432/0001-10',
        email: 'contato@construtorabc.com.br',
        telefone: '(21) 88888-8888',
        segmento: 'construcao',
        cidade: 'Rio de Janeiro, RJ',
        cargo: 'Pedreiro',
        area: 'construcao',
        tipoContrato: 'CLT',
        salario: 'R$ 2.200,00',
        status: 'aprovada',
        dataEnvio: '2024-01-20T14:15:00Z'
      }
    ]
    
    setSolicitacoes(mockSolicitacoes)
    setLoading(false)
  }, [])

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
        return 'bg-yellow-600/20 text-yellow-300'
      case 'aprovada':
        return 'bg-green-600/20 text-green-300'
      case 'rejeitada':
        return 'bg-red-600/20 text-red-300'
      default:
        return 'bg-slate-600/20 text-slate-300'
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
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Solicitações de Empresas</h1>
            <div className="text-slate-400">
              Total: {solicitacoes.length} solicitações
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-2xl font-bold text-yellow-400">
                {solicitacoes.filter(s => s.status === 'pendente').length}
              </div>
              <div className="text-slate-400">Pendentes</div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-2xl font-bold text-green-400">
                {solicitacoes.filter(s => s.status === 'aprovada').length}
              </div>
              <div className="text-slate-400">Aprovadas</div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-2xl font-bold text-red-400">
                {solicitacoes.filter(s => s.status === 'rejeitada').length}
              </div>
              <div className="text-slate-400">Rejeitadas</div>
            </div>
          </div>

          {/* Lista de solicitações */}
          <div className="space-y-6">
            {solicitacoes.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-slate-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {solicitacao.nomeEmpresa}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Solicitação enviada em {formatDate(solicitacao.dataEnvio)}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(solicitacao.status)}`}>
                    {solicitacao.status.charAt(0).toUpperCase() + solicitacao.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-slate-400">CNPJ</div>
                    <div className="text-white">{solicitacao.cnpj}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400">Email</div>
                    <div className="text-white">{solicitacao.email}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400">Telefone</div>
                    <div className="text-white">{solicitacao.telefone}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400">Cidade</div>
                    <div className="text-white">{solicitacao.cidade}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400">Segmento</div>
                    <div className="text-white capitalize">{solicitacao.segmento.replace('-', ' ')}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400">Cargo</div>
                    <div className="text-white">{solicitacao.cargo}</div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-2">Detalhes da Vaga</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Área:</span>
                      <span className="text-white ml-2 capitalize">{solicitacao.area.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Contrato:</span>
                      <span className="text-white ml-2">{solicitacao.tipoContrato}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Salário:</span>
                      <span className="text-white ml-2">{solicitacao.salario}</span>
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
                </div>
              </div>
            ))}
          </div>

          {solicitacoes.length === 0 && (
            <div className="text-center text-slate-400 py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma solicitação encontrada</h3>
              <p>Quando empresas enviarem solicitações, elas aparecerão aqui.</p>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
