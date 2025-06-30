
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function JotaSolucoes({ pageData, error }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

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
          landingSlug: pageData.slug,
          landingTitulo: pageData.titulo
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Obrigado! Entraremos em contato em breve.')
        setFormData({ nome: '', telefone: '', email: '' })
        setShowForm(false)
        
        // Redirecionar para WhatsApp após 2 segundos
        setTimeout(() => {
          if (pageData.whatsapp?.numero) {
            const whatsappUrl = `https://wa.me/${pageData.whatsapp.numero}?text=${encodeURIComponent(pageData.whatsapp.mensagem)}`
            window.open(whatsappUrl, '_blank')
          }
        }, 2000)
      } else {
        setMessage(data.message || 'Erro ao enviar formulário')
      }
    } catch (error) {
      setMessage('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = () => {
    if (pageData.whatsapp?.numero) {
      const whatsappUrl = `https://wa.me/${pageData.whatsapp.numero}?text=${encodeURIComponent(pageData.whatsapp.mensagem)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <>
      <Head>
        <title>{pageData.metaTitle || pageData.titulo}</title>
        <meta name="description" content={pageData.metaDescription} />
        <meta name="keywords" content={pageData.metaKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                {pageData.imagens?.logo && (
                  <img
                    src={pageData.imagens.logo}
                    alt="Jota Soluções"
                    className="h-16 w-auto mx-auto lg:mx-0 mb-8"
                  />
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {pageData.titulo}
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-blue-100">
                  {pageData.subtitulo}
                </p>
                <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto lg:mx-0">
                  {pageData.heroDescription}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {pageData.formulario?.ctaTexto || 'Solicitar Diagnóstico'}
                  </button>
                  
                  {pageData.whatsapp?.numero && (
                    <button
                      onClick={handleWhatsAppClick}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>📱</span>
                      {pageData.whatsapp.ctaTexto}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="relative">
                {pageData.imagens?.hero ? (
                  <img
                    src={pageData.imagens.hero}
                    alt="Jota Soluções"
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-blue-600 rounded-lg shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💼</div>
                      <p className="text-xl">Transforme Seu Negócio</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {pageData.sobre?.titulo}
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {pageData.sobre?.texto}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                    <div className="text-gray-600">Anos de Experiência</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                    <div className="text-gray-600">Empresas Atendidas</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                    <div className="text-gray-600">Satisfação dos Clientes</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-orange-600 mb-2">24h</div>
                    <div className="text-gray-600">Resposta Garantida</div>
                  </div>
                </div>
              </div>
              
              <div>
                {pageData.sobre?.imagem ? (
                  <img
                    src={pageData.sobre.imagem}
                    alt="Sobre a Jota Soluções"
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🎯</div>
                      <p className="text-xl">Excelência em Resultados</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Serviços Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {pageData.servicos?.titulo}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {pageData.servicos?.subtitulo}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pageData.servicos?.lista?.map((servico, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4 text-center">
                    {servico.icone}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {servico.titulo}
                  </h3>
                  <p className="text-gray-700 text-center">
                    {servico.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bonus Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {pageData.bonus?.titulo}
                </h2>
                <p className="text-lg mb-8 text-orange-100">
                  {pageData.bonus?.descricao}
                </p>
                
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg mb-8">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">⏰</div>
                    <div>
                      <div className="font-bold text-lg">Oferta Limitada!</div>
                      <div className="text-orange-100">Apenas para os primeiros 50 cadastros</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-orange-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
                >
                  {pageData.bonus?.ctaTexto}
                </button>
              </div>
              
              <div>
                {pageData.bonus?.imagem ? (
                  <img
                    src={pageData.bonus.imagem}
                    alt="Oferta Especial"
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-white/20 backdrop-blur-sm rounded-lg shadow-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎁</div>
                      <p className="text-xl">Diagnóstico Gratuito</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Formulário Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {pageData.formulario?.titulo}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                {pageData.formulario?.subtitulo}
              </p>
              
              {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                  message.includes('Obrigado') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : pageData.formulario?.ctaTexto}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                {pageData.imagens?.logo && (
                  <img
                    src={pageData.imagens.logo}
                    alt="Jota Soluções"
                    className="h-12 w-auto mb-6"
                  />
                )}
                <p className="text-gray-400 mb-6">
                  {pageData.subtitulo}
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    📧 contato@jotasolucoes.com.br
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Serviços</h4>
                <ul className="space-y-2">
                  {pageData.servicos?.lista?.map((servico, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white">
                        {servico.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Contato</h4>
                <div className="space-y-2">
                  {pageData.whatsapp?.numero && (
                    <div className="text-gray-400">
                      📱 {pageData.whatsapp.numero}
                    </div>
                  )}
                  <div className="text-gray-400">
                    📧 contato@jotasolucoes.com.br
                  </div>
                  <div className="text-gray-400">
                    📍 São Paulo, SP
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 {pageData.titulo}. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/landing-pages/jotasolucoes`)
    
    if (!res.ok) {
      return {
        props: {
          error: true
        }
      }
    }
    
    const data = await res.json()
    
    if (!data.success) {
      return {
        props: {
          error: true
        }
      }
    }
    
    return {
      props: {
        pageData: data.data,
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
