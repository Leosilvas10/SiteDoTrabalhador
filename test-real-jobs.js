// Teste para verificar se apenas vagas reais estão sendo retornadas
// Importar o scraper diretamente
const realJobScraper = require('./lib/realJobScraper');

async function testRealJobs() {
  console.log('🧪 TESTANDO SISTEMA DE VAGAS REAIS...\n');
  
  try {
    const result = await fetchRealJobsFromBrazil();
    
    console.log('📊 RESULTADO DO TESTE:');
    console.log(`✅ Sucesso: ${result.success}`);
    console.log(`📝 Total de vagas: ${result.total}`);
    console.log(`🔗 Fontes: ${result.sources?.join(', ') || 'Nenhuma'}`);
    console.log(`📦 Cached: ${result.cached}\n`);
    
    if (result.data && result.data.length > 0) {
      console.log('🔍 ANÁLISE DAS PRIMEIRAS 5 VAGAS:\n');
      
      result.data.slice(0, 5).forEach((job, index) => {
        console.log(`--- VAGA ${index + 1} ---`);
        console.log(`Título: ${job.title}`);
        console.log(`Empresa: ${job.company?.name || job.company}`);
        console.log(`Local: ${job.location}`);
        console.log(`Fonte: ${job.source}`);
        console.log(`Descrição (primeiros 100 chars): ${job.description?.substring(0, 100)}...`);
        console.log(`Relevância: ${job.relevanceScore || 'N/A'}%`);
        console.log(`Link: ${job.link || 'N/A'}`);
        console.log('---\n');
      });
      
      // Verificar se há fontes fake
      const fakeSources = ['VagasBR', 'Emprega Brasil', 'Catho Fake', 'InfoJobs Fake'];
      const hasFakeSources = result.data.some(job => 
        fakeSources.some(fakeSource => job.source?.includes(fakeSource))
      );
      
      if (hasFakeSources) {
        console.log('❌ ERRO: Ainda existem fontes fake!');
        const fakeJobs = result.data.filter(job => 
          fakeSources.some(fakeSource => job.source?.includes(fakeSource))
        );
        console.log(`🚨 ${fakeJobs.length} vagas fake encontradas:`);
        fakeJobs.forEach(job => console.log(`- ${job.title} (${job.source})`));
      } else {
        console.log('✅ SUCESSO: Nenhuma fonte fake detectada!');
      }
      
      // Verificar qualidade das descrições
      const poorDescriptions = result.data.filter(job => 
        !job.description || job.description.length < 30 || 
        job.description.includes('Lorem') || 
        job.description.includes('descrição genérica')
      );
      
      if (poorDescriptions.length > 0) {
        console.log(`⚠️ ${poorDescriptions.length} vagas com descrições pobres encontradas`);
      } else {
        console.log('✅ Todas as vagas têm descrições adequadas');
      }
      
    } else {
      console.log('❌ Nenhuma vaga retornada - verificar scrapers');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste
testRealJobs();
