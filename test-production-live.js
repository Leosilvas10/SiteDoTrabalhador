const axios = require('axios');

async function testProductionEnvironment() {
  console.log('🌐 TESTE EM PRODUÇÃO (Vercel): Site do Trabalhador');
  console.log('='.repeat(70));
  
  const baseURL = 'https://site-do-trabalhador.vercel.app';
  
  try {
    // 1. Verificar se há vagas disponíveis em produção
    console.log('\n1️⃣ Verificando vagas disponíveis em produção...');
    const jobsResponse = await axios.get(`${baseURL}/api/fetch-home-jobs`);
    const jobs = jobsResponse.data.jobs || [];
    
    if (jobs.length === 0) {
      console.log('❌ Nenhuma vaga disponível para teste em produção');
      return;
    }
    
    console.log(`✅ ${jobs.length} vagas disponíveis em produção`);
    console.log(`📋 Primeira vaga: ${jobs[0].title} - ${jobs[0].company.name}`);
    
    // 2. Simular dados que seriam enviados pelo modal
    const selectedJob = jobs[0];
    
    console.log('\n2️⃣ Simulando candidatura em produção...');
    const modalData = {
      // Dados pessoais
      nome: 'TESTE PRODUÇÃO VERCEL',
      telefone: '11999999999',
      whatsapp: '11999999999',
      email: 'teste@produção.com',
      
      // Respostas da pesquisa trabalhista
      ultimaEmpresa: 'EMPRESA DE TESTE',
      statusTrabalho: 'Desempregado(a)', 
      recebeuDireitos: 'Não, tive problemas',
      problemasTrabalho: 'Férias não pagas',
      desejaConsultoria: 'Sim, quero receber orientação gratuita',
      
      // Campo experiência combinado
      experiencia: 'Última empresa: EMPRESA DE TESTE. Status: Desempregado(a). Recebeu direitos: Não, tive problemas. Problemas: Férias não pagas. Quer consultoria: Sim, quero receber orientação gratuita',
      
      // Consentimento LGPD
      lgpdConsent: true,
      
      // Dados da vaga selecionada
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company.name,
      
      // Dados adicionais
      timestamp: new Date().toISOString()
    };
    
    console.log('📝 Dados do formulário:');
    console.log(`   - Nome: ${modalData.nome}`);
    console.log(`   - WhatsApp: ${modalData.whatsapp}`);
    console.log(`   - Última Empresa: ${modalData.ultimaEmpresa}`);
    console.log(`   - Vaga: ${modalData.jobTitle}`);
    console.log(`   - Empresa: ${modalData.company}`);
    
    // 3. Enviar candidatura para produção
    console.log('\n3️⃣ Enviando candidatura para produção...');
    const submitResponse = await axios.post(`${baseURL}/api/submit-lead`, modalData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      },
      timeout: 30000 // 30 segundos de timeout
    });
    
    console.log('✅ Candidatura enviada com sucesso em produção!');
    console.log('📋 Resposta da API:');
    console.log(`   - Lead ID: ${submitResponse.data.id}`);
    console.log(`   - Status: ${submitResponse.status}`);
    console.log(`   - Message: ${submitResponse.data.message || 'N/A'}`);
    
    // 4. Aguardar um pouco antes de verificar (para dar tempo da persistência)
    console.log('\n⏳ Aguardando 3 segundos para persistência...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 5. Verificar se o lead aparece no painel admin em produção
    console.log('\n4️⃣ Verificando no painel admin em produção...');
    const leadsResponse = await axios.get(`${baseURL}/api/get-leads`, {
      timeout: 30000
    });
    
    const leads = leadsResponse.data.leads || [];
    console.log(`📊 Total de leads encontrados em produção: ${leads.length}`);
    
    // Procurar pelo lead que acabamos de criar
    const createdLead = leads.find(lead => lead.id === submitResponse.data.id);
    
    if (createdLead) {
      console.log('✅ Lead encontrado no painel admin em produção!');
      console.log('📊 Dados salvos:');
      console.log(`   - ID: ${createdLead.id}`);
      console.log(`   - Nome: ${createdLead.nome}`);
      console.log(`   - WhatsApp: ${createdLead.whatsapp}`);
      console.log(`   - Vaga: ${createdLead.jobTitle}`);
      console.log(`   - Empresa: ${createdLead.company}`);
      console.log(`   - Última Empresa: ${createdLead.ultimaEmpresa}`);
      console.log(`   - Status Trabalho: ${createdLead.statusTrabalho}`);
      console.log(`   - Tipo: ${createdLead.type}`);
      console.log(`   - Status: ${createdLead.status}`);
      console.log(`   - Data: ${createdLead.createdAt}`);
      
      // 6. Testar exclusão em produção
      console.log('\n5️⃣ Testando exclusão do lead em produção...');
      const deleteResponse = await axios.post(`${baseURL}/api/delete-lead`, {
        id: createdLead.id
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      if (deleteResponse.status === 200) {
        console.log('✅ Lead excluído com sucesso em produção!');
        
        // Verificar se realmente foi excluído
        const verifyResponse = await axios.get(`${baseURL}/api/get-leads`);
        const remainingLeads = verifyResponse.data.leads || [];
        const stillExists = remainingLeads.find(lead => lead.id === createdLead.id);
        
        if (!stillExists) {
          console.log('✅ Confirmado: Lead foi removido da lista');
        } else {
          console.log('❌ ERRO: Lead ainda aparece na lista após exclusão');
        }
      } else {
        console.log('❌ ERRO: Falha ao excluir lead em produção');
      }
      
    } else {
      console.log('❌ ERRO: Lead NÃO encontrado no painel admin em produção!');
      console.log('🔍 Analisando possíveis causas:');
      console.log('   - Persistência em memória pode ter falhado');
      console.log('   - Instância do Vercel pode ter reiniciado');
      console.log('   - Problema na detecção de ambiente de produção');
      
      // Mostrar alguns leads existentes para debug
      if (leads.length > 0) {
        console.log('\n📋 Leads existentes em produção:');
        leads.slice(0, 3).forEach((lead, index) => {
          console.log(`   ${index + 1}. ${lead.nome} - ${lead.jobTitle || 'N/A'} (${lead.id})`);
        });
      }
    }
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE EM PRODUÇÃO:');
    console.error(`   - Tipo: ${error.name}`);
    console.error(`   - Código: ${error.code || error.response?.status}`);
    console.error(`   - Mensagem: ${error.message}`);
    
    if (error.response) {
      console.error(`   - Status HTTP: ${error.response.status}`);
      console.error(`   - Dados: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('🎯 TESTE EM PRODUÇÃO CONCLUÍDO');
}

// Executar o teste
testProductionEnvironment();
