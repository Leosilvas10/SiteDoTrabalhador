import React from 'react'

const EmpresasFooter = () => {
  const scrollToSection = (sectionId) => {
    // Redirecionar para a página principal com âncora
    window.location.href = `/#${sectionId}`
  }

  const scrollToTop = () => {
    // Redirecionar para a página principal
    window.location.href = '/'
  }

  return (
    <footer className="bg-blue-900 border-t-4 border-yellow-400">
      <div className="container mx-auto px-4 py-8">
        {/* Links úteis */}
        <div className="flex justify-center items-center space-x-8 mb-6 flex-wrap">
          <button 
            onClick={scrollToTop}
            className="text-blue-100 hover:text-yellow-400 transition-colors duration-200 font-medium"
          >
            Página Principal
          </button>
          <button 
            onClick={() => scrollToSection('vagas')}
            className="text-blue-100 hover:text-yellow-400 transition-colors duration-200 font-medium"
          >
            Ver Vagas
          </button>
          <button 
            onClick={() => scrollToSection('calculadora')}
            className="text-blue-100 hover:text-yellow-400 transition-colors duration-200 font-medium"
          >
            Calculadora
          </button>
          <button 
            onClick={() => scrollToSection('contato')}
            className="text-blue-100 hover:text-yellow-400 transition-colors duration-200 font-medium"
          >
            Contato
          </button>
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-blue-100">
            © {new Date().getFullYear()} Site do Trabalhador. Todos os direitos reservados.
          </p>
          <p className="text-blue-200 text-sm mt-2">
            Área exclusiva para empresas
          </p>
        </div>
      </div>
    </footer>
  )
}

export default EmpresasFooter
