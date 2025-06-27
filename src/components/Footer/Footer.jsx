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
    <footer className="header-blue border-t-4 border-govyellow-400">
      <div className="container mx-auto px-4 py-8">
        {/* Links úteis */}
        <div className="flex justify-center items-center space-x-8 mb-6">
          <button 
            onClick={scrollToTop}
            className="text-white hover:text-govyellow-400 transition-colors duration-200 font-medium"
          >
            Início
          </button>
          <button 
            onClick={() => scrollToSection('vagas')}
            className="text-white hover:text-govyellow-400 transition-colors duration-200 font-medium"
          >
            Vagas
          </button>
          <button 
            onClick={() => scrollToSection('calculadora')}
            className="text-white hover:text-govyellow-400 transition-colors duration-200 font-medium"
          >
            Calculadora
          </button>
          <button 
            onClick={() => scrollToSection('contato')}
            className="text-white hover:text-govyellow-400 transition-colors duration-200 font-medium"
          >
            Contato
          </button>
          <button 
            onClick={() => window.open('/empresas', '_blank')}
            className="text-white hover:text-govgreen-400 transition-colors duration-200 font-medium"
          >
            Para Empresas
          </button>
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-white font-medium">
            © {new Date().getFullYear()} Site do Trabalhador. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer