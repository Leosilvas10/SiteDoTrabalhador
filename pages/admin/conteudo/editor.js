import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'
import { useJobStats, useJobFormatting } from '../../../src/hooks/useJobStats'

const AdminContentEditor = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(false)
  const [showRealStats, setShowRealStats] = useState(false)
  
  // Hook para estatísticas reais das vagas
  const { stats: jobStats, loading: statsLoading, error: statsError, refresh: refreshStats } = useJobStats()
  const { formatJobCount, formatCategoryCount } = useJobFormatting()
  const [contents, setContents] = useState({
    home: {
      // Meta Tags
      metaTitle: 'Site do Trabalhador - Encontre Sua Próxima Oportunidade de Emprego',
      metaDescription: 'Conectamos trabalhadores a empresas em todo o Brasil. Encontre vagas de emprego, calcule seus direitos trabalhistas e impulsione sua carreira.',
      metaKeywords: 'emprego, trabalho, vagas, oportunidades, carreira, Brasil, direitos trabalhistas',
      
      // Hero Section
      heroTitle: 'Encontre sua próxima oportunidade',
      heroSubtitle: 'Conectamos trabalhadores a empresas em todo o Brasil',
      heroDescription: 'Sua carreira começa aqui! Descubra vagas de emprego em todo o Brasil e encontre a oportunidade perfeita para o seu perfil.',
      heroCta1: 'Ver Vagas Disponíveis',
      heroCta2: 'Calculadora Trabalhista',
      heroBeneficio1: 'Milhares de vagas atualizadas',
      heroBeneficio2: 'Totalmente gratuito',
      heroBeneficio3: 'Suporte especializado',
      
      // Stats Section
      statsTitle: 'Nossos Números',
      statsSubtitle: 'Resultados que comprovam nossa eficiência',
      stat1Numero: '50.000+',
      stat1Texto: 'Vagas Publicadas',
      stat2Numero: '25.000+',
      stat2Texto: 'Candidatos Ativos',
      stat3Numero: '1.200+',
      stat3Texto: 'Empresas Parceiras',
      stat4Numero: '95%',
      stat4Texto: 'Taxa de Satisfação',
      
      // Sobre Section  
      aboutTitle: 'Sobre o Site do Trabalhador',
      aboutText: 'Plataforma dedicada a conectar trabalhadores e empresas.',
      aboutDescription: 'Somos uma plataforma completa que conecta trabalhadores qualificados às melhores oportunidades de emprego em todo o Brasil.',
      aboutMissao: 'Nossa missão é democratizar o acesso ao mercado de trabalho, oferecendo ferramentas gratuitas e de qualidade para candidatos e empresas.',
      aboutVisao: 'Ser a principal plataforma de empregos do Brasil, reconhecida pela qualidade e eficiência.',
      aboutValores: 'Transparência, inovação, inclusão e compromisso com o sucesso profissional de nossos usuários.',
      
      // Categorias Populares
      categoriasTitle: 'Categorias Mais Procuradas',
      categoriasSubtitle: 'Explore as áreas com mais oportunidades',
      categoria1: 'Serviços Domésticos',
      categoria2: 'Segurança e Portaria',
      categoria3: 'Cuidados e Saúde',
      categoria4: 'Limpeza e Conservação',
      categoria5: 'Transporte e Logística',
      categoria6: 'Vendas e Atendimento',
      categoria7: 'Construção Civil',
      categoria8: 'Alimentação',
      
      // Serviços
      servicosTitle: 'Nossos Serviços',
      servicosDescription: 'Oferecemos uma gama completa de serviços para candidatos e empresas',
      servico1Titulo: 'Busca de Vagas',
      servico1Texto: 'Encontre a vaga ideal com nossos filtros avançados',
      servico2Titulo: 'Calculadora Trabalhista',
      servico2Texto: 'Calcule seus direitos trabalhistas gratuitamente',
      servico3Titulo: 'Publicação de Vagas',
      servico3Texto: 'Empresas podem publicar vagas gratuitamente',
      servico4Titulo: 'Dicas de Carreira',
      servico4Texto: 'Conteúdo especializado para seu crescimento profissional',
      
      // Depoimentos
      depoimentosTitle: 'O Que Nossos Usuários Dizem',
      depoimentosSubtitle: 'Histórias reais de sucesso profissional',
      depoimento1Nome: 'Maria Silva',
      depoimento1Cargo: 'Auxiliar de Limpeza',
      depoimento1Texto: 'Consegui meu emprego atual através do Site do Trabalhador. A plataforma é muito fácil de usar!',
      depoimento2Nome: 'João Santos',
      depoimento2Cargo: 'Porteiro',
      depoimento2Texto: 'Excelente plataforma! Encontrei várias oportunidades na minha área.',
      depoimento3Nome: 'Ana Costa',
      depoimento3Cargo: 'Cuidadora',
      depoimento3Texto: 'A calculadora trabalhista me ajudou muito a entender meus direitos.',
      
      // Como Funciona
      comoFuncionaTitle: 'Como Funciona?',
      comoFuncionaSubtitle: 'Simples e rápido em 3 passos',
      passo1Titulo: 'Busque Vagas',
      passo1Texto: 'Use nossos filtros para encontrar oportunidades ideais',
      passo2Titulo: 'Candidate-se',
      passo2Texto: 'Envie seus dados diretamente para as empresas',
      passo3Titulo: 'Seja Contratado',
      passo3Texto: 'Receba contato das empresas interessadas',
      
      // FAQ
      faqTitle: 'Perguntas Frequentes',
      faqSubtitle: 'Tire suas principais dúvidas sobre nossa plataforma',
      faq1Pergunta: 'O Site do Trabalhador é gratuito?',
      faq1Resposta: 'Sim, todos os nossos serviços são 100% gratuitos para candidatos.',
      faq2Pergunta: 'Como me candidato a uma vaga?',
      faq2Resposta: 'Basta clicar na vaga de interesse e preencher o formulário de candidatura.',
      faq3Pergunta: 'Posso usar a calculadora quantas vezes quiser?',
      faq3Resposta: 'Sim, nossa calculadora trabalhista é gratuita e sem limitações.',
      
      // CTA Final
      ctaFinalTitle: 'Pronto para Encontrar Sua Próxima Oportunidade?',
      ctaFinalTexto: 'Junte-se a milhares de brasileiros que já encontraram emprego conosco',
      ctaFinalBotao: 'Explorar Vagas Agora',
      
      // Contato
      contatoTitle: 'Entre em Contato',
      contatoDescription: 'Estamos aqui para ajudar você a encontrar a oportunidade perfeita',
      contatoEmail: 'contato@sitedotrabalhador.com.br',
      contatoTelefone: '(11) 99999-9999',
      contatoWhatsapp: '(11) 99999-9999',
      contatoHorario: 'Segunda à Sexta: 9h às 18h',
      
      // Footer
      footerDescription: 'Conectando talentos às melhores oportunidades de trabalho no Brasil.',
      footerCopyright: '© 2024 Site do Trabalhador. Todos os direitos reservados.',
      footerPolitica: 'Política de Privacidade',
      footerTermos: 'Termos de Uso',
      footerLgpd: 'LGPD',
      
      // Newsletter
      newsletterTitle: 'Receba Vagas por E-mail',
      newsletterTexto: 'Cadastre-se e receba as melhores oportunidades direto no seu e-mail',
      newsletterPlaceholder: 'Digite seu e-mail',
      newsletterBotao: 'Quero Receber Vagas'
    },
    
    vagas: {
      // Meta Tags
      metaTitle: 'Vagas de Emprego - Site do Trabalhador | Milhares de Oportunidades',
      metaDescription: 'Encontre sua vaga ideal! Milhares de oportunidades de emprego em doméstica, porteiro, cuidador, limpeza, motorista e muito mais.',
      metaKeywords: 'vagas emprego, trabalho doméstica, porteiro, cuidador, limpeza, motorista, oportunidades',
      
      // Hero
      heroTitle: 'Encontre Sua Vaga de Emprego Ideal: Milhares de Oportunidades Esperam por Você!',
      heroSubtitle: 'Doméstica, Porteiro, Cuidador, Limpeza, Motorista e Mais! Filtre por Categoria, Cidade ou Salário.',
      heroDescription: 'Seu próximo emprego está a um clique! Aqui, você encontra as melhores vagas para trabalhos simples em todo o Brasil, atualizadas diariamente. Use nossos filtros inteligentes para achar a oportunidade que realmente combina com você e seu perfil e dê o próximo passo em sua carreira!',
      heroCta: 'Buscar Vagas Agora',
      heroStats: 'Mais de 15.000 vagas disponíveis',
      
      // Busca Rápida
      buscaTitle: 'Busca Rápida',
      buscaPlaceholder: 'Digite o cargo ou área desejada...',
      buscaBotao: 'Pesquisar Vagas',
      buscaSugestoes: 'Sugestões: Doméstica, Porteiro, Cuidador, Limpeza',
      
      // Filtros
      filtrosTitle: 'Filtrar Vagas',
      filtrosDescription: 'Use os filtros abaixo para encontrar exatamente o que você procura',
      filtroCategoria: 'Categoria',
      filtroCidade: 'Cidade',
      filtroSalario: 'Faixa Salarial',
      filtroTipo: 'Tipo de Contrato',
      filtroExperiencia: 'Nível de Experiência',
      filtroLimpar: 'Limpar Filtros',
      filtroAplicar: 'Aplicar Filtros',
      
      // Categorias Destaque
      categoriasTitle: 'Categorias em Destaque',
      categoriasSubtitle: 'Explore as áreas com mais oportunidades',
      categoria1: 'Serviços Domésticos',
      categoria1Count: '2.450 vagas',
      categoria2: 'Segurança e Portaria',
      categoria2Count: '1.820 vagas',
      categoria3: 'Cuidados e Saúde',
      categoria3Count: '1.650 vagas',
      categoria4: 'Limpeza e Conservação',
      categoria4Count: '1.340 vagas',
      categoria5: 'Transporte e Logística',
      categoria5Count: '980 vagas',
      categoria6: 'Vendas e Atendimento',
      categoria6Count: '1.120 vagas',
      
      // Resultados
      resultadosTitle: 'Vagas Encontradas',
      resultadosCount: 'vagas encontradas',
      resultadosOrdenar: 'Ordenar por:',
      ordenarRecente: 'Mais Recentes',
      ordenarSalario: 'Maior Salário',
      ordenarRelevancia: 'Relevância',
      
      // Cards de Vaga
      vagaVerMais: 'Ver Detalhes',
      vagaCandidatar: 'Candidatar-se',
      vagaSalario: 'Salário',
      vagaLocal: 'Local',
      vagaTipo: 'Tipo',
      vagaExperiencia: 'Experiência',
      vagaPostado: 'Postado em',
      vagaEmpresa: 'Empresa',
      
      // Paginação
      paginacaoAnterior: 'Anterior',
      paginacaoProximo: 'Próximo',
      paginacaoMostrando: 'Mostrando',
      paginacaoDe: 'de',
      paginacaoResultados: 'resultados',
      
      // Dicas
      dicasTitle: 'Dicas Essenciais para o Candidato: Conquiste Sua Próxima Vaga!',
      dicasSubtitle: 'Maximize suas chances de sucesso com nossas dicas especializadas para candidatos a emprego',
      
      dicasCurriculoTitle: 'Currículo que Impressiona',
      dicasCurriculoTexto: 'Saiba como montar um currículo simples e eficaz, destacando suas qualidades e experiências para as vagas de emprego.',
      dicasCurriculoLink: 'Dicas para Currículo',
      
      dicasEntrevistaTitle: 'Entrevista de Sucesso', 
      dicasEntrevistaTexto: 'Prepare-se para sua entrevista de emprego com nossas dicas valiosas. Descubra como responder às perguntas mais comuns e deixar uma ótima impressão nos recrutadores.',
      dicasEntrevistaLink: 'Dicas para Entrevista',
      
      dicasDireitosTitle: 'Seus Direitos Trabalhistas',
      dicasDireitosTexto: 'Antes de aceitar qualquer vaga de trabalho, é fundamental conhecer e entender seus direitos trabalhistas. Use nossa Calculadora Trabalhista Gratuita para se informar e garantir um futuro seguro!',
      dicasDireitosLink: 'Calculadora Trabalhista',
      
      dicasNegociacaoTitle: 'Negociação Salarial',
      dicasNegociacaoTexto: 'Aprenda a negociar seu salário e benefícios de forma profissional e assertiva.',
      dicasNegociacaoLink: 'Dicas de Negociação',
      
      // Seção Especial
      especialTitle: 'Área Especial: Trabalho Doméstico',
      especialSubtitle: 'Informações importantes para trabalhadores domésticos',
      especialTexto: 'O trabalho doméstico tem direitos específicos garantidos por lei. Conheça seus direitos, deveres e como se proteger.',
      especialLink: 'Guia Completo do Trabalhador Doméstico',
      
      // Motivos
      motivosTitle: 'Por que escolher o Site do Trabalhador?',
      motivosTexto: 'Somos a plataforma completa que conecta trabalhadores brasileiros às melhores oportunidades de emprego em todo o país. Além de vagas atualizadas diariamente, oferecemos ferramentas gratuitas como a Calculadora Trabalhista, dicas de carreira e orientações sobre direitos trabalhistas. Seu sucesso profissional é nossa missão!',
      
      motivo1Titulo: 'Vagas Verificadas',
      motivo1Texto: 'Todas as vagas passam por verificação para garantir qualidade e segurança.',
      
      motivo2Titulo: 'Atualização Constante',
      motivo2Texto: 'Novas oportunidades são adicionadas diariamente em todo o Brasil.',
      
      motivo3Titulo: 'Suporte Gratuito',
      motivo3Texto: 'Nossa equipe está sempre disponível para ajudar você.',
      
      motivo4Titulo: 'Ferramentas Extras',
      motivo4Texto: 'Calculadora trabalhista, dicas de carreira e muito mais.',
      
      // Região
      regiaoTitle: 'Vagas por Região',
      regiaoSubtitle: 'Encontre oportunidades em todo o Brasil',
      regiaoSudeste: 'Região Sudeste',
      regiaoSul: 'Região Sul',
      regiaoNordeste: 'Região Nordeste',
      regiaoNorte: 'Região Norte',
      regiaoCentroOeste: 'Região Centro-Oeste',
      
      // Tipos de Contrato
      tiposTitle: 'Tipos de Contrato Disponíveis',
      tiposSubtitle: 'Diferentes modalidades para diferentes necessidades',
      tipoClt: 'CLT - Carteira Assinada',
      tipoTemporario: 'Contrato Temporário',
      tipoFreelancer: 'Freelancer/Autônomo',
      tipoEstagio: 'Estágio',
      tipoMeiPeriodo: 'Meio Período',
      tipoHomeOffice: 'Home Office',
      
      // Alerta de Vagas
      alertaTitle: 'Alerta de Vagas',
      alertaTexto: 'Receba notificações quando surgirem vagas que combinam com seu perfil',
      alertaEmail: 'Seu e-mail',
      alertaCategoria: 'Categoria de interesse',
      alertaCidade: 'Cidade de interesse',
      alertaBotao: 'Criar Alerta',
      
      // Footer CTA
      ctaTitle: 'Não Encontrou o Que Procurava?',
      ctaTexto: 'Cadastre-se para receber alertas das melhores vagas direto no seu e-mail',
      ctaBotao: 'Receber Alertas de Vagas'
    },
    
    empresas: {
      // Meta Tags
      metaTitle: 'Publique Vagas Gratuitamente - Site do Trabalhador | Para Empresas',
      metaDescription: 'Encontre os melhores candidatos! Publique suas vagas gratuitamente e conecte-se com milhares de trabalhadores qualificados.',
      metaKeywords: 'publicar vagas, recrutar funcionários, encontrar candidatos, vagas gratuitas, RH',
      
      // Hero
      heroTitle: 'Publique Sua Vaga Gratuitamente: Encontre os Melhores Candidatos para Sua Empresa!',
      heroSubtitle: 'Conecte-se com Milhares de Trabalhadores Qualificados em Todo o Brasil',
      heroDescription: 'Sua empresa merece os melhores profissionais! Nossa plataforma conecta você aos candidatos ideais para suas vagas, de forma rápida, eficiente e totalmente gratuita.',
      heroCta: 'Publicar Vaga Grátis',
      heroStats: 'Mais de 25.000 candidatos ativos',
      
      // Números da Plataforma
      numerosTitle: 'Por Que Somos a Escolha Certa?',
      numerosSubtitle: 'Resultados comprovados para empresas de todos os tamanhos',
      numero1: '1.200+',
      numero1Texto: 'Empresas Parceiras',
      numero2: '25.000+',
      numero2Texto: 'Candidatos Qualificados',
      numero3: '95%',
      numero3Texto: 'Taxa de Satisfação',
      numero4: '48h',
      numero4Texto: 'Tempo Médio de Resposta',
      
      // Benefícios
      beneficiosTitle: 'Por Que Escolher Nossa Plataforma?',
      beneficiosSubtitle: 'Vantagens exclusivas para sua empresa encontrar os melhores talentos',
      
      beneficio1Titulo: 'Publicação Gratuita',
      beneficio1Texto: 'Publique suas vagas sem custos e alcance milhares de candidatos qualificados.',
      beneficio1Icon: '💰',
      
      beneficio2Titulo: 'Candidatos Pré-Qualificados',
      beneficio2Texto: 'Receba apenas candidaturas de profissionais que realmente se encaixam no perfil da vaga.',
      beneficio2Icon: '🎯',
      
      beneficio3Titulo: 'Processo Simplificado',
      beneficio3Texto: 'Sistema intuitivo e rápido para publicar vagas e gerenciar candidaturas.',
      beneficio3Icon: '⚡',
      
      beneficio4Titulo: 'Alcance Nacional',
      beneficio4Texto: 'Sua vaga será vista por candidatos de todo o Brasil.',
      beneficio4Icon: '🌎',
      
      beneficio5Titulo: 'Suporte Especializado',
      beneficio5Texto: 'Nossa equipe de RH está disponível para ajudar você.',
      beneficio5Icon: '🤝',
      
      beneficio6Titulo: 'Análise de Resultados',
      beneficio6Texto: 'Acompanhe estatísticas e desempenho das suas vagas.',
      beneficio6Icon: '📊',
      
      // Processo
      processoTitle: 'Como Funciona?',
      processoSubtitle: 'Em apenas 3 passos simples, sua vaga estará online',
      
      passo1Titulo: 'Preencha o Formulário',
      passo1Texto: 'Conte-nos sobre sua empresa e descreva a vaga em detalhes.',
      passo1Icon: '📝',
      
      passo2Titulo: 'Análise e Aprovação',
      passo2Texto: 'Nossa equipe revisa e aprova sua vaga em até 24 horas.',
      passo2Icon: '✅',
      
      passo3Titulo: 'Receba Candidaturas',
      passo3Texto: 'Candidatos qualificados se candidatam e você escolhe os melhores.',
      passo3Icon: '👥',
      
      // Tipos de Vagas
      tiposTitle: 'Tipos de Vagas Que Você Pode Publicar',
      tiposSubtitle: 'Atendemos todas as áreas e níveis profissionais',
      
      tipo1: 'Serviços Domésticos',
      tipo1Desc: 'Empregadas, cozinheiras, babás',
      tipo2: 'Segurança e Portaria',
      tipo2Desc: 'Porteiros, vigilantes, recepcionistas',
      tipo3: 'Limpeza e Conservação',
      tipo3Desc: 'Auxiliares de limpeza, faxineiras',
      tipo4: 'Cuidados Pessoais',
      tipo4Desc: 'Cuidadores, acompanhantes',
      tipo5: 'Transporte',
      tipo5Desc: 'Motoristas, entregadores',
      tipo6: 'Vendas e Atendimento',
      tipo6Desc: 'Vendedores, atendentes',
      
      // Formulário
      formularioTitle: 'Publique Sua Vaga Agora!',
      formularioSubtitle: 'Preencha o formulário abaixo e comece a receber candidaturas qualificadas',
      
      formEmpresaTitle: 'Dados da Empresa',
      formNomeEmpresa: 'Nome da Empresa *',
      formCnpj: 'CNPJ *',
      formEmail: 'E-mail de Contato *',
      formTelefone: 'Telefone/WhatsApp *',
      formResponsavel: 'Nome do Responsável *',
      formCargo: 'Cargo do Responsável *',
      formCidade: 'Cidade *',
      formEstado: 'Estado *',
      formSegmento: 'Segmento da Empresa *',
      
      formVagaTitle: 'Dados da Vaga',
      formTituloVaga: 'Título da Vaga *',
      formCargoVaga: 'Cargo/Função *',
      formAreaVaga: 'Área de Atuação *',
      formDescricaoVaga: 'Descrição da Vaga *',
      formRequisitos: 'Requisitos e Qualificações',
      formSalario: 'Faixa Salarial *',
      formBeneficios: 'Benefícios Oferecidos',
      formTipoContrato: 'Tipo de Contrato *',
      formJornada: 'Jornada de Trabalho *',
      formExperiencia: 'Tempo de Experiência',
      formEscolaridade: 'Escolaridade Mínima',
      
      formContatoTitle: 'Informações de Contato',
      formEmailCandidatos: 'E-mail para Receber Currículos *',
      formTelefoneCandidatos: 'Telefone para Contato',
      formObservacoes: 'Observações Adicionais',
      
      formBotaoEnviar: 'Publicar Vaga Gratuitamente',
      formTermos: 'Ao publicar esta vaga, você concorda com nossos Termos de Uso e Política de Privacidade.',
      
      // FAQ
      faqTitle: 'Perguntas Frequentes',
      faqSubtitle: 'Tire suas dúvidas sobre nossa plataforma',
      
      faq1Pergunta: 'Quanto custa para publicar uma vaga?',
      faq1Resposta: 'A publicação de vagas é 100% gratuita. Não cobramos nenhuma taxa.',
      
      faq2Pergunta: 'Quanto tempo demora para aprovar minha vaga?',
      faq2Resposta: 'Nossa equipe analisa e aprova vagas em até 24 horas úteis.',
      
      faq3Pergunta: 'Por quanto tempo minha vaga ficará online?',
      faq3Resposta: 'As vagas ficam ativas por 30 dias, podendo ser renovadas gratuitamente.',
      
      faq4Pergunta: 'Como recebo os currículos dos candidatos?',
      faq4Resposta: 'Os currículos são enviados diretamente para o e-mail informado no cadastro.',
      
      faq5Pergunta: 'Posso editar minha vaga depois de publicada?',
      faq5Resposta: 'Sim, entre em contato conosco para editar informações da vaga.',
      
      faq6Pergunta: 'Que tipos de vaga posso publicar?',
      faq6Resposta: 'Aceitamos vagas de todas as áreas, desde serviços domésticos até cargos especializados.',
      
      // Depoimentos
      depoimentosTitle: 'O Que Nossas Empresas Parceiras Dizem',
      depoimentosSubtitle: 'Histórias reais de sucesso na contratação',
      
      depoimento1Nome: 'Maria Fernanda',
      depoimento1Empresa: 'Construtora ABC',
      depoimento1Cargo: 'Gerente de RH',
      depoimento1Texto: 'Encontramos ótimos profissionais através da plataforma. O processo é simples e eficiente.',
      
      depoimento2Nome: 'Roberto Silva',
      depoimento2Empresa: 'Empresa de Limpeza XYZ',
      depoimento2Cargo: 'Diretor',
      depoimento2Texto: 'Conseguimos contratar 5 auxiliares de limpeza em apenas uma semana. Recomendo!',
      
      depoimento3Nome: 'Ana Costa',
      depoimento3Empresa: 'Clínica Saúde & Bem',
      depoimento3Cargo: 'Coordenadora',
      depoimento3Texto: 'A qualidade dos candidatos é excelente. Nossa taxa de aprovação é muito alta.',
      
      // Dicas para Empresas
      dicasTitle: 'Dicas para Atrair os Melhores Candidatos',
      dicasSubtitle: 'Maximize suas chances de encontrar o profissional ideal',
      
      dica1Titulo: 'Seja Claro na Descrição',
      dica1Texto: 'Descreva detalhadamente as responsabilidades, requisitos e benefícios da vaga.',
      
      dica2Titulo: 'Defina o Perfil Ideal',
      dica2Texto: 'Seja específico sobre experiência, escolaridade e habilidades necessárias.',
      
      dica3Titulo: 'Ofereça Benefícios Atrativos',
      dica3Texto: 'Além do salário, mencione benefícios como vale-transporte, alimentação, etc.',
      
      dica4Titulo: 'Responda Rapidamente',
      dica4Texto: 'Candidatos valorizam empresas que respondem rapidamente às candidaturas.',
      
      // Ainda com Dúvidas
      duvidaTitle: 'Ainda com Dúvidas?',
      duvidaTexto: 'Nossa equipe está pronta para ajudar você a encontrar os melhores candidatos para sua empresa. Entre em contato conosco!',
      duvidaEmailTexto: 'Envie um e-mail para nossa equipe',
      duvidaWhatsappTexto: 'Fale conosco pelo WhatsApp',
      duvidaEmail: 'empresas@sitedotrabalhador.com.br',
      duvidaWhatsapp: '(11) 99999-9999',
      
      // CTA Final
      ctaFinalTitle: 'Pronto para Encontrar Seus Próximos Colaboradores?',
      ctaFinalTexto: 'Junte-se a mais de 1.200 empresas que já encontraram os melhores profissionais conosco',
      ctaFinalBotao: 'Publicar Minha Vaga Agora'
    },
    
    calculadora: {
      // Meta Tags
      metaTitle: 'Calculadora Trabalhista Gratuita - Site do Trabalhador | Seus Direitos',
      metaDescription: 'Calcule férias, 13º salário, FGTS, rescisão e mais! Calculadora trabalhista gratuita baseada na legislação brasileira.',
      metaKeywords: 'calculadora trabalhista, direitos trabalhistas, férias, 13º salário, FGTS, rescisão',
      
      // Hero
      heroTitle: 'Calculadora Trabalhista Gratuita: Conheça Seus Direitos e Saiba Exatamente o Que Receber!',
      heroSubtitle: 'Férias, 13º Salário, FGTS, Rescisão e Mais - Calcule Tudo Online em Segundos!',
      heroDescription: 'Proteja seus direitos trabalhistas! Nossa calculadora gratuita ajuda você a entender exatamente quanto deve receber em cada situação. Simples, rápida e confiável.',
      heroCta: 'Começar Cálculo Agora',
      heroStats: 'Mais de 100.000 cálculos realizados',
      
      // Benefícios
      beneficiosTitle: 'Por Que Usar Nossa Calculadora?',
      beneficiosSubtitle: 'Ferramenta completa para seus direitos trabalhistas',
      
      beneficio1Titulo: '100% Gratuita',
      beneficio1Texto: 'Use quantas vezes quiser, sem custos ou limitações.',
      beneficio1Icon: '💰',
      
      beneficio2Titulo: 'Cálculos Precisos',
      beneficio2Texto: 'Baseados na legislação trabalhista brasileira mais atualizada.',
      beneficio2Icon: '✅',
      
      beneficio3Titulo: 'Fácil de Usar',
      beneficio3Texto: 'Interface simples e intuitiva para todos os níveis de usuário.',
      beneficio3Icon: '📱',
      
      beneficio4Titulo: 'Sempre Atualizada',
      beneficio4Texto: 'Acompanhamos todas as mudanças na legislação trabalhista.',
      beneficio4Icon: '🔄',
      
      beneficio5Titulo: 'Resultados Detalhados',
      beneficio5Texto: 'Explicação completa de cada cálculo realizado.',
      beneficio5Icon: '📊',
      
      beneficio6Titulo: 'Privacidade Garantida',
      beneficio6Texto: 'Seus dados não são armazenados em nossos servidores.',
      beneficio6Icon: '🔒',
      
      // Seções da Calculadora
      calculosTitle: 'O Que Você Pode Calcular?',
      calculosSubtitle: 'Todos os seus direitos trabalhistas em um só lugar',
      
      calculo1Titulo: 'Férias',
      calculo1Texto: 'Calcule o valor das suas férias, incluindo o terço constitucional.',
      calculo1Desc: 'Calcule férias vencidas, proporcionais e o adicional de 1/3.',
      calculo1Icon: '🏖️',
      
      calculo2Titulo: '13º Salário',
      calculo2Texto: 'Descubra quanto você deve receber de 13º salário.',
      calculo2Desc: 'Calcule a primeira e segunda parcela do 13º salário.',
      calculo2Icon: '🎁',
      
      calculo3Titulo: 'Rescisão',
      calculo3Texto: 'Calcule todos os valores da rescisão trabalhista.',
      calculo3Desc: 'Aviso prévio, multa do FGTS, férias e muito mais.',
      calculo3Icon: '📄',
      
      calculo4Titulo: 'FGTS',
      calculo4Texto: 'Veja quanto seu empregador deve depositar no FGTS.',
      calculo4Desc: 'Depósitos mensais e multa rescisória do FGTS.',
      calculo4Icon: '🏦',
      
      calculo5Titulo: 'Horas Extras',
      calculo5Texto: 'Calcule o valor das horas extras trabalhadas.',
      calculo5Desc: 'Adicional de 50% ou 100% conforme a legislação.',
      calculo5Icon: '⏰',
      
      calculo6Titulo: 'Adicional Noturno',
      calculo6Texto: 'Calcule o adicional noturno devido.',
      calculo6Desc: 'Adicional de 20% para trabalho noturno.',
      calculo6Icon: '🌙',
      
      calculo7Titulo: 'Descanso Semanal',
      calculo7Texto: 'Calcule o valor do descanso semanal remunerado.',
      calculo7Desc: 'DSR sobre horas extras e comissões.',
      calculo7Icon: '📅',
      
      calculo8Titulo: 'Salário Família',
      calculo8Texto: 'Veja se tem direito ao salário família.',
      calculo8Desc: 'Benefício para quem tem filhos menores de 14 anos.',
      calculo8Icon: '👨‍👩‍👧‍👦',
      
      // Formulário da Calculadora
      formularioTitle: 'Preencha Seus Dados Para Calcular',
      formularioSubtitle: 'Informe os dados abaixo para realizar os cálculos',
      
      formSalario: 'Salário Mensal',
      formDataAdmissao: 'Data de Admissão',
      formDataDemissao: 'Data de Demissão',
      formTipoRescisao: 'Tipo de Rescisão',
      formHorasExtras: 'Horas Extras Mensais',
      formAdicionalNoturno: 'Trabalha no Período Noturno?',
      formDependentes: 'Número de Dependentes',
      formUltimasFerias: 'Data das Últimas Férias',
      
      formBotaoCalcular: 'Calcular Agora',
      formLimpar: 'Limpar Campos',
      
      // Tipos de Rescisão
      rescisaoSemJusta: 'Demissão sem Justa Causa',
      rescisaoComJusta: 'Demissão com Justa Causa',
      rescisaoPedido: 'Pedido de Demissão',
      rescisaoAcordo: 'Acordo Trabalhista',
      rescisaoTermino: 'Término de Contrato',
      
      // Resultados
      resultadosTitle: 'Seus Resultados',
      resultadosSubtitle: 'Veja abaixo o detalhamento de seus direitos',
      
      resultadoFerias: 'Férias',
      resultadoTerco: 'Terço de Férias',
      resultadoDecimo: '13º Salário',
      resultadoFgts: 'FGTS',
      resultadoMultaFgts: 'Multa FGTS (40%)',
      resultadoAvisosPrevio: 'Aviso Prévio',
      resultadoSaldoSalario: 'Saldo de Salário',
      resultadoTotal: 'Total a Receber',
      
      // Dicas Importantes
      dicasTitle: 'Dicas Importantes Sobre Seus Direitos',
      dicasSubtitle: 'Informações essenciais que todo trabalhador deve saber',
      
      dica1Titulo: 'Guarde Seus Documentos',
      dica1Texto: 'Mantenha sempre em ordem carteira de trabalho, contratos e comprovantes de pagamento.',
      
      dica2Titulo: 'Conheça Seus Direitos',
      dica2Texto: 'Todo trabalhador CLT tem direitos garantidos por lei. Não abra mão deles.',
      
      dica3Titulo: 'Procure Orientação',
      dica3Texto: 'Em caso de dúvidas, procure o sindicato da sua categoria ou um advogado trabalhista.',
      
      dica4Titulo: 'Negocie com Consciência',
      dica4Texto: 'Antes de aceitar qualquer acordo, certifique-se de que está recebendo tudo que tem direito.',
      
      // FAQ
      faqTitle: 'Perguntas Frequentes sobre Direitos Trabalhistas',
      faqSubtitle: 'Esclarecemos as principais dúvidas sobre a legislação trabalhista brasileira',
      
      faq1Pergunta: 'Quando tenho direito às férias?',
      faq1Resposta: 'Todo trabalhador tem direito a 30 dias de férias após completar 12 meses de trabalho.',
      
      faq2Pergunta: 'Como é calculado o 13º salário?',
      faq2Resposta: 'O 13º salário corresponde a 1/12 do salário para cada mês trabalhado no ano.',
      
      faq3Pergunta: 'Quando recebo a multa do FGTS?',
      faq3Resposta: 'A multa de 40% do FGTS é devida apenas em casos de demissão sem justa causa.',
      
      faq4Pergunta: 'O que é aviso prévio?',
      faq4Resposta: 'É o aviso de 30 dias que deve ser dado quando o contrato de trabalho é encerrado.',
      
      faq5Pergunta: 'Posso sacar o FGTS?',
      faq5Resposta: 'O FGTS pode ser sacado em casos como demissão sem justa causa, aposentadoria, entre outros.',
      
      // Trabalho Doméstico
      domesticoTitle: 'Direitos Específicos do Trabalhador Doméstico',
      domesticoSubtitle: 'Conheça os direitos garantidos pela Lei Complementar 150/2015',
      
      domesticoDireito1: 'Salário mínimo nacional',
      domesticoDireito2: 'Décimo terceiro salário',
      domesticoDireito3: 'Férias de 30 dias',
      domesticoDireito4: 'FGTS obrigatório',
      domesticoDireito5: 'Seguro-desemprego',
      domesticoDireito6: 'Adicional noturno',
      domesticoDireito7: 'Salário-família',
      domesticoDireito8: 'Auxílio-creche',
      
      // Ainda com Dúvidas
      duvidaTitle: 'Ainda com Dúvidas sobre Seus Direitos?',
      duvidaTexto: 'Nossa equipe especializada está pronta para esclarecer todas as suas dúvidas sobre direitos trabalhistas. Entre em contato conosco!',
      duvidaEmailTexto: 'Envie suas dúvidas por e-mail',
      duvidaWhatsappTexto: 'Fale conosco pelo WhatsApp',
      duvidaEmail: 'direitos@sitedotrabalhador.com.br',
      duvidaWhatsapp: '(11) 99999-9999',
      
      // CTA Final
      ctaFinalTitle: 'Proteja Seus Direitos Trabalhistas!',
      ctaFinalTexto: 'Use nossa calculadora sempre que precisar e mantenha-se informado sobre seus direitos',
      ctaFinalBotao: 'Fazer Novo Cálculo'
    },

    contato: {
      // Meta Tags
      metaTitle: 'Entre em Contato - Site do Trabalhador | Fale Conosco',
      metaDescription: 'Entre em contato com nossa equipe. Estamos prontos para ajudar com dúvidas sobre vagas, direitos trabalhistas e nossa plataforma.',
      metaKeywords: 'contato, atendimento, suporte, dúvidas, ajuda, site do trabalhador',
      
      // Hero
      heroTitle: 'Entre em Contato Conosco',
      heroSubtitle: 'Estamos aqui para ajudar você',
      heroDescription: 'Tem dúvidas ou sugestões? Nossa equipe está pronta para atendê-lo. Entre em contato através dos canais abaixo.',
      heroCta: 'Enviar Mensagem',
      
      // Informações
      infoTitle: 'Informações de Contato',
      infoSubtitle: 'Escolha o canal que preferir para falar conosco',
      
      // Canais de Contato
      emailTitle: 'E-mail',
      emailGeral: 'contato@sitedotrabalhador.com.br',
      emailCandidatos: 'candidatos@sitedotrabalhador.com.br',
      emailEmpresas: 'empresas@sitedotrabalhador.com.br',
      emailDireitos: 'direitos@sitedotrabalhador.com.br',
      emailSuporte: 'suporte@sitedotrabalhador.com.br',
      
      whatsappTitle: 'WhatsApp',
      whatsappGeral: '(11) 99999-9999',
      whatsappEmpresas: '(11) 99999-9998',
      whatsappSuporte: '(11) 99999-9997',
      
      telefoneTitle: 'Telefone',
      telefoneGeral: '(11) 3000-0000',
      
      enderecoTitle: 'Endereço',
      endereco: 'São Paulo, SP - Brasil',
      enderecoCompleto: 'Rua das Oportunidades, 123 - Centro, São Paulo/SP',
      cep: '01000-000',
      
      horarioTitle: 'Horário de Funcionamento',
      horarioFuncionamento: 'Segunda à Sexta: 9h às 18h',
      horarioSabado: 'Sábado: 9h às 14h',
      horarioDomingo: 'Domingo: Fechado',
      
      // Formulário
      formularioTitle: 'Envie uma Mensagem',
      formularioSubtitle: 'Preencha o formulário abaixo e retornaremos em breve',
      
      formNome: 'Nome Completo *',
      formEmail: 'E-mail *',
      formTelefone: 'Telefone/WhatsApp',
      formAssunto: 'Assunto *',
      formTipoContato: 'Tipo de Contato *',
      formMensagem: 'Mensagem *',
      
      // Tipos de Contato
      tipoGeral: 'Dúvida Geral',
      tipoCandidato: 'Sou Candidato',
      tipoEmpresa: 'Sou Empresa',
      tipoDireitos: 'Direitos Trabalhistas',
      tipoTecnico: 'Suporte Técnico',
      tipoSugestao: 'Sugestão/Crítica',
      tipoImprensa: 'Imprensa',
      tipoParcerias: 'Parcerias',
      
      formBotaoEnviar: 'Enviar Mensagem',
      formLimpar: 'Limpar Formulário',
      
      // FAQ Contato
      faqTitle: 'Perguntas Frequentes',
      faqSubtitle: 'Encontre respostas rápidas para as dúvidas mais comuns',
      
      faq1Pergunta: 'Quanto tempo demora para responder?',
      faq1Resposta: 'Respondemos todas as mensagens em até 24 horas úteis.',
      
      faq2Pergunta: 'Posso ligar fora do horário comercial?',
      faq2Resposta: 'Nosso atendimento telefônico funciona apenas no horário comercial. Use WhatsApp para urgências.',
      
      faq3Pergunta: 'Vocês atendem todo o Brasil?',
      faq3Resposta: 'Sim, atendemos candidatos e empresas de todo o território nacional.',
      
      // Redes Sociais
      redesTitle: 'Siga-nos nas Redes Sociais',
      redesSubtitle: 'Fique por dentro das novidades e oportunidades',
      
      facebookTexto: 'Curta nossa página no Facebook',
      instagramTexto: 'Siga-nos no Instagram',
      linkedinTexto: 'Conecte-se no LinkedIn',
      youtubeTexto: 'Inscreva-se no YouTube',
      twitterTexto: 'Siga-nos no Twitter',
      
      // Mapa/Localização
      localizacaoTitle: 'Nossa Localização',
      localizacaoTexto: 'Estamos estrategicamente localizados no centro de São Paulo'
    },
    
    configuracoes: {
      // Configurações Gerais
      siteName: 'Site do Trabalhador',
      siteTagline: 'Conectando talentos às melhores oportunidades',
      siteDescription: 'Conectando trabalhadores às melhores oportunidades de emprego no Brasil',
      siteKeywords: 'emprego, trabalho, vagas, oportunidades, carreira, Brasil, direitos trabalhistas',
      
      // Dados da Empresa
      empresaNome: 'Site do Trabalhador',
      empresaCnpj: '00.000.000/0001-00',
      empresaRazaoSocial: 'Site do Trabalhador Ltda.',
      empresaEndereco: 'Rua das Oportunidades, 123 - Centro',
      empresaCidade: 'São Paulo',
      empresaEstado: 'SP',
      empresaCep: '01000-000',
      empresaTelefone: '(11) 3000-0000',
      empresaEmail: 'contato@sitedotrabalhador.com.br',
      
      // Redes Sociais
      facebookUrl: 'https://facebook.com/sitedotrabalhador',
      facebookAtivo: true,
      instagramUrl: 'https://instagram.com/sitedotrabalhador',
      instagramAtivo: true,
      linkedinUrl: 'https://linkedin.com/company/sitedotrabalhador',
      linkedinAtivo: true,
      youtubeUrl: 'https://youtube.com/@sitedotrabalhador',
      youtubeAtivo: false,
      twitterUrl: 'https://twitter.com/sitedotrabalhador',
      twitterAtivo: false,
      
      // SEO e Analytics
      googleAnalyticsId: 'G-XXXXXXXXXX',
      googleAnalyticsAtivo: false,
      googleTagManagerId: 'GTM-XXXXXXX',
      googleTagManagerAtivo: false,
      facebookPixelId: '000000000000000',
      facebookPixelAtivo: false,
      googleSearchConsole: 'google-site-verification=xxxxxxxxxxxx',
      
      // Email Marketing
      mailchimpApiKey: '',
      mailchimpListId: '',
      mailchimpAtivo: false,
      emailMarketingProvedor: 'mailchimp',
      
      // Configurações do Site
      manutencaoAtiva: false,
      manutencaoMensagem: 'Estamos em manutenção. Voltaremos em breve!',
      registroAberto: true,
      comentariosAtivos: true,
      newsletterAtiva: true,
      
      // Configurações de Vagas
      vagasAutoAprovacao: false,
      vagasTempoExpiracao: '30',
      vagasLimitePorEmpresa: '10',
      vagasModeracaoAutomatica: true,
      
      // Configurações de E-mail
      emailSmtpHost: 'smtp.gmail.com',
      emailSmtpPort: '587',
      emailSmtpUser: 'naoresponder@sitedotrabalhador.com.br',
      emailSmtpPassword: '',
      emailRemetente: 'Site do Trabalhador',
      emailNoReply: 'naoresponder@sitedotrabalhador.com.br',
      
      // Templates de E-mail
      emailBoasVindas: true,
      emailConfirmacaoVaga: true,
      emailNovaVaga: true,
      emailNewsletterSemanal: false,
      
      // Integração WhatsApp
      whatsappNumero: '5511999999999',
      whatsappMensagemPadrao: 'Olá! Vim do Site do Trabalhador e gostaria de mais informações.',
      whatsappAtivo: true,
      
      // Políticas e Termos
      politicaPrivacidadeUrl: '/politica-privacidade',
      termosUsoUrl: '/termos-uso',
      lgpdUrl: '/lgpd',
      cookiePolicy: true,
      
      // Backup e Segurança
      backupAutomatico: true,
      backupFrequencia: 'diario',
      logAtividades: true,
      autenticacaoDoisFatores: false,
      
      // Notificações
      notificacaoNovaVaga: true,
      notificacaoNovoCandidato: true,
      notificacaoSistema: true,
      notificacaoEmail: true,
      notificacaoWhatsapp: false,
      
      // Configurações Avançadas
      cacheAtivo: true,
      compressaoImagens: true,
      lazyLoadImages: true,
      pwaAtivo: false,
      offlineMode: false,
      
      // Idioma e Localização
      idiomaPadrao: 'pt-BR',
      fusoHorario: 'America/Sao_Paulo',
      formatoData: 'DD/MM/YYYY',
      formatoHora: 'HH:mm',
      moedaPadrao: 'BRL',
      
      // Limites e Cotas
      limiteCandidaturasUsuario: '50',
      limiteVagasEmpresa: '100',
      tamanhoMaximoArquivo: '5',
      limiteBandaMensal: '100'
    }
  })

  useEffect(() => {
    // Carregar conteúdos salvos do localStorage
    const savedContents = localStorage.getItem('site_contents')
    if (savedContents) {
      try {
        setContents(JSON.parse(savedContents))
      } catch (error) {
        console.error('Erro ao carregar conteúdos:', error)
      }
    }
  }, [])

  const handleContentChange = (page, field, value) => {
    setContents(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value
      }
    }))
  }

  const saveContents = async () => {
    setLoading(true)
    try {
      // Salvar no localStorage
      localStorage.setItem('site_contents', JSON.stringify(contents))
      
      // Aqui você pode adicionar a integração com uma API real
      // await fetch('/api/save-contents', { method: 'POST', body: JSON.stringify(contents) })
      
      alert('✅ Conteúdos salvos com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('❌ Erro ao salvar conteúdos')
    } finally {
      setLoading(false)
    }
  }

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar os conteúdos padrão? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('site_contents')
      window.location.reload()
    }
  }

  const renderEditor = (page) => {
    const content = contents[page]
    
    // Definir agrupamentos de campos por seção
    const fieldGroups = {
      home: {
        'Meta Tags e SEO': ['metaTitle', 'metaDescription', 'metaKeywords'],
        'Seção Hero': ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroCta1', 'heroCta2'],
        'Benefícios Hero': ['heroBeneficio1', 'heroBeneficio2', 'heroBeneficio3'],
        'Estatísticas': ['statsTitle', 'statsSubtitle', 'stat1Numero', 'stat1Texto', 'stat2Numero', 'stat2Texto', 'stat3Numero', 'stat3Texto', 'stat4Numero', 'stat4Texto'],
        'Sobre Nós': ['aboutTitle', 'aboutText', 'aboutDescription', 'aboutMissao', 'aboutVisao', 'aboutValores'],
        'Categorias': ['categoriasTitle', 'categoriasSubtitle', 'categoria1', 'categoria2', 'categoria3', 'categoria4', 'categoria5', 'categoria6', 'categoria7', 'categoria8'],
        'Serviços': ['servicosTitle', 'servicosDescription', 'servico1Titulo', 'servico1Texto', 'servico2Titulo', 'servico2Texto', 'servico3Titulo', 'servico3Texto', 'servico4Titulo', 'servico4Texto'],
        'Depoimentos': ['depoimentosTitle', 'depoimentosSubtitle', 'depoimento1Nome', 'depoimento1Cargo', 'depoimento1Texto', 'depoimento2Nome', 'depoimento2Cargo', 'depoimento2Texto', 'depoimento3Nome', 'depoimento3Cargo', 'depoimento3Texto'],
        'Como Funciona': ['comoFuncionaTitle', 'comoFuncionaSubtitle', 'passo1Titulo', 'passo1Texto', 'passo2Titulo', 'passo2Texto', 'passo3Titulo', 'passo3Texto'],
        'FAQ': ['faqTitle', 'faqSubtitle', 'faq1Pergunta', 'faq1Resposta', 'faq2Pergunta', 'faq2Resposta', 'faq3Pergunta', 'faq3Resposta'],
        'CTA Final': ['ctaFinalTitle', 'ctaFinalTexto', 'ctaFinalBotao'],
        'Newsletter': ['newsletterTitle', 'newsletterTexto', 'newsletterPlaceholder', 'newsletterBotao'],
        'Contato': ['contatoTitle', 'contatoDescription', 'contatoEmail', 'contatoTelefone', 'contatoWhatsapp', 'contatoHorario'],
        'Rodapé': ['footerDescription', 'footerCopyright', 'footerPolitica', 'footerTermos', 'footerLgpd']
      },
      vagas: {
        'Meta Tags e SEO': ['metaTitle', 'metaDescription', 'metaKeywords'],
        'Seção Hero': ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroCta', 'heroStats'],
        'Busca': ['buscaTitle', 'buscaPlaceholder', 'buscaBotao', 'buscaSugestoes'],
        'Filtros': ['filtrosTitle', 'filtrosDescription', 'filtroCategoria', 'filtroCidade', 'filtroSalario', 'filtroTipo', 'filtroExperiencia', 'filtroLimpar', 'filtroAplicar'],
        'Categorias': ['categoriasTitle', 'categoriasSubtitle', 'categoria1', 'categoria1Count', 'categoria2', 'categoria2Count', 'categoria3', 'categoria3Count', 'categoria4', 'categoria4Count', 'categoria5', 'categoria5Count', 'categoria6', 'categoria6Count'],
        'Resultados': ['resultadosTitle', 'resultadosCount', 'resultadosOrdenar', 'ordenarRecente', 'ordenarSalario', 'ordenarRelevancia'],
        'Cards de Vaga': ['vagaVerMais', 'vagaCandidatar', 'vagaSalario', 'vagaLocal', 'vagaTipo', 'vagaExperiencia', 'vagaPostado', 'vagaEmpresa'],
        'Dicas': ['dicasTitle', 'dicasSubtitle', 'dicasCurriculoTitle', 'dicasCurriculoTexto', 'dicasEntrevistaTitle', 'dicasEntrevistaTexto', 'dicasDireitosTitle', 'dicasDireitosTexto', 'dicasNegociacaoTitle', 'dicasNegociacaoTexto'],
        'Motivos': ['motivosTitle', 'motivosTexto', 'motivo1Titulo', 'motivo1Texto', 'motivo2Titulo', 'motivo2Texto', 'motivo3Titulo', 'motivo3Texto', 'motivo4Titulo', 'motivo4Texto'],
        'Tipos de Contrato': ['tiposTitle', 'tiposSubtitle', 'tipoClt', 'tipoTemporario', 'tipoFreelancer', 'tipoEstagio', 'tipoMeiPeriodo', 'tipoHomeOffice'],
        'Alerta de Vagas': ['alertaTitle', 'alertaTexto', 'alertaEmail', 'alertaCategoria', 'alertaCidade', 'alertaBotao']
      },
      empresas: {
        'Meta Tags e SEO': ['metaTitle', 'metaDescription', 'metaKeywords'],
        'Seção Hero': ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroCta', 'heroStats'],
        'Números': ['numerosTitle', 'numerosSubtitle', 'numero1', 'numero1Texto', 'numero2', 'numero2Texto', 'numero3', 'numero3Texto', 'numero4', 'numero4Texto'],
        'Benefícios': ['beneficiosTitle', 'beneficiosSubtitle', 'beneficio1Titulo', 'beneficio1Texto', 'beneficio2Titulo', 'beneficio2Texto', 'beneficio3Titulo', 'beneficio3Texto', 'beneficio4Titulo', 'beneficio4Texto', 'beneficio5Titulo', 'beneficio5Texto', 'beneficio6Titulo', 'beneficio6Texto'],
        'Processo': ['processoTitle', 'processoSubtitle', 'passo1Titulo', 'passo1Texto', 'passo2Titulo', 'passo2Texto', 'passo3Titulo', 'passo3Texto'],
        'Tipos de Vagas': ['tiposTitle', 'tiposSubtitle', 'tipo1', 'tipo1Desc', 'tipo2', 'tipo2Desc', 'tipo3', 'tipo3Desc', 'tipo4', 'tipo4Desc', 'tipo5', 'tipo5Desc', 'tipo6', 'tipo6Desc'],
        'Formulário': ['formularioTitle', 'formularioSubtitle', 'formEmpresaTitle', 'formVagaTitle', 'formContatoTitle', 'formBotaoEnviar', 'formTermos'],
        'FAQ': ['faqTitle', 'faqSubtitle', 'faq1Pergunta', 'faq1Resposta', 'faq2Pergunta', 'faq2Resposta', 'faq3Pergunta', 'faq3Resposta', 'faq4Pergunta', 'faq4Resposta'],
        'Depoimentos': ['depoimentosTitle', 'depoimentosSubtitle', 'depoimento1Nome', 'depoimento1Empresa', 'depoimento1Texto', 'depoimento2Nome', 'depoimento2Empresa', 'depoimento2Texto'],
        'Dicas': ['dicasTitle', 'dicasSubtitle', 'dica1Titulo', 'dica1Texto', 'dica2Titulo', 'dica2Texto', 'dica3Titulo', 'dica3Texto', 'dica4Titulo', 'dica4Texto'],
        'Contato': ['duvidaTitle', 'duvidaTexto', 'duvidaEmail', 'duvidaWhatsapp']
      },
      calculadora: {
        'Meta Tags e SEO': ['metaTitle', 'metaDescription', 'metaKeywords'],
        'Seção Hero': ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroCta', 'heroStats'],
        'Benefícios': ['beneficiosTitle', 'beneficiosSubtitle', 'beneficio1Titulo', 'beneficio1Texto', 'beneficio2Titulo', 'beneficio2Texto', 'beneficio3Titulo', 'beneficio3Texto', 'beneficio4Titulo', 'beneficio4Texto'],
        'Cálculos': ['calculosTitle', 'calculosSubtitle', 'calculo1Titulo', 'calculo1Texto', 'calculo2Titulo', 'calculo2Texto', 'calculo3Titulo', 'calculo3Texto', 'calculo4Titulo', 'calculo4Texto', 'calculo5Titulo', 'calculo5Texto'],
        'Formulário': ['formularioTitle', 'formularioSubtitle', 'formSalario', 'formDataAdmissao', 'formDataDemissao', 'formBotaoCalcular'],
        'Resultados': ['resultadosTitle', 'resultadosSubtitle', 'resultadoFerias', 'resultadoTerco', 'resultadoDecimo', 'resultadoFgts', 'resultadoTotal'],
        'Dicas': ['dicasTitle', 'dicasSubtitle', 'dica1Titulo', 'dica1Texto', 'dica2Titulo', 'dica2Texto', 'dica3Titulo', 'dica3Texto', 'dica4Titulo', 'dica4Texto'],
        'FAQ': ['faqTitle', 'faqSubtitle', 'faq1Pergunta', 'faq1Resposta', 'faq2Pergunta', 'faq2Resposta', 'faq3Pergunta', 'faq3Resposta', 'faq4Pergunta', 'faq4Resposta'],
        'Trabalho Doméstico': ['domesticoTitle', 'domesticoSubtitle', 'domesticoDireito1', 'domesticoDireito2', 'domesticoDireito3', 'domesticoDireito4']
      },
      contato: {
        'Meta Tags e SEO': ['metaTitle', 'metaDescription', 'metaKeywords'],
        'Seção Hero': ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroCta'],
        'Informações': ['infoTitle', 'infoSubtitle'],
        'E-mails': ['emailTitle', 'emailGeral', 'emailCandidatos', 'emailEmpresas', 'emailDireitos', 'emailSuporte'],
        'Telefones': ['whatsappTitle', 'whatsappGeral', 'whatsappEmpresas', 'telefoneTitle', 'telefoneGeral'],
        'Endereço': ['enderecoTitle', 'endereco', 'enderecoCompleto', 'cep'],
        'Horários': ['horarioTitle', 'horarioFuncionamento', 'horarioSabado', 'horarioDomingo'],
        'Formulário': ['formularioTitle', 'formularioSubtitle', 'formNome', 'formEmail', 'formAssunto', 'formBotaoEnviar'],
        'FAQ': ['faqTitle', 'faqSubtitle', 'faq1Pergunta', 'faq1Resposta', 'faq2Pergunta', 'faq2Resposta'],
        'Redes Sociais': ['redesTitle', 'redesSubtitle', 'facebookTexto', 'instagramTexto', 'linkedinTexto']
      },
      configuracoes: {
        'Dados Gerais': ['siteName', 'siteTagline', 'siteDescription', 'siteKeywords'],
        'Empresa': ['empresaNome', 'empresaCnpj', 'empresaEndereco', 'empresaCidade', 'empresaEmail'],
        'Redes Sociais': ['facebookUrl', 'instagramUrl', 'linkedinUrl', 'youtubeUrl'],
        'Analytics': ['googleAnalyticsId', 'facebookPixelId', 'googleTagManagerId'],
        'E-mail': ['emailSmtpHost', 'emailSmtpPort', 'emailSmtpUser', 'emailRemetente'],
        'WhatsApp': ['whatsappNumero', 'whatsappMensagemPadrao', 'whatsappAtivo'],
        'Configurações Gerais': ['manutencaoAtiva', 'vagasAutoAprovacao', 'vagasTempoExpiracao', 'backupAutomatico']
      }
    }
    
    const groups = fieldGroups[page] || { 'Todos os Campos': Object.keys(content) }
    
    return (
      <div className="space-y-8">
        {Object.entries(groups).map(([groupName, fields]) => (
          <div key={groupName} className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              {groupName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(field => {
                if (!content.hasOwnProperty(field)) return null
                const value = content[field]
                const isLongText = field.includes('description') || field.includes('texto') || field.includes('resposta') || field.includes('Text')
                
                return (
                  <div key={field} className={isLongText ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    {isLongText ? (
                      <textarea
                        value={value}
                        onChange={(e) => handleContentChange(page, field, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-govblue-500 text-sm"
                        placeholder={`Digite o ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type={field.includes('email') ? 'email' : field.includes('url') || field.includes('Url') ? 'url' : field.includes('telefone') || field.includes('whatsapp') ? 'tel' : 'text'}
                        value={value}
                        onChange={(e) => handleContentChange(page, field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-govblue-500 text-sm"
                        placeholder={`Digite o ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Editor de Conteúdo - Admin</title>
      </Head>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Editor de Conteúdo
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Edite os textos e conteúdos das páginas do site
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRealStats(!showRealStats)}
                    className="bg-govblue-600 text-white px-4 py-2 rounded-lg hover:bg-govblue-700 transition-colors"
                  >
                    📊 {showRealStats ? 'Ocultar' : 'Ver'} Dados Reais
                  </button>
                  <button
                    onClick={resetToDefaults}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    🔄 Restaurar Padrão
                  </button>
                  <button
                    onClick={saveContents}
                    disabled={loading}
                    className="bg-govgreen-600 text-white px-4 py-2 rounded-lg hover:bg-govgreen-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas Reais */}
          {showRealStats && (
            <div className="bg-white shadow-sm rounded-lg border-l-4 border-govblue-500">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      📊 Estatísticas Reais das Vagas
                    </h3>
                    <p className="text-sm text-gray-500">
                      Dados atualizados em tempo real da API de vagas
                    </p>
                  </div>
                  <button
                    onClick={refreshStats}
                    disabled={statsLoading}
                    className="bg-govgreen-600 text-white px-3 py-1 rounded text-sm hover:bg-govgreen-700 transition-colors disabled:opacity-50"
                  >
                    {statsLoading ? '⏳' : '🔄'} Atualizar
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {statsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">❌ Erro ao carregar estatísticas: {statsError}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Estatísticas Gerais */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Estatísticas Gerais</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {jobStats.formatted.totalJobsFormatted}
                          </div>
                          <div className="text-sm text-gray-600">Total de Vagas</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {jobStats.formatted.recentJobsFormatted}
                          </div>
                          <div className="text-sm text-gray-600">Vagas Recentes</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatJobCount(jobStats.internalJobs)}
                          </div>
                          <div className="text-sm text-gray-600">Vagas Internas</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {formatJobCount(jobStats.externalJobs)}
                          </div>
                          <div className="text-sm text-gray-600">Vagas Externas</div>
                        </div>
                      </div>
                    </div>

                    {/* Vagas por Categoria */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Vagas por Categoria</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(jobStats.categories).map(([category, count]) => (
                          <div key={category} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold text-gray-900">{category}</div>
                            <div className="text-govblue-600 font-medium">
                              {formatCategoryCount(category, count)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cidades com Mais Vagas */}
                    {jobStats.topCities.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Cidades com Mais Vagas</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {jobStats.topCities.slice(0, 10).map(({ city, count }) => (
                            <div key={city} className="bg-yellow-50 p-2 rounded text-center">
                              <div className="font-medium text-gray-900 capitalize text-sm">{city}</div>
                              <div className="text-yellow-600 font-semibold">{formatJobCount(count)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="border-t pt-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            const newContents = { ...contents }
                            newContents.home.stat1Numero = jobStats.formatted.totalJobsFormatted
                            newContents.vagas.heroStats = `Mais de ${jobStats.formatted.totalJobsFormatted} vagas disponíveis`
                            
                            Object.entries(jobStats.categories).forEach(([category, count], index) => {
                              const countKey = `categoria${index + 1}Count`
                              if (newContents.vagas[countKey]) {
                                newContents.vagas[countKey] = `${formatJobCount(count)} vagas`
                              }
                            })
                            
                            setContents(newContents)
                          }}
                          className="bg-govblue-600 text-white px-4 py-2 rounded-lg hover:bg-govblue-700 transition-colors"
                        >
                          🔄 Atualizar Números no Conteúdo
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(jobStats, null, 2))
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          📋 Copiar Dados JSON
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {Object.keys(contents).map((page) => (
                  <button
                    key={page}
                    onClick={() => setActiveTab(page)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === page
                        ? 'border-govblue-500 text-govblue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {page === 'home' && '🏠 Página Inicial'}
                    {page === 'vagas' && '💼 Vagas'}
                    {page === 'empresas' && '🏢 Empresas'}
                    {page === 'calculadora' && '🧮 Calculadora'}
                    {page === 'contato' && '📞 Contato'}
                    {page === 'configuracoes' && '⚙️ Configurações'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Editor */}
            <div className="p-6">
              {renderEditor(activeTab)}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                📱 Preview da Página {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                {/* Meta Tags Preview */}
                {contents[activeTab].metaTitle && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">SEO Preview</h4>
                    <div className="text-sm">
                      <div className="text-blue-600 font-medium">{contents[activeTab].metaTitle}</div>
                      <div className="text-green-600 text-xs">sitedotrabalhador.com.br/{activeTab}</div>
                      <div className="text-gray-600 mt-1">{contents[activeTab].metaDescription}</div>
                    </div>
                  </div>
                )}
                
                {/* Hero Section Preview */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {contents[activeTab].heroTitle || contents[activeTab].title || 'Título Principal'}
                  </h1>
                  <h2 className="text-xl text-gray-600 mb-4">
                    {contents[activeTab].heroSubtitle || contents[activeTab].subtitle || 'Subtítulo'}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {contents[activeTab].heroDescription || contents[activeTab].description || contents[activeTab].aboutText || 'Descrição principal da página...'}
                  </p>
                  {(contents[activeTab].heroCta || contents[activeTab].heroCta1) && (
                    <div className="flex space-x-3">
                      {contents[activeTab].heroCta1 && (
                        <button className="bg-govblue-600 text-white px-6 py-2 rounded-lg font-medium">
                          {contents[activeTab].heroCta1}
                        </button>
                      )}
                      {contents[activeTab].heroCta && (
                        <button className="bg-govgreen-600 text-white px-6 py-2 rounded-lg font-medium">
                          {contents[activeTab].heroCta}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats Preview */}
                {contents[activeTab].stat1Numero && (
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Estatísticas</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['stat1', 'stat2', 'stat3', 'stat4'].map(stat => 
                        contents[activeTab][`${stat}Numero`] && (
                          <div key={stat} className="text-center">
                            <div className="text-2xl font-bold text-govblue-600">
                              {contents[activeTab][`${stat}Numero`]}
                            </div>
                            <div className="text-sm text-gray-600">
                              {contents[activeTab][`${stat}Texto`]}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info Preview */}
                {activeTab === 'contato' && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contents[activeTab].emailGeral && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-gray-900">📧 E-mail Principal</div>
                        <div className="text-gray-700">{contents[activeTab].emailGeral}</div>
                      </div>
                    )}
                    {contents[activeTab].whatsappGeral && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="font-medium text-gray-900">📱 WhatsApp</div>
                        <div className="text-gray-700">{contents[activeTab].whatsappGeral}</div>
                      </div>
                    )}
                    {contents[activeTab].endereco && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">📍 Endereço</div>
                        <div className="text-gray-700">{contents[activeTab].endereco}</div>
                      </div>
                    )}
                    {contents[activeTab].horarioFuncionamento && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="font-medium text-gray-900">� Horário</div>
                        <div className="text-gray-700">{contents[activeTab].horarioFuncionamento}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Services/Benefits Preview */}
                {contents[activeTab].servico1Titulo && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Serviços</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['servico1', 'servico2', 'servico3', 'servico4'].map(servico => 
                        contents[activeTab][`${servico}Titulo`] && (
                          <div key={servico} className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">
                              {contents[activeTab][`${servico}Titulo`]}
                            </h5>
                            <p className="text-gray-600 text-sm">
                              {contents[activeTab][`${servico}Texto`]}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* FAQ Preview */}
                {contents[activeTab].faq1Pergunta && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">FAQ</h4>
                    <div className="space-y-3">
                      {['faq1', 'faq2', 'faq3'].map(faq => 
                        contents[activeTab][`${faq}Pergunta`] && (
                          <div key={faq} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900 mb-1">
                              {contents[activeTab][`${faq}Pergunta`]}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {contents[activeTab][`${faq}Resposta`]}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default AdminContentEditor
