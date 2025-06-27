
import { useState, useEffect } from 'react'

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalVagas: 0,
    vagasAtivas: 0,
    totalLeads: 0,
    leadsHoje: 0,
    acessosHoje: 0,
    empresasCadastradas: 0,
    usuariosAtivos: 0,
    taxaConversao: 0
  })

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const resetDashboard = async () => {
    const zeroStats = {
      totalVagas: 0,
      vagasAtivas: 0,
      totalLeads: 0,
      leadsHoje: 0,
      acessosHoje: 0,
      empresasCadastradas: 0,
      usuariosAtivos: 0,
      taxaConversao: 0
    }

    const emptyActivities = []

    // Atualizar imediatamente o estado da UI
    setStats(zeroStats)
    setActivities(emptyActivities)
    
    // Salvar estado zerado no localStorage para persistir
    try {
      localStorage.setItem('dashboardStats', JSON.stringify(zeroStats))
      localStorage.setItem('dashboardActivities', JSON.stringify(emptyActivities))
      localStorage.setItem('dashboardResetFlag', 'true')
      localStorage.setItem('dashboardResetTime', new Date().toISOString())
      
      console.log('🧹 Dashboard completamente zerado e salvo!')
      
      // Garantir que os dados sejam limpos também na API
      try {
        await fetch('/api/clear-leads', { method: 'POST' })
        console.log('🧹 Leads da API também limpos!')
      } catch (error) {
        console.log('ℹ️ Não foi possível limpar leads da API (talvez não existam)')
      }
      
    } catch (error) {
      console.error('Erro ao salvar dados zerados:', error)
    }
  }

  const addActivity = (message, icon = '📋') => {
    const newActivity = {
      id: Date.now(),
      message,
      icon,
      time: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const updatedActivities = [newActivity, ...activities].slice(0, 10) // Manter apenas as 10 mais recentes
    
    setActivities(updatedActivities)
    localStorage.setItem('dashboardActivities', JSON.stringify(updatedActivities))
  }

  const updateStats = (newStats) => {
    setStats(newStats)
    localStorage.setItem('dashboardStats', JSON.stringify(newStats))
    // Remover flag de reset se houver dados
    if (Object.values(newStats).some(val => val > 0)) {
      localStorage.removeItem('dashboardResetFlag')
    }
  }
    try {
      setLoading(true)
      
      // Verificar se há dados salvos (zerados) no localStorage
      const savedStats = localStorage.getItem('dashboardStats')
      const savedActivities = localStorage.getItem('dashboardActivities')
      const resetFlag = localStorage.getItem('dashboardResetFlag')
      
      if (resetFlag === 'true' || (savedStats && savedActivities)) {
        // Sistema foi zerado ou há dados salvos - usar esses dados
        const stats = savedStats ? JSON.parse(savedStats) : {
          totalVagas: 0,
          vagasAtivas: 0,
          totalLeads: 0,
          leadsHoje: 0,
          acessosHoje: 0,
          empresasCadastradas: 0,
          usuariosAtivos: 0,
          taxaConversao: 0
        }
        
        const activities = savedActivities ? JSON.parse(savedActivities) : []
        
        setStats(stats)
        setActivities(activities)
        
        if (resetFlag === 'true') {
          console.log('🧹 Sistema zerado - carregando dados limpos')
        } else {
          console.log('📊 Carregando dados salvos do dashboard')
        }
      } else {
        // Primeira vez ou dados não encontrados - começar limpo
        const cleanStats = {
          totalVagas: 0,
          vagasAtivas: 0,
          totalLeads: 0,
          leadsHoje: 0,
          acessosHoje: 0,
          empresasCadastradas: 0,
          usuariosAtivos: 0,
          taxaConversao: 0
        }

        const cleanActivities = []

        setStats(cleanStats)
        setActivities(cleanActivities)
        
        // Salvar dados limpos iniciais
        localStorage.setItem('dashboardStats', JSON.stringify(cleanStats))
        localStorage.setItem('dashboardActivities', JSON.stringify(cleanActivities))
        
        console.log('🆕 Sistema iniciado limpo - sem dados')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      // Em caso de erro, usar dados limpos como fallback
      const fallbackStats = {
        totalVagas: 0,
        vagasAtivas: 0,
        totalLeads: 0,
        leadsHoje: 0,
        acessosHoje: 0,
        empresasCadastradas: 0,
        usuariosAtivos: 0,
        taxaConversao: 0
      }
      setStats(fallbackStats)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, change, changeType, icon, color }) => (
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-shadow ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-govgray-600 text-sm font-medium">{title}</p>
          <p className="text-govgray-800 text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-govgreen-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? '↗' : '↘'} {change}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-govblue-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-lg border border-govgray-200">
            <div className="h-4 bg-govgray-200 rounded mb-3"></div>
            <div className="h-8 bg-govgray-200 rounded mb-2"></div>
            <div className="h-3 bg-govgray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Vagas"
          value={stats.totalVagas}
          change={stats.totalVagas > 0 ? "+12% vs último mês" : null}
          changeType="positive"
          icon="💼"
          color="border-l-4 border-govblue-600"
        />
        <StatCard
          title="Vagas Ativas"
          value={stats.vagasAtivas}
          change={stats.vagasAtivas > 0 ? "+8% vs último mês" : null}
          changeType="positive"
          icon="✅"
          color="border-l-4 border-govgreen-600"
        />
        <StatCard
          title="Total de Leads"
          value={stats.totalLeads}
          change={stats.totalLeads > 0 ? "+23% vs último mês" : null}
          changeType="positive"
          icon="👥"
          color="border-l-4 border-govyellow-500"
        />
        <StatCard
          title="Leads Hoje"
          value={stats.leadsHoje}
          change={stats.leadsHoje > 0 ? "+15% vs ontem" : null}
          changeType="positive"
          icon="📈"
          color="border-l-4 border-govblue-600"
        />
        <StatCard
          title="Acessos Hoje"
          value={stats.acessosHoje}
          change={stats.acessosHoje > 0 ? "+5% vs ontem" : null}
          changeType="positive"
          icon="👁️"
          color="border-l-4 border-govgreen-600"
        />
        <StatCard
          title="Empresas"
          value={stats.empresasCadastradas}
          change={stats.empresasCadastradas > 0 ? "+2 esta semana" : null}
          changeType="positive"
          icon="🏢"
          color="border-l-4 border-govyellow-500"
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.usuariosAtivos}
          change={stats.usuariosAtivos > 0 ? "+18% vs último mês" : null}
          changeType="positive"
          icon="👤"
          color="border-l-4 border-govblue-600"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.taxaConversao}%`}
          change={stats.taxaConversao > 0 ? "+1.2% vs último mês" : null}
          changeType="positive"
          icon="🎯"
          color="border-l-4 border-govgreen-600"
        />
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-govblue-600">Atividade Recente</h3>
            <div className="flex space-x-2">
              <button
                onClick={loadDashboardData}
                className="text-govblue-600 hover:text-govblue-700 text-sm font-medium px-3 py-1 rounded border border-govblue-300 hover:border-govblue-500 transition-colors"
              >
                🔄 Atualizar
              </button>
              <button
                onClick={() => {
                  if (confirm('🧹 Isso vai zerar completamente o dashboard. Continuar?')) {
                    resetDashboard()
                    alert('✅ Dashboard zerado com sucesso!')
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded border border-red-300 hover:border-red-500 transition-colors"
              >
                🗑️ Zerar Tudo
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-govgray-50 rounded-lg border border-govgray-100">
                  <span className="text-lg">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-govgray-700 text-sm font-medium">{activity.message}</p>
                    <p className="text-govgray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-govgray-500">
                <div className="text-4xl mb-3">📊</div>
                <p className="font-medium">Nenhuma atividade recente</p>
                <p className="text-sm">Sistema limpo e pronto para uso</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200">
          <h3 className="text-xl font-semibold text-govblue-600 mb-6">Resumo do Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-govgray-100">
              <span className="text-govgray-700 font-medium">Status do Sistema</span>
              <span className="text-govgreen-600 text-sm font-medium">🟢 Online</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-govgray-100">
              <span className="text-govgray-700 font-medium">Último Reset</span>
              <span className="text-govgray-600 text-sm">
                {localStorage.getItem('dashboardResetTime') 
                  ? new Date(localStorage.getItem('dashboardResetTime')).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Nunca'
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-govgray-100">
              <span className="text-govgray-700 font-medium">Vagas Cadastradas</span>
              <span className={`text-sm font-medium ${stats.totalVagas > 0 ? 'text-govblue-600' : 'text-govgray-500'}`}>
                {stats.totalVagas} vagas
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-govgray-700 font-medium">Estado dos Dados</span>
              <span className={`text-sm font-medium ${
                stats.totalVagas === 0 && stats.totalLeads === 0 && activities.length === 0
                  ? 'text-govgreen-600' 
                  : 'text-govblue-600'
              }`}>
                {stats.totalVagas === 0 && stats.totalLeads === 0 && activities.length === 0
                  ? '🧹 Sistema Limpo'
                  : '📊 Com Dados'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
