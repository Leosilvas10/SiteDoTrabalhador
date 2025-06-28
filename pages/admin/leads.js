import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../src/components/Admin/AdminLayout'

const AdminLeads = () => {
  const [leads, setLeads] = useState([])
  const [calculadoraLeads, setCalculadoraLeads] = useState([])
  const [activeTab, setActiveTab] = useState('all') // 'all', 'jobs', 'calculator'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    fetchLeads()
    fetchCalculadoraLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/get-leads')
      const data = await response.json()

      if (data.success) {
        setLeads(data.leads)
      } else {
        setError('Erro ao carregar leads')
      }
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchCalculadoraLeads = async () => {
    try {
      const response = await fetch('/api/calculadora-leads')
      const data = await response.json()

      if (data.success) {
        setCalculadoraLeads(data.leads)
      } else {
        console.error('Erro ao carregar leads da calculadora:', data.message)
      }
    } catch (error) {
      console.error('Erro ao buscar leads da calculadora:', error)
    }
  }

  const exportToCSV = () => {
    window.open('/api/get-leads?format=csv', '_blank')
  }

  const deleteLead = async (leadId) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) {
      return
    }

    try {
      const response = await fetch(`/api/delete-lead?id=${leadId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ Lead excluído com sucesso!')
        fetchLeads() // Recarregar a lista
        setSelectedLead(null) // Fechar modal se estiver aberto
      } else {
        alert('❌ Erro ao excluir lead: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao excluir lead:', error)
      alert('❌ Erro ao excluir lead')
    }
  }

  const clearAllLeads = async () => {
    if (!confirm('⚠️ ATENÇÃO: Isso vai excluir TODOS os leads permanentemente. Tem certeza?')) {
      return
    }
    
    if (!confirm('🚨 ÚLTIMA CONFIRMAÇÃO: Todos os dados serão perdidos para sempre. Continuar?')) {
      return
    }

    try {
      setLoading(true)
      console.log('🧹 Iniciando limpeza completa...')
      
      const response = await fetch('/api/clear-leads', {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ SISTEMA COMPLETAMENTE LIMPO!\n\n' + 
              '• Todos os leads removidos\n' + 
              '• Cache limpo\n' + 
              '• Dashboard zerado\n\n' + 
              'O sistema está pronto para começar do zero!')
        
        // Forçar recarregamento completo
        setLeads([])
        setSelectedLead(null)
        setError('')
        await fetchLeads()
        
        // Limpar localStorage se houver
        if (typeof window !== 'undefined') {
          localStorage.removeItem('leads-cache')
          localStorage.removeItem('admin-stats')
        }
        
      } else {
        alert('❌ Erro ao limpar sistema: ' + data.message)
      }
    } catch (error) {
      console.error('Erro ao limpar sistema:', error)
      alert('❌ Erro ao limpar sistema. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Data inválida'
      }
      return date.toLocaleString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  // Função para obter estatísticas combinadas
  const getStats = () => {
    const allLeads = [...leads, ...calculadoraLeads]
    const hoje = new Date().toDateString()
    
    return {
      total: allLeads.length,
      novos: allLeads.filter(l => l.status === 'novo').length,
      contatados: allLeads.filter(l => l.status === 'contatado').length,
      hoje: allLeads.filter(l => {
        const leadDate = new Date(l.createdAt || l.timestamp).toDateString()
        return hoje === leadDate
      }).length,
      vagas: leads.length,
      calculadora: calculadoraLeads.length
    }
  }

  // Função para obter leads filtrados por aba
  const getFilteredLeads = () => {
    switch (activeTab) {
      case 'jobs':
        return leads
      case 'calculator':
        return calculadoraLeads
      default:
        return [...leads, ...calculadoraLeads]
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800'
      case 'contatado': return 'bg-yellow-100 text-yellow-800'
      case 'convertido': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Administração de Leads">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando leads...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const stats = getStats()
  const filteredLeads = getFilteredLeads()

  return (
    <AdminLayout title="Administração de Leads">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Administração de Leads
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gerencie os leads capturados pelo site
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={fetchLeads}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  🔄 Atualizar
                </button>
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  📊 Exportar CSV
                </button>
                <button
                  onClick={clearAllLeads}
                  className="inline-flex items-center px-6 py-3 border-2 border-red-500 rounded-md shadow-sm text-sm font-bold text-red-600 bg-white hover:bg-red-50 hover:text-red-700 transition-all duration-300"
                >
                  🧹 ZERAR SISTEMA COMPLETO
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total de Leads
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Novos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.novos}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📞</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Contatados
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.contatados}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">💼</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Hoje
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.hoje}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Leads Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Lista de Leads
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Clique em um lead para ver mais detalhes
              </p>
            </div>
            
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum lead encontrado
                </h3>
                <p className="text-gray-500">
                  Os leads aparecerão aqui quando alguém se candidatar às vagas
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Origem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vaga/Empresa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {lead.nome || lead.name || 'Nome não informado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                📱 {lead.whatsapp || lead.telefone || 'WhatsApp não informado'}
                              </div>
                              {lead.email && (
                                <div className="text-xs text-gray-400">
                                  ✉️ {lead.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.source === 'formulario_empresas' && '🏢 Empresa'}
                            {lead.source === 'Formulário de Contato - Página Inicial' && '📞 Contato Home'}
                            {lead.source === 'Formulário de Contato' && '📞 Contato'}
                            {lead.source === 'calculadora_trabalhista' && '🧮 Calculadora'}
                            {lead.source === 'candidatura_vaga' && '💼 Candidatura'}
                            {(!lead.source || 
                              (lead.source !== 'formulario_empresas' && 
                               lead.source !== 'Formulário de Contato - Página Inicial' && 
                               lead.source !== 'Formulário de Contato' && 
                               lead.source !== 'calculadora_trabalhista' && 
                               lead.source !== 'candidatura_vaga')) && '💼 Candidatura'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lead.source || 'candidatura_vaga'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.type === 'empresa' ? (
                            <div>
                              <div className="text-sm font-medium text-blue-900">
                                🏢 {lead.nomeEmpresa || 'Empresa não informada'}
                              </div>
                              <div className="text-xs text-gray-500">
                                💼 {lead.cargo || 'Cargo não informado'}
                              </div>
                              {lead.cnpj && (
                                <div className="text-xs text-gray-400">
                                  📋 {lead.cnpj}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm text-gray-900">{lead.jobTitle || 'Vaga não informada'}</div>
                              <div className="text-sm text-gray-500">{lead.company || lead.jobCompany || 'Empresa não informada'}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              👁️ Ver
                            </button>
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              🗑️ Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal de detalhes do lead */}
        {selectedLead && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalhes do Lead
                  </h3>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Informações básicas */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">📋 Informações Básicas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedLead.nome || selectedLead.name || 'Nome não informado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedLead.whatsapp || selectedLead.telefone || 'WhatsApp não informado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedLead.email || 'Email não informado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Origem do Lead</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedLead.source === 'formulario_empresas' && '🏢 Formulário de Empresas'}
                          {selectedLead.source === 'Formulário de Contato - Página Inicial' && '📞 Contato - Página Inicial'}
                          {selectedLead.source === 'Formulário de Contato' && '📞 Página de Contato'}
                          {selectedLead.source === 'calculadora_trabalhista' && '🧮 Calculadora Trabalhista'}
                          {selectedLead.source === 'candidatura_vaga' && '💼 Candidatura a Vaga'}
                          {(!selectedLead.source || 
                            (selectedLead.source !== 'formulario_empresas' && 
                             selectedLead.source !== 'Formulário de Contato - Página Inicial' && 
                             selectedLead.source !== 'Formulário de Contato' && 
                             selectedLead.source !== 'calculadora_trabalhista' && 
                             selectedLead.source !== 'candidatura_vaga')) && '💼 Candidatura a Vaga'}
                        </p>
                        <p className="text-xs text-gray-500">{selectedLead.source || 'candidatura_vaga'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dados específicos de empresa */}
                  {selectedLead.type === 'empresa' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">🏢 Dados da Empresa</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Nome da Empresa</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.nomeEmpresa || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700">CNPJ</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.cnpj || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Segmento</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.segmento || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Cidade</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.cidade || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-blue-700">Descrição da Empresa</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.descricaoEmpresa || 'Não informado'}</p>
                        </div>
                      </div>
                      
                      <h5 className="font-semibold text-blue-900 mt-4 mb-3">💼 Vaga Oferecida</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Cargo</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.cargo || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Área</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.area || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Tipo de Contrato</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.tipoContrato || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Salário</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.salario || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700">Local de Trabalho</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.localTrabalho || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-blue-700">Descrição da Vaga</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.descricaoVaga || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-blue-700">Requisitos</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.requisitos || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-blue-700">Benefícios</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.beneficios || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dados de candidatura a vaga */}
                  {selectedLead.type !== 'empresa' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-3">💼 Dados da Candidatura</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-green-700">Vaga de Interesse</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.jobTitle || 'Vaga não informada'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-700">Empresa</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.company || selectedLead.jobCompany || 'Empresa não informada'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-700">Local da Vaga</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.originalLocation || selectedLead.jobLocation || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-700">Salário da Vaga</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.jobSalary || 'Não informado'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-green-700">URL da Vaga Original</label>
                          {selectedLead.jobLink || selectedLead.originalJobUrl ? (
                            <a 
                              href={selectedLead.jobLink || selectedLead.originalJobUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              🔗 Acessar vaga original
                            </a>
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">Não disponível</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dados de contato/assunto (para leads de contato) */}
                  {(selectedLead.source === 'Formulário de Contato - Página Inicial' || selectedLead.source === 'Formulário de Contato' || selectedLead.assunto) && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-3">📞 Dados do Contato</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedLead.assunto && (
                          <div>
                            <label className="block text-sm font-medium text-yellow-700">Assunto</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedLead.assunto}</p>
                          </div>
                        )}
                        {selectedLead.mensagem && (
                          <div>
                            <label className="block text-sm font-medium text-yellow-700">Mensagem</label>
                            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedLead.mensagem}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dados do candidato */}
                  {(selectedLead.statusAtual || selectedLead.ultimaEmpresa || selectedLead.experiencia) && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-3">👤 Dados do Candidato</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedLead.statusAtual && (
                          <div>
                            <label className="block text-sm font-medium text-purple-700">Status Atual</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedLead.statusAtual}</p>
                          </div>
                        )}
                        {selectedLead.ultimaEmpresa && (
                          <div>
                            <label className="block text-sm font-medium text-purple-700">Última Empresa</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedLead.ultimaEmpresa}</p>
                          </div>
                        )}
                        {selectedLead.experiencia && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-purple-700">Experiência/Observações</label>
                            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedLead.experiencia}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Informações técnicas */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                      <div>
                        <strong>Criado em:</strong><br/>
                        {selectedLead.timestamp || selectedLead.timestampISO || selectedLead.createdAt || 'Não informado'}
                      </div>
                      <div>
                        <strong>ID do Lead:</strong><br/>
                        {selectedLead.id || selectedLead.leadId || 'Não informado'}
                      </div>
                      <div>
                        <strong>LGPD:</strong><br/>
                        {selectedLead.lgpdConsent ? '✅ Aceito' : '❌ Não aceito'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => deleteLead(selectedLead.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    🗑️ Excluir Lead
                  </button>
                  <div className="space-x-3">
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Fechar
                    </button>
                    <a
                      href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      📱 Abrir WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  )
}

export default AdminLeads
