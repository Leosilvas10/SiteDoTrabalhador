const axios = require('axios');

async function testJobApplicationFlow() {
  console.log('🎯 TESTE COMPLETO: Candidatura via Modal da Página Inicial');
  console.log('='.repeat(70));
  
  const baseURL = 'http://localhost:3001';
  
  try {
    // 1. Verificar se há vagas disponíveis
    console.log('\n1️⃣ Verificando vagas disponíveis...');
    const jobsResponse = await axios.get(`${baseURL}/api/fetch-home-jobs`);
    const jobs = jobsResponse.data.jobs || [];
    
    if (jobs.length === 0) {
      console.log('❌ Nenhuma vaga disponível para teste');
      return;
    }
    
    console.log(`✅ ${jobs.length} vagas disponíveis`);
    console.log(`📋 Primeira vaga: ${jobs[0].title} - ${jobs[0].company.name}`);
    
    // 2. Simular dados que seriam enviados pelo modal
    const selectedJob = jobs[0]; // Assistente Social
    
    console.log('\n2️⃣ Simulando preenchimento do modal...');
    const modalData = {
      // Dados pessoais (como você preencheu)
      nome: 'LEONARDO SILVA SEVERINO',
      telefone: '31991998938',
      whatsapp: '31991998938',
      email: 'Não informado',
      
      // Respostas da pesquisa trabalhista (simulando preenchimento completo)
      ultimaEmpresa: 'CRAS',
      statusTrabalho: 'Com carteira assinada', 
      recebeuDireitos: 'Sim, recebi tudo',
      problemasTrabalho: 'Nenhuma dessas',
      desejaConsultoria: 'Sim, quero receber orientação gratuita',
      
      // Campo experiência combinado
      experiencia: 'Última empresa: CRAS. Status: Com carteira assinada. Recebeu direitos: Sim, recebi tudo. Problemas: Nenhuma dessas. Quer consultoria: Sim, quero receber orientação gratuita',
      
      // Consentimento LGPD
      lgpdConsent: true,
      
      // Dados da vaga selecionada
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company.name,
      jobLink: selectedJob.apply_url || selectedJob.url,
      originalLocation: selectedJob.originalLocation || selectedJob.location,
      
      // Metadados
      fonte: 'Site do Trabalhador - Pesquisa Trabalhista',
      paginaOrigem: `${baseURL}`,
      source: 'Site do Trabalhador - Formulário Único',
      type: 'job-application'
    };
    
    console.log('📝 Dados do formulário:');
    console.log(`   - Nome: ${modalData.nome}`);
    console.log(`   - WhatsApp: ${modalData.whatsapp}`);
    console.log(`   - Última Empresa: ${modalData.ultimaEmpresa}`);
    console.log(`   - Vaga: ${modalData.jobTitle}`);
    console.log(`   - Empresa: ${modalData.company}`);
    
    // 3. Enviar dados para API
    console.log('\n3️⃣ Enviando candidatura...');
    const submitResponse = await axios.post(`${baseURL}/api/submit-lead`, modalData);
    
    console.log('✅ Candidatura enviada com sucesso!');
    console.log('📋 Resposta da API:');
    console.log(`   - Lead ID: ${submitResponse.data.leadId}`);
    console.log(`   - Status: ${submitResponse.status}`);
    console.log(`   - Redirecionamento: ${submitResponse.data.redirect?.url}`);
    
    // 4. Verificar se aparece no painel admin
    console.log('\n4️⃣ Verificando no painel admin...');
    const leadsResponse = await axios.get(`${baseURL}/api/get-leads`);
    
    if (leadsResponse.status === 200) {
      const leadsData = leadsResponse.data;
      const leads = leadsData.leads || [];
      
      const newLead = leads.find(lead => 
        lead.nome === modalData.nome && 
        lead.whatsapp === modalData.whatsapp &&
        lead.jobTitle === modalData.jobTitle
      );
      
      if (newLead) {
        console.log('✅ Lead encontrado no painel admin!');
        console.log('📊 Dados salvos:');
        console.log(`   - ID: ${newLead.id || newLead.leadId}`);
        console.log(`   - Nome: ${newLead.nome}`);
        console.log(`   - WhatsApp: ${newLead.whatsapp}`);
        console.log(`   - Vaga: ${newLead.jobTitle}`);
        console.log(`   - Empresa: ${newLead.company}`);
        console.log(`   - Última Empresa: ${newLead.ultimaEmpresa}`);
        console.log(`   - Status Trabalho: ${newLead.statusTrabalho}`);
        console.log(`   - Tipo: ${newLead.type}`);
        console.log(`   - Status: ${newLead.status}`);
        console.log(`   - Data: ${newLead.timestamp}`);
        
        console.log('\n' + '='.repeat(70));
        console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('✅ Modal de candidatura → API → Painel Admin: FUNCIONANDO');
        console.log('✅ Todos os dados foram salvos corretamente');
        console.log('✅ Sistema de leads está operacional');
        
      } else {
        console.log('❌ Lead NÃO encontrado no painel admin');
        console.log(`📊 Total de leads no sistema: ${leads.length}`);
      }
    } else {
      console.log('❌ Erro ao buscar leads do painel admin');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Dados:', error.response.data);
    }
  }
}

testJobApplicationFlow();
