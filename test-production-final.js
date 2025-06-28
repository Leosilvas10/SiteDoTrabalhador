const axios = require('axios');

async function testProductionAfterFix() {
  console.log('🔧 TESTE PÓS-CORREÇÃO EM PRODUÇÃO');
  console.log('='.repeat(50));
  
  const prodURL = 'https://sitedotrabalhador.com.br';
  
  // Aguardar deploy (2 minutos)
  console.log('⏳ Aguardando deploy no Vercel (120 segundos)...');
  await new Promise(resolve => setTimeout(resolve, 120000));
  
  try {
    console.log('\n🧪 Testando envio de lead com TODOS os campos trabalhistas...');
    
    const leadCompleto = {
      // Dados pessoais
      nome: 'LEONARDO SILVA SEVERINO - TESTE FINAL',
      telefone: '31991998938',
      whatsapp: '31991998938',
      email: 'leonardo.teste@email.com',
      
      // TODOS os campos trabalhistas do formulário
      ultimaEmpresa: 'CRAS - Centro de Referência',
      statusTrabalho: 'Com carteira assinada',
      recebeuDireitos: 'Sim, recebi tudo',
      problemasTrabalho: 'Nenhuma dessas',
      desejaConsultoria: 'Sim, quero receber orientação gratuita',
      
      // Campo experiência combinado
      experiencia: 'Última empresa: CRAS - Centro de Referência. Status: Com carteira assinada. Recebeu direitos: Sim, recebi tudo. Problemas: Nenhuma dessas. Quer consultoria: Sim, quero receber orientação gratuita',
      
      // Dados da vaga
      jobTitle: 'Assistente Social',
      company: 'CRAS - Centro de Referência',
      jobLink: 'https://example.com/assistente-social',
      originalLocation: 'Brasil',
      
      // Metadados
      lgpdConsent: true,
      source: 'Teste Final - Produção',
      type: 'job-application',
      fonte: 'Site do Trabalhador - Pesquisa Trabalhista'
    };
    
    console.log('📤 Enviando lead completo para produção...');
    const submitResponse = await axios.post(`${prodURL}/api/submit-lead`, leadCompleto, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Lead enviado! Resposta:');
    console.log(`   - Status: ${submitResponse.status}`);
    console.log(`   - Success: ${submitResponse.data.success}`);
    console.log(`   - Lead ID: ${submitResponse.data.leadId}`);
    
    // Aguardar um pouco para garantir que foi processado
    console.log('\n⏳ Aguardando processamento (5 segundos)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar se aparece na listagem
    console.log('\n🔍 Buscando leads em produção...');
    const leadsResponse = await axios.get(`${prodURL}/api/get-leads`, {
      timeout: 30000
    });
    
    if (leadsResponse.status === 200) {
      const leadsData = leadsResponse.data;
      const leads = leadsData.leads || [];
      
      console.log(`📊 Total de leads em produção: ${leads.length}`);
      
      // Procurar nosso lead
      const ourLead = leads.find(lead => 
        lead.nome?.includes('LEONARDO SILVA SEVERINO') ||
        lead.nome?.includes('TESTE FINAL')
      );
      
      if (ourLead) {
        console.log('\n🎉 SUCESSO! Lead encontrado em produção!');
        console.log('📋 Dados completos do lead:');
        console.log(`   ✅ Nome: ${ourLead.nome}`);
        console.log(`   ✅ WhatsApp: ${ourLead.whatsapp}`);
        console.log(`   ✅ Email: ${ourLead.email}`);
        console.log(`   ✅ Última Empresa: ${ourLead.ultimaEmpresa || '❌ FALTANDO'}`);
        console.log(`   ✅ Status Trabalho: ${ourLead.statusTrabalho || '❌ FALTANDO'}`);
        console.log(`   ✅ Recebeu Direitos: ${ourLead.recebeuDireitos || '❌ FALTANDO'}`);
        console.log(`   ✅ Problemas: ${ourLead.problemasTrabalho || '❌ FALTANDO'}`);
        console.log(`   ✅ Consultoria: ${ourLead.desejaConsultoria || '❌ FALTANDO'}`);
        console.log(`   ✅ Vaga: ${ourLead.jobTitle}`);
        console.log(`   ✅ Empresa: ${ourLead.company}`);
        console.log(`   ✅ Tipo: ${ourLead.type}`);
        console.log(`   ✅ Status: ${ourLead.status}`);
        console.log(`   ✅ Data: ${ourLead.timestamp}`);
        
        // Verificar se todos os campos trabalhistas estão presentes
        const camposObrigatorios = [
          'ultimaEmpresa', 'statusTrabalho', 'recebeuDireitos', 
          'problemasTrabalho', 'desejaConsultoria'
        ];
        
        const camposFaltando = camposObrigatorios.filter(campo => 
          !ourLead[campo] || ourLead[campo] === 'undefined'
        );
        
        if (camposFaltando.length === 0) {
          console.log('\n🎉🎉🎉 PERFEITO! TODOS OS CAMPOS TRABALHISTAS SALVOS!');
          console.log('✅ Sistema de leads funcionando 100% em produção!');
        } else {
          console.log('\n⚠️ Campos faltando:', camposFaltando.join(', '));
        }
        
      } else {
        console.log('\n❌ Lead não encontrado em produção');
        console.log('📋 Leads existentes:');
        leads.slice(0, 5).forEach((lead, i) => {
          console.log(`   ${i+1}. ${lead.nome} - ${lead.whatsapp || lead.telefone}`);
        });
      }
    } else {
      console.log('❌ Erro ao buscar leads de produção');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testProductionAfterFix();
