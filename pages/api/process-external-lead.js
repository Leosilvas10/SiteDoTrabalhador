// API para processar lead e redirecionar para vaga externa
export default async function handler(req, res) {
  try {
    console.log('🔗 Processando lead e redirecionamento...');
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }

    const { leadData, jobData } = req.body;
    
    if (!leadData || !jobData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do lead e da vaga são obrigatórios'
      });
    }

    // Validar dados obrigatórios do lead
    const requiredFields = ['nome', 'email', 'telefone'];
    const missingFields = requiredFields.filter(field => !leadData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
      });
    }

    console.log('📝 Processando lead para vaga externa:', jobId);

    // Salvar lead no sistema
    const leadToSave = {
      ...leadData,
      source: 'Vaga Pública Externa',
      jobId: jobId,
      redirectUrl: redirectUrl,
      timestamp: new Date().toISOString(),
      type: 'external_job_application'
    };

    // Salvar no arquivo de leads (mesmo sistema usado nas outras páginas)
    const fs = require('fs').promises;
    const path = require('path');
    
    const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');
    
    let existingLeads = [];
    try {
      const fileContent = await fs.readFile(leadsFilePath, 'utf8');
      existingLeads = JSON.parse(fileContent);
    } catch (error) {
      // Arquivo não existe ainda, será criado
      console.log('Arquivo de leads não existe, será criado');
    }

    existingLeads.push(leadToSave);

    // Salvar leads atualizados
    await fs.writeFile(leadsFilePath, JSON.stringify(existingLeads, null, 2));

    console.log('✅ Lead salvo com sucesso:', leadData.nome);

    // Retornar URL de redirecionamento
    res.status(200).json({
      success: true,
      message: 'Lead processado com sucesso',
      data: {
        leadId: existingLeads.length,
        redirectUrl: redirectUrl,
        jobId: jobId,
        leadSaved: true
      },
      redirectTo: redirectUrl
    });

  } catch (error) {
    console.error('❌ Erro ao processar lead:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
}
