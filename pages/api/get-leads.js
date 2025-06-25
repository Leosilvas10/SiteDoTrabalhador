import { getLeads, leadsToCSV } from '../../lib/leadsDB'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const { format } = req.query

    const leads = await getLeads()

    if (format === 'csv') {
      // Exportar como CSV
      const csvData = leadsToCSV(leads)
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.csv"`)
      
      return res.status(200).send('\uFEFF' + csvData) // BOM para UTF-8
    }

    // Retornar como JSON
    res.status(200).json({
      success: true,
      leads,
      total: leads.length
    })

  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}
