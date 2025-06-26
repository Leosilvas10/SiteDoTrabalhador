import React from 'react'

const SimpleCopyright = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="bg-govgray-100 py-4 border-t border-govgray-200">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-govgray-600 text-sm">
            © {currentYear} Site do Trabalhador - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleCopyright
