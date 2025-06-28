// API para gerenciar o sistema de atualização automática de vagas
import { startJobUpdateScheduler, stopJobUpdateScheduler, getSchedulerStatus } from '../../lib/autoUpdateScheduler';

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
    const { action } = req.query;

    switch (action) {
      case 'start':
        startJobUpdateScheduler();
        return res.status(200).json({
          success: true,
          message: 'Sistema de atualização automática iniciado',
          status: getSchedulerStatus()
        });

      case 'stop':
        stopJobUpdateScheduler();
        return res.status(200).json({
          success: true,
          message: 'Sistema de atualização automática parado',
          status: getSchedulerStatus()
        });

      case 'status':
      default:
        return res.status(200).json({
          success: true,
          message: 'Status do sistema de atualização',
          status: getSchedulerStatus(),
          info: {
            description: 'Sistema de atualização automática de vagas',
            interval: '1 hora',
            sources: ['APIs públicas de vagas', 'Portais de emprego']
          }
        });
    }

  } catch (error) {
    console.error('❌ Erro na API de gerenciamento:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno no sistema de atualização',
      error: error.message
    });
  }
}
