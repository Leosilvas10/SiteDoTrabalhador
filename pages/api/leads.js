import { addLead } from '../../lib/leadsDB'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const {
      name,
      whatsapp,
      email,
      jobTitle,
      jobCompany,
      jobUrl,
      jobLocation,
      jobSalary,
      lastCompany,
      workStatus,
      receivedRights,
      workIssues,
      wantConsultation,
      lgpdConsent
    } = req.body

    // Validações básicas
    if (!name || !whatsapp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome e WhatsApp são obrigatórios' 
      })
    }

    if (!lgpdConsent) {
      return res.status(400).json({ 
        success: false, 
        message: 'É necessário aceitar a LGPD' 
      })
    }

    // Dados do lead
    const leadData = {
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email?.trim() || '',
      jobTitle: jobTitle || '',
      jobCompany: jobCompany || '',
      jobUrl: jobUrl || '',
      jobLocation: jobLocation || '',
      jobSalary: jobSalary || '',
      lastCompany: lastCompany?.trim() || '',
      workStatus: workStatus || '',
      receivedRights: receivedRights || '',
      workIssues: workIssues || '',
      wantConsultation: wantConsultation || '',
      lgpdConsent,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    }

    // Salvar o lead
    const result = await addLead(leadData)

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Lead cadastrado com sucesso!',
        leadId: result.lead.id
      })
    } else {
      res.status(500).json({
        success: false,
        message: result.error || 'Erro interno do servidor'
      })
    }

  } catch (error) {
    console.error('Erro na API de leads:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}
