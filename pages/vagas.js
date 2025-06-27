import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import LeadModal from '../src/components/LeadModal/LeadModal'
import ExternalJobModal from '../src/components/ExternalJobModal/ExternalJobModal'
import ExternalJobLeadModal from '../src/components/ExternalJobLeadModal/ExternalJobLeadModal'

const VagasPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false)
  const [selectedExternalJob, setSelectedExternalJob] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    salary: '',
    type: ''
  })
  const [filteredJobs, setFilteredJobs] = useState([])
  const jobsPerPage = 9

  useEffect(() => {
    // Buscar TODAS as vagas (internas + públicas externas)
    console.log('🔍 Buscando TODAS as vagas (internas + públicas)...')
    
    fetch(`/api/all-jobs-combined?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('📋 Dados recebidos na página de vagas:', data)
        
        if (data.success) {
          const vagasData = data.jobs || data.data || []
          console.log(`✅ Total de ${vagasData.length} vagas carregadas`)
          console.log(`📊 Internas: ${data.meta?.internalJobs || 0}, Externas: ${data.meta?.externalJobs || 0}`)
          console.log(`🌐 Fontes: ${data.meta?.sources?.join(', ') || 'N/A'}`)
          
          setJobs(vagasData)
          setFilteredJobs(vagasData)
        } else {
          console.error('❌ Erro na resposta da API:', data.message)
          setError(data.message || 'Erro ao carregar vagas')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ Erro ao buscar vagas:', err)
        setError('Erro ao carregar vagas. Tente novamente.')
        setLoading(false)
      })
  }, [])

  // Effect para aplicar filtros
  useEffect(() => {
    let filtered = [...jobs]

    // Filtro de busca (título ou empresa)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm) ||
        job.company?.name?.toLowerCase().includes(searchTerm) ||
        job.company?.toLowerCase().includes(searchTerm)
      )
    }

    // Filtro por categoria (baseado no título da vaga)
    if (filters.category) {
      filtered = filtered.filter(job => {
        const title = job.title?.toLowerCase() || ''
        switch (filters.category) {
          case 'vendas':
            return title.includes('vend') || title.includes('comercial')
          case 'administrativo':
            return title.includes('admin') || title.includes('assist') || title.includes('auxiliar')
          case 'servicos':
            return title.includes('serv') || title.includes('atend') || title.includes('recep')
          case 'operacional':
            return title.includes('oper') || title.includes('produc') || title.includes('fabric')
          case 'saude':
            return title.includes('enferm') || title.includes('medic') || title.includes('saude')
          default:
            return true
        }
      })
    }

    // Filtro por faixa salarial
    if (filters.salary) {
      filtered = filtered.filter(job => {
        const salary = job.salary?.toLowerCase() || ''
        switch (filters.salary) {
          case 'ate-2k':
            return salary.includes('1.') || salary.includes('salário') || salary.includes('combinar')
          case '2k-5k':
            return salary.includes('2.') || salary.includes('3.') || salary.includes('4.')
          case 'acima-5k':
            return salary.includes('5.') || salary.includes('6.') || salary.includes('7.') || salary.includes('8.')
          default:
            return true
        }
      })
    }

    // Filtro por tipo de contrato
    if (filters.type) {
      filtered = filtered.filter(job => {
        const description = (job.description || '').toLowerCase()
        const title = (job.title || '').toLowerCase()
        switch (filters.type) {
          case 'clt':
            return description.includes('clt') || title.includes('efetiv')
          case 'pj':
            return description.includes('pj') || description.includes('pessoa jurídica')
          case 'temporario':
            return description.includes('temp') || description.includes('contrato')
          case 'estagio':
            return title.includes('estag') || title.includes('jovem aprendiz')
          default:
            return true
        }
      })
    }

    setFilteredJobs(filtered)
    setCurrentPage(1) // Reset para primeira página quando filtrar
  }, [jobs, filters])

  // Cálculos de paginação usando jobs filtrados
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      salary: '',
      type: ''
    })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleApply = (job) => {
    // Verificar se é vaga externa que requer captação de lead
    if (job.isExternal && job.requiresLead) {
      setSelectedExternalJob(job)
      setIsExternalModalOpen(true)
    } else {
      // Vaga interna - usar modal normal
      setSelectedJob(job)
      setIsModalOpen(true)
    }
  }

  const handleExternalJobSubmit = (result) => {
    console.log('✅ Lead de vaga externa processado:', result)
    // Modal será fechado automaticamente
    // Redirecionamento será feito automaticamente
  }

  return (
    <div className="page-white-bg min-h-screen">
      <Head>
        <title>Vagas de Emprego - Site do Trabalhador</title>
        <meta name="description" content="Encontre vagas de emprego em todo o Brasil. Oportunidades atualizadas em tempo real." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
        <section className="bg-govblue-600 relative overflow-hidden border-b-4 border-govyellow-400">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                💼 Vagas em Destaque
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {loading ? "Carregando vagas..." : `${filteredJobs.length} vagas encontradas de ${jobs.length} disponíveis`}
              </p>
            </div>
          </div>
        </section>

        {/* Seção de Filtros */}
        {!loading && !error && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 mb-8">
              <div className="flex flex-wrap items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-govgray-800">🔍 Filtrar Vagas</h3>
                <button
                  onClick={clearFilters}
                  className="text-govblue-600 hover:text-govblue-700 text-sm font-medium transition-colors"
                >
                  🗑️ Limpar Filtros
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Busca por palavra-chave */}
                <div>
                  <label className="block text-sm font-medium text-govgray-700 mb-2">
                    Buscar por cargo ou empresa
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: vendedor, assistente..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full px-3 py-2 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-govgray-700 mb-2">
                    Área de atuação
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Todas as áreas</option>
                    <option value="vendas">💼 Vendas e Comercial</option>
                    <option value="administrativo">📋 Administrativo</option>
                    <option value="servicos">🤝 Atendimento e Serviços</option>
                    <option value="operacional">⚙️ Operacional</option>
                    <option value="saude">🏥 Saúde</option>
                  </select>
                </div>

                {/* Faixa Salarial */}
                <div>
                  <label className="block text-sm font-medium text-govgray-700 mb-2">
                    Faixa salarial
                  </label>
                  <select
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                    className="w-full px-3 py-2 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Todos os salários</option>
                    <option value="ate-2k">💰 Até R$ 2.000</option>
                    <option value="2k-5k">💰 R$ 2.000 - R$ 5.000</option>
                    <option value="acima-5k">💰 Acima de R$ 5.000</option>
                  </select>
                </div>

                {/* Tipo de Contrato */}
                <div>
                  <label className="block text-sm font-medium text-govgray-700 mb-2">
                    Tipo de contrato
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="clt">📄 CLT</option>
                    <option value="pj">🏢 Pessoa Jurídica</option>
                    <option value="temporario">⏰ Temporário</option>
                    <option value="estagio">🎓 Estágio</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govblue-600 mx-auto mb-4"></div>
              <p className="text-govgray-600 font-medium">Carregando vagas reais...</p>
            </div>  
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-govgray-800 mb-2">Erro ao carregar vagas</h3>
              <p className="text-govgray-600 mb-6">{error}</p>
            </div>
          </section>
        )}

        {/* Lista de Vagas com Paginação */}
        {!loading && !error && filteredJobs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map((job, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300 relative">
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-govgray-800 mb-1">{job.title || 'Vaga sem título'}</h3>
                    <p className="text-govgray-600 text-sm font-medium">{job.company?.name || job.company || 'Empresa não informada'}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">�</span>
                      <span className="text-sm">{job.location || 'Brasil'}</span>
                    </div>
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">�💰</span>
                      <span className="text-sm font-semibold text-govgreen-600">{job.salary || 'Salário a combinar'}</span>
                    </div>
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">⏰</span>
                      <span className="text-sm">Recente</span>
                    </div>
                  </div>

                  <p className="text-govgray-600 text-sm mb-4 line-clamp-2">
                    {job.description || 'Descrição não disponível'}
                  </p>

                  <button 
                    onClick={() => handleApply(job)}
                    className="w-full py-3 px-4 rounded-lg transition-colors font-medium shadow-md bg-govgreen-600 hover:bg-govgreen-700 text-white"
                  >
                    {job.isExternal ? '✨ Quero me Candidatar' : '✨ Quero me Candidatar'}
                  </button>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-govgray-100 text-govgray-700 rounded-lg hover:bg-govgray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-govblue-600 text-white'
                        : 'bg-govgray-100 text-govgray-700 hover:bg-govgray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-govgray-100 text-govgray-700 rounded-lg hover:bg-govgray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima →
                </button>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && jobs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-govgray-800 mb-4">Nenhuma vaga encontrada</h3>
              <p className="text-govgray-600 mb-8 max-w-md mx-auto">
                Não encontramos vagas com os filtros aplicados. Tente ajustar os critérios de busca.
              </p>
              <button
                onClick={clearFilters}
                className="bg-govblue-600 text-white px-6 py-3 rounded-lg hover:bg-govblue-700 transition-colors font-medium"
              >
                🗑️ Limpar Filtros
              </button>
            </div>
          </section>
        )}

        {/* Empty State - Nenhuma vaga disponível */}
        {!loading && !error && jobs.length === 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-govgray-800 mb-4">Nenhuma vaga encontrada</h3>
              <p className="text-govgray-600 mb-8 max-w-md mx-auto">
                Não há vagas disponíveis no momento. Nossas fontes estão sendo atualizadas constantemente.
              </p>
            </div>
          </section>
        )}

        {/* Espaço branco antes do footer */}
        <div className="bg-white py-12">
          {/* Espaço em branco intencional */}
        </div>

        {/* Modal de Lead - Vagas Internas */}
        <LeadModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobData={selectedJob}
        />

        {/* Modal de Lead - Vagas Externas */}
        <ExternalJobModal
          isOpen={isExternalModalOpen}
          onClose={() => setIsExternalModalOpen(false)}
          job={selectedExternalJob}
          onSubmit={handleExternalJobSubmit}
        />
      </div>
    )
  }

export default VagasPage
