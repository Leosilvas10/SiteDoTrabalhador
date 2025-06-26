
// API para submissão de leads com redirecionamento para vaga original
const fs = require('fs').promises;
const path = require('path');

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
    
    // Adicionar informações de rastreamento e redirecionamento
    const submissionData = {
      ...leadData,
      timestamp: new Date().toLocaleString('pt-BR'),
      timestampISO: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      leadId: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: 'Site do Trabalhador',
      validated: true,
      
      // Dados da vaga para redirecionamento
      jobId: leadData.jobId,
      jobLink: leadData.jobLink || leadData.originalJobUrl,
      originalLocation: leadData.originalLocation,
      company: leadData.company,
      jobTitle: leadData.jobTitle
    };

    // Log detalhado do lead
    console.log('✅ Novo lead validado:', {
      leadId: submissionData.leadId,
      nome: submissionData.nome,
      email: submissionData.email,
      telefone: submissionData.telefone,
      vaga: submissionData.jobTitle,
      empresa: submissionData.company,
      originalLocation: submissionData.originalLocation,
      timestamp: submissionData.timestamp
    });

    // Salvar lead em arquivo JSON local (backup)
    try {
      const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');
      
      let existingLeads = [];
      try {
        const fileContent = await fs.readFile(leadsFilePath, 'utf8');
        existingLeads = JSON.parse(fileContent);
      } catch (err) {
        // Arquivo não existe ou está vazio, começar com array vazio
        console.log('Criando novo arquivo de leads...');
      }

      existingLeads.push(submissionData);
      
      // Manter apenas os últimos 1000 leads para evitar arquivo muito grande
      if (existingLeads.length > 1000) {
        existingLeads = existingLeads.slice(-1000);
      }

      await fs.writeFile(leadsFilePath, JSON.stringify(existingLeads, null, 2));
      console.log(`💾 Lead salvo localmente: ${submissionData.leadId}`);
    } catch (saveError) {
      console.error('⚠️ Erro ao salvar lead localmente:', saveError.message);
      // Não bloquear o processo se falhar ao salvar
    }

    // Preparar resposta com dados de redirecionamento
    const response = {
      success: true,
      message: 'Candidatura enviada com sucesso!',
      leadId: submissionData.leadId,
      redirect: {
        url: submissionData.jobLink,
        originalLocation: submissionData.originalLocation,
        company: submissionData.company,
        jobTitle: submissionData.jobTitle,
        message: 'Você será redirecionado para a vaga original em instantes...'
      }
    };

    // Se não houver link da vaga, criar um link de busca genérico
    if (!response.redirect.url || response.redirect.url === '#') {
      const encodedTitle = encodeURIComponent(submissionData.jobTitle || 'emprego');
      const encodedLocation = encodeURIComponent((submissionData.originalLocation || 'brasil').split(',')[0]);
      
      response.redirect.url = `https://www.indeed.com.br/jobs?q=${encodedTitle}&l=${encodedLocation}`;
      response.redirect.message = 'Você será redirecionado para buscar vagas similares...';
    }

    console.log('🔗 Redirecionamento preparado:', response.redirect);

    // Future integrations:
    // 1. Google Sheets API
    // 2. CRM integration  
    // 3. Email notifications
    // 4. WhatsApp notifications

    res.status(200).json(response);
    
  } catch (error) {
    console.error('❌ Erro ao submeter lead:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor. Tente novamente.' 
    });
  }
}
