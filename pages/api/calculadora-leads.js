// API para gerenciar leads da Calculadora Trabalhista
import fs from 'fs'
import path from 'path'

const CALCULADORA_LEADS_FILE = path.join(process.cwd(), 'data', 'calculadora-leads.json')

// Garantir que a pasta data existe
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Garantir que o arquivo existe
if (!fs.existsSync(CALCULADORA_LEADS_FILE)) {
  fs.writeFileSync(CALCULADORA_LEADS_FILE, JSON.stringify([], null, 2))
}

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        return handleGet(req, res)
      case 'POST':
        return handlePost(req, res)
      case 'DELETE':
        return handleDelete(req, res)
      default:
        return res.status(405).json({
          success: false,
          message: 'Método não permitido'
        })
    }
  } catch (error) {
    console.error('❌ Erro na API calculadora-leads:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    })
  }
}

// GET - Listar todos os leads da calculadora
async function handleGet(req, res) {
  try {
    const { format } = req.query
    
    const data = fs.readFileSync(CALCULADORA_LEADS_FILE, 'utf8')
    const leads = JSON.parse(data)

    // Ordenar por data mais recente
    const sortedLeads = leads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    if (format === 'csv') {
      // Exportar como CSV
      const csvHeaders = [
        'Data/Hora',
        'Nome',
        'WhatsApp',
        'E-mail',
        'Calculadora Usada',
        'Resultado',
        'Problema Relatado',
        'LGPD Aceito'
      ].join(',')

      const csvRows = sortedLeads.map(lead => [
        lead.dataChegada || new Date(lead.timestamp).toLocaleString('pt-BR'),
        `"${lead.nome || ''}"`,
        lead.telefone || lead.whatsapp || '',
        lead.email || '',
        lead.calculatorType || lead.calculator || '',
        `"${JSON.stringify(lead.result || {})}"`,
        `"${lead.problema || ''}"`,
        lead.lgpdConsent ? 'Sim' : 'Não'
      ].join(','))

      const csvContent = [csvHeaders, ...csvRows].join('\n')
      
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=calculadora-leads.csv')
      return res.status(200).send(csvContent)
    }

    return res.status(200).json({
      success: true,
      leads: sortedLeads,
      total: sortedLeads.length,
      message: `${sortedLeads.length} leads da calculadora encontrados`
    })

  } catch (error) {
    console.error('❌ Erro ao buscar leads da calculadora:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar leads da calculadora',
      leads: []
    })
  }
}

// POST - Salvar novo lead da calculadora
async function handlePost(req, res) {
  try {
    const leadData = req.body

    // Validações básicas
    if (!leadData.nome || !leadData.telefone) {
      return res.status(400).json({
        success: false,
        message: 'Nome e telefone são obrigatórios'
      })
    }

    // Adicionar metadados
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      timestamp: new Date().toISOString(),
      dataChegada: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'Calculadora Trabalhista',
      userAgent: req.headers['user-agent'] || '',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''
    }

    // Ler dados existentes
    const data = fs.readFileSync(CALCULADORA_LEADS_FILE, 'utf8')
    const leads = JSON.parse(data)

    // Adicionar novo lead
    leads.push(newLead)

    // Salvar de volta
    fs.writeFileSync(CALCULADORA_LEADS_FILE, JSON.stringify(leads, null, 2))

    console.log('✅ Novo lead da calculadora salvo:', {
      id: newLead.id,
      nome: newLead.nome,
      calculadora: newLead.calculatorType || newLead.calculator
    })

    return res.status(201).json({
      success: true,
      message: 'Lead da calculadora salvo com sucesso',
      leadId: newLead.id
    })

  } catch (error) {
    console.error('❌ Erro ao salvar lead da calculadora:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao salvar lead da calculadora'
    })
  }
}

// DELETE - Excluir lead da calculadora
async function handleDelete(req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do lead é obrigatório'
      })
    }

    // Ler dados existentes
    const data = fs.readFileSync(CALCULADORA_LEADS_FILE, 'utf8')
    const leads = JSON.parse(data)

    // Filtrar removendo o lead
    const updatedLeads = leads.filter(lead => lead.id !== id)

    if (leads.length === updatedLeads.length) {
      return res.status(404).json({
        success: false,
        message: 'Lead não encontrado'
      })
    }

    // Salvar de volta
    fs.writeFileSync(CALCULADORA_LEADS_FILE, JSON.stringify(updatedLeads, null, 2))

    console.log('🗑️ Lead da calculadora excluído:', id)

    return res.status(200).json({
      success: true,
      message: 'Lead da calculadora excluído com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao excluir lead da calculadora:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir lead da calculadora'
    })
  }
}
