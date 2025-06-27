// API que combina vagas internas + vagas públicas externas
export default async function handler(req, res) {
  try {
    console.log('🔄 Buscando TODAS as vagas (internas + públicas)...');
    
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

    const allJobs = [];
    const sources = [];
    let totalErrors = 0;

    // 1. Buscar vagas internas
    try {
      console.log('📋 Buscando vagas internas...');
      const internalResponse = await fetch(`${getBaseUrl(req)}/api/jobs`);
      const internalData = await internalResponse.json();
      
      if (internalData.success && internalData.data) {
        const internalJobs = internalData.data.map(job => ({
          ...job,
          isExternal: false,
          requiresLead: false,
          source: job.source || 'Site do Trabalhador'
        }));
        
        allJobs.push(...internalJobs);
        sources.push('Vagas Internas');
        console.log(`✅ ${internalJobs.length} vagas internas carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas internas:', error);
      totalErrors++;
    }

    // 2. Buscar vagas públicas externas
    try {
      console.log('🌐 Buscando vagas públicas...');
      const publicResponse = await fetch(`${getBaseUrl(req)}/api/public-jobs`);
      const publicData = await publicResponse.json();
      
      if (publicData.success && publicData.data) {
        allJobs.push(...publicData.data);
        sources.push('APIs Públicas');
        console.log(`✅ ${publicData.data.length} vagas públicas carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas públicas:', error);
      totalErrors++;
    }

    // 3. Embaralhar para misturar vagas internas e externas
    const shuffledJobs = shuffleArray(allJobs);
    
    console.log(`🎯 Total final: ${shuffledJobs.length} vagas (${sources.join(' + ')})`);

    res.status(200).json({
      success: true,
      data: shuffledJobs,
      jobs: shuffledJobs,
      total: shuffledJobs.length,
      meta: {
        sources: sources,
        internalJobs: allJobs.filter(job => !job.isExternal).length,
        externalJobs: allJobs.filter(job => job.isExternal).length,
        totalAvailable: shuffledJobs.length,
        lastUpdate: new Date().toISOString(),
        errors: totalErrors,
        mixed: true
      }
    });

  } catch (error) {
    console.error('❌ Erro geral na API de todas as vagas:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar vagas',
      data: [],
      jobs: [],
      total: 0
    });
  }
}

// Função para obter base URL
function getBaseUrl(req) {
  if (req.headers.host) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    return `${protocol}://${req.headers.host}`;
  }
  return 'http://localhost:3000';
}

// Função para embaralhar array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
