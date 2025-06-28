// Função para salvar leads tanto localmente quanto em produção
import { promises as fs } from 'fs'
import path from 'path'

// Detectar ambiente
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'

// Array em memória para produção (temporário)
let productionLeads = []

// Função para garantir que o diretório existe (apenas em desenvolvimento)
async function ensureDataDir() {
  if (isProduction) return null
  
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  return dataDir
}

// Função para ler leads
export async function getLeads() {
  try {
    if (isProduction) {
      // Em produção, retornar leads da memória ou de uma API externa
      console.log('📊 Produção: Retornando leads da memória:', productionLeads.length)
      return productionLeads
    }
    
    // Em desenvolvimento, ler do arquivo
    const dataDir = await ensureDataDir()
    const filePath = path.join(dataDir, 'leads.json')
    
    try {
      const data = await fs.readFile(filePath, 'utf8')
      const leads = JSON.parse(data)
      console.log('📊 Desenvolvimento: Leads carregados do arquivo:', leads.length)
      return leads
    } catch {
      return []
    }
  } catch (error) {
    console.error('❌ Erro ao ler leads:', error)
    return []
  }
}

// Função para salvar leads
export async function saveLeads(leads) {
  try {
    if (isProduction) {
      // Em produção, salvar na memória e tentar enviar para uma API externa
      productionLeads = [...leads]
      console.log('💾 Produção: Leads salvos na memória:', productionLeads.length)
      
      // Aqui poderia integrar com Google Sheets, Airtable, ou outro serviço
      // await sendToExternalAPI(leads)
      
      return true
    }
    
    // Em desenvolvimento, salvar no arquivo
    console.log('💾 Desenvolvimento: Salvando leads no arquivo...')
    const dataDir = await ensureDataDir()
    const filePath = path.join(dataDir, 'leads.json')
    
    await fs.writeFile(filePath, JSON.stringify(leads, null, 2), 'utf8')
    console.log('✅ Leads salvos no arquivo local')
    return true
    
  } catch (error) {
    console.error('❌ Erro ao salvar leads:', error)
    throw error
  }
}

// Função para adicionar um novo lead
export async function addLead(leadData) {
  try {
    const leads = await getLeads()
    leads.push(leadData)
    await saveLeads(leads)
    
    console.log(`✅ Lead adicionado: ${leadData.nome} (${leadData.id})`)
    return leadData
  } catch (error) {
    console.error('❌ Erro ao adicionar lead:', error)
    throw error
  }
}

// Função para deletar um lead
export async function deleteLead(leadId) {
  try {
    const leads = await getLeads()
    const initialLength = leads.length
    
    const filteredLeads = leads.filter(lead => 
      lead.id !== leadId && lead.leadId !== leadId
    )
    
    if (filteredLeads.length === initialLength) {
      throw new Error('Lead não encontrado')
    }
    
    await saveLeads(filteredLeads)
    
    const deletedLead = leads.find(lead => 
      lead.id === leadId || lead.leadId === leadId
    )
    
    console.log(`🗑️ Lead deletado: ${leadId}`)
    return deletedLead
  } catch (error) {
    console.error('❌ Erro ao deletar lead:', error)
    throw error
  }
}

// Função para exportar leads como CSV
export function leadsToCSV(leads) {
  if (!leads || leads.length === 0) {
    return 'Nenhum lead encontrado'
  }

  const headers = [
    'ID', 'Nome', 'Email', 'Telefone', 'WhatsApp', 
    'Última Empresa', 'Status Trabalho', 'Recebeu Direitos',
    'Problemas Trabalho', 'Deseja Consultoria',
    'Vaga', 'Empresa', 'Data', 'Fonte', 'Status'
  ]

  const csvRows = [headers.join(',')]

  leads.forEach(lead => {
    const row = [
      lead.id || lead.leadId || '',
      `"${lead.nome || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.telefone || ''}"`,
      `"${lead.whatsapp || ''}"`,
      `"${lead.ultimaEmpresa || ''}"`,
      `"${lead.statusTrabalho || ''}"`,
      `"${lead.recebeuDireitos || ''}"`,
      `"${lead.problemasTrabalho || ''}"`,
      `"${lead.desejaConsultoria || ''}"`,
      `"${lead.jobTitle || ''}"`,
      `"${lead.company || ''}"`,
      `"${lead.timestamp || ''}"`,
      `"${lead.source || ''}"`,
      `"${lead.status || ''}"`,
    ]
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}
