
export const LandingPageSchema = {
  id: String,
  slug: String, // jotasolucoes, metodocor, bancojota
  titulo: String,
  subtitulo: String,
  heroDescription: String,
  
  // Seções editáveis
  sobre: {
    titulo: String,
    texto: String,
    imagem: String
  },
  
  servicos: {
    titulo: String,
    subtitulo: String,
    lista: [
      {
        titulo: String,
        descricao: String,
        icone: String
      }
    ]
  },
  
  bonus: {
    titulo: String,
    descricao: String,
    imagem: String,
    ctaTexto: String
  },
  
  // Formulário
  formulario: {
    titulo: String,
    subtitulo: String,
    ctaTexto: String
  },
  
  // WhatsApp
  whatsapp: {
    numero: String,
    mensagem: String,
    ctaTexto: String
  },
  
  // PDFs
  pdfs: [
    {
      nome: String,
      url: String,
      descricao: String
    }
  ],
  
  // Imagens
  imagens: {
    hero: String,
    sobre: String,
    bonus: String,
    logo: String
  },
  
  // SEO
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
  
  // Status
  ativo: Boolean,
  criadoEm: Date,
  atualizadoEm: Date
}

export const LeadSchema = {
  id: String,
  nome: String,
  telefone: String,
  email: String,
  landingSlug: String,
  landingTitulo: String,
  ip: String,
  userAgent: String,
  utm: {
    source: String,
    medium: String,
    campaign: String
  },
  criadoEm: Date,
  status: String // novo, contatado, convertido
}
