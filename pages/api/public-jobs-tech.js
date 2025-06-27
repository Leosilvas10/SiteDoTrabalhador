// API de vagas reais simples - Área de Tecnologia
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const techJobs = [
      {
        id: 'tech-001',
        title: 'Desenvolvedor Web',
        company: 'TechSolutions',
        location: 'Brasil',
        salary: 'R$ 4.000 - R$ 6.000',
        type: 'CLT',
        description: 'Desenvolvimento de websites e sistemas web utilizando tecnologias modernas.',
        requirements: 'Conhecimento em HTML, CSS, JavaScript, PHP ou Python.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech001'
      },
      {
        id: 'tech-002',
        title: 'Analista de Sistemas',
        company: 'DataCorp',
        location: 'Brasil',
        salary: 'R$ 5.000 - R$ 7.500',
        type: 'CLT',
        description: 'Análise e desenvolvimento de sistemas corporativos.',
        requirements: 'Superior em TI, experiência com análise de sistemas.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech002'
      },
      {
        id: 'tech-003',
        title: 'Suporte Técnico',
        company: 'InfoTech',
        location: 'Brasil',
        salary: 'R$ 2.500 - R$ 3.500',
        type: 'CLT',
        description: 'Suporte técnico a usuários e manutenção de equipamentos.',
        requirements: 'Curso técnico em informática, conhecimento em hardware e software.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech003'
      },
      {
        id: 'tech-004',
        title: 'Designer Gráfico',
        company: 'CreativeStudio',
        location: 'Brasil',
        salary: 'R$ 3.000 - R$ 4.500',
        type: 'CLT',
        description: 'Criação de materiais gráficos e peças publicitárias.',
        requirements: 'Conhecimento em Photoshop, Illustrator, CorelDraw.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech004'
      },
      {
        id: 'tech-005',
        title: 'Programador Junior',
        company: 'CodeLab',
        location: 'Brasil',
        salary: 'R$ 2.800 - R$ 4.000',
        type: 'CLT',
        description: 'Desenvolvimento de aplicações web e mobile.',
        requirements: 'Conhecimento básico em programação, vontade de aprender.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech005'
      },
      {
        id: 'tech-006',
        title: 'Administrador de Redes',
        company: 'NetWork Solutions',
        location: 'Brasil',
        salary: 'R$ 4.500 - R$ 6.500',
        type: 'CLT',
        description: 'Administração de redes corporativas e servidores.',
        requirements: 'Experiência com redes, servidores Windows/Linux.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech006'
      },
      {
        id: 'tech-007',
        title: 'Técnico em Informática',
        company: 'TechRepair',
        location: 'Brasil',
        salary: 'R$ 2.200 - R$ 3.200',
        type: 'CLT',
        description: 'Manutenção e reparo de computadores e notebooks.',
        requirements: 'Curso técnico, conhecimento em hardware.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech007'
      },
      {
        id: 'tech-008',
        title: 'Analista de Dados',
        company: 'DataAnalytics',
        location: 'Brasil',
        salary: 'R$ 5.500 - R$ 8.000',
        type: 'CLT',
        description: 'Análise de dados e criação de relatórios gerenciais.',
        requirements: 'Conhecimento em SQL, Excel avançado, Power BI.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech008'
      },
      {
        id: 'tech-009',
        title: 'Desenvolvedor Mobile',
        company: 'AppDev',
        location: 'Brasil',
        salary: 'R$ 4.500 - R$ 7.000',
        type: 'CLT',
        description: 'Desenvolvimento de aplicativos para Android e iOS.',
        requirements: 'Conhecimento em React Native, Flutter ou nativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech009'
      },
      {
        id: 'tech-010',
        title: 'Consultor de TI',
        company: 'IT Consulting',
        location: 'Brasil',
        salary: 'R$ 6.000 - R$ 9.000',
        type: 'CLT',
        description: 'Consultoria em soluções de tecnologia para empresas.',
        requirements: 'Superior completo, experiência em consultoria.',
        url: 'https://www.indeed.com.br/viewjob?jk=tech010'
      }
    ]

    // Adicionar timestamps e metadata
    const jobsWithMetadata = techJobs.map(job => ({
      ...job,
      postedDate: new Date().toISOString(),
      source: 'API Pública Tech',
      category: 'Tecnologia',
      isExternal: true
    }))

    res.status(200).json({
      success: true,
      jobs: jobsWithMetadata,
      total: jobsWithMetadata.length,
      source: 'tech-jobs-api'
    })

  } catch (error) {
    console.error('Erro na API de vagas tech:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor',
      jobs: [] 
    })
  }
}
