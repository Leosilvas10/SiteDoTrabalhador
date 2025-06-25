import React from 'react'

const SimpleCopyright = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="bg-govblue-900 py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-white text-sm">
            © {currentYear} Site do Trabalhador - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleCopyright
