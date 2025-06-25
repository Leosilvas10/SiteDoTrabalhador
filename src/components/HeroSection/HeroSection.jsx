import React from 'react'

const HeroSection = () => {
  // Estatísticas para exibir
  const stats = [
    { label: 'Vagas Ativas', value: '50K+', icon: '💼' },
    { label: 'Empresas Cadastradas', value: '5K+', icon: '🏢' },
    { label: 'Profissionais', value: '100K+', icon: '👥' },
    { label: 'Vagas Preenchidas', value: '25K+', icon: '✅' }
  ]

  // Categorias populares - Vagas Operacionais
  const popularCategories = [
    { name: 'Doméstica', icon: '🏠', count: '8K+' },
    { name: 'Limpeza', icon: '🧹', count: '6K+' },
    { name: 'Segurança', icon: '🛡️', count: '5K+' },
    { name: 'Alimentação', icon: '🍽️', count: '7K+' },
    { name: 'Cuidados', icon: '👨‍⚕️', count: '4K+' },
    { name: 'Construção', icon: '🔨', count: '9K+' }
  ]

  return (
    <div className="relative bg-gradient-to-br from-govblue-600 via-govblue-700 to-govblue-800 overflow-hidden">
      {/* Background pattern - Inspirado no gov.br */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,205,7,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center">
          {/* Título principal - Estilo Gov.br */}
          <div className="mb-8 fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Encontre sua próxima
              <span className="block text-govyellow-400">
                oportunidade de trabalho
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-govgray-100 max-w-4xl mx-auto leading-relaxed mb-8 font-medium">
              Portal oficial de vagas de emprego. Mais de 50 mil oportunidades atualizadas, 
              orientação completa sobre direitos trabalhistas e ferramenta gratuita.
            </p>
            
            {/* Botão Ver Todas as Vagas - Estilo Gov.br */}
            <div className="bounce-in" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => window.location.href = '/vagas'}
                className="inline-flex items-center space-x-3 bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold text-lg px-10 py-4 rounded shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <span className="text-2xl">👀</span>
                <span>Ver Todas as Vagas</span>
                <span className="text-xl">→</span>
              </button>
              <p className="text-sm text-govgray-200 mt-3 font-medium">
                Mais de 50 mil oportunidades atualizadas diariamente
              </p>
            </div>
          </div>

          {/* Categorias populares - Estilo Gov.br */}
          <div className="mb-16 bounce-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-bold text-govyellow-400 mb-6">
              🔥 Categorias Mais Procuradas
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => window.location.href = '/vagas'}
                  className="flex items-center space-x-2 bg-white hover:bg-govgray-50 text-govblue-600 px-5 py-3 rounded font-medium transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-semibold">{category.name}</span>
                  <span className="text-xs bg-govgreen-600 text-white px-2 py-1 rounded">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Estatísticas - Estilo Gov.br */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 fade-in" style={{ animationDelay: '0.6s' }}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-govblue-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-govgray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Actions - Estilo Gov.br */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up" style={{ animationDelay: '0.8s' }}>
            <button 
              onClick={() => document.getElementById('direitos').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center space-x-2 bg-govyellow-500 hover:bg-govyellow-600 text-govblue-800 font-bold px-8 py-4 rounded transition-all duration-200 shadow-lg"
            >
              <span className="text-xl">⚖️</span>
              <span>Direitos Trabalhistas</span>
            </button>
            <button 
              onClick={() => document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center space-x-2 bg-white hover:bg-govgray-50 text-govblue-600 font-bold px-8 py-4 rounded transition-all duration-200 shadow-lg border-2 border-govblue-600"
            >
              <span className="text-xl">🧮</span>
              <span>Calculadora</span>
            </button>
          </div>

          {/* Indicador de scroll - Estilo Gov.br */}
          <div className="mt-16 fade-in" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col items-center text-govgray-200">
              <span className="text-sm mb-2 font-medium">Role para explorar o portal</span>
              <div className="w-6 h-10 border-2 border-govyellow-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-govyellow-400 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection