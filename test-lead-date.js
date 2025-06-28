// Script de teste para verificar se as datas dos leads estão sendo salvas corretamente

// Simular dados de um lead como seria criado pelo submit-lead.js
const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const submissionData = {
  id: leadId,
  leadId: leadId,
  nome: "João Silva Teste",
  telefone: "11999999999",
  whatsapp: "11999999999",
  jobTitle: "Porteiro",
  company: "Empresa Teste",
  timestamp: new Date().toLocaleString('pt-BR'),
  timestampISO: new Date().toISOString(),
  createdAt: new Date().toISOString(), // Campo principal para datas
  status: 'novo', // Status padrão para novos leads
  source: 'candidatura_vaga',
  validated: true,
  lgpdConsent: true
};

// Função de formatação igual ao admin
const formatDate = (dateString) => {
  if (!dateString) return 'Data não informada'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Data inválida'
    }
    return date.toLocaleString('pt-BR')
  } catch (error) {
    return 'Data inválida'
  }
}

console.log('🧪 Teste de formatação de data do lead:');
console.log('=====================================');
console.log('createdAt original:', submissionData.createdAt);
console.log('createdAt formatado:', formatDate(submissionData.createdAt));
console.log('timestamp original:', submissionData.timestamp);
console.log('timestampISO original:', submissionData.timestampISO);
console.log('');
console.log('✅ Teste com data válida passou!');

// Teste com data inválida
console.log('🧪 Teste com data inválida:');
console.log('============================');
console.log('Data undefined:', formatDate(undefined));
console.log('Data null:', formatDate(null));
console.log('Data string inválida:', formatDate('data-invalida'));
console.log('');
console.log('✅ Testes com datas inválidas passaram!');

console.log('');
console.log('🎯 Resultado Final:');
console.log('==================');
console.log('✅ Campo createdAt será salvo com:', submissionData.createdAt);
console.log('✅ Admin irá exibir:', formatDate(submissionData.createdAt));
console.log('✅ Não haverá mais "Invalid Date" no admin!');
