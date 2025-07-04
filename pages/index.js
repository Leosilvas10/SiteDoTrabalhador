import Head from "next/head"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import JobCard from "../src/components/JobCard/JobCard"
import HeroSection from "../src/components/HeroSection/HeroSection"
import LeadModal from "../src/components/LeadModal/LeadModal"

const HomePage = () => {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [nextUpdate, setNextUpdate] = useState(null)
  const [updateCountdown, setUpdateCountdown] = useState(60 * 60) // 60 minutos em segundos
  const [totalSystemJobs, setTotalSystemJobs] = useState(0) // Total de vagas no sistema
  
  // Estado do formulário de contato
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    lgpdConsent: false
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)

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

  // Função para buscar vagas reais com cache instantâneo
  const fetchJobs = useCallback(async (showLoadingState = true) => {
    try {
      // 🚀 CACHE INSTANTÂNEO - Mostrar dados imediatamente se disponível
      const cachedData = localStorage.getItem('jobsCache')
      const cacheTime = localStorage.getItem('jobsCacheTime')
      const totalCached = localStorage.getItem('totalSystemJobs')
      const now = Date.now()
      const cacheMaxAge = 3 * 60 * 1000 // 3 minutos para cache válido
      
      // Se há cache válido, usar IMEDIATAMENTE
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < cacheMaxAge) {
        try {
          const jobs = JSON.parse(cachedData)
          if (Array.isArray(jobs) && jobs.length > 0) {
            console.log('⚡ CACHE INSTANTÂNEO carregado:', jobs.length, 'vagas')
            setJobs(jobs.slice(0, 6))
            setTotalSystemJobs(parseInt(totalCached) || jobs.length)
            setLoading(false)
            setError(null)
            setLastUpdate(new Date(parseInt(cacheTime)))
            
            // Buscar atualizações em BACKGROUND (sem loading)
            setTimeout(() => fetchJobsFromAPI(false), 500)
            return
          }
        } catch (parseError) {
          console.warn('Cache corrompido, removendo...')
          localStorage.removeItem('jobsCache')
          localStorage.removeItem('jobsCacheTime')
          localStorage.removeItem('totalSystemJobs')
        }
      }
      
      // Se não há cache válido, buscar com loading normal
      await fetchJobsFromAPI(showLoadingState)
      
    } catch (error) {
      console.error("❌ Erro geral na busca:", error)
      setError(`Erro ao carregar vagas: ${error.message}`)
      setLoading(false)
    }
  }, [])

  // Função separada para buscar da API (pode ser chamada em background)
  const fetchJobsFromAPI = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true)
        setError(null)
      }

      console.log('📡 Buscando vagas da API HOME (fonte unificada)...')
      
      const timestamp = Date.now()
      const response = await fetch(`/api/all-jobs-combined?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      console.log('📡 Resposta da API HOME recebida, status:', response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('🔍 Dados HOME recebidos:', { success: data.success, dataLength: data.data?.length })

      if (!data || !data.hasOwnProperty('success')) {
        throw new Error('Formato de resposta da API inválido')
      }

      if (!data.success) {
        throw new Error(data.message || 'Erro na API')
      }

      const jobsData = safeArray(data.jobs || data.data || [])
      const totalAvailable = data.meta?.totalJobs || data.meta?.totalAvailable || jobsData.length
      
      console.log('📊 Processando vagas HOME (sem cidade):', jobsData.length)
      console.log('📈 Total no sistema:', totalAvailable)

      // Atualizar total do sistema
      setTotalSystemJobs(totalAvailable)

      // Se não há vagas reais, mostrar mensagem apropriada
      if (jobsData.length === 0) {
        setJobs([])
        setError('Nenhuma vaga encontrada no momento. Estamos buscando novas oportunidades em todo o Brasil.')
        console.log('⚠️ Nenhuma vaga encontrada')
      } else {
        // Processar vagas HOME (limitadas a 6, sem cidade específica)
        const processedJobs = jobsData.slice(0, 6).map(job => ({
          ...job,
          timeAgo: getTimeAgo(job.publishedDate || job.start),
          // Garantir que a cidade está oculta na home
          location: 'Brasil',
          originalLocation: job.originalLocation || job.location,
          showLocation: false
        }))

        setJobs(processedJobs)
        
        // 💾 Salvar no cache local para carregamento instantâneo futuro
        try {
          localStorage.setItem('jobsCache', JSON.stringify(processedJobs))
          localStorage.setItem('jobsCacheTime', Date.now().toString())
          localStorage.setItem('totalSystemJobs', totalAvailable.toString())
          console.log('💾 Cache atualizado com', processedJobs.length, 'vagas')
        } catch (error) {
          console.warn('Erro ao salvar cache:', error)
        }
        
        console.log(`✅ ${processedJobs.length} vagas carregadas de todo o Brasil`)
        console.log(`📊 Fontes: ${data.meta?.sources?.join(', ') || 'Indeed Brasil'}`)
      }

      // Atualizar informações de timestamp
      setLastUpdate(new Date())
      if (data.meta?.nextUpdate) {
        setNextUpdate(new Date(data.meta.nextUpdate))
      }

      // Resetar countdown para 60 minutos
      setUpdateCountdown(60 * 60)

    } catch (error) {
      console.error("❌ Erro ao buscar vagas da API:", error)
      
      if (showLoadingState) {
        // Tentar usar cache mesmo que esteja expirado em caso de erro
        let cachedData = null
        try {
          cachedData = localStorage.getItem('jobsCache')
        } catch (error) {
          console.warn('Erro ao acessar localStorage em fallback:', error)
        }
        
        if (cachedData) {
          console.log('🔄 Usando cache local como fallback...')
          try {
            const jobs = JSON.parse(cachedData)
            if (Array.isArray(jobs) && jobs.length > 0) {
              setJobs(jobs)
              setError('Erro na busca em tempo real. Exibindo vagas em cache.')
            } else {
              throw new Error('Cache vazio ou inválido')
            }
          } catch (parseError) {
            console.warn('Erro ao parsear cache em fallback:', parseError)
            setError(`Erro ao carregar vagas: ${error.message}`)
            setJobs([])
          }
        } else {
          setError(`Erro ao carregar vagas: ${error.message}`)
          setJobs([])
        }
      }
    } finally {
      if (showLoadingState) {
        setLoading(false)
      }
    }
  }

  // Effect para busca inicial e configuração de intervalos
  useEffect(() => {
    // 🚨 LIMPAR CACHE SEMPRE - Para forçar vagas novas e corretas após mudança de API
    console.log('🧹 Limpando cache para buscar vagas da fonte unificada...')
    localStorage.removeItem('jobsCache')
    localStorage.removeItem('jobsCacheTime')
    localStorage.removeItem('totalSystemJobs')
    
    // Buscar vagas reais em vez de usar vagas mockadas
    fetchJobs()
    
    // Configurar atualização automática a cada 60 minutos
    const interval = setInterval(() => {
      fetchJobs(false) // Não mostrar loading no auto-refresh
    }, 60 * 60 * 1000) // 60 minutos
    
    // Configurar countdown
    const countdownInterval = setInterval(() => {
      setUpdateCountdown(prev => prev > 0 ? prev - 1 : 60 * 60)
    }, 1000)
    
    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [fetchJobs])

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

  // Função para lidar com envio do formulário de contato
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message || !contactForm.lgpdConsent) {
      alert('Por favor, preencha todos os campos obrigatórios e aceite os termos.')
      return
    }

    setIsSubmittingContact(true)

    try {
      const leadData = {
        nome: contactForm.name,
        email: contactForm.email,
        telefone: '', // Não temos WhatsApp no formulário de contato
        assunto: contactForm.subject,
        mensagem: contactForm.message,
        source: 'Formulário de Contato - Página Inicial',
        lgpdConsent: contactForm.lgpdConsent,
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setContactForm({
          name: '',
          email: '',
          subject: '',
          message: '',
          lgpdConsent: false
        })
      } else {
        throw new Error(data.message || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário de contato:', error)
      alert('❌ Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.')
    } finally {
      setIsSubmittingContact(false)
    }
  }

  return (
    <>
      <Head>
        <title>Site do Trabalhador - Vagas de Todo o Brasil</title>
        <meta name="description" content="Vagas de emprego em todo o Brasil: doméstica, porteiro, limpeza, cuidador, motorista e mais. Mais de 50 vagas atualizadas constantemente de fontes como Indeed, Vagas.com e mercado brasileiro." />
        <meta name="keywords" content="vagas emprego brasil real, doméstica, porteiro, auxiliar limpeza, cuidador, trabalho operacional, indeed brasil, vagas.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/site-do-trabalhador.ico" />
      </Head>

      {/* Seção Início - Hero */}
      <section id="inicio" className="min-h-screen">
        <HeroSection />
      </section>

      {/* Seção Vagas - Estilo Gov.br */}
      <section id="vagas" className="min-h-screen bg-govgray-50">
        <div className="container mx-auto px-4 py-20">
          {/* Cabeçalho da Seção Vagas - Estilo Gov.br */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-govblue-800 mb-4">
              💼 Vagas em Destaque
            </h2>
            <p className="text-xl text-govgray-700 mb-6 max-w-2xl mx-auto font-medium">
              Vagas em Todo o Brasil atualizadas em tempo real
            </p>

            {/* Status de atualização - Estilo Gov.br */}
            <div className="mb-6">
              {loading ? (
                <p className="text-xl text-govblue-600 mb-2 font-bold">
                  🔄 Carregando vagas...
                </p>
              ) : jobs.length > 0 ? (
                <>
                  <p className="text-xl text-govgreen-600 mb-2 font-bold">
                    ✅ {totalSystemJobs} vagas disponíveis | Mostrando {Math.min(6, jobs.length)} em destaque
                  </p>
                  {lastUpdate && (
                    <div className="text-sm text-govgray-600 space-y-1 font-medium">
                      <p>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</p>
                      <p>Próxima atualização em: {formatCountdown(updateCountdown)}</p>
                      <p>🔄 Atualização automática a cada 1 hora</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xl text-govyellow-600 mb-2 font-bold">
                  ⏳ Buscando novas vagas...
                </p>
              )}
            </div>

            {/* Estatísticas em destaque */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">{totalSystemJobs}</div>
                <div className="text-blue-200 text-sm">Vagas</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-green-200 text-sm">Verificadas</div>
              </div>            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-white">1h</div>
              <div className="text-purple-200 text-sm">Atualização</div>
            </div>
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">🇧🇷</div>
                <div className="text-yellow-200 text-sm">Só Brasil</div>
              </div>
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
          ) : jobs.length > 0 ? (
            /* Listagem de Vagas em Destaque - Apenas 6 vagas */
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.slice(0, 6).map((job, index) => (
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
              {jobs.length >= 6 && (
                <div className="text-center mt-12">
                  <div className="mb-4">
                    <p className="text-slate-300 mb-2">
                      Mostrando apenas 6 vagas em destaque
                    </p>
                    <p className="text-blue-400 font-semibold">
                      {Math.max(0, totalSystemJobs - 6)}+ vagas adicionais disponíveis
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/vagas')}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <span className="mr-2">👀</span>
                    Ver Todas as Vagas
                    <span className="ml-2">→</span>
                  </button>
                  <p className="text-sm text-slate-400 mt-3">
                    60 vagas atualizadas a cada 1 hora - Filtros, busca por cidade e mais
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Estado Vazio - Nenhuma vaga real encontrada */
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Buscando novas oportunidades...
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Não encontramos vagas disponíveis no momento. Nossas fontes estão sendo atualizadas constantemente com novas oportunidades em todo o Brasil.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => fetchJobs()}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mr-4"
                >
                  {loading ? '🔄 Buscando...' : '🔄 Buscar Novamente'}
                </button>
                <button
                  onClick={() => router.push('/vagas')}
                  className="px-8 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all duration-300 shadow-lg"
                >
                  📋 Ver Página de Vagas
                </button>
              </div>
              <div className="mt-8 text-sm text-slate-500">
                <p>💡 Dica: Nossas vagas são atualizadas a cada 1 hora</p>
                <p>📱 Enquanto isso, conheça seus direitos trabalhistas abaixo</p>
              </div>
            </div>
          )}

          {/* Indicador de próxima atualização */}
          {!loading && jobs.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-govgray-500 text-sm font-medium">
                💡 Próxima busca por vagas em {formatCountdown(updateCountdown)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Seção para Empresas - Chamada para Ação */}
      <section className="bg-gradient-to-r from-govgreen-600 to-govblue-600 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                🏢 Sua Empresa Precisa de Talentos?
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                Conecte-se diretamente com milhares de profissionais qualificados que estão procurando uma oportunidade! 
                Domésticas, porteiros, cuidadores, auxiliares de limpeza, motoristas e muito mais.
              </p>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
                <p className="text-lg mb-6 font-medium">
                  <strong>Por que escolher o Site do Trabalhador para encontrar seus funcionários?</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <p className="mb-3">✅ <strong>Candidatos Verificados:</strong> Profissionais com experiência real</p>
                    <p className="mb-3">✅ <strong>Publicação Gratuita:</strong> Anuncie sua vaga sem custos</p>
                  </div>
                  <div>
                    <p className="mb-3">✅ <strong>Resultados Rápidos:</strong> Receba candidatos em 24h</p>
                    <p className="mb-3">✅ <strong>Suporte Dedicado:</strong> Nossa equipe te ajuda a encontrar o profissional ideal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Link href="/empresas">
                <button className="group bg-white text-govblue-600 hover:bg-govgray-100 font-bold text-xl px-16 py-5 rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
                  <span className="flex items-center space-x-4">
                    <span>🚀</span>
                    <span>PUBLIQUE SUA VAGA GRATUITAMENTE</span>
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </span>
                </button>
              </Link>
              
              <p className="text-lg text-white/90 font-medium">
                Junte-se a centenas de empresas que já encontraram seus funcionários conosco!
              </p>
              
              <p className="text-sm text-white/80 italic">
                ✅ Cadastro Rápido • ✅ Sem Taxas Ocultas • ✅ Candidatos Qualificados • ✅ Atendimento Personalizado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Calculadora de Direitos - Conversão de Leads */}
      <section id="direitos" className="min-h-screen bg-gradient-to-br from-govblue-600 via-govblue-700 to-govblue-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Título Principal - Focado na Dor do Usuário */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              🚨 Será que Seus Direitos Estão Sendo Respeitados? Descubra Agora!
            </h2>

            {/* Parágrafo Principal - Criando a Dor */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
              <p className="text-xl text-white mb-6 font-medium leading-relaxed">
                Você trabalhou duro, mas tem dúvidas se recebeu <strong>tudo o que era seu por direito?</strong> 
                FGTS, seguro-desemprego, horas extras, rescisão... Infelizmente, <span className="text-govyellow-300 font-bold">muitos trabalhadores perdem dinheiro</span> simplesmente por falta de informação. 
                <strong className="text-govyellow-300">Não deixe isso acontecer com você!</strong>
              </p>

              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Use nossa <strong>Calculadora de Direitos Trabalhistas GRATUITA</strong> e tenha uma estimativa clara do que te pertence. 
                É uma ferramenta rápida, fácil de usar e totalmente segura. 
                <span className="text-govyellow-300 font-semibold">Proteja seu futuro financeiro e garante o que é justo!</span>
              </p>

              {/* CTA Principal - Bem Destacado */}
              <div className="flex flex-col items-center space-y-4">
                <Link href="/calculadora" className="group">
                  <button className="bg-gradient-to-r from-govgreen-500 to-govgreen-600 hover:from-govgreen-600 hover:to-govgreen-700 text-white font-bold text-lg px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-govgreen-400 hover:border-govgreen-300">
                    <span className="flex items-center space-x-3">
                      <span>🧮</span>
                      <span>Calcular Meus Direitos</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </button>
                </Link>
                
                <p className="text-sm text-blue-200 italic">
                  ✅ 100% Gratuito • ✅ Resultados Imediatos • ✅ Dados Protegidos
                </p>
              </div>
            </div>

            {/* Elementos de Prova Social */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-govyellow-300 mb-2">25K+</div>
                <div className="text-sm">Cálculos Realizados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-govyellow-300 mb-2">R$ 2.8M</div>
                <div className="text-sm">Recuperados pelos Usuários*</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-govyellow-300 mb-2">4.9⭐</div>
                <div className="text-sm">Avaliação dos Usuários</div>
              </div>
            </div>

            <p className="text-xs text-blue-200 mt-4 italic">
              *Estimativa baseada em relatos de usuários que utilizaram nossa calculadora
            </p>
          </div>
        </div>
      </section>

      {/* Seção Contato - Estilo Gov.br */}
      <section id="contato" className="min-h-screen bg-govgray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-govblue-800 mb-4">
              📞 Entre em Contato
            </h2>
            <p className="text-xl text-govgray-700 max-w-3xl mx-auto font-medium">
              Tem dúvidas sobre direitos trabalhistas, problemas com vagas ou sugestões? 
              Nossa equipe está pronta para ajudar você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Informações de Contato - Estilo Gov.br */}
            <div>
              <h3 className="text-2xl font-bold text-govblue-800 mb-8">Fale Conosco</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-govblue-600 rounded flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="text-govblue-800 font-bold">Email</h4>
                    <p className="text-govgray-600 font-medium">contato@sitedotrabalhador.com.br</p>
                    <p className="text-govgray-600 font-medium">suporte@sitedotrabalhador.com.br</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-govgreen-600 rounded flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="text-govblue-800 font-bold">WhatsApp</h4>
                    <p className="text-govgray-600 font-medium">(11) 99999-9999</p>
                    <p className="text-govgray-500 text-sm font-medium">Atendimento: Seg a Sex, 8h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-govyellow-500 rounded flex items-center justify-center">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <h4 className="text-govblue-800 font-bold">Endereço</h4>
                    <p className="text-govgray-600 font-medium">São Paulo - SP, Brasil</p>
                    <p className="text-govgray-500 text-sm font-medium">Atendimento 100% digital</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Contato - Estilo Gov.br */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-govblue-600">
              <h3 className="text-2xl font-bold text-govblue-800 mb-6">Envie sua Mensagem</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-govblue-800 mb-2 font-medium">Nome *</label>
                    <input 
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="form-input w-full" 
                      placeholder="Seu nome completo" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-govblue-800 mb-2 font-medium">Email *</label>
                    <input 
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="form-input w-full" 
                      placeholder="seu@email.com" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-govblue-800 mb-2 font-medium">Assunto *</label>
                  <select 
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="form-input w-full" 
                    required
                  >
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
                  <label className="block text-govblue-800 mb-2 font-medium">Mensagem *</label>
                  <textarea 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="form-input w-full h-32 resize-none" 
                    placeholder="Descreva sua mensagem detalhadamente..." 
                    required
                  ></textarea>
                </div>

                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    checked={contactForm.lgpdConsent}
                    onChange={(e) => setContactForm({...contactForm, lgpdConsent: e.target.checked})}
                    className="mt-1" 
                    required 
                  />
                  <label className="text-govblue-700 text-sm">
                    Aceito o tratamento dos meus dados conforme a <Link href="/politica-privacidade" className="text-govblue-600 hover:text-govblue-800 hover:underline">Política de Privacidade</Link> e <Link href="/lgpd" className="text-govblue-600 hover:text-govblue-800 hover:underline">LGPD</Link>.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmittingContact}
                  className="w-full bg-govblue-600 hover:bg-govblue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md disabled:bg-govgray-400 disabled:cursor-not-allowed"
                >
                  {isSubmittingContact ? '📤 Enviando...' : '📤 Enviar Mensagem'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      

      {/* Modal de Candidatura */}
      {showModal && selectedJob && (
        <LeadModal 
          isOpen={showModal}
          onClose={handleCloseModal}
          jobData={selectedJob}
        />
      )}
    </>
  )
}

export default HomePage