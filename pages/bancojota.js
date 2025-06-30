
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function BancoJota({ pageData, error }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600">A página que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/landing-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          landingSlug: 'bancojota',
          landingTitulo: 'Banco Jota - Consórcio'
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('🎉 Obrigado! Em breve nosso consultor entrará em contato!')
        setFormData({ nome: '', telefone: '', email: '' })
        setShowForm(false)
        
        // Enviar para WhatsApp também
        setTimeout(() => {
          handleWhatsAppRedirect()
        }, 1500)
      } else {
        setMessage(data.message || 'Erro ao processar solicitação')
      }
    } catch (error) {
      setMessage('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppRedirect = () => {
    const whatsappNumber = pageData?.whatsapp?.numero || '5511999887766'
    const whatsappMessage = pageData?.whatsapp?.mensagem || 
      `Olá! Tenho interesse no consórcio do Banco Jota. Gostaria de mais informações sobre como funciona e quais são as condições.`
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleVideoPlay = () => {
    // Analytics ou tracking do vídeo
    console.log('Vídeo reproduzido')
  }

  return (
    <>
      <Head>
        <title>{pageData?.metaTitle || 'Banco Jota - Consórcio com Consultoria Especializada'}</title>
        <meta name="description" content={pageData?.metaDescription || 'Realize seu sonho com o consórcio do Banco Jota. Atendimento personalizado e consultoria financeira até a contemplação.'} />
        <meta name="keywords" content={pageData?.metaKeywords || 'consórcio, banco jota, financiamento, consultoria financeira'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {pageData?.imagens?.logo ? (
                  <img
                    src={pageData.imagens.logo}
                    alt="Banco Jota"
                    className="h-12 w-auto"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">BJ</span>
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-blue-900">Banco Jota</h1>
                  <p className="text-sm text-blue-600">Consórcio Especializado</p>
                </div>
              </div>
              
              {/* Navegação */}
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#hero"
                  className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
                >
                  Início
                </a>
                <a
                  href="#como-funciona"
                  className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
                >
                  Como Funciona
                </a>
                <a
                  href="#beneficios"
                  className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
                >
                  Benefícios
                </a>
                <a
                  href="#depoimentos"
                  className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
                >
                  Depoimentos
                </a>
                <a
                  href="#contato"
                  className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
                >
                  Contato
                </a>
              </nav>
              
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Quero Meu Consórcio
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section com Vídeo */}
        <section id="hero" className={`pt-24 pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2 mb-6">
                  <span className="text-blue-600 font-semibold text-sm">🏆 CONSULTORIA ESPECIALIZADA</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
                  {pageData?.titulo || 'Seu sonho realizado com'}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {pageData?.subtitulo || 'Consórcio Inteligente'}
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                  {pageData?.heroDescription || 'Te acompanhamos do primeiro contato até a entrega do seu bem. Consultoria financeira personalizada e processo transparente.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    🎯 Quero Ser Contemplado
                  </button>
                  
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    💬 Falar com Consultor
                  </button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Consultoria gratuita
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Acompanhamento total
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Processo transparente
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Vídeo Principal */}
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-black rounded-2xl overflow-hidden">
                    {pageData?.video?.url ? (
                      <video
                        className="w-full h-64 object-cover"
                        controls
                        poster={pageData.video.thumbnail || pageData.imagens?.hero}
                        onPlay={handleVideoPlay}
                      >
                        <source src={pageData.video.url} type="video/mp4" />
                        Seu navegador não suporta vídeo.
                      </video>
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-4xl mb-4">🎥</div>
                          <p className="text-lg font-medium mb-2">Vídeo Explicativo</p>
                          <p className="text-sm opacity-80">Vídeo será adicionado pelo admin</p>
                          <button
                            onClick={handleVideoPlay}
                            className="mt-4 bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center hover:bg-white/30 transition-all"
                          >
                            <span className="text-2xl">▶️</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-white/90 text-sm">
                      ⏱️ Assista e entenda como funciona nosso processo
                    </p>
                  </div>
                </div>
                
                {/* Elementos flutuantes */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  🏆
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Por Que Escolher o Banco Jota */}
        <section id="como-funciona" className={`py-20 bg-white transition-all duration-1000 ${isVisible['como-funciona'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                {pageData?.sobre?.titulo || 'Por que fazer consórcio com o Banco Jota?'}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {pageData?.sobre?.texto || 'Não somos apenas uma administradora de consórcio. Somos seus parceiros na realização do seu sonho, oferecendo consultoria especializada e acompanhamento personalizado.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: '🤝',
                  title: 'Atendimento Diferenciado',
                  description: 'Você não fica sozinho. Nossa equipe te acompanha desde o primeiro contato até a entrega do seu bem.'
                },
                {
                  icon: '💡',
                  title: 'Consultoria Financeira',
                  description: 'Analisamos seu perfil e indicamos a melhor estratégia para sua contemplação mais rápida.'
                },
                {
                  icon: '📋',
                  title: 'Processo Transparente',
                  description: 'Você acompanha cada etapa do processo. Sem surpresas, sem taxas ocultas.'
                },
                {
                  icon: '🎯',
                  title: 'Foco na Contemplação',
                  description: 'Nossa meta é a sua contemplação. Utilizamos estratégias comprovadas para acelerar o processo.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Benefícios */}
        <section id="beneficios" className={`py-20 bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-1000 ${isVisible.beneficios ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                {pageData?.servicos?.titulo || 'Nossos Diferenciais'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {pageData?.servicos?.subtitulo || 'O que nos torna únicos no mercado de consórcios'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {(pageData?.servicos?.lista || [
                  {
                    titulo: 'Consultoria Personalizada',
                    descricao: 'Análise completa do seu perfil financeiro para definir a melhor estratégia de contemplação.',
                    icone: '🎯'
                  },
                  {
                    titulo: 'Acompanhamento 360°',
                    descricao: 'Desde a adesão até a entrega do bem, você tem suporte total da nossa equipe especializada.',
                    icone: '🔄'
                  },
                  {
                    titulo: 'Processo Consultivo',
                    descricao: 'Não vendemos consórcio, fazemos consultoria. Indicamos o que é melhor para seu caso específico.',
                    icone: '💡'
                  }
                ]).map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-xl text-white flex-shrink-0">
                      {item.icone}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 mb-2">{item.titulo}</h3>
                      <p className="text-gray-600">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                {pageData?.imagens?.sobre ? (
                  <img
                    src={pageData.imagens.sobre}
                    alt="Benefícios"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🏢</div>
                      <p className="text-xl font-semibold">Banco Jota</p>
                      <p className="text-blue-200">Sua parceria de confiança</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-sm font-semibold text-gray-900">Processo Aprovado</span>
                  </div>
                  <p className="text-xs text-gray-600">+2.500 clientes contemplados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Problemas que Resolvemos */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Problemas que Resolvemos
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Identificamos e solucionamos os principais obstáculos na jornada do consórcio
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  problema: 'Não sei qual consórcio escolher',
                  solucao: 'Fazemos análise comparativa e indicamos o melhor para seu perfil',
                  icon: '❓'
                },
                {
                  problema: 'Medo de não ser contemplado',
                  solucao: 'Estratégias comprovadas para aumentar chances de contemplação',
                  icon: '😰'
                },
                {
                  problema: 'Processo confuso e burocrático',
                  solucao: 'Simplificamos tudo e te acompanhamos em cada etapa',
                  icon: '📄'
                },
                {
                  problema: 'Falta de suporte pós-venda',
                  solucao: 'Atendimento contínuo até a entrega do seu bem',
                  icon: '🚫'
                },
                {
                  problema: 'Taxas e custos não transparentes',
                  solucao: 'Total transparência financeira desde o primeiro contato',
                  icon: '💰'
                },
                {
                  problema: 'Não entendo como funciona',
                  solucao: 'Educação financeira e explicação detalhada do processo',
                  icon: '🤔'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="text-lg font-bold text-red-600 mb-2">❌ {item.problema}</h3>
                    <div className="w-full h-px bg-gradient-to-r from-red-500 to-green-500 my-4"></div>
                    <h4 className="text-lg font-bold text-green-600">✅ Nossa Solução:</h4>
                    <p className="text-gray-600 mt-2">{item.solucao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Depoimentos */}
        <section id="depoimentos" className={`py-20 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-1000 ${isVisible.depoimentos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                O que nossos clientes falam
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Histórias reais de quem realizou o sonho com o Banco Jota
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  nome: 'Maria Silva',
                  cargo: 'Empresária',
                  depoimento: 'O Banco Jota me ajudou a conquistar meu primeiro imóvel. O atendimento foi excepcional e me senti segura durante todo o processo.',
                  estrelas: 5,
                  foto: '👩‍💼'
                },
                {
                  nome: 'João Santos',
                  cargo: 'Engenheiro',
                  depoimento: 'Consultoria incrível! Eles analisaram meu perfil e me indicaram a melhor estratégia. Fui contemplado em 8 meses.',
                  estrelas: 5,
                  foto: '👨‍💼'
                },
                {
                  nome: 'Ana Costa',
                  cargo: 'Professora',
                  depoimento: 'Processo transparente e equipe sempre disponível. Recomendo para quem quer realizar o sonho da casa própria.',
                  estrelas: 5,
                  foto: '👩‍🏫'
                }
              ].map((depoimento, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-xl mr-4">
                      {depoimento.foto}
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900">{depoimento.nome}</h4>
                      <p className="text-sm text-gray-600">{depoimento.cargo}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(depoimento.estrelas)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic">"{depoimento.depoimento}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Principal */}
        <section className={`py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Pronto para realizar
              <span className="block text-blue-200">seu sonho?</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Não perca mais tempo. Nossa consultoria é gratuita e pode acelerar sua contemplação.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full text-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                🎯 Quero Minha Consultoria Grátis
              </button>
              
              <button
                onClick={handleWhatsAppRedirect}
                className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                💬 Falar Agora no WhatsApp
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-lg font-bold mb-1">Resposta Rápida</h3>
                <p className="text-white/80 text-sm">Retorno em até 2 horas</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">🆓</div>
                <h3 className="text-lg font-bold mb-1">Consultoria Gratuita</h3>
                <p className="text-white/80 text-sm">Sem custos para análise</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="text-lg font-bold mb-1">Especialistas</h3>
                <p className="text-white/80 text-sm">+10 anos de experiência</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção PDF */}
        {pageData?.pdfs && pageData.pdfs.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  Material Institucional
                </h2>
                <p className="text-lg text-gray-600">
                  Baixe nossos materiais informativos sobre consórcio
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageData.pdfs.map((pdf, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📄</div>
                      <h3 className="text-lg font-bold text-blue-900 mb-2">{pdf.nome}</h3>
                      <p className="text-gray-600 text-sm mb-4">{pdf.descricao}</p>
                      <a
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                      >
                        📥 Baixar PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Modal do Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-in slide-in-from-bottom-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  {pageData?.formulario?.titulo || 'Consultoria Gratuita'}
                </h3>
                <p className="text-gray-600">
                  {pageData?.formulario?.subtitulo || 'Preencha seus dados e nosso consultor entrará em contato'}
                </p>
              </div>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 text-center ${
                  message.includes('Obrigado') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Nome completo"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="WhatsApp: (11) 99999-9999"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : pageData?.formulario?.ctaTexto || '🎯 Quero Consultoria'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer id="contato" className="bg-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  {pageData?.imagens?.logo ? (
                    <img
                      src={pageData.imagens.logo}
                      alt="Banco Jota"
                      className="h-12 w-auto"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">BJ</span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-white">Banco Jota</h1>
                    <h2 className="text-lg font-bold text-blue-200 -mt-1">Consórcio Especializado</h2>
                  </div>
                </div>
                <p className="text-blue-200 mb-6 max-w-md">
                  Sua parceria de confiança para realizar sonhos através do consórcio com consultoria especializada.
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleWhatsAppRedirect}
                    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    title="WhatsApp"
                  >
                    💬
                  </button>
                  <a 
                    href={`mailto:${pageData?.contato?.email || 'contato@bancojota.com.br'}`}
                    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    title="E-mail"
                  >
                    📧
                  </a>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    title="Consultoria"
                  >
                    🎯
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Navegação</h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#hero" 
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Início
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#como-funciona" 
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Como Funciona
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#beneficios" 
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Benefícios
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#depoimentos" 
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Depoimentos
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="text-blue-200 hover:text-white transition-colors text-left"
                    >
                      Consultoria Gratuita
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Contato</h4>
                <div className="space-y-3">
                  <div className="text-blue-200">
                    <span className="font-semibold">📞 Central:</span><br />
                    <a href={`tel:${pageData?.contato?.telefone || '08001234567'}`} className="hover:text-white transition-colors">
                      {pageData?.contato?.telefone || '0800 123 4567'}
                    </a>
                  </div>
                  <div className="text-blue-200">
                    <span className="font-semibold">📧 E-mail:</span><br />
                    <a href={`mailto:${pageData?.contato?.email || 'contato@bancojota.com.br'}`} className="hover:text-white transition-colors">
                      {pageData?.contato?.email || 'contato@bancojota.com.br'}
                    </a>
                  </div>
                  <div className="text-blue-200">
                    <span className="font-semibold">💬 WhatsApp:</span><br />
                    <button 
                      onClick={handleWhatsAppRedirect}
                      className="hover:text-white transition-colors text-left"
                    >
                      {pageData?.whatsapp?.numero || '(11) 99988-7766'}
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      🎯 Consultoria Gratuita
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-blue-800 mt-12 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                <div>
                  <p className="text-blue-200">
                    © 2024 Banco Jota. Todos os direitos reservados.
                  </p>
                  <p className="text-blue-300 text-sm mt-1">
                    CNPJ: 00.000.000/0001-00
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-blue-200 text-sm">
                    Consultoria especializada em consórcio
                  </p>
                  <div className="flex justify-center md:justify-end space-x-4 mt-2">
                    <a href="/termos" className="text-blue-300 text-xs hover:text-white">
                      Termos de Uso
                    </a>
                    <a href="/privacidade" className="text-blue-300 text-xs hover:text-white">
                      Política de Privacidade
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    // Dados mockados focados em consórcio
    const pageData = {
      slug: 'bancojota',
      titulo: 'Seu sonho realizado com',
      subtitulo: 'Consórcio Inteligente',
      heroDescription: 'Te acompanhamos do primeiro contato até a entrega do seu bem. Consultoria financeira personalizada e processo transparente.',
      metaTitle: 'Banco Jota - Consórcio com Consultoria Especializada',
      metaDescription: 'Realize seu sonho com o consórcio do Banco Jota. Atendimento personalizado e consultoria financeira até a contemplação.',
      sobre: {
        titulo: 'Por que fazer consórcio com o Banco Jota?',
        texto: 'Não somos apenas uma administradora de consórcio. Somos seus parceiros na realização do seu sonho, oferecendo consultoria especializada e acompanhamento personalizado.'
      },
      servicos: {
        titulo: 'Nossos Diferenciais',
        subtitulo: 'O que nos torna únicos no mercado de consórcios',
        lista: [
          {
            titulo: 'Consultoria Personalizada',
            descricao: 'Análise completa do seu perfil financeiro para definir a melhor estratégia de contemplação.',
            icone: '🎯'
          },
          {
            titulo: 'Acompanhamento 360°',
            descricao: 'Desde a adesão até a entrega do bem, você tem suporte total da nossa equipe especializada.',
            icone: '🔄'
          },
          {
            titulo: 'Processo Consultivo',
            descricao: 'Não vendemos consórcio, fazemos consultoria. Indicamos o que é melhor para seu caso específico.',
            icone: '💡'
          }
        ]
      },
      formulario: {
        titulo: 'Consultoria Gratuita',
        subtitulo: 'Preencha seus dados e nosso consultor entrará em contato',
        ctaTexto: '🎯 Quero Consultoria'
      },
      whatsapp: {
        numero: '5511999887766',
        mensagem: 'Olá! Tenho interesse no consórcio do Banco Jota. Gostaria de mais informações sobre como funciona e quais são as condições.',
        ctaTexto: 'Falar com Consultor'
      },
      contato: {
        telefone: '0800 123 4567',
        email: 'contato@bancojota.com.br'
      },
      // Simular campos de PDF (avisar que precisa ser criado no admin)
      pdfs: [
        {
          nome: 'Guia Completo do Consórcio',
          url: '#',
          descricao: 'Tudo que você precisa saber sobre consórcio'
        }
      ]
    }
    
    return {
      props: {
        pageData,
        error: false
      }
    }
  } catch (error) {
    console.error('Erro ao buscar landing page:', error)
    return {
      props: {
        error: true
      }
    }
  }
}
