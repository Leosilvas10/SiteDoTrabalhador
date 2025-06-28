// API para atualização automática de vagas a cada 1 hora
const { fetchRealJobsFromBrazil } = require('../../lib/realJobScraper');

// Variável para controlar a última atualização
let lastUpdate = null;
let updateInProgress = false;

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    console.log('🔄 === VERIFICANDO ATUALIZAÇÃO AUTOMÁTICA DE VAGAS ===');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000)); // 1 hora atrás
    
    // Verificar se já passou 1 hora desde a última atualização
    const shouldUpdate = !lastUpdate || lastUpdate < oneHourAgo;
    
    if (!shouldUpdate && !updateInProgress) {
      const nextUpdateTime = new Date(lastUpdate.getTime() + (60 * 60 * 1000));
      const minutesUntilUpdate = Math.ceil((nextUpdateTime - now) / (1000 * 60));
      
      return res.status(200).json({
        success: true,
        message: 'Vagas atualizadas recentemente',
        lastUpdate: lastUpdate.toISOString(),
        nextUpdate: nextUpdateTime.toISOString(),
        minutesUntilUpdate: minutesUntilUpdate,
        updateNeeded: false
      });
    }

    if (updateInProgress) {
      return res.status(200).json({
        success: true,
        message: 'Atualização em progresso',
        updateInProgress: true,
        updateNeeded: false
      });
    }

    // Iniciar atualização
    updateInProgress = true;
    console.log('🚀 Iniciando atualização automática de vagas...');
    
    // Buscar vagas reais usando o sistema robusto
    const result = await fetchRealJobsFromBrazil();
    
    if (!result.success) {
      console.error('❌ Erro na atualização automática:', result.message);
      updateInProgress = false;
      return res.status(500).json({
        success: false,
        message: 'Erro na atualização automática de vagas',
        error: result.message
      });
    }

    // Atualização bem-sucedida
    lastUpdate = now;
    updateInProgress = false;
    
    const { data: allJobs, sources, cached, total, stats } = result;
    
    console.log(`✅ Atualização automática concluída: ${allJobs.length} vagas`);
    console.log(`📊 Fontes utilizadas: ${sources.join(', ')}`);
    console.log(`💾 Cache: ${cached ? 'SIM' : 'NÃO'}`);

    const nextUpdateTime = new Date(now.getTime() + (60 * 60 * 1000));

    return res.status(200).json({
      success: true,
      message: 'Vagas atualizadas com sucesso',
      lastUpdate: lastUpdate.toISOString(),
      nextUpdate: nextUpdateTime.toISOString(),
      totalJobs: allJobs.length,
      sources: sources,
      cached: cached,
      stats: stats,
      updateNeeded: false,
      updated: true
    });

  } catch (error) {
    console.error('❌ Erro na API de atualização automática:', error);
    updateInProgress = false;
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno na atualização automática',
      error: error.message
    });
  }
}

// Função para ser chamada pelo cron job ou scheduler externo
export const startAutoUpdate = () => {
  console.log('🔄 Sistema de atualização automática iniciado');
  
  // Atualizar imediatamente
  updateJobs();
  
  // Configurar intervalo de 1 hora (3600000 ms)
  setInterval(() => {
    updateJobs();
  }, 3600000); // 1 hora em millisegundos
};

const updateJobs = async () => {
  try {
    console.log('🔄 Executando atualização automática...');
    
    const response = await fetch('/api/auto-update-jobs');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Atualização automática concluída');
    } else {
      console.error('❌ Erro na atualização automática:', result.message);
    }
  } catch (error) {
    console.error('❌ Erro ao executar atualização automática:', error);
  }
};
