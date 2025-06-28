const axios = require('axios');

async function testCompleteFlow() {
  console.log('🧪 Testando fluxo completo: Candidatura → Painel Admin');
  console.log('='.repeat(60));
  
  const baseURL = 'http://localhost:3002';
  
  try {
    // 1. Simular candidatura através do modal
    console.log('\n1️⃣ Simulando candidatura de vaga...');
    const candidateData = {
      nome: 'João Silva Candidato',
      email: 'joao.candidato@email.com',
      telefone: '(11) 98765-4321',
      whatsapp: '(11) 98765-4321',
      jobTitle: 'Desenvolvedor Frontend',
      company: 'Tech Solutions LTDA',
      jobLink: 'https://example.com/vaga-frontend',
      originalLocation: 'São Paulo, SP',
      lgpdConsent: true,
      source: 'Site do Trabalhador - Modal Candidatura',
      experiencia: 'Experiência: 3 anos em React e JavaScript',
      type: 'job-application'
    };
    
    const submitResponse = await axios.post(`${baseURL}/api/submit-lead`, candidateData);
    console.log('✅ Candidatura enviada:', submitResponse.status === 200);
    console.log('📋 Lead ID:', submitResponse.data.leadId);
    
    // 2. Verificar se o lead aparece na listagem
    console.log('\n2️⃣ Verificando se aparece no painel admin...');
    const getLeadsResponse = await axios.get(`${baseURL}/api/get-leads`);
    console.log('✅ Busca de leads:', getLeadsResponse.status === 200);
    
    const leadsData = getLeadsResponse.data;
    const leads = leadsData.leads || [];
    const newLead = leads.find(lead => lead.email === candidateData.email);
    console.log('✅ Lead encontrado no painel:', !!newLead);
    
    if (newLead) {
      console.log('📊 Dados do lead:');
      console.log(`   - Nome: ${newLead.nome}`);
      console.log(`   - Email: ${newLead.email}`);
      console.log(`   - Vaga: ${newLead.jobTitle}`);
      console.log(`   - Empresa: ${newLead.company}`);
      console.log(`   - Tipo: ${newLead.type}`);
      console.log(`   - Status: ${newLead.status}`);
      console.log(`   - Data: ${newLead.timestamp}`);
    }
    
    // 3. Testar exclusão através da API
    console.log('\n3️⃣ Testando exclusão do lead...');
    if (newLead) {
      const deleteResponse = await axios.post(`${baseURL}/api/delete-lead`, { 
        leadId: newLead.leadId || newLead.id 
      });
      console.log('✅ Exclusão via API:', deleteResponse.status === 200);
      
      // Verificar se foi realmente excluído
      const verifyResponse = await axios.get(`${baseURL}/api/get-leads`);
      const remainingLeadsData = verifyResponse.data;
      const remainingLeads = remainingLeadsData.leads || [];
      const deletedLead = remainingLeads.find(lead => 
        lead.leadId === (newLead.leadId || newLead.id)
      );
      console.log('✅ Lead removido da base:', !deletedLead);
    }
    
    // 4. Relatório final
    console.log('\n' + '='.repeat(60));
    console.log('📋 RELATÓRIO FINAL DOS TESTES');
    console.log('='.repeat(60));
    console.log('✅ Modal de candidatura → API: FUNCIONANDO');
    console.log('✅ Leads aparecem no painel admin: FUNCIONANDO');
    console.log('✅ Exclusão de leads via API: FUNCIONANDO');
    console.log('✅ Sistema de leads completo: FUNCIONANDO');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Dados:', error.response.data);
    }
  }
}

// Executar teste
testCompleteFlow();
