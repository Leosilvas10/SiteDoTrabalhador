import React from 'react'
import { useSiteContext } from '../../contexts/SiteContext'

const UnifiedLogo = ({ className = '', onClick = null }) => {
  const { siteConfig } = useSiteContext()
  
  return (
    <div 
      className={`flex items-center cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {siteConfig.logoUrl ? (
        <div className="relative flex items-center">
          {/* Logo com fundo branco - responsivo e bem centralizado */}
          <div className="h-12 w-20 sm:h-14 sm:w-24 bg-white rounded-lg shadow-md transform group-hover:scale-105 transition-all duration-300 border border-govgray-200 flex items-center justify-center p-1">
            <img 
              src={`${siteConfig.logoUrl}?t=${Date.now()}`}
              alt="Site do Trabalhador" 
              className="h-12 w-16 sm:h-12 sm:w-20 object-contain transition-all duration-300"
              onError={(e) => {
                console.error('Erro ao carregar logo:', siteConfig.logoUrl)
                e.target.style.display = 'none'
              }}
            />
          </div>
          {/* Pontos decorativos */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-govyellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-govgreen-400 rounded-full animate-pulse"></div>
        </div>
      ) : (
        /* Fallback quando não há logo - responsivo */
        <div className="h-12 w-20 sm:h-14 sm:w-24 bg-gradient-to-br from-govblue-600 to-govblue-800 rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20 group-hover:scale-105 transition-all duration-300">
          <span className="text-white font-bold text-lg sm:text-xl">ST</span>
        </div>
      )}
    </div>
  )
}

export default UnifiedLogo
