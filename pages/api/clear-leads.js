import { saveLeads } from '../../lib/leadsDB'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    // Salvar array vazio (limpar todos os leads)
    const saved = await saveLeads([])
    
    if (saved) {
      res.status(200).json({
        success: true,
        message: 'Todos os leads foram excluídos com sucesso'
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao limpar leads'
      })
    }

  } catch (error) {
    console.error('Erro ao limpar leads:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}
