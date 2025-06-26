const { fetchRealJobsFromBrazil } = require('./lib/realJobScraper.js');

console.log('🧪 Testando fetchRealJobsFromBrazil...');

fetchRealJobsFromBrazil().then(result => {
  console.log('✅ Resultado:', {
    success: result.success,
    total: result.total,
    sources: result.sources,
    cached: result.cached,
    hasError: !!result.error
  });
  
  if (result.data && result.data.length > 0) {
    console.log('📋 Primeira vaga:', {
      title: result.data[0].title,
      company: result.data[0].company,
      location: result.data[0].location,
      hasUrl: !!result.data[0].url
    });
  }
}).catch(err => {
  console.error('❌ Erro:', err.message);
});
