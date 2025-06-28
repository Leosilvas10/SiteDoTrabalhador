// API para gerenciar sistema de rotação de vagas baseado em popularidade
import fs from 'fs'
import path from 'path'

const JOBS_STATS_FILE = path.join(process.cwd(), 'data', 'jobs-stats.json')
const JOBS_REFRESH_LOG = path.join(process.cwd(), 'data', 'jobs-refresh.json')

// Garantir que arquivos existam
const ensureFiles = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  if (!fs.existsSync(JOBS_STATS_FILE)) {
    fs.writeFileSync(JOBS_STATS_FILE, JSON.stringify({}, null, 2))
  }
  
  if (!fs.existsSync(JOBS_REFRESH_LOG)) {
    fs.writeFileSync(JOBS_REFRESH_LOG, JSON.stringify({
      lastRefresh: new Date().toISOString(),
      refreshCount: 0,
      jobsReplaced: 0
    }, null, 2))
  }
}

export default async function handler(req, res) {
  ensureFiles()
  
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        return handleGetStats(req, res)
      case 'POST':
        return handleJobInteraction(req, res)
      case 'PUT':
        return handleForceRefresh(req, res)
      default:
        return res.status(405).json({
          success: false,
          message: 'Método não permitido'
        })
    }
  } catch (error) {
    console.error('❌ Erro na API jobs-analytics:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// GET - Obter estatísticas das vagas
function handleGetStats(req, res) {
  try {
    const stats = JSON.parse(fs.readFileSync(JOBS_STATS_FILE, 'utf8'))
    const refreshLog = JSON.parse(fs.readFileSync(JOBS_REFRESH_LOG, 'utf8'))
    
    // Calcular vagas menos populares (candidatos a substituição)
    const jobEntries = Object.entries(stats)
    const lowPerformingJobs = jobEntries
      .filter(([_, data]) => {
        const daysSinceLastView = (Date.now() - new Date(data.lastViewed).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceLastView > 3 && data.views < 5 // Vagas com menos de 5 visualizações em 3+ dias
      })
      .sort((a, b) => a[1].views - b[1].views) // Ordenar por menor número de views
    
    const response = {
      success: true,
      stats: {
        totalTrackedJobs: jobEntries.length,
        totalViews: jobEntries.reduce((sum, [_, data]) => sum + data.views, 0),
        totalApplications: jobEntries.reduce((sum, [_, data]) => sum + data.applications, 0),
        lowPerformingJobs: lowPerformingJobs.length,
        lastRefresh: refreshLog.lastRefresh,
        refreshCount: refreshLog.refreshCount,
        jobsReplaced: refreshLog.jobsReplaced
      },
      jobsToReplace: lowPerformingJobs.slice(0, 10).map(([jobId, data]) => ({
        jobId,
        views: data.views,
        applications: data.applications,
        lastViewed: data.lastViewed,
        daysSinceLastView: Math.floor((Date.now() - new Date(data.lastViewed).getTime()) / (1000 * 60 * 60 * 24))
      }))
    }
    
    return res.status(200).json(response)
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao carregar estatísticas'
    })
  }
}

// POST - Registrar interação com vaga (visualização ou candidatura)
function handleJobInteraction(req, res) {
  try {
    const { jobId, action, jobData } = req.body
    
    if (!jobId || !action) {
      return res.status(400).json({
        success: false,
        message: 'jobId e action são obrigatórios'
      })
    }
    
    const stats = JSON.parse(fs.readFileSync(JOBS_STATS_FILE, 'utf8'))
    
    // Inicializar estatísticas da vaga se não existir
    if (!stats[jobId]) {
      stats[jobId] = {
        views: 0,
        applications: 0,
        firstSeen: new Date().toISOString(),
        lastViewed: new Date().toISOString(),
        jobTitle: jobData?.title || 'Título não informado',
        company: jobData?.company || 'Empresa não informada'
      }
    }
    
    // Atualizar estatísticas baseado na ação
    switch (action) {
      case 'view':
        stats[jobId].views += 1
        stats[jobId].lastViewed = new Date().toISOString()
        break
      case 'apply':
        stats[jobId].applications += 1
        stats[jobId].lastViewed = new Date().toISOString()
        break
      default:
        return res.status(400).json({
          success: false,
          message: 'Ação inválida. Use "view" ou "apply"'
        })
    }
    
    // Salvar estatísticas atualizadas
    fs.writeFileSync(JOBS_STATS_FILE, JSON.stringify(stats, null, 2))
    
    console.log(`📊 Interação registrada: ${action} para vaga ${jobId}`)
    
    return res.status(200).json({
      success: true,
      message: 'Interação registrada com sucesso',
      stats: stats[jobId]
    })
    
  } catch (error) {
    console.error('Erro ao registrar interação:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao registrar interação'
    })
  }
}

// PUT - Forçar atualização/substituição de vagas pouco visitadas
function handleForceRefresh(req, res) {
  try {
    const stats = JSON.parse(fs.readFileSync(JOBS_STATS_FILE, 'utf8'))
    const refreshLog = JSON.parse(fs.readFileSync(JOBS_REFRESH_LOG, 'utf8'))
    
    // Identificar vagas para substituição
    const jobEntries = Object.entries(stats)
    const lowPerformingJobs = jobEntries
      .filter(([_, data]) => {
        const daysSinceLastView = (Date.now() - new Date(data.lastViewed).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceLastView > 3 && data.views < 5
      })
      .map(([jobId]) => jobId)
    
    // Remover estatísticas das vagas que serão substituídas
    lowPerformingJobs.forEach(jobId => {
      delete stats[jobId]
    })
    
    // Atualizar log de refresh
    refreshLog.lastRefresh = new Date().toISOString()
    refreshLog.refreshCount += 1
    refreshLog.jobsReplaced += lowPerformingJobs.length
    
    // Salvar alterações
    fs.writeFileSync(JOBS_STATS_FILE, JSON.stringify(stats, null, 2))
    fs.writeFileSync(JOBS_REFRESH_LOG, JSON.stringify(refreshLog, null, 2))
    
    console.log(`🔄 Refresh forçado: ${lowPerformingJobs.length} vagas removidas das estatísticas`)
    
    return res.status(200).json({
      success: true,
      message: 'Refresh realizado com sucesso',
      jobsReplaced: lowPerformingJobs.length,
      replacedJobIds: lowPerformingJobs
    })
    
  } catch (error) {
    console.error('Erro ao realizar refresh:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao realizar refresh'
    })
  }
}
