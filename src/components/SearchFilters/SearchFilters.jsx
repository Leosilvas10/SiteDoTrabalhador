import { useState, useEffect } from 'react'

const SearchFilters = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é mobile após a hidratação
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Opções de filtros - Vagas Operacionais
  const filterOptions = {
    areas: [
      'Todas as áreas',
      'Serviços Domésticos', 'Limpeza', 'Segurança', 'Alimentação', 'Cuidados', 
      'Construção Civil', 'Manutenção', 'Transporte', 'Atendimento', 'Vendas',
      'Operacional', 'Produção', 'Agropecuária', 'Mecânica', 'Beleza e Estética'
    ],
    types: [
      'Todos os tipos',
      'Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship', 'Remote'
    ],
    salaryRanges: [
      'Qualquer salário',
      'Até R$ 2.000', 'R$ 2.000 - R$ 4.000', 'R$ 4.000 - R$ 6.000',
      'R$ 6.000 - R$ 8.000', 'R$ 8.000 - R$ 12.000', 'R$ 12.000 - R$ 20.000',
      'Acima de R$ 20.000'
    ],
    experienceLevels: [
      'Qualquer nível',
      'Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Gerente', 'Diretor'
    ],
    cities: [
      'Todas as cidades',
      'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador',
      'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Goiânia', 'Remoto'
    ]
  }

  // Aplicar filtros
  const handleFilterChange = (key, value) => {
    const newValue = value === filterOptions[key + 's'][0] ? '' : value
    setFilters(prev => ({
      ...prev,
      [key]: newValue
    }))
  }

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({
      city: '',
      area: '',
      type: '',
      search: ''
    })
  }

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(value => value && value.length > 0).length

  return (
    <div className="filter-container mb-8">
      {/* Cabeçalho dos filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <span className="text-2xl mr-2">🔧</span>
            Filtros Avançados
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {activeFiltersCount} ativo{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-1"
            >
              <span>🔄</span>
              <span>Limpar Filtros</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-slate-400 hover:text-white transition-colors duration-300 flex items-center space-x-2"
          >
            <span>{isExpanded ? '🔼' : '🔽'}</span>
            <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
          </button>
        </div>
      </div>

      {/* Filtros principais (sempre visíveis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Busca por palavra-chave */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            🔍 Palavra-chave
          </label>
          <input
            type="text"
            placeholder="Ex: desenvolvedor, vendas..."
            value={filters.search || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="form-input"
          />
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            📍 Localização
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="form-input"
          >
            {filterOptions.cities.map(city => (
              <option key={city} value={city === 'Todas as cidades' ? '' : city} className="bg-slate-800">
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Área */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            💼 Área de Atuação
          </label>
          <select
            value={filters.area || ''}
            onChange={(e) => handleFilterChange('area', e.target.value)}
            className="form-input"
          >
            {filterOptions.areas.map(area => (
              <option key={area} value={area === 'Todas as áreas' ? '' : area} className="bg-slate-800">
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros avançados (expansíveis no mobile) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${
        isExpanded || isMobile ? 'block' : 'hidden'
      }`}>
        {/* Tipo de contrato */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            📋 Tipo de Contrato
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="form-input"
          >
            {filterOptions.types.map(type => (
              <option key={type} value={type === 'Todos os tipos' ? '' : type} className="bg-slate-800">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Nível de experiência */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            📈 Nível de Experiência
          </label>
          <select
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="form-input"
          >
            {filterOptions.experienceLevels.map(level => (
              <option key={level} value={level === 'Qualquer nível' ? '' : level} className="bg-slate-800">
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros rápidos com tags */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-sm font-medium text-slate-300 mb-3">🚀 Filtros Rápidos</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '🏠 Doméstica', filter: 'area', value: 'Serviços Domésticos' },
            { label: '🧹 Limpeza', filter: 'area', value: 'Limpeza' },
            { label: '🛡️ Segurança', filter: 'area', value: 'Segurança' },
            { label: '🍽️ Alimentação', filter: 'area', value: 'Alimentação' },
            { label: '👨‍⚕️ Cuidados', filter: 'area', value: 'Cuidados' },
            { label: '🔨 Construção', filter: 'area', value: 'Construção Civil' },
            { label: '🚗 Transporte', filter: 'area', value: 'Transporte' },
            { label: '🌟 SP', filter: 'city', value: 'São Paulo' },
          ].map((quickFilter) => (
            <button
              key={quickFilter.label}
              onClick={() => handleFilterChange(quickFilter.filter, quickFilter.value)}
              className={`px-3 py-2 rounded-full text-sm transition-all duration-300 ${
                filters[quickFilter.filter] === quickFilter.value
                  ? 'bg-blue-600 text-white shadow-glow'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {quickFilter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo dos filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-3">✨ Filtros Aplicados</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => 
              value && value.length > 0 ? (
                <div
                  key={key}
                  className="bg-blue-600/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>
                    {key === 'search' && '🔍'}
                    {key === 'city' && '📍'}
                    {key === 'area' && '💼'}
                    {key === 'type' && '📋'}
                    {key === 'level' && '📈'}
                  </span>
                  <span>{value}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                    className="text-blue-300 hover:text-white transition-colors duration-300"
                  >
                    ✕
                  </button>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilters