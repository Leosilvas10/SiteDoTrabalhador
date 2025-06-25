import Head from "next/head"
import { useState, useEffect } from "react"
import Header from "../src/components/Header/Header"
import Footer from "../src/components/Footer/Footer"
import LeadModal from "../src/components/LeadModal/LeadModal"

const VagasPage = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    area: "",
    city: "",
    salary: ""
  })
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 12

  // Função helper para busca segura em strings
  const safeIncludes = (str, search) => {
    if (!str || !search || typeof str !== 'string' || typeof search !== 'string') {
      return false
    }
    return str.toLowerCase().includes(search.toLowerCase())
  }

  // Buscar vagas reais da API
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Buscando vagas reais...')
      
      // Usar a mesma API da página inicial
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/fetch-real-jobs?t=${timestamp}`)
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data || !data.hasOwnProperty('success')) {
        throw new Error('Formato de resposta da API inválido')
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Erro na API')
      }
      
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const processedJobs = data.data.map(job => ({
          ...job,
          timeAgo: getTimeAgo(job.publishedDate || job.start)
        }))
        
        setJobs(processedJobs)
        setFilteredJobs(processedJobs)
        console.log(`✅ ${processedJobs.length} vagas reais carregadas na página de vagas`)
      } else {
        setError('Nenhuma vaga encontrada no momento')
        setJobs([])
        setFilteredJobs([])
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas:', error)
      setError('Erro ao carregar vagas. Tente novamente.')
      setJobs([])
      setFilteredJobs([])
    } finally {
      setLoading(false)
    }
  }

  // Função para calcular tempo decorrido
  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Recente'

      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffMinutes < 60) {
        return diffMinutes <= 1 ? 'Agora mesmo' : `há ${diffMinutes} minutos`
      } else if (diffHours < 24) {
        return diffHours === 1 ? 'há 1 hora' : `há ${diffHours} horas`
      } else {
        return diffDays === 1 ? 'há 1 dia' : `há ${diffDays} dias`
      }
    } catch (error) {
      return 'Recente'
    }
  }

  // Aplicar filtros nas vagas reais
  useEffect(() => {
    if (!jobs.length) {
      setFilteredJobs([])
      return
    }

    let filtered = jobs.filter(job => {
      // Filtro de busca por título, empresa, descrição ou tags
      const searchMatch = !filters.search || 
        safeIncludes(job.title, filters.search) ||
        safeIncludes(job.company?.name || job.company, filters.search) ||
        safeIncludes(job.description, filters.search) ||
        safeIncludes(job.tags, filters.search)

      // Filtro por área/categoria
      const areaMatch = !filters.area || 
        job.category === filters.area ||
        safeIncludes(job.category, filters.area) ||
        safeIncludes(job.tags, filters.area)

      // Filtro por cidade
      const cityMatch = !filters.city || 
        safeIncludes(job.location, filters.city)

      return searchMatch && areaMatch && cityMatch
    })

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [jobs, filters])

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      search: "",
      area: "",
      city: "",
      salary: ""
    })
    setCurrentPage(1)
  }

  // Função para atualizar filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Paginação
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Abrir modal de candidatura
  const openJobModal = (job) => {
    console.log('🎯 Abrindo modal para vaga:', job.title)
    setSelectedJob(job)
  }

  const closeJobModal = () => {
    console.log('❌ Fechando modal de candidatura')
    setSelectedJob(null)
  }

  return (
    <>
      <Head>
        <title>Vagas em Destaque - Site do Trabalhador</title>
        <meta name="description" content="Encontre as melhores oportunidades de emprego. Vagas em destaque de todo o Brasil atualizadas em tempo real." />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-20">
        {/* Hero Section */}
        <section className="bg-govblue-600 relative overflow-hidden border-b-4 border-govyellow-400">
          {/* Padrão geométrico sutil */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-white opacity-5 pattern-geometry"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                💼 Vagas em Destaque
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {loading ? "Carregando vagas..." : `${filteredJobs.length} vagas em destaque de todo o Brasil`}
              </p>
              
              {!loading && (
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span className="text-govyellow-400 mr-2">✅</span>
                    <span className="text-white font-medium">Vagas em Destaque</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span className="text-govyellow-400 mr-2">🌎</span>
                    <span className="text-white font-medium">Todo o Brasil</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span className="text-govyellow-400 mr-2">📊</span>
        {/* Filtros de Busca */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200">
            <h2 className="text-govblue-600 text-lg font-semibold mb-6 flex items-center">
              <span className="mr-2">🔍</span>
              Filtros de Busca
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Busca por palavra-chave */}
              <div>
                <label className="block text-govgray-700 text-sm font-medium mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Cargo, empresa, cidade..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-govgray-800 rounded-lg border border-govgray-300 focus:border-govblue-600 focus:ring-2 focus:ring-govblue-600 focus:ring-opacity-20 focus:outline-none transition-colors"
                />
              </div>

              {/* Filtro por área */}
              <div>
                <label className="block text-govgray-700 text-sm font-medium mb-2">
                  Área
                </label>
                <select
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-govgray-800 rounded-lg border border-govgray-300 focus:border-govblue-600 focus:ring-2 focus:ring-govblue-600 focus:ring-opacity-20 focus:outline-none transition-colors"
                >
                  <option value="">Todas as áreas</option>
                  <option value="Cuidados">Cuidados</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Produção">Produção</option>
                </select>
              </div>

              {/* Filtro por cidade */}
              <div>
                <label className="block text-govgray-700 text-sm font-medium mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-govgray-800 rounded-lg border border-govgray-300 focus:border-govblue-600 focus:ring-2 focus:ring-govblue-600 focus:ring-opacity-20 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-govgray-200">
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 bg-govgray-100 text-govgray-700 rounded-lg hover:bg-govgray-200 transition-colors font-medium"
              >
                🗑️ Limpar Filtros
              </button>
              <button
                onClick={fetchJobs}
                className="flex items-center px-4 py-2 bg-govblue-600 text-white rounded-lg hover:bg-govblue-700 transition-colors font-medium"
              >
                🔄 Atualizar Vagas
              </button>
            </div>
          </div>
        </section>
                🗑️ Limpar Filtros
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
              <button
                onClick={fetchJobs}
                className="px-6 py-3 bg-govblue-600 text-white rounded-lg hover:bg-govblue-700 transition-colors font-medium"
              >
                🔄 Tentar Novamente
              </button>
            </div>
          </section>
        )}    <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-white mb-2">Erro ao carregar vagas</h3>
        {/* Lista de Vagas */}
        {!loading && !error && currentJobs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300 hover:border-govblue-600">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-govgray-800 mb-1">{job.title || 'Vaga sem título'}</h3>
                      <p className="text-govgray-600 text-sm font-medium">{job.company?.name || job.company || 'Empresa não informada'}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-govgreen-100 text-govgreen-700 px-3 py-1 rounded-full text-xs font-medium">
                        {job.type || 'Tipo não informado'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">📍</span>
                      <span className="text-sm">{job.location || 'Local não informado'}</span>
                    </div>
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">💰</span>
                      <span className="text-sm font-semibold text-govgreen-600">{job.salary || 'Salário a combinar'}</span>
                    </div>
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">⏰</span>
                      <span className="text-sm">{job.timeAgo || 'Recente'}</span>
                    </div>
                  </div>

                  <p className="text-govgray-600 text-sm mb-4 line-clamp-2">
                    {job.description || 'Descrição não disponível'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(job.tags) && job.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-govblue-100 text-govblue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                    {job.category && (
                      <span className="bg-govyellow-100 text-govyellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        {job.category}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openJobModal(job)}
                      className="flex-1 bg-govblue-600 text-white py-2 px-4 rounded-lg hover:bg-govblue-700 transition-colors font-medium"
                    >
                      ✅ Quero me Candidatar
                    </button>
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-govgray-100 text-govgray-700 py-2 px-3 rounded-lg hover:bg-govgray-200 transition-colors font-medium"
                      >
                        🔗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sem vagas encontradas */}
        {!loading && !error && currentJobs.length === 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-govgray-800 mb-4">Nenhuma vaga encontrada</h3>
              <p className="text-govgray-600 mb-8 max-w-md mx-auto">
                {filteredJobs.length === 0 && jobs.length === 0 
                  ? 'Não há vagas disponíveis no momento. Nossas fontes estão sendo atualizadas constantemente.'
                  : 'Nenhuma vaga corresponde aos filtros aplicados. Tente ajustar os critérios de busca.'
                }
              </p>
              <div className="space-y-4">
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-govblue-600 text-white font-bold rounded-xl hover:bg-govblue-700 transition-all duration-300 shadow-lg mr-4"
                >
                  🗑️ Limpar Todos os Filtros
                </button>
                <button
                  onClick={fetchJobs}
                  disabled={loading}
                  className="px-8 py-4 bg-govgray-600 text-white font-bold rounded-xl hover:bg-govgray-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? '🔄 Buscando...' : '🔄 Buscar Novamente'}
                </button>
              </div>
              <div className="mt-8 text-sm text-govgray-500">
                <p>💡 Dica: Experimente termos mais gerais na busca</p>
                <p>📍 Ou remova filtros de localização para ver mais opções</p>
              </div>
            </div>
          </section>
        )}        className="px-8 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? '🔄 Buscando...' : '🔄 Buscar Novamente'}
                </button>
              </div>
              <div className="mt-8 text-sm text-slate-500">
                <p>💡 Dica: Experimente termos mais gerais na busca</p>
                <p>📍 Ou remova filtros de localização para ver mais opções</p>
              </div>
            </div>
          </section>
        )}

        {/* Paginação */}
        {!loading && !error && totalPages > 1 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="flex justify-center">
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="px-4 py-2 bg-white text-govgray-700 border border-govgray-300 rounded-lg hover:bg-govgray-50 transition-colors font-medium"
                  >
                    ← Anterior
                  </button>
                )}
                
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = Math.max(1, currentPage - 2) + index
                  if (pageNumber > totalPages) return null
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                        currentPage === pageNumber
                          ? 'bg-govblue-600 text-white'
                          : 'bg-white text-govgray-700 border border-govgray-300 hover:bg-govgray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                
                {currentPage < totalPages && (
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-4 py-2 bg-white text-govgray-700 border border-govgray-300 rounded-lg hover:bg-govgray-50 transition-colors font-medium"
                  >
                    Próxima →
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Modal de Candidatura */}
      {selectedJob && (
        <LeadModal job={selectedJob} onClose={closeJobModal} />
      )}
    </>
  )
}

export default VagasPage
