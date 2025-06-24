
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const leadData = req.body;

    // Validações server-side
    if (!leadData.nome || leadData.nome.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome deve ter pelo menos 2 caracteres' 
      });
    }

    if (!leadData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email inválido' 
      });
    }

    if (!leadData.experiencia || leadData.experiencia.length < 20) {
      return res.status(400).json({ 
        success: false, 
        message: 'Descrição da experiência deve ter pelo menos 20 caracteres' 
      });
    }

    if (!leadData.lgpdConsent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Consentimento LGPD é obrigatório' 
      });
    }
    
    // Adicionar informações de rastreamento
    const submissionData = {
      ...leadData,
      timestamp: new Date().toLocaleString('pt-BR'),
      timestampISO: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      leadId: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: 'Site do Trabalhador',
      validated: true
    };

    // Log detalhado do lead
    console.log('✅ Novo lead validado:', {
      leadId: submissionData.leadId,
      nome: submissionData.nome,
      email: submissionData.email,
      telefone: submissionData.telefone,
      vaga: submissionData.jobTitle,
      empresa: submissionData.company,
      timestamp: submissionData.timestamp
    });

    // You can integrate with:
    // 1. Google Sheets API directly
    // 2. SheetDB (https://sheetdb.io/)
    // 3. Google Apps Script Web App
    
    // Example SheetDB integration:
    // const response = await fetch('https://sheetdb.io/api/v1/YOUR_SHEET_ID', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(submissionData)
    // });

    // Send email notification (you can use EmailJS, Resend, or similar)
    // await sendEmailNotification(submissionData);

    res.status(200).json({ 
      success: true, 
      message: 'Lead submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting lead' 
    });
  }
}
