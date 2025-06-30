
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../src/components/Admin/AdminLayout'

export default function LeadsLandingPage() {
  const router = useRouter()
  const { slug } = router.query
  
  const [leads, setLeads] = useState([])
  const [landingPage, setLandingPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (slug) {
      fetchData()
    }
  }, [slug])

  const fetchData = async () => {
    try {
      const [leadsRes, pagesRes] = await Promise.all([
        fetch('/api/landing-leads'),
        fetch('/api/landing-pages')
      ])
      
      const leadsData = await leadsRes.json()
      const pagesData = await pagesRes.json()
      
      if (leadsData.success) {
        const filteredLeads = leadsData.data.filter(lead => lead.landingSlug === slug)
        setLeads(filteredLeads)
      }
      
      if (pagesData.success) {
        const page = pagesData.data.find(p => p.slug === slug)
        setLandingPage(page)
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Nome', 'Telefone', 'E-mail', 'Data', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.nome,
        lead.telefone,
        lead.email,
        new Date(lead.criadoEm).toLocaleDateString('pt-BR'),
        lead.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `leads-${slug}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const updateLeadStatus = async (leadId, newStatus) => {
    // Aqui você implementaria a API para atualizar status do lead
    console.log('Atualizar status:', leadId, newStatus)
  }

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'todos' || lead.status === filter
    const matchesSearch = searchTerm === '' || 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm)
    
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: leads.length,
    novos: leads.filter(l => l.status === 'novo').length,
    contatados: leads.filter(l => l.status === 'contatado').length,
    convertidos: leads.filter(l => l.status === 'convertido').length,
    hoje: leads.filter(l => {
      const hoje = new Date().toDateString()
      const leadDate = new Date(l.criadoEm).toDateString()
      return hoje === leadDate
    }).length
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Leads - {landingPage?.titulo} - Admin</title>
      </Head>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Leads - {landingPage?.titulo}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    /{slug}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔄 Atualizar
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📊 Exportar CSV
                  </button>
                  <a
                    href={`/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ver Página
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-yellow-600">{stats.novos}</div>
              <div className="text-sm text-gray-600">Novos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600">{stats.contatados}</div>
              <div className="text-sm text-gray-600">Contatados</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{stats.convertidos}</div>
              <div className="text-sm text-gray-600">Convertidos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">{stats.hoje}</div>
              <div className="text-sm text-gray-600">Hoje</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="novo">Novos</option>
                  <option value="contatado">Contatados</option>
                  <option value="convertido">Convertidos</option>
                </select>
              </div>
              
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Lista de Leads */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Leads ({filteredLeads.length})
              </h2>
            </div>
            
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium mb-2">Nenhum lead encontrado</h3>
                <p>Não há leads que correspondam aos filtros selecionados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads
                      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
                      .map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {lead.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lead.telefone}
                            </div>
                            <a
                              href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:text-green-800"
                            >
                              WhatsApp
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              {new Date(lead.criadoEm).toLocaleDateString('pt-BR')}
                            </div>
                            <div>
                              {new Date(lead.criadoEm).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className={`text-xs font-medium rounded-full px-2 py-1 ${
                                lead.status === 'novo'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : lead.status === 'contatado'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              <option value="novo">Novo</option>
                              <option value="contatado">Contatado</option>
                              <option value="convertido">Convertido</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              📧
                            </a>
                            <a
                              href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800"
                            >
                              📱
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* WhatsApp Config */}
          {landingPage?.whatsapp?.numero && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-900 mb-4">
                WhatsApp da Landing Page
              </h3>
              <div className="space-y-2">
                <div>
                  <strong>Número:</strong> {landingPage.whatsapp.numero}
                </div>
                <div>
                  <strong>Mensagem:</strong> {landingPage.whatsapp.mensagem}
                </div>
                <a
                  href={`https://wa.me/${landingPage.whatsapp.numero}?text=${encodeURIComponent(landingPage.whatsapp.mensagem)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mt-2"
                >
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
