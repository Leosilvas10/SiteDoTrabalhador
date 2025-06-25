import React from 'react'
import { useSiteContext } from '../../contexts/SiteContext'

const EmpresasHeader = () => {
  const { siteConfig } = useSiteContext()

  const scrollToTop = () => {
    // Redirecionar para a página principal
    window.location.href = '/'
  }

  return (
    <>
      <header className="bg-govblue-600 shadow-lg fixed top-0 w-full z-50 border-b-4 border-govyellow-400">
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
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="text-govblue-600 font-bold text-sm">ST</span>
                </div>
              )}
              <span className="text-xl font-bold text-white">Site do Trabalhador</span>
            </div>

            {/* Desktop Navigation - removido da página empresas */}
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={scrollToTop}
                className="px-4 py-2 bg-govgreen-600 hover:bg-govgreen-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Ver Site
              </button>
            </div>

            {/* Mobile Menu Button - removido da página empresas */}
          </div>

          {/* Mobile Menu - removido da página empresas */}
        </div>
      </header>
    </>
  )
}

export default EmpresasHeader
