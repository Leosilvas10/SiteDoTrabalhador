import fs from 'fs/promises'
import path from 'path'

const LANDING_PAGES_FILE = path.join(process.cwd(), 'data', 'landing-pages.json')

// Dados padrão das landing pages
const defaultLandingPages = [
  {
    id: 'jotasolucoes',
    slug: 'jotasolucoes',
    titulo: 'Jota Soluções - Transforme Seu Negócio',
    subtitulo: 'Soluções inovadoras para empresas que querem crescer',
    heroDescription: 'Oferecemos consultoria especializada e tecnologia de ponta para impulsionar seu negócio ao próximo nível.',
    sobre: {
      titulo: 'Sobre a Jota Soluções',
      texto: 'Com mais de 10 anos de experiência no mercado, ajudamos empresas a otimizar processos e aumentar resultados.',
      imagem: '/images/jota-sobre.jpg'
    },
    servicos: {
      titulo: 'Nossos Serviços',
      subtitulo: 'Soluções completas para sua empresa',
      lista: [
        {
          titulo: 'Consultoria Empresarial',
          descricao: 'Análise completa dos processos da sua empresa',
          icone: '💼'
        },
        {
          titulo: 'Automação de Processos',
          descricao: 'Tecnologia para otimizar suas operações',
          icone: '⚙️'
        },
        {
          titulo: 'Treinamento de Equipes',
          descricao: 'Capacitação para máxima produtividade',
          icone: '🎓'
        }
      ]
    },
    bonus: {
      titulo: 'Oferta Especial',
      descricao: 'Diagnóstico empresarial gratuito para os primeiros 50 cadastros',
      imagem: '/images/bonus-jota.jpg',
      ctaTexto: 'Quero Meu Diagnóstico Grátis'
    },
    formulario: {
      titulo: 'Solicite Seu Diagnóstico Gratuito',
      subtitulo: 'Preencha os dados e nossa equipe entrará em contato',
      ctaTexto: 'Solicitar Diagnóstico'
    },
    whatsapp: {
      numero: '5511999999999',
      mensagem: 'Olá! Vim do site da Jota Soluções e quero saber mais sobre o diagnóstico gratuito.',
      ctaTexto: 'Falar no WhatsApp'
    },
    pdfs: [],
    imagens: {
      hero: '/images/jota-hero.jpg',
      sobre: '/images/jota-sobre.jpg',
      bonus: '/images/bonus-jota.jpg',
      logo: '/images/logo-jota.png'
    },
    metaTitle: 'Jota Soluções - Consultoria Empresarial',
    metaDescription: 'Transforme seu negócio com nossas soluções inovadoras. Diagnóstico gratuito!',
    metaKeywords: 'consultoria, empresa, negócio, diagnóstico',
    ativo: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  },
  {
    id: 'metodocor',
    slug: 'metodocor',
    titulo: 'Método Cor - Desperte Sua Verdadeira Beleza',
    subtitulo: 'Descubra as cores que valorizam sua personalidade',
    heroDescription: 'Transforme sua imagem pessoal e profissional com nossa consultoria em coloração personalizada.',
    sobre: {
      titulo: 'O Que É o Método Cor',
      texto: 'Nossa metodologia exclusiva analisa seu tom de pele, cabelo e olhos para encontrar sua paleta perfeita.',
      imagem: '/images/metodo-sobre.jpg'
    },
    servicos: {
      titulo: 'Nossos Serviços',
      subtitulo: 'Transformação completa da sua imagem',
      lista: [
        {
          titulo: 'Análise de Coloração',
          descricao: 'Descubra sua paleta de cores ideal',
          icone: '🎨'
        },
        {
          titulo: 'Consultoria de Estilo',
          descricao: 'Orientação completa sobre vestuário',
          icone: '👗'
        },
        {
          titulo: 'Maquiagem Personalizada',
          descricao: 'Técnicas e produtos para seu tom',
          icone: '💄'
        }
      ]
    },
    bonus: {
      titulo: 'Bônus Exclusivo',
      descricao: 'E-book "Guia das Cores" + paleta personalizada para as primeiras 30 inscrições',
      imagem: '/images/bonus-metodo.jpg',
      ctaTexto: 'Quero Meu Bônus'
    },
    formulario: {
      titulo: 'Agende Sua Consultoria',
      subtitulo: 'Preencha os dados e descubra suas cores',
      ctaTexto: 'Agendar Consultoria'
    },
    whatsapp: {
      numero: '5511888888888',
      mensagem: 'Oi! Vi o site do Método Cor e quero agendar minha consultoria de coloração.',
      ctaTexto: 'Agendar pelo WhatsApp'
    },
    pdfs: [],
    imagens: {
      hero: '/images/metodo-hero.jpg',
      sobre: '/images/metodo-sobre.jpg',
      bonus: '/images/bonus-metodo.jpg',
      logo: '/images/logo-metodo.png'
    },
    metaTitle: 'Método Cor - Consultoria em Coloração Pessoal',
    metaDescription: 'Descubra as cores que mais valorizam você. Agende sua consultoria!',
    metaKeywords: 'coloração pessoal, consultoria, cores, estilo, beleza',
    ativo: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  },
  {
    id: 'bancojota',
    slug: 'bancojota',
    titulo: 'Seu sonho realizado com',
    subtitulo: 'Consórcio Inteligente',
    heroDescription: 'Te acompanhamos do primeiro contato até a entrega do seu bem. Consultoria financeira personalizada e processo transparente.',
    sobre: {
      titulo: 'Por que fazer consórcio com o Banco Jota?',
      texto: 'Não somos apenas uma administradora de consórcio. Somos seus parceiros na realização do seu sonho, oferecendo consultoria especializada e acompanhamento personalizado.'
    },
    servicos: {
      titulo: 'Nossos Diferenciais',
      subtitulo: 'O que nos torna únicos no mercado de consórcios',
      lista: [
        {
          titulo: 'Consultoria Personalizada',
          descricao: 'Análise completa do seu perfil financeiro para definir a melhor estratégia de contemplação.',
          icone: '🎯'
        },
        {
          titulo: 'Acompanhamento 360°',
          descricao: 'Desde a adesão até a entrega do bem, você tem suporte total da nossa equipe especializada.',
          icone: '🔄'
        },
        {
          titulo: 'Processo Consultivo',
          descricao: 'Não vendemos consórcio, fazemos consultoria. Indicamos o que é melhor para seu caso específico.',
          icone: '💡'
        }
      ]
    },
    bonus: {
      titulo: 'Oferta Especial',
      descricao: 'Consultoria gratuita para análise do seu perfil e definição da melhor estratégia de contemplação.',
      imagem: '/images/bonus-banco.jpg',
      ctaTexto: 'Quero Minha Consultoria Grátis'
    },
    formulario: {
      titulo: 'Consultoria Gratuita',
      subtitulo: 'Preencha seus dados e nosso consultor entrará em contato',
      ctaTexto: '🎯 Quero Consultoria'
    },
    whatsapp: {
      numero: '5511999887766',
      mensagem: 'Olá! Tenho interesse no consórcio do Banco Jota. Gostaria de mais informações sobre como funciona e quais são as condições.',
      ctaTexto: 'Falar com Consultor'
    },
    pdfs: [
      {
        nome: 'Guia Completo do Consórcio',
        url: '#',
        descricao: 'Tudo que você precisa saber sobre consórcio'
      }
    ],
    imagens: {
      hero: '/images/banco-hero.jpg',
      sobre: '/images/banco-sobre.jpg',
      bonus: '/images/bonus-banco.jpg',
      logo: '/images/logo-banco.png'
    },
    metaTitle: 'Banco Jota - Consórcio com Consultoria Especializada',
    metaDescription: 'Realize seu sonho com o consórcio do Banco Jota. Atendimento personalizado e consultoria financeira até a contemplação.',
    metaKeywords: 'consórcio, banco jota, financiamento, consultoria financeira, contemplação',
    ativo: true,
    criadoEm: '2024-01-15T10:30:00.000Z',
    atualizadoEm: '2024-01-20T14:45:00.000Z'
  }
]

async function getLandingPages() {
  try {
    const data = await fs.readFile(LANDING_PAGES_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Se arquivo não existe, criar com dados padrão
    await fs.mkdir(path.dirname(LANDING_PAGES_FILE), { recursive: true })
    await fs.writeFile(LANDING_PAGES_FILE, JSON.stringify(defaultLandingPages, null, 2))
    return defaultLandingPages
  }
}

async function saveLandingPages(pages) {
  await fs.writeFile(LANDING_PAGES_FILE, JSON.stringify(pages, null, 2))
}

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        const pages = await getLandingPages()
        res.status(200).json({ success: true, data: pages })
        break

      case 'POST':
        const newPage = {
          ...req.body,
          id: req.body.slug,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        }

        const allPages = await getLandingPages()
        allPages.push(newPage)
        await saveLandingPages(allPages)

        res.status(201).json({ success: true, data: newPage })
        break

      case 'PUT':
        const { id } = req.query
        const updatedPage = {
          ...req.body,
          atualizadoEm: new Date().toISOString()
        }

        const pages2 = await getLandingPages()
        const index = pages2.findIndex(p => p.id === id)

        if (index === -1) {
          return res.status(404).json({ success: false, message: 'Página não encontrada' })
        }

        pages2[index] = { ...pages2[index], ...updatedPage }
        await saveLandingPages(pages2)

        res.status(200).json({ success: true, data: pages2[index] })
        break

      case 'DELETE':
        const { id: deleteId } = req.query

        const pages3 = await getLandingPages()
        const filteredPages = pages3.filter(p => p.id !== deleteId)

        if (pages3.length === filteredPages.length) {
          return res.status(404).json({ success: false, message: 'Página não encontrada' })
        }

        await saveLandingPages(filteredPages)
        res.status(200).json({ success: true, message: 'Página deletada' })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Erro na API de landing pages:', error)
    res.status(500).json({ success: false, message: 'Erro interno do servidor' })
  }
}