import { saveLeads } from '../../lib/leadsDB'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    console.log('🧹 Iniciando limpeza completa do sistema...')
    
    // 1. Limpar todos os leads do arquivo
    const saved = await saveLeads([])
    
    // 2. Limpar qualquer cache relacionado
    if (global.leadsCache) {
      delete global.leadsCache
      console.log('🗑️ Cache de leads limpo')
    }
    
    // 3. Força limpeza de cache no navegador
    const timestamp = new Date().toISOString()
    
    if (saved) {
      console.log('✅ Limpeza completa realizada com sucesso')
      res.status(200).json({
        success: true,
        message: 'Sistema completamente limpo - todos os dados foram removidos',
        timestamp,
        details: {
          leadsRemoved: true,
          cacheCleared: true,
          systemReset: true
        }
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao limpar o sistema'
      })
    }

  } catch (error) {
    console.error('❌ Erro ao limpar sistema:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    })
  }
}
