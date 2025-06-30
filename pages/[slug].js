
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function LandingPage({ pageData, error }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-8">A landing page que você procura não existe.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          landingSlug: pageData.slug,
          landingTitulo: pageData.titulo,
          utm: {
            source: router.query.utm_source || '',
            medium: router.query.utm_medium || '',
            campaign: router.query.utm_campaign || ''
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Dados enviados com sucesso! Nossa equipe entrará em contato em breve.')
        setFormData({ nome: '', telefone: '', email: '' })
        
        // Opcional: redirecionar para WhatsApp após alguns segundos
        setTimeout(() => {
          if (pageData.whatsapp?.numero) {
            const whatsappUrl = `https://wa.me/${pageData.whatsapp.numero}?text=${encodeURIComponent(pageData.whatsapp.mensagem)}`
            window.open(whatsappUrl, '_blank')
          }
        }, 2000)
      } else {
        setMessage(data.message || 'Erro ao enviar dados. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro:', error)
      setMessage('Erro ao enviar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleWhatsApp = () => {
    if (pageData.whatsapp?.numero) {
      const url = `https://wa.me/${pageData.whatsapp.numero}?text=${encodeURIComponent(pageData.whatsapp.mensagem)}`
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <Head>
        <title>{pageData.metaTitle}</title>
        <meta name="description" content={pageData.metaDescription} />
        <meta name="keywords" content={pageData.metaKeywords} />
        <meta property="og:title" content={pageData.titulo} />
        <meta property="og:description" content={pageData.subtitulo} />
        <meta property="og:image" content={pageData.imagens?.hero} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {pageData.imagens?.logo && (
                <img
                  src={pageData.imagens.logo}
                  alt="Logo"
                  className="h-12 w-auto"
                />
              )}
              {pageData.whatsapp?.numero && (
                <button
                  onClick={handleWhatsApp}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <span>📱</span>
                  <span>{pageData.whatsapp.ctaTexto}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  {pageData.titulo}
                </h1>
                <h2 className="text-xl lg:text-2xl mb-6 opacity-90">
                  {pageData.subtitulo}
                </h2>
                <p className="text-lg mb-8 opacity-80">
                  {pageData.heroDescription}
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                  <a
                    href="#formulario"
                    className="block sm:inline-block bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors text-center"
                  >
                    {pageData.formulario?.ctaTexto || 'Começar Agora'}
                  </a>
                  {pageData.whatsapp?.numero && (
                    <button
                      onClick={handleWhatsApp}
                      className="block sm:inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors text-center"
                    >
                      {pageData.whatsapp.ctaTexto}
                    </button>
                  )}
                </div>
              </div>
              
              {pageData.imagens?.hero && (
                <div className="text-center">
                  <img
                    src={pageData.imagens.hero}
                    alt="Hero"
                    className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sobre Section */}
        {pageData.sobre && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {pageData.sobre.titulo}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {pageData.sobre.texto}
                  </p>
                </div>
                
                {pageData.sobre.imagem && (
                  <div>
                    <img
                      src={pageData.sobre.imagem}
                      alt="Sobre"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Serviços Section */}
        {pageData.servicos && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {pageData.servicos.titulo}
                </h2>
                <p className="text-xl text-gray-600">
                  {pageData.servicos.subtitulo}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pageData.servicos.lista?.map((servico, index) => (
                  <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="text-4xl mb-4">{servico.icone}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {servico.titulo}
                    </h3>
                    <p className="text-gray-600">
                      {servico.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bonus Section */}
        {pageData.bonus && (
          <section className="py-20 bg-yellow-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      {pageData.bonus.titulo}
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">
                      {pageData.bonus.descricao}
                    </p>
                    <a
                      href="#formulario"
                      className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors"
                    >
                      {pageData.bonus.ctaTexto}
                    </a>
                  </div>
                  
                  {pageData.bonus.imagem && (
                    <div className="h-64 lg:h-auto">
                      <img
                        src={pageData.bonus.imagem}
                        alt="Bônus"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PDFs Section */}
        {pageData.pdfs && pageData.pdfs.length > 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Material Gratuito
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pageData.pdfs.map((pdf, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="text-red-500 text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {pdf.nome}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {pdf.descricao}
                    </p>
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Download Grátis
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Formulário Section */}
        <section id="formulario" className="py-20 bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.formulario?.titulo || 'Entre em Contato'}
              </h2>
              <p className="text-xl opacity-90">
                {pageData.formulario?.subtitulo || 'Preencha o formulário abaixo'}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="seu@email.com"
                  />
                </div>
                
                {message && (
                  <div className={`p-4 rounded-lg ${message.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : (pageData.formulario?.ctaTexto || 'Enviar')}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {pageData.imagens?.logo && (
              <img
                src={pageData.imagens.logo}
                alt="Logo"
                className="h-12 w-auto mx-auto mb-6"
              />
            )}
            <p className="text-gray-400">
              © 2024 {pageData.titulo}. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { slug } = params
  
  // Verificar se é uma das landing pages válidas
  const validSlugs = ['jotasolucoes', 'metodocor', 'bancojota']
  
  if (!validSlugs.includes(slug)) {
    return {
      props: {
        error: true
      }
    }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/landing-pages/${slug}`)
    
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
