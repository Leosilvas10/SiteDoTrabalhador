import React from 'react'

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="container mx-auto px-4 py-8">
        {/* Links úteis */}
        <div className="flex justify-center items-center space-x-8 mb-6">
          <button 
            onClick={scrollToTop}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
          >
            Início
          </button>
          <button 
            onClick={() => scrollToSection('vagas')}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
          >
            Vagas
          </button>
          <button 
            onClick={() => scrollToSection('calculadora')}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
          >
            Calculadora
          </button>
          <button 
            onClick={() => scrollToSection('contato')}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
          >
            Contato
          </button>
          <button 
            onClick={() => window.open('/empresas', '_blank')}
            className="text-slate-400 hover:text-green-400 transition-colors duration-200"
          >
            Para Empresas
          </button>
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Site do Trabalhador. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer