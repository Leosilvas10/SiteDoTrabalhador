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
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center">
          {/* Título principal */}
          <div className="mb-8 fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Encontre sua próxima
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                oportunidade
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              A maior plataforma de vagas do Brasil. Mais de 50 mil oportunidades atualizadas, 
              orientação completa sobre direitos trabalhistas e ferramenta gratuita.
            </p>
          </div>

          {/* Categorias populares */}
          <div className="mb-16 bounce-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-semibold text-slate-300 mb-6">
              🔥 Categorias em Alta
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => window.location.href = '/vagas'}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 border border-white/20 hover:border-blue-400"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 fade-in" style={{ animationDelay: '0.6s' }}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up" style={{ animationDelay: '0.8s' }}>
            <button 
              onClick={() => document.getElementById('direitos').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 border border-white/20 hover:border-blue-400"
            >
              <span className="text-xl">⚖️</span>
              <span>Direitos Trabalhistas</span>
            </button>
            <button 
              onClick={() => document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400"
            >
              <span className="text-xl">🧮</span>
              <span>Calculadora</span>
            </button>
          </div>

          {/* Indicador de scroll */}
          <div className="mt-16 fade-in" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col items-center text-slate-400">
              <span className="text-sm mb-2">Role para ver as vagas</span>
              <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection