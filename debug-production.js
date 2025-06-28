const axios = require('axios');

async function debugProductionEnvironment() {
  console.log('🔍 DEBUG: Análise detalhada do ambiente de produção');
  console.log('='.repeat(70));
  
  const baseURL = 'https://site-do-trabalhador.vercel.app';
  
  try {
    // Criar um endpoint de debug para verificar variáveis de ambiente
    console.log('\n1️⃣ Testando detecção de ambiente...');
    
    // Simular candidatura simples
    const testData = {
      nome: 'DEBUG TEST',
      telefone: '11999999999',
      whatsapp: '11999999999',
      email: 'debug@test.com',
      ultimaEmpresa: 'TEST',
      statusTrabalho: 'Desempregado(a)',
      recebeuDireitos: 'Sim, recebi tudo',
      problemasTrabalho: 'Nenhuma dessas',
      desejaConsultoria: 'Não, só quero me candidatar',
      experiencia: 'Debug test',
      lgpdConsent: true,
      jobId: 'debug-job',
      jobTitle: 'Debug Job',
      company: 'Debug Company',
      timestamp: new Date().toISOString()
    };
    
    console.log('📝 Enviando candidatura de debug...');
    const submitResponse = await axios.post(`${baseURL}/api/submit-lead`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Debug-Script/1.0'
      },
      timeout: 30000
    });
    
    // Analisar resposta detalhadamente
    console.log('\n📋 Resposta completa da API:');
    console.log('Status:', submitResponse.status);
    console.log('Data:', JSON.stringify(submitResponse.data, null, 2));
    
    // Aguardar um pouco
    console.log('\n⏳ Aguardando 2 segundos...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar leads
    console.log('\n2️⃣ Verificando leads salvos...');
    const leadsResponse = await axios.get(`${baseURL}/api/get-leads`, {
      timeout: 30000
    });
    
    console.log('📊 Resposta completa de leads:');
    console.log('Status:', leadsResponse.status);
    console.log('Total leads:', leadsResponse.data.leads?.length || 0);
    
    if (leadsResponse.data.leads && leadsResponse.data.leads.length > 0) {
      console.log('\n📋 Últimos 3 leads:');
      leadsResponse.data.leads.slice(-3).forEach((lead, index) => {
        console.log(`${index + 1}. ID: ${lead.id}, Nome: ${lead.nome}, Data: ${lead.createdAt || lead.timestamp}`);
      });
      
      // Procurar pelo lead de debug
      const debugLead = leadsResponse.data.leads.find(lead => lead.nome === 'DEBUG TEST');
      if (debugLead) {
        console.log('\n✅ Lead de debug encontrado!');
        console.log('Dados completos:', JSON.stringify(debugLead, null, 2));
      } else {
        console.log('\n❌ Lead de debug NÃO encontrado');
      }
    }
    
  } catch (error) {
    console.error('\n❌ ERRO NO DEBUG:');
    console.error('Tipo:', error.name);
    console.error('Mensagem:', error.message);
    
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code) {
      console.error('Código:', error.code);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('🔍 DEBUG CONCLUÍDO');
}

debugProductionEnvironment();
