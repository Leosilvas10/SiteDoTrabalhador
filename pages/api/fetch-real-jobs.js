// API ROBUSTA para buscar 300+ vagas REAIS do Brasil
const { fetchRealJobsFromBrazil } = require('../../lib/realJobScraper');

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
    console.log('🇧🇷 === API VAGAS ROBUSTA 300+ ===');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    // Buscar vagas reais usando o sistema robusto
    const result = await fetchRealJobsFromBrazil();
    
    if (!result.success) {
      console.error('❌ Erro na busca de vagas:', result.message);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar vagas',
        data: []
      });
    }

    const { data: allJobs, sources, cached, total, nextUpdate, stats } = result;

    // Limitar para página de vagas (60 vagas - quantidade adequada para navegação)
    const jobs = allJobs.slice(0, 60);

    console.log(`✅ API respondendo com ${jobs.length} vagas reais`);
    console.log(`📊 Fontes utilizadas: ${sources.join(', ')}`);
    console.log(`💾 Cache: ${cached ? 'SIM' : 'NÃO'}`);
    console.log(`🎯 Limitado para página de vagas: ${jobs.length} de ${allJobs.length} disponíveis`);

    // Estatísticas das vagas
    const finalStats = {
      total: jobs.length,
      bySource: stats?.bySource || {},
      byCategory: {},
      byLocation: {},
      recentJobs: jobs.filter(job => {
        const publishedDate = new Date(job.publishedDate);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return publishedDate > oneDayAgo;
      }).length
    };

    // Contar por categoria e localização
    jobs.forEach(job => {
      finalStats.byCategory[job.category] = (finalStats.byCategory[job.category] || 0) + 1;
      
      // Extrair estado da localização
      const state = job.location.split(',').pop()?.trim() || 'N/A';
      finalStats.byLocation[state] = (finalStats.byLocation[state] || 0) + 1;
    });

    console.log('📈 Estatísticas das vagas:', finalStats);

    return res.status(200).json({
      success: true,
      message: `${jobs.length} vagas reais encontradas em todo o Brasil`,
      jobs: jobs,
      data: jobs,
      meta: {
        total: jobs.length,
        sources: sources,
        cached: cached,
        lastUpdate: new Date().toISOString(),
        nextUpdate: nextUpdate,
        updateInterval: '30 minutos',
        stats: finalStats,
        searchInfo: {
          scope: 'Todo o Brasil',
          jobTypes: 'Vagas diversas e trabalhos simples',
          realData: !result.fallback,
          autoUpdate: true,
          minJobs: 300,
          maxJobs: 500
        }
      }
    });

  } catch (error) {
    console.error('❌ ERRO CRÍTICO na API:', error);
    
    // Em caso de erro, retornar ao menos algumas vagas de emergência
    const { generateBrazilianMarketJobs } = require('../../lib/realJobScraper');
    const emergencyJobs = generateBrazilianMarketJobs(300);

    return res.status(200).json({
      success: true,
      message: 'Sistema de emergência ativo - vagas carregadas',
      jobs: emergencyJobs,
      data: emergencyJobs,
      meta: {
        total: emergencyJobs.length,
        sources: ['Sistema de Emergência'],
        cached: false,
        lastUpdate: new Date().toISOString(),
        error: error.message,
        fallback: true,
        searchInfo: {
          scope: 'Todo o Brasil',
          jobTypes: 'Dados de emergência',
          realData: false,
          emergency: true
        }
      }
    });
  }
}
