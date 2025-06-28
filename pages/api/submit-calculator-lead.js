// API específica para leads da calculadora trabalhista
const fs = require('fs')
const path = require('path')

const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json')

// Garantir que o diretório existe
const ensureDirectoryExists = () => {
  const dir = path.dirname(leadsFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido. Use POST.'
      })
    }

    ensureDirectoryExists()

    const leadData = req.body
    console.log('📊 Recebendo lead da calculadora:', leadData)

    // Validação básica
    if (!leadData.nome || !leadData.telefone) {
      return res.status(400).json({
        success: false,
        message: 'Nome e telefone são obrigatórios'
      })
    }

    // Criar lead estruturado para calculadora
    const calculatorLead = {
      id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      
      // Dados pessoais
      nome: leadData.nome,
      telefone: leadData.telefone,
      whatsapp: leadData.telefone,
      email: leadData.email || 'Não informado',
      
      // Dados específicos da calculadora
      calculatorType: leadData.calculatorType || leadData.calculator || 'Não especificado',
      result: leadData.result || 'Resultado não disponível',
      problema: leadData.problema || leadData.problem || 'Não informado',
      
      // Metadados
      source: 'Calculadora Trabalhista',
      fonte: 'Calculadora Trabalhista',
      type: 'calculator',
      status: 'novo',
      
      // Timestamps
      timestamp: new Date().toISOString(),
      dataChegada: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      createdAt: new Date().toISOString(),
      
      // Dados técnicos
      userAgent: req.headers['user-agent'] || 'Não disponível',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Não disponível',
      
      // LGPD
      lgpdConsent: leadData.lgpdConsent || false
    }

    // Ler leads existentes
    let existingLeads = []
    if (fs.existsSync(leadsFilePath)) {
      try {
        const data = fs.readFileSync(leadsFilePath, 'utf8')
        existingLeads = JSON.parse(data)
      } catch (error) {
        console.error('Erro ao ler leads existentes:', error)
        existingLeads = []
      }
    }

    // Adicionar novo lead
    existingLeads.push(calculatorLead)

    // Salvar no arquivo
    fs.writeFileSync(leadsFilePath, JSON.stringify(existingLeads, null, 2))

    console.log('✅ Lead da calculadora salvo com sucesso:', calculatorLead.id)

    return res.status(200).json({
      success: true,
      message: 'Lead da calculadora registrado com sucesso!',
      leadId: calculatorLead.id,
      data: {
        nome: calculatorLead.nome,
        telefone: calculatorLead.telefone,
        calculatorType: calculatorLead.calculatorType,
        timestamp: calculatorLead.timestamp
      }
    })

  } catch (error) {
    console.error('❌ Erro ao processar lead da calculadora:', error)
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao registrar lead',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    })
  }
}
