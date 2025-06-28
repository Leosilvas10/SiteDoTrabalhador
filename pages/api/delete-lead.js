// API para deletar leads com suporte a produção
const fs = require('fs').promises;
const path = require('path');

// Detectar ambiente
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

// Array em memória para produção
let productionLeads = [];

// Função para ler leads
async function getLeads() {
  if (isProduction) {
    return productionLeads;
  }
  
  try {
    const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');
    const fileContent = await fs.readFile(leadsFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (err) {
    return [];
  }
}

// Função para salvar leads
async function saveLeads(leads) {
  if (isProduction) {
    productionLeads = [...leads];
    console.log('💾 Produção: Leads atualizados na memória. Total:', productionLeads.length);
    return true;
  }
  
  try {
    const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');
    await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar leads:', error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    // Para POST, o ID vem no body. Para DELETE, vem na query
    const { leadId, id } = req.method === 'POST' ? req.body : req.query
    const leadIdToDelete = leadId || id

    console.log('🗑️ Tentando excluir lead com ID:', leadIdToDelete)

    if (!leadIdToDelete) {
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
      lead.id === leadIdToDelete || 
      lead.leadId === leadIdToDelete || 
      lead.id === String(leadIdToDelete) || 
      lead.leadId === String(leadIdToDelete)
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
