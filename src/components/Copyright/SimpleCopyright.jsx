import React from 'react'

const SimpleCopyright = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="header-blue py-4 border-t-4 border-govyellow-400">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-white text-sm font-medium">
            © {currentYear} Site do Trabalhador - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleCopyright
