import Head from "next/head"
import { useState, useEffect, useCallback } from "react"
import JobCard from "../src/components/JobCard/JobCard"
import HeroSection from "../src/components/HeroSection/HeroSection"
import SearchFilters from "../src/components/SearchFilters/SearchFilters"
import LeadModal from "../src/components/LeadModal/LeadModal"
import CalculadoraTrabalhista from "../src/components/CalculadoraTrabalhista/CalculadoraTrabalhista"
import FAQSection from "../src/components/FAQ/FAQ"

const HomePage = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [nextUpdate, setNextUpdate] = useState(null)
  const [updateCountdown, setUpdateCountdown] = useState(20 * 60) // 20 minutos em segundos
  const [filters, setFilters] = useState({
    city: "",
    area: "",
    type: "",
    search: ""
  })
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 20

  // Função para operações seguras com strings
  const safeIncludes = (str, search) => {
    if (!str || !search || typeof str !== 'string' || typeof search !== 'string') {
      return false
    }
    return str.toLowerCase().includes(search.toLowerCase())
  }

  const safeArray = (arr) => {
    return Array.isArray(arr) ? arr : []
  }

  // Função para calcular tempo decorrido de forma precisa
  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString)

      if (isNaN(date.getTime())) {
        return 'Recente'
      }

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
      console.error('Erro ao calcular tempo:', error)
      return 'Recente'
    }
  }

  // Função para buscar vagas reais com cache busting
  const fetchJobs = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true)
      }
      setError(null)

      console.log('🔄 Buscando vagas em todo o Brasil...')

      // Verificar cache local primeiro (válido por 5 minutos)
      const cachedData = localStorage.getItem('jobsCache')
      const cacheTime = localStorage.getItem('jobsCacheTime')
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)

      if (cachedData && cacheTime && parseInt(cacheTime) > fiveMinutesAgo) {
        console.log('📦 Usando cache local para carregar vagas rapidamente...')
        const jobs = JSON.parse(cachedData)
        setJobs(jobs)
        setLoading(false)
        setLastUpdate(new Date(parseInt(cacheTime)))
        return
      }

      // Usar nova API de vagas reais com timeout menor
      const timestamp = new Date().getTime()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 segundos timeout

      const response = await fetch(`/api/fetch-real-jobs?t=${timestamp}&limit=50`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

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

      const jobsData = safeArray(data.data)

      // Se não há vagas reais, mostrar mensagem apropriada
      if (jobsData.length === 0) {
        setJobs([])
        setError('Nenhuma vaga encontrada no momento. Estamos buscando novas oportunidades em todo o Brasil.')
        console.log('⚠️ Nenhuma vaga encontrada')
      } else {
        // Processar vagas reais e adicionar campo de tempo calculado
        const processedJobs = jobsData.map(job => ({
          ...job,
          timeAgo: getTimeAgo(job.publishedDate || job.start)
        }))

        setJobs(processedJobs)
        
        // Salvar no cache local
        localStorage.setItem('jobsCache', JSON.stringify(processedJobs))
        localStorage.setItem('jobsCacheTime', Date.now().toString())
        
        console.log(`✅ ${processedJobs.length} vagas carregadas de todo o Brasil`)
        console.log(`📊 Fontes: ${data.meta?.sources?.join(', ') || 'Não informado'}`)
        console.log(`📈 Estatísticas:`, data.meta?.stats)
      }

      // Atualizar informações de timestamp
      setLastUpdate(new Date())
      if (data.meta?.nextUpdate) {
        setNextUpdate(new Date(data.meta.nextUpdate))
      }

      // Resetar countdown para 20 minutos
      setUpdateCountdown(20 * 60)

    } catch (error) {
      console.error("❌ Erro ao buscar vagas:", error)
      
      // Tentar usar cache mesmo que esteja expirado em caso de erro
      const cachedData = localStorage.getItem('jobsCache')
      if (cachedData && error.name === 'AbortError') {
        console.log('⏱️ Timeout - usando cache local...')
        const jobs = JSON.parse(cachedData)
        setJobs(jobs)
        setError('Carregamento demorou mais que o esperado. Exibindo vagas em cache.')
      } else {
        setError(`Erro ao carregar vagas: ${error.message}`)
        setJobs([])
      }
    } finally {
      if (showLoadingState) {
        setLoading(false)
      }
    }
  }, [])

  // Effect para busca inicial e configuração de intervalos
  useEffect(() => {
    // Buscar vagas reais em vez de usar vagas mockadas
    fetchJobs()
    
    // Configurar atualização automática a cada 20 minutos
    const interval = setInterval(() => {
      fetchJobs(false) // Não mostrar loading no auto-refresh
    }, 20 * 60 * 1000) // 20 minutos
    
    // Configurar countdown
    const countdownInterval = setInterval(() => {
      setUpdateCountdown(prev => prev > 0 ? prev - 1 : 20 * 60)
    }, 1000)
    
    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [])

  // Effect para filtrar vagas
  useEffect(() => {
    try {
      let filtered = [...jobs]

      if (filters.search) {
        filtered = filtered.filter(job => 
          safeIncludes(job.title, filters.search) ||
          safeIncludes(job.company.name, filters.search) ||
          safeIncludes(job.description, filters.search) ||
          safeIncludes(job.tags, filters.search)
        )
      }

      if (filters.city) {
        filtered = filtered.filter(job => 
          safeIncludes(job.location, filters.city)
        )
      }

      if (filters.area) {
        filtered = filtered.filter(job => 
          safeIncludes(job.category, filters.area) || 
          safeIncludes(job.tags, filters.area)
        )
      }

      if (filters.type) {
        filtered = filtered.filter(job => 
          safeIncludes(job.type, filters.type)
        )
      }

      setFilteredJobs(filtered)
    } catch (error) {
      console.error("Erro ao filtrar vagas:", error)
      setFilteredJobs(jobs)
    }
  }, [filters, jobs])

  // Função para abrir modal de candidatura
  const handleApplyClick = (job) => {
    setSelectedJob(job)
    setShowModal(true)
  }

  // Função para fechar modal
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedJob(null)
  }

  // Função para formatear countdown
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Filtros rápidos para vagas operacionais
  const quickFilters = [
    { label: '🏠 Doméstica', filter: { area: 'Serviços Domésticos' } },
    { label: '🧹 Limpeza', filter: { area: 'Limpeza' } },
    { label: '🛡️ Porteiro/Segurança', filter: { area: 'Segurança' } },
    { label: '🔧 Manutenção', filter: { area: 'Manutenção' } },
    { label: '👨‍⚕️ Cuidador', filter: { area: 'Cuidados' } },
    { label: '🚗 Motorista', filter: { area: 'Transporte' } },
    { label: '🍽️ Alimentação', filter: { area: 'Alimentação' } },
    { label: '🔨 Construção', filter: { area: 'Construção Civil' } },
  ]

  return (
    <>
      <Head>
        <title>Site do Trabalhador - Vagas de Todo o Brasil</title>
        <meta name="description" content="Vagas de emprego em todo o Brasil: doméstica, porteiro, limpeza, cuidador, motorista e mais. Mais de 50 vagas atualizadas constantemente de fontes como Indeed, Vagas.com e mercado brasileiro." />
        <meta name="keywords" content="vagas emprego brasil real, doméstica, porteiro, auxiliar limpeza, cuidador, trabalho operacional, indeed brasil, vagas.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Seção Início - Hero */}
      <section id="inicio" className="min-h-screen">
        <HeroSection filters={filters} setFilters={setFilters} />
      </section>

      {/* Seção Vagas */}
      <section id="vagas" className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-20">
          {/* Filtros Avançados */}
          <SearchFilters filters={filters} setFilters={setFilters} />

          {/* Cabeçalho da Seção Vagas */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              💼 Vagas em Destaque
            </h2>
            <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
              Vagas em Todo o Brasil atualizadas em tempo real
            </p>

            {/* Status de atualização */}
            <div className="mb-6">
              {loading ? (
                <p className="text-xl text-blue-400 mb-2">
                  🔄 Carregando vagas...
                </p>
              ) : jobs.length > 0 ? (
                <>
                  <p className="text-xl text-green-400 mb-2">
                    ✅ {jobs.length} vagas disponíveis | Mostrando {Math.min(6, filteredJobs.length)} em destaque
                  </p>
                  {lastUpdate && (
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</p>
                      <p>Próxima atualização em: {formatCountdown(updateCountdown)}</p>
                      <p>🔄 Atualização automática a cada 20 minutos</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xl text-amber-400 mb-2">
                  ⏳ Buscando novas vagas...
                </p>
              )}
            </div>

            {/* Estatísticas em destaque */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">{jobs.length}</div>
                <div className="text-blue-200 text-sm">Vagas</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-green-200 text-sm">Verificadas</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">20min</div>
                <div className="text-purple-200 text-sm">Atualização</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">🇧🇷</div>
                <div className="text-yellow-200 text-sm">Só Brasil</div>
              </div>
            </div>

            {/* Filtros rápidos */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {quickFilters.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setFilters(prev => ({ ...prev, ...item.filter }))}
                  className="px-4 py-2 rounded-full text-sm bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setFilters({ city: "", area: "", type: "", search: "" })}
                className="px-4 py-2 rounded-full text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all duration-300"
              >
                🔄 Limpar
              </button>
            </div>
          </div>

          {/* Indicador de Error */}
          {error && (
            <div className="mb-8 p-4 bg-amber-900/20 border border-amber-600 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <h3 className="text-amber-400 font-semibold">Aviso</h3>
                  <p className="text-amber-200 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="job-card animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            /* Listagem de Vagas em Destaque - Apenas 6 vagas */
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.slice(0, 6).map((job, index) => (
                  <div 
                    key={job.id} 
                    className="fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <JobCard 
                      job={job} 
                      onApplyClick={() => handleApplyClick(job)} 
                    />
                  </div>
                ))}
              </div>

              {/* Botão Ver Todas as Vagas */}
              {jobs.length > 6 && (
                <div className="text-center mt-12">
                  <div className="mb-4">
                    <p className="text-slate-300 mb-2">
                      Mostrando apenas 6 vagas em destaque
                    </p>
                    <p className="text-blue-400 font-semibold">
                      {jobs.length - 6} vagas adicionais disponíveis
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.href = '/vagas'}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <span className="mr-2">👀</span>
                    Ver Todas as {jobs.length} Vagas
                    <span className="ml-2">→</span>
                  </button>
                  <p className="text-sm text-slate-400 mt-3">
                    Filtros avançados, busca por cidade e muito mais na página de vagas
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Estado Vazio - Nenhuma vaga real encontrada */
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Nenhuma vaga real encontrada
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {jobs.length === 0 
                  ? 'Estamos buscando novas vagas em tempo real. Tente novamente em alguns minutos.'
                  : 'Não encontramos vagas que correspondam aos seus filtros. Tente ajustar os critérios de busca.'
                }
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => fetchJobs()}
                  className="btn-primary mr-4"
                >
                  🔄 Buscar Novamente
                </button>
                {jobs.length > 0 && (
                  <button
                    onClick={() => setFilters({ city: "", area: "", type: "", search: "" })}
                    className="btn-secondary"
                  >
                    🔄 Limpar Filtros
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Indicador de próxima atualização */}
          {!loading && jobs.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-slate-500 text-sm">
                💡 Próxima busca por vagas em {formatCountdown(updateCountdown)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Seção Calculadora Trabalhista */}
      <section id="calculadora" className="min-h-screen bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              🧮 Calculadora Trabalhista
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Calcule seus direitos trabalhistas de forma rápida e precisa. 
              Ferramenta gratuita e atualizada com a legislação atual.
            </p>
          </div>

          <CalculadoraTrabalhista />
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contato" className="min-h-screen bg-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              📞 Entre em Contato
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Tem dúvidas sobre direitos trabalhistas, problemas com vagas ou sugestões? 
              Nossa equipe está pronta para ajudar você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Fale Conosco</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Email</h4>
                    <p className="text-slate-400">contato@sitedotrabalhador.com.br</p>
                    <p className="text-slate-400">suporte@sitedotrabalhador.com.br</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">WhatsApp</h4>
                    <p className="text-slate-400">(11) 99999-9999</p>
                    <p className="text-slate-500 text-sm">Atendimento: Seg a Sex, 8h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Endereço</h4>
                    <p className="text-slate-400">São Paulo - SP, Brasil</p>
                    <p className="text-slate-500 text-sm">Atendimento 100% digital</p>
                  </div>
                </div>
              </div>

              {/* FAQ Interativo */}
              <FAQSection />
            </div>

            {/* Formulário de Contato */}
            <div className="bg-slate-700 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Envie sua Mensagem</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-2">Nome *</label>
                    <input type="text" className="form-input w-full" placeholder="Seu nome completo" required />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2">Email *</label>
                    <input type="email" className="form-input w-full" placeholder="seu@email.com" required />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Assunto *</label>
                  <select className="form-input w-full" required>
                    <option value="">Selecione o assunto</option>
                    <option>Dúvida sobre direitos trabalhistas</option>
                    <option>Problema com vaga de emprego</option>
                    <option>Sugestão de melhoria</option>
                    <option>Parceria/Empresa</option>
                    <option>Denúncia</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Mensagem *</label>
                  <textarea 
                    className="form-input w-full h-32 resize-none" 
                    placeholder="Descreva sua mensagem detalhadamente..." 
                    required
                  ></textarea>
                </div>

                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1" required />
                  <label className="text-slate-400 text-sm">
                    Aceito o tratamento dos meus dados conforme a <button type="button" className="text-blue-400 hover:underline">Política de Privacidade</button> e <button type="button" className="text-blue-400 hover:underline">LGPD</button>.
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full">
                  📤 Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      

      {/* Modal de Candidatura */}
      {showModal && selectedJob && (
        <LeadModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default HomePage