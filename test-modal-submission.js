const axios = require('axios');

async function testModalSubmission() {
  console.log('🧪 Testando envio do modal da página inicial');
  console.log('='.repeat(60));
  
  const baseURL = 'http://localhost:3001';
  
  try {
    // Simular dados enviados pelo modal da página inicial
    const modalData = {
      // Dados pessoais
      nome: 'LEONARDO SILVA SEVERINO',
      telefone: '31991998938',
      whatsapp: '31991998938',
      email: 'Não informado',
      
      // Respostas da pesquisa
      ultimaEmpresa: 'CRAS',
      statusTrabalho: 'Com carteira assinada',
      recebeuDireitos: 'Sim, recebi tudo',
      problemasTrabalho: 'Nenhuma dessas',
      desejaConsultoria: 'Sim, quero receber orientação gratuita',
      
      // Campo experiência combinado
      experiencia: 'Última empresa: CRAS. Status: Com carteira assinada. Recebeu direitos: Sim, recebi tudo. Problemas: Nenhuma dessas. Quer consultoria: Sim, quero receber orientação gratuita',
      
      // Consentimento LGPD
      lgpdConsent: true,
      
      // Dados da vaga
      jobId: 'assistente-social',
      jobTitle: 'Assistente Social',
      company: 'Empresa não informada',
      jobLink: '#',
      originalLocation: 'Brasil',
      
      // Metadados
      fonte: 'Site do Trabalhador - Pesquisa Trabalhista',
      paginaOrigem: 'http://localhost:3001',
      source: 'Site do Trabalhador - Formulário Único',
      type: 'job-application'
    };
    
    console.log('\n📋 Dados do modal:');
    console.log('Nome:', modalData.nome);
    console.log('WhatsApp:', modalData.whatsapp);
    console.log('Empresa:', modalData.ultimaEmpresa);
    console.log('Status:', modalData.statusTrabalho);
    console.log('Vaga:', modalData.jobTitle);
    
    // Enviar para API
    console.log('\n🚀 Enviando para /api/submit-lead...');
    const response = await axios.post(`${baseURL}/api/submit-lead`, modalData, {
      timeout: 10000 // 10 segundos de timeout
    });
    
    console.log('✅ Resposta da API:');
    console.log('Status:', response.status);
    console.log('Dados:', JSON.stringify(response.data, null, 2));
    
    // Verificar se aparece na listagem
    console.log('\n🔍 Verificando no painel admin...');
    const getLeadsResponse = await axios.get(`${baseURL}/api/get-leads`);
    
    if (getLeadsResponse.status === 200) {
      const leadsData = getLeadsResponse.data;
      const leads = leadsData.leads || [];
      
      console.log(`📊 Total de leads: ${leads.length}`);
      
      const newLead = leads.find(lead => 
        lead.nome === modalData.nome && 
        lead.whatsapp === modalData.whatsapp
      );
      
      if (newLead) {
        console.log('✅ Lead encontrado no painel admin!');
        console.log('- ID:', newLead.id || newLead.leadId);
        console.log('- Nome:', newLead.nome);
        console.log('- WhatsApp:', newLead.whatsapp);
        console.log('- Empresa:', newLead.ultimaEmpresa || newLead.company);
        console.log('- Tipo:', newLead.type);
        console.log('- Status:', newLead.status);
        console.log('- Data:', newLead.timestamp);
      } else {
        console.log('❌ Lead NÃO encontrado no painel admin!');
        console.log('Leads existentes:');
        leads.forEach((lead, index) => {
          console.log(`${index + 1}. ${lead.nome} - ${lead.whatsapp || lead.telefone}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
  }
}

testModalSubmission();
