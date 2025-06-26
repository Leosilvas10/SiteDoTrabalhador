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
    
    // Buscar vagas para home (limitado e sem cidade específica)
    const jobs = await fetchJobsForHome();
    
    if (!jobs || jobs.length === 0) {
      console.log('⚠️ Nenhuma vaga encontrada para home');
      return res.status(200).json({
        success: true,
        message: 'Nenhuma vaga disponível no momento',
        jobs: [],
        data: []
      });
    }

    console.log(`✅ Home API: ${jobs.length} vagas (cidades ocultas)`);

    // Garantir que as cidades estão ocultas
    const homeJobs = jobs.map(job => ({
      ...job,
      location: 'Brasil', // Sempre "Brasil" na home
      originalLocation: job.originalLocation || job.location, // Salvar original
      showLocation: false, // Flag para o frontend
      homeDisplay: true // Flag indicando que é para home
    }));

    return res.status(200).json({
      success: true,
      message: `${homeJobs.length} vagas em destaque`,
      jobs: homeJobs,
      data: homeJobs,
      meta: {
        total: homeJobs.length,
        displayType: 'home',
        locationHidden: true,
        maxDisplay: 20,
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
