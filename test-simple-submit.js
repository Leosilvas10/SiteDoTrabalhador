const axios = require('axios');

async function testSimpleSubmit() {
  console.log('🧪 Teste simples da API submit-lead');
  
  const data = {
    nome: 'LEONARDO SILVA SEVERINO',
    telefone: '31991998938',
    whatsapp: '31991998938',
    email: 'Não informado',
    ultimaEmpresa: 'CRAS',
    experiencia: 'Última empresa: CRAS',
    lgpdConsent: true,
    jobTitle: 'Assistente Social',
    company: 'Empresa não informada',
    source: 'Site do Trabalhador - Modal',
    type: 'job-application'
  };
  
  try {
    console.log('📤 Enviando dados...');
    const response = await axios.post('http://localhost:3001/api/submit-lead', data, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Sucesso!');
    console.log('Status:', response.status);
    console.log('Resposta:', response.data);
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
    }
  }
}

testSimpleSubmit();
