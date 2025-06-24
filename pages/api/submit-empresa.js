
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const empresaData = req.body

    // Aqui você pode integrar com banco de dados, Google Sheets, etc.
    // Por enquanto, vamos simular o salvamento
    
    console.log('Nova solicitação de empresa recebida:', {
      empresa: empresaData.nomeEmpresa,
      cargo: empresaData.cargo,
      email: empresaData.email,
      timestamp: empresaData.timestamp
    })

    // Em produção, salvar no banco de dados:
    // await salvarSolicitacaoEmpresa(empresaData)

    res.status(200).json({ 
      success: true, 
      message: 'Solicitação recebida com sucesso' 
    })
    
  } catch (error) {
    console.error('Erro ao processar solicitação de empresa:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    })
  }
}
