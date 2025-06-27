import React from 'react'

const SimpleCopyright = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="header-blue py-6 border-t-4 border-govyellow-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-white text-xs sm:text-sm font-medium leading-relaxed break-words">
            © {currentYear} Site do Trabalhador - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleCopyright
