// API para buscar leads com suporte a produção
const fs = require('fs').promises;
const path = require('path');

// Detectar ambiente - versão mais robusta
const isProduction = process.env.NODE_ENV === 'production' || 
                     process.env.VERCEL_ENV === 'production' ||
                     process.env.VERCEL === '1';

// Array em memória para produção - usar globalThis para compartilhar entre APIs
if (!globalThis.productionLeads) {
  globalThis.productionLeads = [];
}

// Função para debug de ambiente
function logEnvironmentInfo() {
  console.log('🔍 Get-Leads Environment Debug:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL: process.env.VERCEL,
    isProduction: isProduction,
    globalLeadsCount: globalThis.productionLeads?.length || 0
  });
}

// Função para ler leads
async function getLeads() {
  logEnvironmentInfo();
  
  if (isProduction) {
    console.log('📊 Produção: Retornando leads da memória:', productionLeads.length);
    if (productionLeads.length > 0) {
      console.log('📊 Últimos 3 IDs na memória:', productionLeads.slice(-3).map(l => l.id));
    }
    return productionLeads;
  }
  
  try {
    const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');
    const fileContent = await fs.readFile(leadsFilePath, 'utf8');
    const leads = JSON.parse(fileContent);
    console.log('📊 Desenvolvimento: Leads do arquivo:', leads.length);
    return leads;
  } catch (err) {
    console.log('📊 Nenhum arquivo de leads encontrado');
    return [];
  }
}

// Função para exportar como CSV
function leadsToCSV(leads) {
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
