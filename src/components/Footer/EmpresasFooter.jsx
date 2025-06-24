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
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="container mx-auto px-4 py-8">
        {/* Links úteis */}
        <div className="flex justify-center items-center space-x-8 mb-6">
          <button 
            onClick={scrollToTop}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
          >
            Página Principal
          </button>
          <button 
            onClick={() => scrollToSection('vagas')}
            className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
          >
            Ver Vagas
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
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Site do Trabalhador. Todos os direitos reservados.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Área exclusiva para empresas
          </p>
        </div>
      </div>
    </footer>
  )
}

export default EmpresasFooter
