import { useState, useEffect } from 'react'
import Head from 'next/head'

const AdminLeads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    fetchLeads()
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
    return new Date(dateString).toLocaleString('pt-BR')
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando leads...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Administração de Leads - Site do Trabalhador</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                        {leads.length}
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
                        {leads.filter(l => l.status === 'novo').length}
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
                        {leads.filter(l => l.status === 'contatado').length}
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
                        {leads.filter(l => {
                          const today = new Date().toDateString()
                          const leadDate = new Date(l.createdAt).toDateString()
                          return today === leadDate
                        }).length}
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
            
            {leads.length === 0 ? (
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
                        Vaga de Interesse
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
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {lead.nome || lead.name || 'Nome não informado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {lead.whatsapp || lead.telefone || 'WhatsApp não informado'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.jobTitle || 'Vaga não informada'}</div>
                          <div className="text-sm text-gray-500">{lead.company || lead.jobCompany || 'Empresa não informada'}</div>
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
                      <label className="block text-sm font-medium text-gray-700">Vaga de Interesse</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.jobTitle || 'Vaga não informada'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Empresa</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.company || selectedLead.jobCompany || 'Empresa não informada'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Local da Vaga</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.originalLocation || selectedLead.jobLocation || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Salário da Vaga</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.jobSalary || 'Não informado'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">URL da Vaga Original</label>
                      {selectedLead.jobUrl ? (
                        <a 
                          href={selectedLead.jobUrl} 
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Última Empresa</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.lastCompany || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status de Trabalho</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.workStatus || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Recebeu Direitos</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.receivedRights || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quer Consultoria</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.wantConsultation || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Problemas Trabalhistas</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.workIssues || 'Não informado'}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500">
                      Criado em: {formatDate(selectedLead.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {selectedLead.id}
                    </p>
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
      </div>
    </>
  )
}

export default AdminLeads
