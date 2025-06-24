import React, { useState, useEffect } from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Monitorar scroll para mostrar/esconder o botão
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (scrolled / maxHeight) * 100

      setScrollProgress(progress)
      setIsVisible(scrolled > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Função de scroll suave para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <>
      {/* Botão principal */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        aria-label="Voltar ao topo da página"
        title="Voltar ao topo"
      >
        {/* Ícone de seta para cima */}
        <svg 
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>

        {/* Indicador de progresso circular */}
        <svg className="absolute inset-0 w-14 h-14 transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-blue-300 opacity-30"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 24}`}
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
            className="text-white transition-all duration-300"
          />
        </svg>
      </button>

      {/* Tooltip informativo */}
      <div className={`fixed bottom-24 right-6 z-40 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        isVisible && scrollProgress > 50 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div className="flex items-center space-x-2">
          <span>📊</span>
          <span>{Math.round(scrollProgress)}% da página</span>
        </div>
        {/* Seta apontando para o botão */}
        <div className="absolute -bottom-1 right-6 w-2 h-2 bg-slate-800 transform rotate-45"></div>
      </div>
    </>
  )
}

export default ScrollToTop