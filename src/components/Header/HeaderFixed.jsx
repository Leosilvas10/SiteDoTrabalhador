import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSiteContext } from '../../contexts/SiteContext'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const { siteConfig } = useSiteContext()
  const router = useRouter()

  // Verificar se está na página inicial
  const isHomePage = router.pathname === '/'

  // Debug: Log das configurações do site
  useEffect(() => {
    console.log('Header - siteConfig atual:', siteConfig)
    console.log('Header - logoUrl:', siteConfig.logoUrl)
    console.log('Header - isHomePage:', isHomePage)
  }, [siteConfig, isHomePage])

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setIsMobileMenuOpen(false)
  }

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      // Se está na página inicial, faz scroll suave
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Se está em outra página, redireciona para home com âncora
      router.push(`/#${sectionId}`)
    }
    setIsMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
    setIsMobileMenuOpen(false)
  }

  const goToHome = () => {
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="bg-slate-800 shadow-lg fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - Aumentada e otimizada */}
            <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
              {siteConfig.logoUrl ? (
                <div className="h-20 sm:h-24 w-32 sm:w-40 flex items-center">
                  <img 
                    src={`${siteConfig.logoUrl}?t=${Date.now()}`}
                    alt="Site do Trabalhador" 
                    className="h-full w-full object-contain transition-all duration-200 hover:scale-105"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                    onError={(e) => {
                      console.error('Erro ao carregar logo no header:', siteConfig.logoUrl)
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              ) : (
                <div className="h-20 sm:h-24 w-32 sm:w-40 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl sm:text-3xl">ST</span>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            {isHomePage ? (
              // Menus de navegação apenas na página inicial
              <nav className="hidden md:flex space-x-8">
                <button onClick={scrollToTop} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                  Início
                </button>
                <button onClick={() => router.push('/vagas')} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                  Vagas
                </button>
                <button onClick={() => scrollToSection('calculadora')} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                  Calculadora
                </button>
                <button onClick={() => scrollToSection('contato')} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                  Contato
                </button>
              </nav>
            ) : (
              // Botão "Ver Site" para outras páginas
              <div className="hidden md:flex">
                <button 
                  onClick={goToHome}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🏠</span>
                  Ver Site
                </button>
              </div>
            )}

            {/* Desktop Auth Buttons - apenas na home */}
            {isHomePage && (
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => window.open('/empresas', '_blank')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
                >
                  Para Empresas
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Abrir menu principal</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-700">
              {isHomePage ? (
                // Menus de navegação mobile apenas na página inicial
                <>
                  <button onClick={scrollToTop} className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 font-medium">
                    Início
                  </button>
                  <button onClick={() => router.push('/vagas')} className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 font-medium">
                    Vagas
                  </button>
                  <button onClick={() => scrollToSection('calculadora')} className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 font-medium">
                    Calculadora
                  </button>
                  <button onClick={() => scrollToSection('contato')} className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 font-medium">
                    Contato
                  </button>
                  <button onClick={() => window.open('/empresas', '_blank')} className="block w-full text-left px-3 py-2 text-green-400 hover:text-green-300 font-medium">
                    Para Empresas
                  </button>
                </>
              ) : (
                // Botão "Ver Site" mobile para outras páginas
                <button onClick={goToHome} className="block w-full text-left px-3 py-2 text-blue-400 hover:text-blue-300 font-medium">
                  🏠 Ver Site
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
