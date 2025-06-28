const axios = require('axios');

async function addTestJob() {
  console.log('🏢 Adicionando vaga de teste...');
  
  const testJob = {
    title: 'Assistente Social',
    company: {
      name: 'CRAS - Centro de Referência'
    },
    location: 'Brasil',
    description: 'Vaga de Assistente Social para atendimento ao público',
    url: 'https://example.com/vaga-assistente-social',
    apply_url: 'https://example.com/candidatar',
    source: 'Manual - Teste',
    posted_date: new Date().toISOString(),
    id: 'test-assistente-social-' + Date.now()
  };
  
  try {
    const response = await axios.post('http://localhost:3001/api/post_job', testJob);
    console.log('✅ Vaga adicionada:', response.data);
    
    // Verificar se foi salva
    const jobsResponse = await axios.get('http://localhost:3001/api/fetch-home-jobs');
    console.log('📊 Total de vagas agora:', jobsResponse.data.jobs?.length || jobsResponse.data.data?.length || 0);
    
  } catch (error) {
    console.error('❌ Erro ao adicionar vaga:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

addTestJob();
