// API para monitorar o status do sistema de vagas
const { getWorkerStatus, forceUpdate } = require('../../workers/jobUpdater');

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Retornar status do sistema
      const workerStatus = getWorkerStatus();
      
      // Verificar se há dados de cache válidos
      const { fetchRealJobsFromBrazil } = require('../../lib/realJobScraper');
      
      return res.status(200).json({
        success: true,
        status: 'Sistema operacional',
        worker: workerStatus,
        system: {
          updateInterval: '30 minutos',
          minJobs: 300,
          maxJobs: 500,
          autoRedirect: true,
          locationHiding: true
        },
        timestamp: new Date().toISOString()
      });
      
    } else if (req.method === 'POST') {
      const { action } = req.body;
      
      if (action === 'force-update') {
        console.log('🔄 Forçando atualização via API...');
        await forceUpdate();
        
        return res.status(200).json({
          success: true,
          message: 'Atualização forçada executada',
          timestamp: new Date().toISOString()
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Ação não reconhecida'
      });
    }
    
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
    
  } catch (error) {
    console.error('❌ Erro na API de status:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
