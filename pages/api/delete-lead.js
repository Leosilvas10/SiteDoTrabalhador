import { getLeads, saveLeads } from '../../lib/leadsDB'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do lead é obrigatório' 
      })
    }

    // Buscar todos os leads
    const leads = await getLeads()
    
    // Encontrar o lead para verificar se existe
    const leadIndex = leads.findIndex(lead => lead.id === id)
    
    if (leadIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lead não encontrado'
      })
    }

    // Remover o lead
    leads.splice(leadIndex, 1)
    
    // Salvar a lista atualizada
    const saved = await saveLeads(leads)
    
    if (saved) {
      res.status(200).json({
        success: true,
        message: 'Lead excluído com sucesso'
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao salvar alterações'
      })
    }

  } catch (error) {
    console.error('Erro ao excluir lead:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}
