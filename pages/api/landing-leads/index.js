
import fs from 'fs/promises'
import path from 'path'

const LEADS_FILE = path.join(process.cwd(), 'data', 'landing-leads.json')

async function getLeads() {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveLeads(leads) {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true })
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
}

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        const leads = await getLeads()
        res.status(200).json({ success: true, data: leads })
        break

      case 'POST':
        const { nome, telefone, email, landingSlug, utm } = req.body

        // Validações
        if (!nome || nome.trim().length < 2) {
          return res.status(400).json({ success: false, message: 'Nome é obrigatório' })
        }

        if (!telefone || telefone.trim().length < 10) {
          return res.status(400).json({ success: false, message: 'Telefone é obrigatório' })
        }

        if (!email || !email.includes('@')) {
          return res.status(400).json({ success: false, message: 'E-mail válido é obrigatório' })
        }

        if (!landingSlug) {
          return res.status(400).json({ success: false, message: 'Landing slug é obrigatório' })
        }

        // Criar novo lead
        const newLead = {
          id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim().toLowerCase(),
          landingSlug,
          landingTitulo: req.body.landingTitulo || '',
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          utm: utm || {},
          criadoEm: new Date().toISOString(),
          status: 'novo'
        }

        // Salvar lead
        const allLeads = await getLeads()
        allLeads.push(newLead)
        
        // Manter apenas os últimos 1000 leads
        if (allLeads.length > 1000) {
          allLeads.splice(0, allLeads.length - 1000)
        }

        await saveLeads(allLeads)

        console.log(`✅ Novo lead da landing ${landingSlug}:`, {
          id: newLead.id,
          nome: newLead.nome,
          email: newLead.email,
          telefone: newLead.telefone
        })

        res.status(201).json({
          success: true,
          message: 'Lead cadastrado com sucesso!',
          data: newLead
        })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Erro na API de leads:', error)
    res.status(500).json({ success: false, message: 'Erro interno do servidor' })
  }
}
