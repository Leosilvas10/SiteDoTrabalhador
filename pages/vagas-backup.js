import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../src/components/Header/Header'
import LeadModal from '../src/components/LeadModal/LeadModal'
import SimpleCopyright from '../src/components/Copyright/SimpleCopyright'

const VagasPage = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    area: "",
    salary: ""
  })
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 12

  // Função helper para busca segura em strings
  const safeIncludes = (str, search) => {
    if (!str || !search) return true
    return str.toString().toLowerCase().includes(search.toLowerCase())
  }

  // Buscar vagas reais da API
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // 🚀 CACHE INSTANTÂNEO para página de vagas
      const cachedData = localStorage.getItem('vagasPageCache')
      const cacheTime = localStorage.getItem('vagasPageCacheTime')
      const now = Date.now()
      const cacheMaxAge = 2 * 60 * 1000 // 2 minutos para cache válido
      
      // Se há cache válido, usar IMEDIATAMENTE
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < cacheMaxAge) {
        try {
          const jobs = JSON.parse(cachedData)
          if (Array.isArray(jobs) && jobs.length > 0) {
            console.log('⚡ CACHE INSTANTÂNEO vagas carregado:', jobs.length, 'vagas')
            const jobsWithId = jobs.map((job, index) => ({
              ...job,
              id: job.id || `job-${index}`,
              timeAgo: calculateTimeAgo(job.datePosted || job.created_at || new Date())
            }))
            setJobs(jobsWithId)
            setFilteredJobs(jobsWithId)
            setLoading(false)
            setError(null)
            
            // Buscar atualizações em BACKGROUND
            setTimeout(() => fetchJobsFromAPI(false), 1000)
            return
          }
        } catch (parseError) {
          console.warn('Cache vagas corrompido, removendo...')
          localStorage.removeItem('vagasPageCache')
          localStorage.removeItem('vagasPageCacheTime')
        }
      }
      
      // Se não há cache válido, buscar com loading
      await fetchJobsFromAPI(true)
      
    } catch (error) {
      console.error('❌ Erro geral ao buscar vagas:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  // Função separada para buscar da API
  const fetchJobsFromAPI = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
        setError(null)
      }
      
      console.log('🔄 Buscando vagas reais...')
      
      const timestamp = Date.now()
      const response = await fetch(`/api/fetch-real-jobs?limit=120&t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.jobs)) {
        console.log('✅ Vagas carregadas:', data.jobs.length)
        
        const jobsWithId = data.jobs.map((job, index) => ({
          ...job,
          id: job.id || `job-${index}`,
          timeAgo: calculateTimeAgo(job.datePosted || job.created_at || new Date())
        }))
        
        setJobs(jobsWithId)
        setFilteredJobs(jobsWithId)
        
        // 💾 Salvar no cache para carregamento instantâneo futuro
        try {
          localStorage.setItem('vagasPageCache', JSON.stringify(jobsWithId))
          localStorage.setItem('vagasPageCacheTime', Date.now().toString())
          console.log('💾 Cache vagas atualizado com', jobsWithId.length, 'vagas')
        } catch (error) {
          console.warn('Erro ao salvar cache vagas:', error)
        }
        
      } else {
        console.warn('❌ Resposta da API não contém jobs válidos:', data)
        setError('Nenhuma vaga encontrada no momento')
        setJobs([])
        setFilteredJobs([])
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas da API:', error)
      if (showLoading) {
        setError(error.message)
        setJobs([])
        setFilteredJobs([])
      }
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  // Calcular tempo decorrido
  const calculateTimeAgo = (dateString) => {
    const now = new Date()
    const posted = new Date(dateString)
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}sem atrás`
  }

  // Aplicar filtros nas vagas reais
  useEffect(() => {
    if (!jobs.length) {
      setFilteredJobs([])
      return
    }

    let filtered = jobs.filter(job => {
      // Filtro por busca de texto
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

      return searchMatch && areaMatch
    })

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [jobs, filters])

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      search: "",
      area: "",
      salary: ""
    })
    setCurrentPage(1)
  }

  // Atualizar filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Paginação
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Modal functions
  const openJobModal = (job) => {
    setSelectedJob(job)
  }

  const closeJobModal = () => {
    setSelectedJob(null)
  }

  return (
    <>
      <Head>
        <title>Vagas de Emprego - Site do Trabalhador</title>
        <meta name="description" content="Encontre vagas de emprego em todo o Brasil. Oportunidades atualizadas em tempo real." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        {/* Hero Section */}
        <section className="bg-govblue-600 relative overflow-hidden border-b-4 border-govyellow-400">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-white opacity-5"></div>
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
                    <span className="text-white font-medium">Atualizadas em Tempo Real</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filtros de Busca */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200">
            <h2 className="text-govblue-600 text-lg font-semibold mb-6 flex items-center">
              <span className="mr-2">🔍</span>
              Filtros de Busca
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Busca por palavra-chave */}
              <div>
                <label className="block text-govgray-700 text-sm font-medium mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Cargo, empresa..."
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
                  <option value="Limpeza">Limpeza</option>
                  <option value="Segurança">Segurança</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Cuidados">Cuidados</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Produção">Produção</option>
                </select>
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
                onClick={() => fetchJobsFromAPI(true)}
                className="flex items-center px-4 py-2 bg-govblue-600 text-white rounded-lg hover:bg-govblue-700 transition-colors font-medium"
              >
                🔄 Atualizar Vagas
              </button>
            </div>
          </div>
        </section>

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
                onClick={() => fetchJobsFromAPI(true)}
                className="px-6 py-3 bg-govblue-600 text-white rounded-lg hover:bg-govblue-700 transition-colors font-medium"
              >
                🔄 Tentar Novamente
              </button>
            </div>
          </section>
        )}

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

        {/* Empty State */}
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
                  onClick={() => fetchJobsFromAPI(true)}
                  disabled={loading}
                  className="px-8 py-4 bg-govgray-600 text-white font-bold rounded-xl hover:bg-govgray-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? '🔄 Buscando...' : '🔄 Buscar Novamente'}
                </button>
              </div>
              <div className="mt-8 text-sm text-govgray-500">
                <p>💡 Dica: Experimente termos mais gerais na busca</p>
                <p>🔍 Ou experimente buscar por área de interesse</p>
              </div>
            </div>
          </section>
        )}

        {/* Paginação */}
        {!loading && !error && totalPages > 1 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-govblue-600 text-white border-govblue-600'
                          : 'bg-white text-govgray-700 border-govgray-300 hover:bg-govgray-50'
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

      {/* Espaço branco antes do footer */}
      <div className="bg-white py-12">
        {/* Espaço em branco intencional */}
      </div>

      {/* Footer simples - diretamente colado ao fim da página */}
      <SimpleCopyright />

      {/* Modal de Candidatura */}
      {selectedJob && (
        <LeadModal job={selectedJob} onClose={closeJobModal} />
      )}
    </>
  )
}

export default VagasPage
