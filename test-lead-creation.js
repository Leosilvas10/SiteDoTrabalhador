// Teste simples para verificar criação de leads
const axios = require('axios')

async function testLeadCreation() {
  try {
    console.log('🧪 Testando criação de lead...')
    
    const leadData = {
      nome: 'Teste Usuario',
      email: 'teste@email.com',
      telefone: '(11) 99999-9999',
      whatsapp: '(11) 99999-9999',
      jobTitle: 'Teste de Vaga',
      company: 'Empresa Teste',
      jobLink: 'https://example.com',
      originalLocation: 'São Paulo, SP',
      lgpdConsent: true,
      source: 'Teste Automatizado'
    }

    const response = await axios.post('http://localhost:3002/api/submit-lead', leadData)
    
    console.log('✅ Lead criado com sucesso!')
    console.log('📊 Resposta:', response.data)
    
    return response.data.leadId
  } catch (error) {
    console.error('❌ Erro ao criar lead:', error.response?.data || error.message)
    return null
  }
}

async function testGetLeads() {
  try {
    console.log('🧪 Testando busca de leads...')
    
    const response = await axios.get('http://localhost:3002/api/get-leads')
    
    console.log('✅ Leads encontrados!')
    console.log('📊 Total:', response.data.total)
    console.log('📋 Últimos 3 leads:', response.data.leads.slice(-3).map(l => ({
      id: l.id,
      nome: l.nome,
      timestamp: l.timestamp
    })))
    
    return response.data.leads
  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error.response?.data || error.message)
    return []
  }
}

async function testDeleteLead(leadId) {
  try {
    console.log('🧪 Testando exclusão de lead:', leadId)
    
    const response = await axios.delete(`http://localhost:3002/api/delete-lead?id=${leadId}`)
    
    console.log('✅ Lead excluído com sucesso!')
    console.log('📊 Resposta:', response.data)
    
    return true
  } catch (error) {
    console.error('❌ Erro ao excluir lead:', error.response?.data || error.message)
    return false
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes do sistema de leads...\n')
  
  // Teste 1: Criar lead
  const leadId = await testLeadCreation()
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Teste 2: Buscar leads
  const leads = await testGetLeads()
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Teste 3: Excluir lead (se foi criado)
  if (leadId) {
    await testDeleteLead(leadId)
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Verificar se foi excluído
    console.log('🧪 Verificando se lead foi excluído...')
    await testGetLeads()
  }
  
  console.log('\n✅ Testes concluídos!')
}

// Executar testes
runTests().catch(console.error)
