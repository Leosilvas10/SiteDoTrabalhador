// Script de teste para validar as APIs principais
const { fetchRealJobsFromBrazil } = require('./lib/realJobScraper');

async function testAPIs() {
  console.log('🧪 Testando APIs do sistema...\n');

  try {
    // Teste 1: Scraper principal
    console.log('1️⃣ Testando scraper principal...');
    const startTime = Date.now();
    const jobs = await fetchRealJobsFromBrazil();
    const endTime = Date.now();
    
    console.log(`✅ Scraper executado em ${endTime - startTime}ms`);
    console.log(`📊 Total de vagas coletadas: ${jobs.length}`);
    
    if (jobs.length >= 300) {
      console.log('✅ Meta de 300+ vagas atingida!');
    } else {
      console.log('⚠️ Meta de 300+ vagas não atingida');
    }

    // Teste 2: Validar estrutura das vagas
    console.log('\n2️⃣ Validando estrutura das vagas...');
    const sampleJob = jobs[0];
    const requiredFields = ['title', 'company', 'location', 'salary', 'description', 'url', 'source', 'postedAt'];
    
    let validStructure = true;
    requiredFields.forEach(field => {
      if (!sampleJob[field]) {
        console.log(`❌ Campo obrigatório ausente: ${field}`);
        validStructure = false;
      }
    });
    
    if (validStructure) {
      console.log('✅ Estrutura das vagas válida');
    }

    // Teste 3: Distribuição por fonte
    console.log('\n3️⃣ Análise de distribuição por fonte...');
    const sourceDistribution = {};
    jobs.forEach(job => {
      sourceDistribution[job.source] = (sourceDistribution[job.source] || 0) + 1;
    });
    
    console.log('📈 Vagas por fonte:');
    Object.entries(sourceDistribution).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} vagas`);
    });

    // Teste 4: Distribuição por localização
    console.log('\n4️⃣ Análise de distribuição geográfica...');
    const locationDistribution = {};
    jobs.forEach(job => {
      const state = job.location.split(',').pop().trim();
      locationDistribution[state] = (locationDistribution[state] || 0) + 1;
    });
    
    const topStates = Object.entries(locationDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    console.log('🗺️ Top 10 estados com mais vagas:');
    topStates.forEach(([state, count]) => {
      console.log(`  ${state}: ${count} vagas`);
    });

    console.log('\n🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes se este arquivo for executado diretamente
if (require.main === module) {
  testAPIs();
}

module.exports = { testAPIs };
