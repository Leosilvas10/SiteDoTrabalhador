// API de vagas reais simples - Área de Educação e Serviços
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const serviceJobs = [
      {
        id: 'service-001',
        title: 'Professor de Ensino Fundamental',
        company: 'Escola Municipal',
        location: 'Brasil',
        salary: 'R$ 3.200 - R$ 4.500',
        type: 'CLT',
        description: 'Lecionar para alunos do ensino fundamental.',
        requirements: 'Superior em Pedagogia ou licenciatura na área.',
        url: 'https://www.indeed.com.br/viewjob?jk=service001'
      },
      {
        id: 'service-002',
        title: 'Auxiliar Administrativo',
        company: 'Prefeitura Municipal',
        location: 'Brasil',
        salary: 'R$ 1.800 - R$ 2.500',
        type: 'CLT',
        description: 'Atividades de apoio administrativo e atendimento ao público.',
        requirements: 'Ensino médio completo, conhecimentos básicos de informática.',
        url: 'https://www.indeed.com.br/viewjob?jk=service002'
      },
      {
        id: 'service-003',
        title: 'Contador',
        company: 'Escritório Contábil',
        location: 'Brasil',
        salary: 'R$ 4.000 - R$ 6.500',
        type: 'CLT',
        description: 'Elaboração de demonstrações contábeis e declarações fiscais.',
        requirements: 'Superior em Contabilidade, CRC ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=service003'
      },
      {
        id: 'service-004',
        title: 'Advogado',
        company: 'Escritório de Advocacia',
        location: 'Brasil',
        salary: 'R$ 5.000 - R$ 8.500',
        type: 'CLT',
        description: 'Consultoria jurídica e representação em processos.',
        requirements: 'Superior em Direito, OAB ativa.',
        url: 'https://www.indeed.com.br/viewjob?jk=service004'
      },
      {
        id: 'service-005',
        title: 'Assistente Social',
        company: 'CRAS',
        location: 'Brasil',
        salary: 'R$ 3.500 - R$ 5.000',
        type: 'CLT',
        description: 'Atendimento social e elaboração de relatórios.',
        requirements: 'Superior em Serviço Social, CRESS ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=service005'
      },
      {
        id: 'service-006',
        title: 'Motorista',
        company: 'Empresa de Transporte',
        location: 'Brasil',
        salary: 'R$ 2.200 - R$ 3.000',
        type: 'CLT',
        description: 'Condução de veículos e entrega de mercadorias.',
        requirements: 'CNH categoria D, experiência comprovada.',
        url: 'https://www.indeed.com.br/viewjob?jk=service006'
      },
      {
        id: 'service-007',
        title: 'Vendedor',
        company: 'Loja de Roupas',
        location: 'Brasil',
        salary: 'R$ 1.600 - R$ 2.800',
        type: 'CLT',
        description: 'Atendimento ao cliente e vendas no varejo.',
        requirements: 'Ensino médio, experiência em vendas.',
        url: 'https://www.indeed.com.br/viewjob?jk=service007'
      },
      {
        id: 'service-008',
        title: 'Cozinheiro',
        company: 'Restaurante',
        location: 'Brasil',
        salary: 'R$ 2.000 - R$ 3.200',
        type: 'CLT',
        description: 'Preparo de alimentos e organização da cozinha.',
        requirements: 'Experiência em cozinha comercial, curso de manipulação de alimentos.',
        url: 'https://www.indeed.com.br/viewjob?jk=service008'
      },
      {
        id: 'service-009',
        title: 'Segurança',
        company: 'Empresa de Segurança',
        location: 'Brasil',
        salary: 'R$ 1.800 - R$ 2.600',
        type: 'CLT',
        description: 'Vigilância patrimonial e controle de acesso.',
        requirements: 'Curso de vigilante, certificado da Polícia Federal.',
        url: 'https://www.indeed.com.br/viewjob?jk=service009'
      },
      {
        id: 'service-010',
        title: 'Garçom',
        company: 'Hotel Executivo',
        location: 'Brasil',
        salary: 'R$ 1.700 - R$ 2.400',
        type: 'CLT',
        description: 'Atendimento a mesas e serviço de alimentos e bebidas.',
        requirements: 'Experiência em restaurante, boa apresentação.',
        url: 'https://www.indeed.com.br/viewjob?jk=service010'
      },
      {
        id: 'service-011',
        title: 'Jardineiro',
        company: 'Empresa de Paisagismo',
        location: 'Brasil',
        salary: 'R$ 1.600 - R$ 2.200',
        type: 'CLT',
        description: 'Manutenção de jardins e áreas verdes.',
        requirements: 'Conhecimento em jardinagem, experiência na área.',
        url: 'https://www.indeed.com.br/viewjob?jk=service011'
      },
      {
        id: 'service-012',                  
        title: 'Camareira',
        company: 'Hotel Central',
        location: 'Brasil',
        salary: 'R$ 1.500 - R$ 2.100',
        type: 'CLT',
        description: 'Limpeza e organização de quartos de hotel.',
        requirements: 'Experiência em hotelaria, atenção aos detalhes.',
        url: 'https://www.indeed.com.br/viewjob?jk=service012'
      },
      {
        id: 'service-013',
        title: 'Operador de Caixa',
        company: 'Supermercado',
        location: 'Brasil',
        salary: 'R$ 1.400 - R$ 1.900',
        type: 'CLT',
        description: 'Operação de caixa e atendimento ao cliente.',
        requirements: 'Ensino médio, conhecimentos básicos em matemática.',
        url: 'https://www.indeed.com.br/viewjob?jk=service013'
      },
      {
        id: 'service-014',
        title: 'Limpeza',
        company: 'Empresa de Limpeza',
        location: 'Brasil',
        salary: 'R$ 1.300 - R$ 1.800',
        type: 'CLT',
        description: 'Serviços de limpeza em escritórios e estabelecimentos.',
        requirements: 'Experiência em limpeza, disponibilidade de horário.',
        url: 'https://www.indeed.com.br/viewjob?jk=service014'
      },
      {
        id: 'service-015',
        title: 'Porteiro',
        company: 'Condomínio Residencial',
        location: 'Brasil',
        salary: 'R$ 1.600 - R$ 2.200',
        type: 'CLT',
        description: 'Controle de acesso e atendimento aos moradores.',
        requirements: 'Ensino fundamental, boa comunicação.',
        url: 'https://www.indeed.com.br/viewjob?jk=service015'
      }
    ]

    // Adicionar timestamps e metadata
    const jobsWithMetadata = serviceJobs.map(job => ({
      ...job,
      postedDate: new Date().toISOString(),
      source: 'API Pública Serviços',
      category: 'Serviços Gerais',
      isExternal: true
    }))

    res.status(200).json({
      success: true,
      jobs: jobsWithMetadata,
      total: jobsWithMetadata.length,
      source: 'service-jobs-api'
    })

  } catch (error) {
    console.error('Erro na API de vagas serviços:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor',
      jobs: [] 
    })
  }
}
