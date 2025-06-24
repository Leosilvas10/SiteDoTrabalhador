import React, { useState } from 'react'
import { useSiteContext } from '../../contexts/SiteContext'

const EmpresasHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { siteConfig } = useSiteContext()

  const scrollToSection = (sectionId) => {
    // Redirecionar para a página principal com âncora
    window.location.href = `/#${sectionId}`
    setIsMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    // Redirecionar para a página principal
    window.location.href = '/'
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="bg-slate-800 shadow-lg fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
              {siteConfig.logoUrl ? (
                <img 
                  src={siteConfig.logoUrl} 
                  alt="Logo Site do Trabalhador" 
                  className="w-10 h-10 rounded-lg mr-3 object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">ST</span>
                </div>
              )}
              <span className="text-xl font-bold text-white">Site do Trabalhador</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={scrollToTop} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
                Início
              </button>
              <button onClick={() => scrollToSection('vagas')} className="text-white hover:text-blue-400 font-medium transition-colors duration-200">
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
              <span className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
                Para Empresas
              </span>
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
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-400" onClick={() => scrollToSection('vagas')}>
                Vagas
              </button>
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-400" onClick={() => scrollToSection('calculadora')}>
                Calculadora
              </button>
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-400" onClick={() => scrollToSection('contato')}>
                Contato
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default EmpresasHeader
