// API para gerenciar leads específicos da calculadora trabalhista
const fs = require('fs')
const path = require('path')

const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json')

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Buscar apenas leads da calculadora
      let leads = []
      
      if (fs.existsSync(leadsFilePath)) {
        const leadsData = fs.readFileSync(leadsFilePath, 'utf8')
        const allLeads = JSON.parse(leadsData)
        
        // Filtrar apenas leads que vieram da calculadora
        leads = allLeads.filter(lead => 
          lead.source === 'Calculadora Trabalhista' || 
          lead.source === 'Calculadora de Direitos' ||
          lead.fonte === 'Calculadora Trabalhista' ||
          lead.calculatorType || 
          lead.calculator ||
          lead.result
        )
        
        // Ordenar por data mais recente
        leads.sort((a, b) => new Date(b.timestamp || b.dataChegada) - new Date(a.timestamp || a.dataChegada))
      }
      
      console.log(`📊 Retornando ${leads.length} leads da calculadora`)
      
      return res.status(200).json({
        success: true,
        leads: leads,
        total: leads.length,
        message: `${leads.length} leads da calculadora encontrados`
      })
      
    } else if (req.method === 'DELETE') {
      // Excluir lead específico da calculadora
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do lead é obrigatório'
        })
      }
      
      if (fs.existsSync(leadsFilePath)) {
        const leadsData = fs.readFileSync(leadsFilePath, 'utf8')
        let allLeads = JSON.parse(leadsData)
        
        const initialLength = allLeads.length
        allLeads = allLeads.filter(lead => lead.id !== id)
        
        if (allLeads.length === initialLength) {
          return res.status(404).json({
            success: false,
            message: 'Lead não encontrado'
          })
        }
        
        fs.writeFileSync(leadsFilePath, JSON.stringify(allLeads, null, 2))
        
        return res.status(200).json({
          success: true,
          message: 'Lead da calculadora excluído com sucesso'
        })
      }
      
      return res.status(404).json({
        success: false,
        message: 'Nenhum lead encontrado'
      })
      
    } else {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido'
      })
    }
    
  } catch (error) {
    console.error('❌ Erro na API calculator-leads:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    })
  }
}
