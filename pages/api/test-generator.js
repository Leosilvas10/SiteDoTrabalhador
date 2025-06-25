// Teste simples do gerador de vagas
const { generateBrazilianMarketJobs } = require('../../lib/realJobScraper');

export default function handler(req, res) {
  try {
    console.log('🔍 Testando gerador de vagas...');
    
    const testJobs = generateBrazilianMarketJobs(25);
    
    console.log('✅ Gerador funcionou:', testJobs.length, 'vagas');
    
    return res.status(200).json({
      success: true,
      message: `${testJobs.length} vagas geradas pelo sistema`,
      jobs: testJobs,
      data: testJobs
    });
    
  } catch (error) {
    console.error('❌ Erro no gerador:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro no gerador de vagas',
      error: error.message
    });
  }
}
