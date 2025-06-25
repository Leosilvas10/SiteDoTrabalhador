import { promises as fs } from 'fs'
import path from 'path'

// Função para garantir que o diretório existe
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  return dataDir
}

// Função para ler leads do arquivo JSON
export async function getLeads() {
  try {
    const dataDir = await ensureDataDir()
    const filePath = path.join(dataDir, 'leads.json')
    
    try {
      const data = await fs.readFile(filePath, 'utf8')
      return JSON.parse(data)
    } catch {
      // Se o arquivo não existe, retorna array vazio
      return []
    }
  } catch (error) {
    console.error('Erro ao ler leads:', error)
    return []
  }
}

// Função para salvar leads no arquivo JSON
export async function saveLeads(leads) {
  try {
    const dataDir = await ensureDataDir()
    const filePath = path.join(dataDir, 'leads.json')
    
    await fs.writeFile(filePath, JSON.stringify(leads, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Erro ao salvar leads:', error)
    return false
  }
}

// Função para adicionar um novo lead
export async function addLead(leadData) {
  try {
    const leads = await getLeads()
    
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      createdAt: new Date().toISOString(),
      status: 'novo'
    }
    
    leads.push(newLead)
    const saved = await saveLeads(leads)
    
    if (saved) {
      return { success: true, lead: newLead }
    } else {
      return { success: false, error: 'Erro ao salvar lead' }
    }
  } catch (error) {
    console.error('Erro ao adicionar lead:', error)
    return { success: false, error: error.message }
  }
}

// Função para converter leads para CSV
export function leadsToCSV(leads) {
  if (!leads || leads.length === 0) {
    return 'Nenhum lead encontrado'
  }

  const headers = [
    'ID',
    'Nome',
    'WhatsApp',
    'Email',
    'Vaga de Interesse',
    'Empresa da Vaga',
    'URL da Vaga',
    'Local da Vaga',
    'Salário da Vaga',
    'Última Empresa',
    'Status de Trabalho',
    'Recebeu Direitos',
    'Problemas Trabalhistas',
    'Quer Consultoria',
    'Data de Criação',
    'Status'
  ]

  const rows = leads.map(lead => [
    lead.id || '',
    lead.name || '',
    lead.whatsapp || '',
    lead.email || '',
    lead.jobTitle || '',
    lead.jobCompany || '',
    lead.jobUrl || '',
    lead.jobLocation || '',
    lead.jobSalary || '',
    lead.lastCompany || '',
    lead.workStatus || '',
    lead.receivedRights || '',
    lead.workIssues || '',
    lead.wantConsultation || '',
    lead.createdAt ? new Date(lead.createdAt).toLocaleString('pt-BR') : '',
    lead.status || 'novo'
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}
