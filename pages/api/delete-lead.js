import { getLeads, saveLeads } from '../../lib/leadsDB'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const { id } = req.query

    console.log('🗑️ Tentando excluir lead com ID:', id)

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do lead é obrigatório' 
      })
    }

    // Buscar todos os leads
    const leads = await getLeads()
    console.log('📋 Total de leads encontrados:', leads.length)
    console.log('🔍 IDs dos leads:', leads.map(lead => ({ id: lead.id || lead.leadId, nome: lead.nome })))
    
    // Encontrar o lead - verificar tanto 'id' quanto 'leadId'
    const leadIndex = leads.findIndex(lead => 
      lead.id === id || 
      lead.leadId === id || 
      lead.id === String(id) || 
      lead.leadId === String(id)
    )
    
    console.log('📍 Index do lead encontrado:', leadIndex)
    
    if (leadIndex === -1) {
      console.log('❌ Lead não encontrado. IDs disponíveis:', leads.map(l => l.id || l.leadId))
      return res.status(404).json({
        success: false,
        message: 'Lead não encontrado'
      })
    }

    const leadToDelete = leads[leadIndex]
    console.log('🎯 Lead encontrado para exclusão:', leadToDelete.nome)

    // Remover o lead
    leads.splice(leadIndex, 1)
    
    // Salvar a lista atualizada
    const saved = await saveLeads(leads)
    
    if (!saved) {
      console.log('❌ Erro ao salvar leads após exclusão')
      return res.status(500).json({
        success: false,
        message: 'Erro ao salvar dados após exclusão'
      })
    }

    console.log('✅ Lead excluído com sucesso:', leadToDelete.nome)

    return res.status(200).json({
      success: true,
      message: 'Lead excluído com sucesso',
      deletedLead: { id: leadToDelete.id || leadToDelete.leadId, nome: leadToDelete.nome }
    })
    
  } catch (error) {
    console.error('❌ Erro ao excluir lead:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    })
  }
}
    
    if (saved) {
      console.log('✅ Lead excluído com sucesso')
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
