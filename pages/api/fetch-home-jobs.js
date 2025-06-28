// API específica para página inicial - vagas SEM cidade específica
const { fetchJobsForHome } = require('../../lib/realJobScraper');

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
    console.log('🏠 === API VAGAS HOME (SEM CIDADE) ===');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    // TEMPORARIAMENTE: Carregar vagas de teste
    const fs = require('fs');
    const path = require('path');
    const testJobsPath = path.join(process.cwd(), 'data', 'jobs-test.json');
    
    let jobs = [];
    if (fs.existsSync(testJobsPath)) {
      const testJobs = JSON.parse(fs.readFileSync(testJobsPath, 'utf8'));
      jobs = testJobs;
      console.log('📋 Carregadas vagas de teste:', jobs.length);
    } else {
      // Buscar vagas para home (limitado e sem cidade específica)
      jobs = await fetchJobsForHome();
    }
    
    if (!jobs || jobs.length === 0) {
      console.log('⚠️ Nenhuma vaga encontrada para home');
      return res.status(200).json({
        success: true,
        message: 'Nenhuma vaga disponível no momento',
        jobs: [],
        data: [],
        meta: {
          total: 0,
          totalAvailable: 0
        }
      });
    }

    // Buscar o total de vagas disponíveis no sistema para mostrar no card
    const { fetchRealJobsFromBrazil } = require('../../lib/realJobScraper');
    let totalSystemJobs = 0;
    
    try {
      const systemResult = await fetchRealJobsFromBrazil();
      totalSystemJobs = systemResult.success ? systemResult.data.length : 0;
    } catch (error) {
      console.log('⚠️ Erro ao buscar total do sistema:', error.message);
      totalSystemJobs = 300; // Fallback para o mínimo garantido
    }

    console.log(`✅ Home API: ${jobs.length} vagas disponíveis, mostrando 6 em destaque`);
    console.log(`📊 Total no sistema: ${totalSystemJobs} vagas`);

    // Garantir que as cidades estão ocultas - APENAS 6 vagas em destaque
    const homeJobs = jobs.slice(0, 6).map(job => ({
      ...job,
      location: 'Brasil', // Sempre "Brasil" na home
      originalLocation: job.originalLocation || job.location, // Salvar original
      showLocation: false, // Flag para o frontend
      homeDisplay: true // Flag indicando que é para home
    }));

    return res.status(200).json({
      success: true,
      message: `${totalSystemJobs} vagas disponíveis | Mostrando ${homeJobs.length} em destaque`,
      jobs: homeJobs,
      data: homeJobs,
      meta: {
        total: homeJobs.length,
        totalAvailable: totalSystemJobs,
        displayType: 'home',
        locationHidden: true,
        maxDisplay: 6,
        lastUpdate: new Date().toISOString(),
        info: {
          message: 'Localizações específicas reveladas após candidatura',
          scope: 'Vagas em destaque para todo o Brasil',
          strategy: 'Lead generation'
        }
      }
    });

  } catch (error) {
    console.error('❌ ERRO na API Home:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      jobs: [],
      data: [],
      error: error.message
    });
  }
}
