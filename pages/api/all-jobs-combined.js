// API que combina vagas internas + vagas externas
export default async function handler(req, res) {
  try {
    console.log('🔄 Buscando TODAS as vagas (internas + externas)...');
    
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }

    const allJobs = [];
    const sources = [];

    // Obter a URL base correta
    const baseUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;

    // 1. Buscar vagas internas
    try {
      console.log('📋 Buscando vagas internas...');
      const internalResponse = await fetch(`${baseUrl}/api/jobs`);
      const internalData = await internalResponse.json();
      
      if (internalData.success && internalData.data) {
        const internalJobs = internalData.data.map(job => ({
          ...job,
          isExternal: false,
          requiresLead: false
        }));
        
        allJobs.push(...internalJobs);
        sources.push('Vagas Internas');
        console.log(`✅ ${internalJobs.length} vagas internas carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas internas:', error);
    }

    // 2. Buscar vagas externas da API principal
    try {
      console.log('🌐 Buscando vagas externas...');
      const externalResponse = await fetch(`${baseUrl}/api/public-jobs-new`);
      const externalData = await externalResponse.json();
      
      if (externalData.success && externalData.data) {
        const externalJobs = externalData.data.map(job => ({
          ...job,
          isExternal: true,
          requiresLead: true // SEMPRE requer lead para vagas externas
        }));
        
        allJobs.push(...externalJobs);
        sources.push('Vagas Externas Gerais');
        console.log(`✅ ${externalJobs.length} vagas externas carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas externas:', error);
    }

    // 3. Buscar vagas de tecnologia
    try {
      console.log('💻 Buscando vagas de tecnologia...');
      const techResponse = await fetch(`${baseUrl}/api/public-jobs-tech`);
      const techData = await techResponse.json();
      
      if (techData.success && techData.jobs) {
        const techJobs = techData.jobs.map(job => ({
          ...job,
          isExternal: true,
          requiresLead: true
        }));
        
        allJobs.push(...techJobs);
        sources.push('Vagas de Tecnologia');
        console.log(`✅ ${techJobs.length} vagas de tecnologia carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas de tecnologia:', error);
    }

    // 4. Buscar vagas de saúde
    try {
      console.log('🏥 Buscando vagas de saúde...');
      const healthResponse = await fetch(`${baseUrl}/api/public-jobs-health`);
      const healthData = await healthResponse.json();
      
      if (healthData.success && healthData.jobs) {
        const healthJobs = healthData.jobs.map(job => ({
          ...job,
          isExternal: true,
          requiresLead: true
        }));
        
        allJobs.push(...healthJobs);
        sources.push('Vagas de Saúde');
        console.log(`✅ ${healthJobs.length} vagas de saúde carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas de saúde:', error);
    }

    // 5. Buscar vagas de serviços gerais
    try {
      console.log('🔧 Buscando vagas de serviços gerais...');
      const servicesResponse = await fetch(`${baseUrl}/api/public-jobs-services`);
      const servicesData = await servicesResponse.json();
      
      if (servicesData.success && servicesData.jobs) {
        const servicesJobs = servicesData.jobs.map(job => ({
          ...job,
          isExternal: true,
          requiresLead: true
        }));
        
        allJobs.push(...servicesJobs);
        sources.push('Vagas de Serviços Gerais');
        console.log(`✅ ${servicesJobs.length} vagas de serviços gerais carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar vagas de serviços gerais:', error);
    }

    // Embaralhar todas as vagas para misturar fontes
    const shuffledJobs = shuffleArray(allJobs);

    console.log(`🎯 Total: ${shuffledJobs.length} vagas combinadas de ${sources.length} fontes`);

    res.status(200).json({
      success: true,
      data: shuffledJobs,
      jobs: shuffledJobs,
      total: shuffledJobs.length,
      meta: {
        totalAvailable: shuffledJobs.length,
        sources: sources,
        internal: allJobs.filter(j => !j.isExternal).length,
        external: allJobs.filter(j => j.isExternal).length,
        lastUpdate: new Date().toISOString(),
        combined: true
      }
    });

  } catch (error) {
    console.error('❌ Erro na API combinada:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar vagas combinadas',
      data: [],
      jobs: [],
      total: 0
    });
  }
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
