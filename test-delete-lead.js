const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testDeleteLead() {
  console.log('🧪 === TESTE DE EXCLUSÃO DE LEAD ===\n');
  
  try {
    // 1. Primeiro, vamos listar os leads existentes
    console.log('1. 📋 Listando leads existentes...');
    const leadsResponse = await axios.get(`${BASE_URL}/api/get-leads`);
    const leads = leadsResponse.data.leads || [];
    
    console.log(`   Total de leads: ${leads.length}`);
    
    if (leads.length === 0) {
      console.log('   ⚠️  Nenhum lead encontrado. Criando um lead de teste...');
      
      // Criar um lead de teste
      const testLead = {
        nome: 'Teste Delete Lead',
        email: 'teste-delete@example.com',
        telefone: '11999999999',
        cargo: 'Desenvolvedor',
        empresa: 'Empresa Teste',
        experiencia: '2-5 anos',
        tipo: 'candidatura',
        origem: 'teste'
      };
      
      const createResponse = await axios.post(`${BASE_URL}/api/submit-lead`, testLead);
      console.log('   ✅ Lead de teste criado:', createResponse.data.leadId);
      
      // Listar novamente para pegar o ID
      const updatedLeadsResponse = await axios.get(`${BASE_URL}/api/get-leads`);
      const updatedLeads = updatedLeadsResponse.data.leads || [];
      
      if (updatedLeads.length > 0) {
        console.log(`   📋 Agora temos ${updatedLeads.length} lead(s)`);
        leads.push(...updatedLeads);
      }
    }
    
    if (leads.length > 0) {
      // Pegar o primeiro lead para testar a exclusão
      const leadToDelete = leads[0];
      const leadId = leadToDelete.id || leadToDelete.leadId;
      
      console.log(`\n2. 🗑️  Tentando excluir lead:`);
      console.log(`   ID: ${leadId}`);
      console.log(`   Nome: ${leadToDelete.nome}`);
      console.log(`   Email: ${leadToDelete.email}`);
      
      // 2. Tentar excluir o lead
      const deleteResponse = await axios.delete(`${BASE_URL}/api/delete-lead?id=${leadId}`);
      
      console.log('\n   ✅ Resposta da exclusão:');
      console.log('   Status:', deleteResponse.status);
      console.log('   Dados:', deleteResponse.data);
      
      // 3. Verificar se o lead foi realmente excluído
      console.log('\n3. 🔍 Verificando se o lead foi excluído...');
      const finalLeadsResponse = await axios.get(`${BASE_URL}/api/get-leads`);
      const finalLeads = finalLeadsResponse.data.leads || [];
      
      console.log(`   Total de leads após exclusão: ${finalLeads.length}`);
      
      // Verificar se o lead específico foi removido
      const leadStillExists = finalLeads.find(lead => 
        (lead.id === leadId || lead.leadId === leadId)
      );
      
      if (leadStillExists) {
        console.log('   ❌ ERRO: Lead ainda existe na base de dados!');
        console.log('   Lead encontrado:', leadStillExists);
      } else {
        console.log('   ✅ SUCCESS: Lead foi excluído com sucesso!');
      }
      
    } else {
      console.log('   ❌ Não foi possível criar um lead para teste');
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    
    if (error.response) {
      console.error('   Status da resposta:', error.response.status);
      console.error('   Dados da resposta:', error.response.data);
    }
  }
  
  console.log('\n🧪 === FIM DO TESTE ===');
}

// Executar o teste
testDeleteLead();
