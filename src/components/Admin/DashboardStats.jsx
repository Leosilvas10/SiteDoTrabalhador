
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

  const loadDashboardData = async () => {
    try {
      // Simular carregamento de dados reais (pode ser substituído por API real)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dados mockados mas realistas para demonstração
      const mockStats = {
        totalVagas: 45,
        vagasAtivas: 32,
        totalLeads: 128,
        leadsHoje: 8,
        acessosHoje: 234,
        empresasCadastradas: 12,
        usuariosAtivos: 89,
        taxaConversao: 6.25
      }

      const mockActivities = [
        {
          id: 1,
          type: 'lead',
          message: 'Novo lead recebido - Maria Silva',
          time: '2 min atrás',
          icon: '👤'
        },
        {
          id: 2,
          type: 'vaga',
          message: 'Vaga publicada: Auxiliar de Limpeza',
          time: '15 min atrás',
          icon: '💼'
        },
        {
          id: 3,
          type: 'empresa',
          message: 'Nova empresa cadastrada: Limpeza Total Ltda',
          time: '1h atrás',
          icon: '🏢'
        },
        {
          id: 4,
          type: 'lead',
          message: 'Lead convertido - João Santos',
          time: '2h atrás',
          icon: '✅'
        },
        {
          id: 5,
          type: 'sistema',
          message: 'Backup automático realizado',
          time: '3h atrás',
          icon: '💾'
        }
      ]

      setStats(mockStats)
      setActivities(mockActivities)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, change, changeType, icon, color }) => (
    <div className={`bg-slate-800 rounded-lg p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {changeType === 'positive' ? '↗' : '↘'} {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color.replace('border-', 'bg-').replace('-500', '-500/20')}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-3"></div>
            <div className="h-8 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-2/3"></div>
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
          change="+12% vs último mês"
          changeType="positive"
          icon="💼"
          color="border-blue-500"
        />
        <StatCard
          title="Vagas Ativas"
          value={stats.vagasAtivas}
          change="+8% vs último mês"
          changeType="positive"
          icon="✅"
          color="border-green-500"
        />
        <StatCard
          title="Total de Leads"
          value={stats.totalLeads}
          change="+23% vs último mês"
          changeType="positive"
          icon="👥"
          color="border-purple-500"
        />
        <StatCard
          title="Leads Hoje"
          value={stats.leadsHoje}
          change="+15% vs ontem"
          changeType="positive"
          icon="📈"
          color="border-orange-500"
        />
        <StatCard
          title="Acessos Hoje"
          value={stats.acessosHoje}
          change="+5% vs ontem"
          changeType="positive"
          icon="👁️"
          color="border-cyan-500"
        />
        <StatCard
          title="Empresas"
          value={stats.empresasCadastradas}
          change="+2 esta semana"
          changeType="positive"
          icon="🏢"
          color="border-yellow-500"
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.usuariosAtivos}
          change="+18% vs último mês"
          changeType="positive"
          icon="👤"
          color="border-pink-500"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.taxaConversao}%`}
          change="+1.2% vs último mês"
          changeType="positive"
          icon="🎯"
          color="border-indigo-500"
        />
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Atividade Recente</h3>
            <button
              onClick={loadDashboardData}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              🔄 Atualizar
            </button>
          </div>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">{activity.message}</p>
                  <p className="text-slate-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Resumo do Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Status do Sistema</span>
              <span className="text-green-400 text-sm">🟢 Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Último Backup</span>
              <span className="text-slate-400 text-sm">3h atrás</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Vagas Sincronizadas</span>
              <span className="text-blue-400 text-sm">21 vagas</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Próxima Atualização</span>
              <span className="text-slate-400 text-sm">em 15 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
