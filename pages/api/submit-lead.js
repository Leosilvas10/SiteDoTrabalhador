
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
    if (!leadData.nome || leadData.nome.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome deve ter pelo menos 2 caracteres' 
      });
    }

    // WhatsApp é obrigatório e mais importante que email
    if (!leadData.telefone && !leadData.whatsapp) {
      return res.status(400).json({ 
        success: false, 
        message: 'WhatsApp é obrigatório' 
      });
    }

    // Validar formato do WhatsApp
    const whatsappNumber = (leadData.telefone || leadData.whatsapp || '').replace(/\D/g, '');
    if (whatsappNumber.length < 10 || whatsappNumber.length > 11) {
      return res.status(400).json({ 
        success: false, 
        message: 'WhatsApp deve ter 10 ou 11 dígitos' 
      });
    }

    // Email não é mais obrigatório no formulário

    // Experiência é opcional no formulário simplificado
    if (!leadData.experiencia || leadData.experiencia.length < 10) {
      // Criar experiência baseada nos campos preenchidos
      leadData.experiencia = `Status: ${leadData.statusAtual || 'Não informado'}. Última empresa: ${leadData.ultimaEmpresa || 'Não informado'}`;
    }

    if (!leadData.lgpdConsent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Consentimento LGPD é obrigatório' 
      });
    }
    
    // Adicionar informações de rastreamento e redirecionamento
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const submissionData = {
      ...leadData,
      id: leadId, // ID principal para busca
      leadId: leadId, // Backup do ID (compatibilidade)
      timestamp: new Date().toLocaleString('pt-BR'),
      timestampISO: new Date().toISOString(),
      createdAt: new Date().toISOString(), // Campo principal para datas
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      source: 'Site do Trabalhador',
      validated: true,
      status: 'novo', // Status padrão para novos leads
      
      // Dados da vaga para redirecionamento
      jobId: leadData.jobId,
      jobLink: leadData.jobLink || leadData.originalJobUrl,
      originalLocation: leadData.originalLocation,
      company: leadData.company,
      jobTitle: leadData.jobTitle
    };

    // Log detalhado do lead
    console.log('✅ Novo lead validado:', {
      id: submissionData.id,
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
      console.log(`💾 Lead salvo localmente: ${submissionData.id}`);
    } catch (saveError) {
      console.error('⚠️ Erro ao salvar lead localmente:', saveError.message);
      // Não bloquear o processo se falhar ao salvar
    }

    // Preparar resposta com dados de redirecionamento
    const response = {
      success: true,
      message: 'Candidatura enviada com sucesso!',
      leadId: submissionData.id, // Usar o ID principal
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
