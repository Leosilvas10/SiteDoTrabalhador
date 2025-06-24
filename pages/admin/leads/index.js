
import { useState, useEffect } from 'react'
import AdminLayout from '../../../src/components/Admin/AdminLayout'
import Head from 'next/head'

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredLeads, setFilteredLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      // Simular dados de leads com as perguntas do formulário trabalhista
      const mockLeads = [
        {
          id: 'lead_1704067200_abc123',
          name: 'Ana Silva Santos',
          whatsapp: '(11) 98765-4321',
          lastCompany: 'Empresa ABC Ltda',
          workStatus: 'Com carteira assinada',
          receivedRights: 'Recebi só uma parte',
          workIssues: 'Fazia hora extra sem receber',
          wantConsultation: 'Sim, quero saber se tenho algo a receber',
          jobTitle: 'Desenvolvedor Frontend React',
          jobCompany: 'Tech Solutions Brasil',
          jobUrl: 'https://vagas.com.br/vaga-123',
          data: '2024-01-15',
          timestamp: '15/01/2024 14:30:25',
          lgpdConsent: true,
          ip: '192.168.1.100'
        },
        {
          id: 'lead_1704153600_def456',
          name: 'Carlos Eduardo Lima',
          whatsapp: '(21) 99887-6655',
          lastCompany: 'Marketing Solutions',
          workStatus: 'Sem carteira assinada',
          receivedRights: 'Não recebi nada',
          workIssues: 'Trabalhei domingos/feriados sem adicional ou folga',
          wantConsultation: 'Sim, quero saber se tenho algo a receber',
          jobTitle: 'Analista de Marketing Digital',
          jobCompany: 'Marketing Pro',
          jobUrl: 'https://vagas.com.br/vaga-456',
          data: '2024-01-16',
          timestamp: '16/01/2024 09:15:42',
          lgpdConsent: true,
          ip: '192.168.1.101'
        },
        {
          id: 'lead_1704240000_ghi789',
          name: 'Mariana Costa',
          whatsapp: '(31) 97654-3210',
          lastCompany: 'Design Creative',
          workStatus: 'Comecei sem, depois registraram',
          receivedRights: 'Sim',
          workIssues: 'Acúmulo de funções sem aumento salarial',
          wantConsultation: 'Não, obrigado(a)',
          jobTitle: 'Designer UX/UI',
          jobCompany: 'Design Studio',
          jobUrl: 'https://infojobs.com.br/vaga-789',
          data: '2024-01-17',
          timestamp: '17/01/2024 16:45:18',
          lgpdConsent: true,
          ip: '192.168.1.102'
        }
      ]
      setLeads(mockLeads)
      setFilteredLeads(mockLeads)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.whatsapp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.jobCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastCompany.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (dateFilter) {
      filtered = filtered.filter(lead => lead.data === dateFilter)
    }

    setFilteredLeads(filtered)
  }, [searchTerm, dateFilter, leads])

  const deleteLead = async (leadId) => {
    try {
      // Aqui você implementaria a chamada para a API para deletar o lead
      // await fetch(`/api/delete-lead/${leadId}`, { method: 'DELETE' })
      
      // Por enquanto, apenas removemos da lista local
      const updatedLeads = leads.filter(lead => lead.id !== leadId)
      setLeads(updatedLeads)
      setFilteredLeads(updatedLeads.filter(lead => {
        let matches = true
        if (searchTerm) {
          matches = matches && (
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.whatsapp.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.jobCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.lastCompany.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        if (dateFilter) {
          matches = matches && lead.data === dateFilter
        }
        return matches
      }))
      setShowDeleteConfirm(null)
      alert('Lead deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar lead:', error)
      alert('Erro ao deletar lead. Tente novamente.')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'ID', 'Nome', 'WhatsApp', 'Última Empresa', 'Status do Trabalho', 
      'Recebeu Direitos', 'Problemas no Trabalho', 'Quer Consultoria',
      'Vaga de Interesse', 'Empresa da Vaga', 'Data', 'LGPD'
    ]
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.id,
        `"${lead.name}"`,
        `"${lead.whatsapp}"`,
        `"${lead.lastCompany}"`,
        `"${lead.workStatus}"`,
        `"${lead.receivedRights}"`,
        `"${lead.workIssues}"`,
        `"${lead.wantConsultation}"`,
        `"${lead.jobTitle}"`,
        `"${lead.jobCompany}"`,
        lead.data,
        lead.lgpdConsent ? 'Sim' : 'Não'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDateFilter('')
  }

  return (
    <>
      <Head>
        <title>Leads - Admin</title>
      </Head>
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Gestão de Leads</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              📊 Exportar CSV
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Buscar</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, WhatsApp, vaga, empresa..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Data</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-600 rounded-lg p-4">
              <h3 className="text-white text-lg font-semibold">Total de Leads</h3>
              <p className="text-3xl font-bold text-white">{leads.length}</p>
            </div>
            <div className="bg-green-600 rounded-lg p-4">
              <h3 className="text-white text-lg font-semibold">Hoje</h3>
              <p className="text-3xl font-bold text-white">
                {leads.filter(lead => lead.data === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <div className="bg-purple-600 rounded-lg p-4">
              <h3 className="text-white text-lg font-semibold">Querem Consultoria</h3>
              <p className="text-3xl font-bold text-white">
                {leads.filter(lead => lead.wantConsultation.includes('Sim')).length}
              </p>
            </div>
            <div className="bg-orange-600 rounded-lg p-4">
              <h3 className="text-white text-lg font-semibold">Problemas Trabalhistas</h3>
              <p className="text-3xl font-bold text-white">
                {leads.filter(lead => lead.workIssues !== 'Nenhuma dessas').length}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-white text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-2">Carregando leads...</p>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-white">Nome</th>
                      <th className="px-4 py-3 text-left text-white">WhatsApp</th>
                      <th className="px-4 py-3 text-left text-white">Última Empresa</th>
                      <th className="px-4 py-3 text-left text-white">Vaga de Interesse</th>
                      <th className="px-4 py-3 text-left text-white">Quer Consultoria</th>
                      <th className="px-4 py-3 text-left text-white">Data</th>
                      <th className="px-4 py-3 text-left text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="border-b border-slate-700 hover:bg-slate-750">
                        <td className="px-4 py-3 text-slate-300 font-medium">{lead.name}</td>
                        <td className="px-4 py-3 text-slate-300">
                          <a 
                            href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} 
                            className="text-green-400 hover:underline" 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {lead.whatsapp}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{lead.lastCompany}</td>
                        <td className="px-4 py-3 text-slate-300">
                          <div>
                            <div className="font-medium">{lead.jobTitle}</div>
                            <div className="text-sm text-slate-400">{lead.jobCompany}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            lead.wantConsultation.includes('Sim') 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-600 text-white'
                          }`}>
                            {lead.wantConsultation.includes('Sim') ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{lead.timestamp}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => setSelectedLead(lead)}
                              title="Ver detalhes"
                            >
                              👁️
                            </button>
                            <button 
                              className="text-green-400 hover:text-green-300"
                              onClick={() => window.open(`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}?text=Olá ${lead.name}! Vi que você se interessou pela vaga de ${lead.jobTitle}. Como posso ajudar?`, '_blank')}
                              title="Contatar via WhatsApp"
                            >
                              💬
                            </button>
                            <button 
                              className="text-red-400 hover:text-red-300"
                              onClick={() => setShowDeleteConfirm(lead.id)}
                              title="Deletar lead"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLeads.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p>Nenhum lead encontrado com os filtros aplicados.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de Detalhes do Lead */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">Detalhes do Lead</h2>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-slate-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-sm">Nome</label>
                      <p className="text-white font-medium">{selectedLead.name}</p>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm">WhatsApp</label>
                      <p className="text-white font-medium">{selectedLead.whatsapp}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm">Última empresa onde trabalhou</label>
                    <p className="text-white">{selectedLead.lastCompany}</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm">Trabalhou com ou sem carteira assinada?</label>
                    <p className="text-white">{selectedLead.workStatus}</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm">Recebeu tudo certinho ao sair?</label>
                    <p className="text-white">{selectedLead.receivedRights}</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm">Problemas durante o trabalho</label>
                    <p className="text-white">{selectedLead.workIssues}</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm">Quer consulta trabalhista?</label>
                    <p className="text-white">{selectedLead.wantConsultation}</p>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Vaga de Interesse</h3>
                    <div>
                      <p className="text-white font-medium">{selectedLead.jobTitle}</p>
                      <p className="text-slate-300">{selectedLead.jobCompany}</p>
                      {selectedLead.jobUrl && (
                        <a 
                          href={selectedLead.jobUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Ver vaga original
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-slate-400">Data de envio</label>
                        <p className="text-slate-300">{selectedLead.timestamp}</p>
                      </div>
                      <div>
                        <label className="block text-slate-400">IP</label>
                        <p className="text-slate-300">{selectedLead.ip}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => window.open(`https://wa.me/55${selectedLead.whatsapp.replace(/\D/g, '')}?text=Olá ${selectedLead.name}! Vi que você se interessou pela vaga de ${selectedLead.jobTitle}. Como posso ajudar?`, '_blank')}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    💬 Contatar WhatsApp
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="flex-1 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h2>
                <p className="text-slate-300 mb-6">
                  Tem certeza que deseja deletar este lead? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => deleteLead(showDeleteConfirm)}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
