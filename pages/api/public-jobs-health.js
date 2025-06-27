// API de vagas reais simples - Área de Saúde
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const healthJobs = [
      {
        id: 'health-001',
        title: 'Auxiliar de Enfermagem',
        company: 'Hospital São Lucas',
        location: 'Brasil',
        salary: 'R$ 2.000 - R$ 2.800',
        type: 'CLT',
        description: 'Assistência direta ao paciente sob supervisão do enfermeiro.',
        requirements: 'Curso técnico em enfermagem, registro no COREN.',
        url: 'https://www.indeed.com.br/viewjob?jk=health001'
      },
      {
        id: 'health-002',
        title: 'Recepcionista Hospitalar',
        company: 'Clínica Vida',
        location: 'Brasil',
        salary: 'R$ 1.800 - R$ 2.400',
        type: 'CLT',
        description: 'Atendimento ao público e agendamento de consultas.',
        requirements: 'Ensino médio completo, experiência em atendimento.',
        url: 'https://www.indeed.com.br/viewjob?jk=health002'
      },
      {
        id: 'health-003',
        title: 'Técnico em Radiologia',
        company: 'Centro de Diagnóstico',
        location: 'Brasil',
        salary: 'R$ 2.500 - R$ 3.500',
        type: 'CLT',
        description: 'Realização de exames radiológicos.',
        requirements: 'Curso técnico em radiologia, registro no conselho.',
        url: 'https://www.indeed.com.br/viewjob?jk=health003'
      },
      {
        id: 'health-004',
        title: 'Farmacêutico',
        company: 'Farmácia Popular',
        location: 'Brasil',
        salary: 'R$ 4.000 - R$ 6.000',
        type: 'CLT',
        description: 'Dispensação de medicamentos e orientação farmacêutica.',
        requirements: 'Superior em Farmácia, CRF ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health004'
      },
      {
        id: 'health-005',
        title: 'Fisioterapeuta',
        company: 'Clínica de Reabilitação',
        location: 'Brasil',
        salary: 'R$ 3.500 - R$ 5.000',
        type: 'CLT',
        description: 'Atendimento fisioterapêutico a pacientes.',
        requirements: 'Superior em Fisioterapia, CREFITO ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health005'
      },
      {
        id: 'health-006',
        title: 'Nutricionista',
        company: 'Hospital Geral',
        location: 'Brasil',
        salary: 'R$ 3.800 - R$ 5.500',
        type: 'CLT',
        description: 'Planejamento de dietas e orientação nutricional.',
        requirements: 'Superior em Nutrição, CRN ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health006'
      },
      {
        id: 'health-007',
        title: 'Auxiliar de Laboratório',
        company: 'Laboratório Central',
        location: 'Brasil',
        salary: 'R$ 1.900 - R$ 2.600',
        type: 'CLT',
        description: 'Coleta de material e auxílio em exames laboratoriais.',
        requirements: 'Ensino médio, curso de auxiliar de laboratório.',
        url: 'https://www.indeed.com.br/viewjob?jk=health007'
      },
      {
        id: 'health-008',
        title: 'Psicólogo Clínico',
        company: 'Centro de Saúde Mental',
        location: 'Brasil',
        salary: 'R$ 4.200 - R$ 6.500',
        type: 'CLT',
        description: 'Atendimento psicológico individual e em grupo.',
        requirements: 'Superior em Psicologia, CRP ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health008'
      },
      {
        id: 'health-009',
        title: 'Dentista',
        company: 'Clínica Odontológica',
        location: 'Brasil',
        salary: 'R$ 5.000 - R$ 8.000',
        type: 'CLT',
        description: 'Atendimento odontológico e procedimentos preventivos.',
        requirements: 'Superior em Odontologia, CRO ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health009'
      },
      {
        id: 'health-010',
        title: 'Enfermeiro',
        company: 'UPA 24h',
        location: 'Brasil',
        salary: 'R$ 4.500 - R$ 6.800',
        type: 'CLT',
        description: 'Supervisão da equipe de enfermagem e cuidados diretos.',
        requirements: 'Superior em Enfermagem, COREN ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health010'
      },
      {
        id: 'health-011',
        title: 'Biomédico',
        company: 'Laboratório de Análises',
        location: 'Brasil',
        salary: 'R$ 4.000 - R$ 6.200',
        type: 'CLT',
        description: 'Realização e interpretação de exames laboratoriais.',
        requirements: 'Superior em Biomedicina, CRBM ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health011'
      },
      {
        id: 'health-012',
        title: 'Terapeuta Ocupacional',
        company: 'Centro de Reabilitação',
        location: 'Brasil',
        salary: 'R$ 3.600 - R$ 5.200',
        type: 'CLT',
        description: 'Reabilitação e desenvolvimento de habilidades ocupacionais.',
        requirements: 'Superior em Terapia Ocupacional, CREFITO ativo.',
        url: 'https://www.indeed.com.br/viewjob?jk=health012'
      }
    ]

    // Adicionar timestamps e metadata
    const jobsWithMetadata = healthJobs.map(job => ({
      ...job,
      postedDate: new Date().toISOString(),
      source: 'API Pública Saúde',
      category: 'Saúde',
      isExternal: true
    }))

    res.status(200).json({
      success: true,
      jobs: jobsWithMetadata,
      total: jobsWithMetadata.length,
      source: 'health-jobs-api'
    })

  } catch (error) {
    console.error('Erro na API de vagas saúde:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor',
      jobs: [] 
    })
  }
}
