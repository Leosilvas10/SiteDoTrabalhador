// Sistema de inicialização automática para atualização de vagas
let isSchedulerRunning = false;
let updateInterval = null;

// Função para iniciar o sistema de atualização automática
export const startJobUpdateScheduler = () => {
  if (isSchedulerRunning) {
    console.log('⚠️ Sistema de atualização já está rodando');
    return;
  }

  console.log('🚀 Iniciando sistema de atualização automática de vagas...');
  console.log('⏰ Intervalo: 1 hora');
  
  isSchedulerRunning = true;
  
  // Executar primeira atualização após 30 segundos (dar tempo para o servidor inicializar)
  setTimeout(() => {
    executeUpdate();
  }, 30000);
  
  // Configurar intervalo de 1 hora (3600000 ms)
  updateInterval = setInterval(() => {
    executeUpdate();
  }, 3600000);
  
  console.log('✅ Sistema de atualização automática iniciado com sucesso');
};

// Função para parar o sistema de atualização
export const stopJobUpdateScheduler = () => {
  if (!isSchedulerRunning) {
    console.log('⚠️ Sistema de atualização não está rodando');
    return;
  }
  
  console.log('🛑 Parando sistema de atualização automática...');
  
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  
  isSchedulerRunning = false;
  console.log('✅ Sistema de atualização parado');
};

// Função para executar a atualização
const executeUpdate = async () => {
  try {
    console.log('🔄 Executando atualização automática de vagas...');
    
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sitedotrabalhador.com.br' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/auto-update-jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Atualização automática concluída com sucesso');
      console.log(`📊 Total de vagas: ${result.totalJobs || 'N/A'}`);
      console.log(`🌐 Fontes: ${result.sources?.join(', ') || 'N/A'}`);
    } else {
      console.error('❌ Erro na atualização automática:', result.message);
    }
  } catch (error) {
    console.error('❌ Erro ao executar atualização automática:', error.message);
  }
};

// Função para verificar status do sistema
export const getSchedulerStatus = () => {
  return {
    isRunning: isSchedulerRunning,
    hasInterval: updateInterval !== null,
    nextUpdate: updateInterval ? 'Em execução' : 'Parado'
  };
};

// Inicializar automaticamente quando o módulo for carregado (apenas no servidor)
if (typeof window === 'undefined') {
  // Delay para garantir que tudo está inicializado
  setTimeout(() => {
    startJobUpdateScheduler();
  }, 5000);
}
