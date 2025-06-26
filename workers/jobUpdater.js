// Worker de atualização automática de vagas - roda a cada 30 minutos
const { fetchRealJobsFromBrazil } = require('../lib/realJobScraper');

let updateInterval = null;
let isUpdating = false;

// Função principal de atualização
async function updateJobs() {
  if (isUpdating) {
    console.log('⏸️ Atualização já em andamento, pulando...');
    return;
  }

  isUpdating = true;
  console.log('🔄 Iniciando atualização automática de vagas...');
  
  try {
    const startTime = Date.now();
    const result = await fetchRealJobsFromBrazil();
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    if (result.success) {
      console.log(`✅ Atualização concluída em ${duration}s`);
      console.log(`📊 Total de vagas: ${result.total}`);
      console.log(`📍 Fontes: ${result.sources.join(', ')}`);
      console.log(`⏰ Próxima atualização: ${new Date(Date.now() + 30 * 60 * 1000).toLocaleString()}`);
    } else {
      console.error('❌ Falha na atualização:', result.error);
    }
  } catch (error) {
    console.error('❌ Erro crítico na atualização:', error.message);
  } finally {
    isUpdating = false;
  }
}

// Iniciar o worker
function startWorker() {
  if (updateInterval) {
    console.log('⚠️ Worker já está rodando');
    return;
  }

  console.log('🚀 Iniciando worker de atualização automática (30 minutos)');
  
  // Executar imediatamente na primeira vez
  updateJobs();
  
  // Agendar atualizações a cada 30 minutos
  updateInterval = setInterval(updateJobs, 30 * 60 * 1000);
  
  console.log('✅ Worker iniciado com sucesso');
}

// Parar o worker
function stopWorker() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log('🛑 Worker de atualização parado');
  }
}

// Verificar status do worker
function getWorkerStatus() {
  return {
    running: !!updateInterval,
    updating: isUpdating,
    nextUpdate: updateInterval ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null
  };
}

// Forçar atualização manual
async function forceUpdate() {
  console.log('🔄 Forçando atualização manual...');
  await updateJobs();
}

module.exports = {
  startWorker,
  stopWorker,
  getWorkerStatus,
  forceUpdate,
  updateJobs
};

// Auto-iniciar o worker quando o módulo for carregado
if (require.main === module) {
  startWorker();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('📡 Recebido SIGINT, parando worker...');
    stopWorker();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('📡 Recebido SIGTERM, parando worker...');
    stopWorker();
    process.exit(0);
  });
}
