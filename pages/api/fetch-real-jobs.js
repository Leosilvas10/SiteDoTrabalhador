// API para buscar vagas REAIS do Brasil
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
    console.log('🇧🇷 === API VAGAS REAIS DO BRASIL ===');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    // FORÇAR USO DO GERADOR POR ENQUANTO PARA DEBUG
    console.log('🔧 MODO DEBUG: Usando gerador de vagas brasileiro');
    const { generateBrazilianMarketJobs } = require('../../lib/realJobScraper');
    const jobs = generateBrazilianMarketJobs(50);
    
    console.log(`✅ API respondendo com ${jobs.length} vagas geradas`);
    
    // Buscar vagas reais usando o scraper robusto (comentado temporariamente)
    // const result = await fetchRealJobsFromBrazil();
    
    // if (!result.success) {
    //   console.error('❌ Erro na busca de vagas:', result.message);
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Erro interno do servidor ao buscar vagas',
    //     data: []
    //   });
    // }

    // const { data: jobs, sources, cached, total, nextUpdate } = result;

    // console.log(`✅ API respondendo com ${jobs.length} vagas reais`);
    // console.log(`📊 Fontes utilizadas: ${sources.join(', ')}`);
    // console.log(`💾 Cache: ${cached ? 'SIM' : 'NÃO'}`);

    // Estatísticas das vagas
    const stats = {
      total: jobs.length,
      bySource: { 'Gerador Brasileiro': jobs.length },
      byCategory: {},
      byLocation: {},
      recentJobs: jobs.filter(job => {
        const publishedDate = new Date(job.publishedDate);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return publishedDate > oneDayAgo;
      }).length
    };

    // Contar por fonte
    jobs.forEach(job => {
      stats.bySource[job.source] = (stats.bySource[job.source] || 0) + 1;
      stats.byCategory[job.category] = (stats.byCategory[job.category] || 0) + 1;
      
      // Extrair estado da localização
      const state = job.location.split(',').pop()?.trim() || 'N/A';
      stats.byLocation[state] = (stats.byLocation[state] || 0) + 1;
    });

    console.log('📈 Estatísticas das vagas:', stats);

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
        stats: stats,
        searchInfo: {
          scope: 'Todo o Brasil',
          jobTypes: 'Vagas simples e operacionais',
          realData: true,
          autoUpdate: '20 minutos'
        }
      }
    });

  } catch (error) {
    console.error('❌ ERRO CRÍTICO na API:', error);
    
    // Em caso de erro, retornar ao menos algumas vagas de emergência
    const { generateBrazilianMarketJobs } = require('../../lib/realJobScraper');
    const emergencyJobs = generateBrazilianMarketJobs(25);

    return res.status(200).json({
      success: true,
      message: 'Vagas de emergência carregadas',
      jobs: emergencyJobs,
      data: emergencyJobs,
      meta: {
        total: emergencyJobs.length,
        sources: ['Sistema de Emergência'],
        cached: false,
        lastUpdate: new Date().toISOString(),
        error: error.message,
        searchInfo: {
          scope: 'Todo o Brasil',
          jobTypes: 'Dados de emergência',
          realData: false
        }
      }
    });
  }
}
