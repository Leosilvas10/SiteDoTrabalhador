
// API para fazer scraping de vagas do HelperPlace
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Simulação de scraping do HelperPlace
    // Em produção, você poderia usar puppeteer ou cheerio para scraping real
    const scrapedJobs = [
      {
        id: 'helper_scrape_1',
        title: 'Empregada Doméstica - Zona Sul',
        company: {
          name: 'Residência Particular',
          logo: '/lodo.png'
        },
        location: 'São Paulo, SP - Zona Sul',
        salary: 'R$ 1.800 - R$ 2.200',
        type: 'Full-time',
        description: 'Procuramos empregada doméstica com experiência para casa na zona sul. Responsabilidades incluem limpeza geral, organização e cuidados básicos com roupas.',
        tags: 'doméstica, limpeza, zona sul',
        start: new Date().toLocaleDateString("pt-BR"),
        category: 'Serviços Domésticos',
        url: 'https://www.helperplace.com/empregada-domestica-zona-sul',
        source: 'HelperPlace (Scraping)'
      },
      {
        id: 'helper_scrape_2',
        title: 'Cuidador de Idoso - Período Integral',
        company: {
          name: 'Casa de Repouso Premium',
          logo: '/lodo.png'
        },
        location: 'Rio de Janeiro, RJ',
        salary: 'R$ 2.000 - R$ 2.800',
        type: 'Full-time',
        description: 'Vaga para cuidador(a) de idoso com experiência comprovada. Necessário curso técnico e disponibilidade para plantões.',
        tags: 'cuidador, idoso, plantão',
        start: new Date().toLocaleDateString("pt-BR"),
        category: 'Cuidados',
        url: 'https://www.helperplace.com/cuidador-idoso-rj',
        source: 'HelperPlace (Scraping)'
      },
      {
        id: 'helper_scrape_3',
        title: 'Babá com Inglês - Família Executiva',
        company: {
          name: 'Família Internacional',
          logo: '/lodo.png'
        },
        location: 'Brasília, DF',
        salary: 'R$ 2.500 - R$ 3.500',
        type: 'Full-time',
        description: 'Babá para cuidar de crianças de 5 e 8 anos. Necessário inglês fluente e experiência com educação infantil.',
        tags: 'babá, inglês, educação',
        start: new Date().toLocaleDateString("pt-BR"),
        category: 'Cuidados',
        url: 'https://www.helperplace.com/baba-ingles-df',
        source: 'HelperPlace (Scraping)'
      }
    ];

    res.status(200).json({
      success: true,
      data: scrapedJobs,
      total: scrapedJobs.length,
      source: 'HelperPlace Scraping'
    });

  } catch (error) {
    console.error('Erro no scraping do HelperPlace:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer scraping das vagas'
    });
  }
}
