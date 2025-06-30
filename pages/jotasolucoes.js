
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
  const [activeTab, setActiveTab] = useState('conta')
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
          landingTitulo: 'Banco Jota - Conta Digital'
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('🎉 Parabéns! Sua conta será criada em breve. Você receberá R$ 50 de bônus!')
        setFormData({ nome: '', telefone: '', email: '' })
        setShowForm(false)
      } else {
        setMessage(data.message || 'Erro ao processar solicitação')
      }
    } catch (error) {
      setMessage('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/5511999887766?text=${encodeURIComponent('Oi! Quero abrir minha conta no Banco Jota e receber meu bônus de R$ 50!')}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      <Head>
        <title>Banco Jota - Conta Digital Gratuita com R$ 50 de Bônus</title>
        <meta name="description" content="Abra sua conta digital gratuita no Banco Jota e ganhe R$ 50 de bônus. Sem taxas, sem burocracias!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-indigo-900">banco</h1>
                  <h2 className="text-lg font-bold text-indigo-900 -mt-1">jota</h2>
                </div>
              </div>
              
              {/* Navegação */}
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#hero"
                  className="text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-200"
                >
                  Início
                </a>
                <a
                  href="#produtos"
                  className="text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-200"
                >
                  Produtos
                </a>
                <a
                  href="#bonus"
                  className="text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-200"
                >
                  Bônus
                </a>
                <a
                  href="#contato"
                  className="text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-200"
                >
                  Contato
                </a>
              </nav>
              
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Abrir Conta
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section id="hero" className={`pt-24 pb-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-4 py-2 mb-6">
                  <span className="text-green-600 font-semibold text-sm">🎁 OFERTA LIMITADA</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-indigo-900 mb-6 leading-tight">
                  Seu futuro
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    financeiro
                  </span>
                  começa aqui
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                  Conta digital 100% gratuita + <strong className="text-green-600">R$ 50 de bônus</strong> para quem abrir conta até o final do mês
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    🏦 Abrir Conta Grátis
                  </button>
                  
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    💬 Falar com Consultor
                  </button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Sem taxas
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Sem anuidade
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    R$ 50 grátis
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg"></div>
                      <span className="text-gray-600 text-sm">Conta Digital</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-500 text-sm">Saldo disponível</p>
                      <p className="text-3xl font-bold text-gray-900">R$ 1.250,00</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 mb-4">
                      <p className="text-green-600 font-semibold text-sm">🎁 Bônus de boas-vindas</p>
                      <p className="text-2xl font-bold text-green-700">+ R$ 50,00</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      {['💳', '💰', '📊', '🔒'].map((icon, index) => (
                        <div key={index} className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform duration-300">
                          {icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Elementos flutuantes */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  💎
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                  R$
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Produtos Section */}
        <section id="produtos" className={`py-20 bg-white transition-all duration-1000 ${isVisible.produtos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                Produtos que fazem a diferença
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar seu dinheiro, sem complicação
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                   onClick={() => setActiveTab('conta')}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-all duration-300 ${activeTab === 'conta' ? 'bg-gradient-to-br from-indigo-500 to-blue-500 text-white' : 'bg-gray-100 group-hover:bg-indigo-100'}`}>
                  🏦
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Conta Digital</h3>
                <p className="text-gray-600 text-sm">Gratuita e sem taxas</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                   onClick={() => setActiveTab('cartao')}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-all duration-300 ${activeTab === 'cartao' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gray-100 group-hover:bg-purple-100'}`}>
                  💳
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cartão</h3>
                <p className="text-gray-600 text-sm">Sem anuidade para sempre</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                   onClick={() => setActiveTab('investimentos')}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-all duration-300 ${activeTab === 'investimentos' ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : 'bg-gray-100 group-hover:bg-green-100'}`}>
                  📈
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Investimentos</h3>
                <p className="text-gray-600 text-sm">Renda fixa e variável</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                   onClick={() => setActiveTab('pix')}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-all duration-300 ${activeTab === 'pix' ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' : 'bg-gray-100 group-hover:bg-orange-100'}`}>
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">PIX Grátis</h3>
                <p className="text-gray-600 text-sm">Ilimitado e instantâneo</p>
              </div>
            </div>
            
            {/* Conteúdo das Abas */}
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-8">
              {activeTab === 'conta' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-900 mb-4">Conta Digital 100% Gratuita</h3>
                    <ul className="space-y-3">
                      {[
                        'Sem taxa de manutenção',
                        'Transferências ilimitadas',
                        'Cartão virtual imediato',
                        'Controle total pelo app',
                        'Suporte 24/7'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-3">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">🏦</div>
                      <h4 className="font-bold text-gray-900">Conta sempre no azul</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Taxa de manutenção</span>
                        <span className="font-bold text-green-600">R$ 0,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transferências TED</span>
                        <span className="font-bold text-green-600">Grátis</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PIX</span>
                        <span className="font-bold text-green-600">Ilimitado</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'cartao' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-900 mb-4">Cartão Sem Anuidade</h3>
                    <ul className="space-y-3">
                      {[
                        'Sem anuidade para sempre',
                        'Aceito em todo o mundo',
                        'Programa de pontos',
                        'Controle de gastos em tempo real',
                        'Bloqueio e desbloqueio pelo app'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-purple-500 mr-3">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="w-80 h-48 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl mx-auto">
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-sm opacity-80">banco jota</span>
                        <span className="text-2xl">💳</span>
                      </div>
                      <div className="mb-4">
                        <p className="text-lg tracking-wider">•••• •••• •••• 1234</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs opacity-80">Titular</p>
                          <p className="text-sm font-semibold">SEU NOME AQUI</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-80">Válido</p>
                          <p className="text-sm">12/28</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'investimentos' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-900 mb-4">Investimentos Inteligentes</h3>
                    <ul className="space-y-3">
                      {[
                        'CDB com liquidez diária',
                        'Tesouro Direto sem taxa',
                        'Fundos de investimento',
                        'Corretagem zero em ações',
                        'Consultoria gratuita'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-3">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <div className="text-green-600 text-2xl mb-2">📈</div>
                      <p className="text-sm text-gray-600">CDB</p>
                      <p className="text-xl font-bold text-green-600">12,5% a.a.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <div className="text-blue-600 text-2xl mb-2">🏛️</div>
                      <p className="text-sm text-gray-600">Tesouro</p>
                      <p className="text-xl font-bold text-blue-600">11,8% a.a.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <div className="text-purple-600 text-2xl mb-2">📊</div>
                      <p className="text-sm text-gray-600">Fundos</p>
                      <p className="text-xl font-bold text-purple-600">15,2% a.a.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <div className="text-orange-600 text-2xl mb-2">💎</div>
                      <p className="text-sm text-gray-600">Ações</p>
                      <p className="text-xl font-bold text-orange-600">R$ 0 taxa</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'pix' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-900 mb-4">PIX Ilimitado e Grátis</h3>
                    <ul className="space-y-3">
                      {[
                        'Transferências instantâneas',
                        'Disponível 24h por dia',
                        '100% gratuito sempre',
                        'Chave PIX personalizável',
                        'Histórico completo'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-orange-500 mr-3">⚡</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-2">⚡</div>
                      <h4 className="font-bold text-gray-900">PIX em segundos</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <span className="text-sm">Para: Maria Silva</span>
                        <span className="font-bold text-orange-600">R$ 250,00</span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <span className="text-sm">Para: João Santos</span>
                        <span className="font-bold text-orange-600">R$ 150,00</span>
                      </div>
                      <div className="text-center">
                        <span className="text-green-600 font-semibold">✓ Transferências realizadas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Bonus Section */}
        <section id="bonus" className={`py-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 text-white relative overflow-hidden transition-all duration-1000 ${isVisible.bonus ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-2 mb-6">
                <span className="text-white font-bold">⏰ OFERTA POR TEMPO LIMITADO</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Ganhe R$ 50
                <span className="block text-yellow-200">de bônus!</span>
              </h2>
              
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                Abra sua conta digital gratuita até o final do mês e receba R$ 50 direto na sua conta. Sem pegadinhas!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-bold mb-2">R$ 50 Grátis</h3>
                <p className="text-white/80">Bônus creditado na abertura da conta</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2">Conta em 5min</h3>
                <p className="text-white/80">Aprovação automática e instantânea</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-bold mb-2">Zero Taxas</h3>
                <p className="text-white/80">Para sempre, sem letras miúdas</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-orange-600 font-bold py-6 px-12 rounded-full text-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 inline-flex items-center gap-3"
            >
              <span>🏦</span>
              Quero Meus R$ 50 Grátis
            </button>
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">💰</div>
          <div className="absolute top-20 right-20 text-4xl opacity-30 animate-pulse">💎</div>
          <div className="absolute bottom-10 left-20 text-5xl opacity-25 animate-bounce delay-500">🎁</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-40 animate-pulse delay-1000">⚡</div>
        </section>

        {/* Modal do Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-in slide-in-from-bottom-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4">
                  🏦
                </div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-2">
                  Abrir Conta Digital
                </h3>
                <p className="text-gray-600">
                  Preencha os dados e receba seus R$ 50 de bônus
                </p>
              </div>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 text-center ${
                  message.includes('Parabéns') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Nome completo"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processando...' : '🎁 Ganhar R$ 50'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer id="contato" className="bg-indigo-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">banco</h1>
                    <h2 className="text-lg font-bold text-blue-200 -mt-1">jota</h2>
                  </div>
                </div>
                <p className="text-blue-200 mb-6 max-w-md">
                  O banco digital que faz seu dinheiro render mais e sua vida ficar mais simples.
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleWhatsAppClick}
                    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    title="WhatsApp"
                  >
                    💬
                  </button>
                  <a 
                    href="mailto:contato@bancojota.com.br"
                    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    title="E-mail"
                  >
                    📧
                  </a>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    title="Abrir Conta"
                  >
                    🏦
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
                      href="#produtos" 
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Produtos
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#bonus" 
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Bônus R$ 50
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="text-blue-200 hover:text-white transition-colors text-left"
                    >
                      Abrir Conta
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Contato</h4>
                <div className="space-y-3">
                  <div className="text-blue-200">
                    <span className="font-semibold">📞 Central:</span><br />
                    <a href="tel:08001234567" className="hover:text-white transition-colors">
                      0800 123 4567
                    </a>
                  </div>
                  <div className="text-blue-200">
                    <span className="font-semibold">📧 E-mail:</span><br />
                    <a href="mailto:contato@bancojota.com.br" className="hover:text-white transition-colors">
                      contato@bancojota.com.br
                    </a>
                  </div>
                  <div className="text-blue-200">
                    <span className="font-semibold">💬 WhatsApp:</span><br />
                    <button 
                      onClick={handleWhatsAppClick}
                      className="hover:text-white transition-colors text-left"
                    >
                      (11) 99988-7766
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      🎁 Ganhar R$ 50
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
                    Banco digital 100% seguro e regulamentado
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    Seus dados protegidos pela LGPD
                  </p>
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
    // Dados mockados já que não temos a API específica do Banco Jota
    const pageData = {
      slug: 'bancojota',
      titulo: 'Banco Jota - Conta Digital Gratuita',
      subtitulo: 'Seu futuro financeiro começa aqui',
      metaTitle: 'Banco Jota - Conta Digital Gratuita com R$ 50 de Bônus',
      metaDescription: 'Abra sua conta digital gratuita no Banco Jota e ganhe R$ 50 de bônus. Sem taxas, sem burocracias!'
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
