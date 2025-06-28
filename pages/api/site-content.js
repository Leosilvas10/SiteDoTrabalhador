// API para gerenciar conteúdo global do site
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Retornar configuração atual do site
    const siteContent = {
      // Dados de contato globais
      global: {
        whatsapp: '(11) 99999-9999',
        email: 'contato@sitedotrabalhador.com.br',
        logoUrl: '/site-do-trabalhador.ico',
        siteName: 'Site do Trabalhador',
        siteDescription: 'Conectamos trabalhadores a empresas em todo o Brasil'
      },
      
      // Página inicial
      home: {
        heroTitle: 'Encontre sua próxima oportunidade',
        heroSubtitle: 'Conectamos trabalhadores a empresas em todo o Brasil',
        heroButtonText: 'Ver Vagas Disponíveis',
        
        aboutTitle: 'Sobre o Site do Trabalhador',
        aboutDescription: 'Plataforma dedicada a conectar trabalhadores e empresas, facilitando o encontro entre quem busca emprego e quem oferece oportunidades.',
        
        statsTitle: 'Nossos Números',
        statsVagas: 'Vagas Ativas',
        statsEmpresas: 'Empresas Parceiras',
        statsCandidatos: 'Candidatos Cadastrados',
        
        ctaTitle: 'Pronto para encontrar sua vaga?',
        ctaDescription: 'Cadastre-se agora e receba oportunidades direto no seu WhatsApp',
        ctaButtonText: 'Buscar Vagas Agora'
      },
      
      // Página de vagas
      vagas: {
        pageTitle: 'Vagas Disponíveis',
        pageDescription: 'Encontre as melhores oportunidades de emprego em todo o Brasil',
        filterTitle: 'Filtrar Vagas',
        noJobsMessage: 'Nenhuma vaga encontrada com os filtros selecionados',
        applyButtonText: 'Candidatar-se',
        loadMoreText: 'Carregar Mais Vagas'
      },
      
      // Página de empresas
      empresas: {
        pageTitle: 'Para Empresas e Famílias',
        pageSubtitle: 'Encontre os melhores profissionais para sua empresa ou residência',
        
        benefitsTitle: 'Benefícios para sua Empresa',
        benefit1Title: 'Candidatos Qualificados',
        benefit1Description: 'Acesso a uma base de candidatos pré-selecionados e qualificados.',
        benefit2Title: 'Processo Simplificado',
        benefit2Description: 'Sistema fácil de usar para publicar vagas e gerenciar candidaturas.',
        benefit3Title: 'Suporte Especializado',
        benefit3Description: 'Nossa equipe te ajuda em todo o processo de recrutamento.',
        
        stepsTitle: 'Como Funciona',
        step1Title: 'Publique sua Vaga',
        step1Description: 'Descreva a posição e os requisitos necessários.',
        step2Title: 'Receba Candidatos',
        step2Description: 'Candidatos qualificados se inscrevem automaticamente.',
        step3Title: 'Contrate o Melhor',
        step3Description: 'Escolha o profissional ideal para sua empresa.',
        
        ctaTitle: 'Pronto para Contratar?',
        ctaDescription: 'Publique sua primeira vaga gratuitamente e encontre o profissional ideal.',
        ctaButtonText: 'Publicar Vaga Gratuita',
        
        faqTitle: 'Perguntas Frequentes',
        faq1Question: 'Quanto custa publicar uma vaga?',
        faq1Answer: 'A primeira vaga é gratuita! Para vagas adicionais, consulte nossos planos.',
        faq2Question: 'Como funciona o processo de seleção?',
        faq2Answer: 'Você recebe os currículos dos candidatos e pode entrar em contato diretamente.',
        faq3Question: 'Posso publicar vagas para trabalho doméstico?',
        faq3Answer: 'Sim! Atendemos tanto empresas quanto famílias que buscam profissionais domésticos.'
      },
      
      // Footer global
      footer: {
        description: 'Conectamos trabalhadores a empresas em todo o Brasil. Encontre sua próxima oportunidade ou o profissional ideal.',
        quickLinksTitle: 'Links Rápidos',
        contactTitle: 'Contato',
        followTitle: 'Siga-nos',
        copyrightText: '© 2025 Site do Trabalhador. Todos os direitos reservados.',
        
        // Links
        homeLink: 'Início',
        vagasLink: 'Vagas',
        empresasLink: 'Para Empresas',
        contatoLink: 'Contato',
        privacidadeLink: 'Política de Privacidade',
        termosLink: 'Termos de Uso'
      }
    }
    
    res.status(200).json(siteContent)
  } else if (req.method === 'POST') {
    // Atualizar conteúdo do site
    const { section, content } = req.body
    
    // Aqui você implementaria a lógica de salvar no banco de dados
    // Por enquanto, vamos simular sucesso
    
    console.log('Atualizando seção:', section)
    console.log('Novo conteúdo:', content)
    
    res.status(200).json({ 
      success: true, 
      message: 'Conteúdo atualizado com sucesso!' 
    })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
