const axios = require('axios');

async function testProductionAPI() {
  console.log('🌐 TESTE DIRETO EM PRODUÇÃO');
  console.log('='.repeat(50));
  
  const prodURL = 'https://sitedotrabalhador.com.br';
  
  try {
    // 1. Verificar se as vagas estão carregando em produção
    console.log('\n1️⃣ Verificando vagas em produção...');
    const jobsResponse = await axios.get(`${prodURL}/api/fetch-home-jobs`);
    const jobs = jobsResponse.data.jobs || [];
    
    console.log(`📊 Vagas em produção: ${jobs.length}`);
    if (jobs.length > 0) {
      console.log(`📋 Primeira vaga: ${jobs[0].title} - ${jobs[0].company?.name || jobs[0].company}`);
    }
    
    // 2. Testar envio de lead para produção
    console.log('\n2️⃣ Testando envio de lead para produção...');
    const testLead = {
      nome: 'TESTE PRODUÇÃO - LEONARDO',
      telefone: '31991998938',
      whatsapp: '31991998938',
      email: 'Não informado',
      
      // Campos trabalhistas
      ultimaEmpresa: 'CRAS - Teste Produção',
      statusTrabalho: 'Com carteira assinada',
      recebeuDireitos: 'Sim, recebi tudo',
      problemasTrabalho: 'Nenhuma dessas',
      desejaConsultoria: 'Sim, quero receber orientação gratuita',
      
      experiencia: 'Última empresa: CRAS - Teste Produção. Status: Com carteira assinada. Recebeu direitos: Sim, recebi tudo',
      lgpdConsent: true,
      
      jobTitle: jobs.length > 0 ? jobs[0].title : 'Teste de Vaga',
      company: jobs.length > 0 ? (jobs[0].company?.name || jobs[0].company) : 'Empresa Teste',
      jobLink: jobs.length > 0 ? jobs[0].apply_url : 'https://teste.com',
      originalLocation: 'Brasil',
      
      source: 'Teste Produção - API Direta',
      type: 'job-application'
    };
    
    console.log('📤 Enviando lead para produção...');
    const submitResponse = await axios.post(`${prodURL}/api/submit-lead`, testLead, {
      timeout: 30000 // 30 segundos
    });
    
    console.log('✅ Lead enviado para produção!');
    console.log('📋 Resposta:', {
      success: submitResponse.data.success,
      leadId: submitResponse.data.leadId,
      status: submitResponse.status
    });
    
    // 3. Verificar se o lead aparece na listagem de produção
    console.log('\n3️⃣ Verificando leads em produção...');
    const leadsResponse = await axios.get(`${prodURL}/api/get-leads`, {
      timeout: 30000
    });
    
    if (leadsResponse.status === 200) {
      const leadsData = leadsResponse.data;
      const leads = leadsData.leads || [];
      
      console.log(`📊 Total de leads em produção: ${leads.length}`);
      
      const ourLead = leads.find(lead => 
        lead.nome?.includes('TESTE PRODUÇÃO') || 
        lead.nome?.includes('LEONARDO')
      );
      
      if (ourLead) {
        console.log('✅ Lead encontrado em produção!');
        console.log('📊 Campos disponíveis:', Object.keys(ourLead));
        console.log('📋 Dados do lead:');
        console.log(`   - Nome: ${ourLead.nome}`);
        console.log(`   - WhatsApp: ${ourLead.whatsapp}`);
        console.log(`   - Última Empresa: ${ourLead.ultimaEmpresa || 'NÃO DEFINIDO'}`);
        console.log(`   - Status Trabalho: ${ourLead.statusTrabalho || 'NÃO DEFINIDO'}`);
        console.log(`   - Recebeu Direitos: ${ourLead.recebeuDireitos || 'NÃO DEFINIDO'}`);
        console.log(`   - Problemas: ${ourLead.problemasTrabalho || 'NÃO DEFINIDO'}`);
        console.log(`   - Consultoria: ${ourLead.desejaConsultoria || 'NÃO DEFINIDO'}`);
        console.log(`   - Experiência: ${ourLead.experiencia}`);
        
        if (!ourLead.ultimaEmpresa) {
          console.log('❌ PROBLEMA: Campos trabalhistas não estão sendo salvos em produção!');
        } else {
          console.log('✅ Campos trabalhistas salvos corretamente em produção!');
        }
        
      } else {
        console.log('❌ Lead não encontrado em produção');
        if (leads.length > 0) {
          console.log('📋 Leads existentes:');
          leads.slice(0, 3).forEach((lead, i) => {
            console.log(`   ${i+1}. ${lead.nome} - ${lead.whatsapp || lead.telefone}`);
          });
        }
      }
    } else {
      console.log('❌ Erro ao buscar leads de produção');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO no teste de produção:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', error.response.data);
    }
  }
}

testProductionAPI();
