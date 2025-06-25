
import React, { useState, useEffect } from 'react'
import { useSiteContext } from '../../contexts/SiteContext'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const { siteConfig } = useSiteContext()

  // Debug: Log das configurações do site
  useEffect(() => {
    console.log('Header - siteConfig atual:', siteConfig)
    console.log('Header - logoUrl:', siteConfig.logoUrl)
  }, [siteConfig])

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
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <nav className="hidden md:flex space-x-8">
              <button onClick={scrollToTop} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                Início
              </button>
              <button onClick={() => window.location.href = '/vagas'} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                Vagas
              </button>
              <button onClick={() => scrollToSection('calculadora')} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                Calculadora
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                Contato
              </button>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => window.open('/empresas', '_blank')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
              >
                Para Empresas
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Abrir menu</span>
              <div className="w-6 h-6 relative">
                <span className={`absolute top-0 left-0 w-full h-0.5 bg-gray-600 transform transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`absolute top-2.5 left-0 w-full h-0.5 bg-gray-600 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`absolute top-5 left-0 w-full h-0.5 bg-gray-600 transform transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 border-t border-slate-700">
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-400" onClick={scrollToTop}>
                Início
              </button>
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-400" onClick={() => { window.location.href = '/vagas'; setIsMobileMenuOpen(false); }}>
                Vagas
              </button>
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-400" onClick={() => scrollToSection('calculadora')}>
                Calculadora
              </button>
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-400" onClick={() => scrollToSection('contato')}>
                Contato
              </button>
              
              <div className="border-t border-slate-700 pt-4">
                <div className="px-3 py-2">
                  <button 
                    onClick={() => window.open('/empresas', '_blank')}
                    className="w-full text-left px-3 py-2 text-base font-medium text-green-400 hover:text-green-300"
                  >
                    Para Empresas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
