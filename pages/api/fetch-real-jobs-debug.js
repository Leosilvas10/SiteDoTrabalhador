// API de teste simples para debug
export default function handler(req, res) {
  console.log('🔍 DEBUG: API chamada recebida');
  console.log('🔍 DEBUG: Método:', req.method);
  console.log('🔍 DEBUG: URL:', req.url);
  
  if (req.method !== 'GET') {
    console.log('❌ DEBUG: Método não permitido');
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    // Dados de teste simples
    const testJobs = [
      {
        id: 'test-1',
        title: 'Auxiliar de Limpeza',
        company: 'Empresa Teste',
        location: 'São Paulo, SP',
        salary: 'R$ 1.500,00',
        type: 'CLT',
        description: 'Vaga de teste para auxiliar de limpeza',
        datePosted: new Date().toISOString(),
        tags: ['limpeza', 'clt'],
        category: 'Limpeza'
      },
      {
        id: 'test-2',
        title: 'Porteiro',
        company: 'Condomínio ABC',
        location: 'Rio de Janeiro, RJ',
        salary: 'R$ 1.800,00',
        type: 'CLT',
        description: 'Vaga para porteiro em condomínio',
        datePosted: new Date().toISOString(),
        tags: ['portaria', 'segurança'],
        category: 'Segurança'
      },
      {
        id: 'test-3',
        title: 'Atendente de Lanchonete',
        company: 'Lanchonete do João',
        location: 'Belo Horizonte, MG',
        salary: 'R$ 1.400,00',
        type: 'CLT',
        description: 'Atendente para lanchonete',
        datePosted: new Date().toISOString(),
        tags: ['atendimento', 'alimentação'],
        category: 'Alimentação'
      }
    ];

    console.log('✅ DEBUG: Retornando', testJobs.length, 'vagas de teste');

    return res.status(200).json({
      success: true,
      message: `${testJobs.length} vagas de teste carregadas`,
      jobs: testJobs,
      meta: {
        total: testJobs.length,
        sources: ['Teste'],
        cached: false,
        lastUpdate: new Date().toISOString(),
        debug: true
      }
    });

  } catch (error) {
    console.error('❌ DEBUG: Erro na API:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
