import React, { useState } from 'react'

const LeadModal = ({ isOpen, onClose, jobData }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    lastCompany: '',
    workStatus: '',
    receivedRights: '',
    workIssues: '',
    wantConsultation: '',
    lgpdConsent: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Se o modal não está aberto, não renderiza nada
  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'whatsapp') {
      // Aplicar formatação automática no WhatsApp
      const formattedValue = formatWhatsApp(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const formatWhatsApp = (value) => {
    // Remove tudo que não é número
    const onlyNumbers = value.replace(/\D/g, '')
    
    // Aplica formatação brasileira
    if (onlyNumbers.length <= 2) {
      return `(${onlyNumbers}`
    } else if (onlyNumbers.length <= 7) {
      return `(${onlyNumbers.substring(0, 2)}) ${onlyNumbers.substring(2)}`
    } else if (onlyNumbers.length <= 11) {
      return `(${onlyNumbers.substring(0, 2)}) ${onlyNumbers.substring(2, 7)}-${onlyNumbers.substring(7)}`
    }
    
    // Limita a 11 dígitos
    return `(${onlyNumbers.substring(0, 2)}) ${onlyNumbers.substring(2, 7)}-${onlyNumbers.substring(7, 11)}`
  }

  const validateWhatsApp = (whatsapp) => {
    // Remove tudo que não é número
    const onlyNumbers = whatsapp.replace(/\D/g, '')
    
    // Deve ter exatamente 10 ou 11 dígitos
    if (onlyNumbers.length < 10 || onlyNumbers.length > 11) {
      return false
    }
    
    // DDD deve estar entre 11 e 99
    const ddd = parseInt(onlyNumbers.substring(0, 2))
    if (ddd < 11 || ddd > 99) {
      return false
    }
    
    // Se tem 11 dígitos, o terceiro deve ser 9 (celular)
    if (onlyNumbers.length === 11 && onlyNumbers[2] !== '9') {
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.lgpdConsent) {
      alert('Você deve aceitar os termos para continuar.')
      return
    }

    // Validação rigorosa do WhatsApp
    if (!formData.whatsapp || !validateWhatsApp(formData.whatsapp)) {
      alert('❌ Por favor, insira um número de WhatsApp válido com DDD.\n\nFormato esperado: (11) 99999-9999\n- DDD entre 11 e 99\n- Para celular, deve começar com 9 após o DDD')
      return
    }

    setIsSubmitting(true)

    try {
      // Formatar WhatsApp - manter apenas números
      const whatsappFormatted = formData.whatsapp.replace(/\D/g, '')
      
      console.log('📋 Dados do formulário antes do envio:', {
        nome: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        whatsappFormatted: whatsappFormatted,
        lastCompany: formData.lastCompany,
        workStatus: formData.workStatus,
        jobData: jobData
      })

      console.log('🔍 Verificando URLs disponíveis na vaga:', {
        url: jobData?.url,
        link: jobData?.link,
        apply_url: jobData?.apply_url,
        original_url: jobData?.original_url,
        company: jobData?.company,
        title: jobData?.title,
        location: jobData?.location
      })

      const leadSubmission = {
        // Dados pessoais
        nome: formData.name || '',
        email: formData.email || '',
        telefone: whatsappFormatted, // Usar apenas números
        whatsapp: whatsappFormatted, // Campo adicional para compatibilidade
        
        // Experiência profissional detalhada
        ultimaEmpresa: formData.lastCompany || 'Não informado',
        statusAtual: formData.workStatus || 'Não informado',
        recebeuDireitos: formData.receivedRights || 'Não informado',
        problemasTrabalho: formData.workIssues || 'Não informado',
        desejaConsultoria: formData.wantConsultation || 'Não informado',
        
        // Campo experiência combinado (para compatibilidade)
        experiencia: `Última empresa: ${formData.lastCompany || 'Não informado'}. Status atual: ${formData.workStatus || 'Não informado'}. Recebeu direitos: ${formData.receivedRights || 'Não informado'}. Problemas no trabalho: ${formData.workIssues || 'Não informado'}. Deseja consultoria: ${formData.wantConsultation || 'Não informado'}`,
        
        // Consentimento LGPD
        lgpdConsent: formData.lgpdConsent,
        
        // Dados da vaga para redirecionamento  
        jobId: jobData?.id || jobData?.jobId,
        jobTitle: jobData?.title || jobData?.jobTitle || 'Vaga não especificada',
        company: jobData?.company?.name || jobData?.company || 'Empresa não especificada',
        jobLink: jobData?.url || jobData?.link || jobData?.apply_url || jobData?.original_url || '#',
        originalLocation: jobData?.originalLocation || jobData?.location || 'Brasil',
        
        // Metadados adicionais
        fonte: 'Site do Trabalhador',
        paginaOrigem: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        source: 'Site do Trabalhador - Página de Vagas'
      }

      console.log('📤 Enviando lead:', leadSubmission)

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadSubmission),
      })

      const result = await response.json()
      console.log('📥 Resposta do lead:', result)
      console.log('🔗 Dados de redirecionamento recebidos:', result.redirect)

      if (result.success) {
        // Mostrar mensagem de sucesso primeiro
        let successMessage = '✅ Candidatura enviada com sucesso!'
        successMessage += '\n\n📋 Dados registrados:'
        successMessage += `\n• Nome: ${formData.name}`
        successMessage += `\n• WhatsApp: ${formData.whatsapp}`
        
        // Verificar se há dados de redirecionamento
        if (result.redirect && result.redirect.url && result.redirect.url !== '#') {
          const { url, originalLocation, company, jobTitle } = result.redirect
          
          console.log('✅ Redirecionamento válido encontrado:', url)
          
          if (originalLocation && originalLocation !== 'Brasil') {
            successMessage += `\n\n📍 Localização da vaga: ${originalLocation}`
          }
          
          if (company) {
            successMessage += `\n🏢 Empresa: ${company}`
          }
          
          successMessage += '\n\n🔗 Redirecionando para a vaga original...'
          
          alert(successMessage)
          
          // Fechar modal
          onClose()
          
          // Redirecionamento único para a vaga original
          setTimeout(() => {
            console.log('🔗 Executando redirecionamento para:', url)
            window.open(url, '_blank')
          }, 1000)
          
        } else {
          console.log('⚠️ Redirecionamento não disponível ou inválido:', result.redirect)
          // Tentar gerar URL manual se possível
          if (jobData?.title && jobData?.location) {
            const encodedTitle = encodeURIComponent(jobData.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '+'))
            const encodedLocation = encodeURIComponent(jobData.location.split(',')[0].replace(/\s+/g, '+'))
            const fallbackUrl = `https://www.indeed.com.br/jobs?q=${encodedTitle}&l=${encodedLocation}`
            
            successMessage += '\n\n🔗 Redirecionando para buscar vagas similares...'
            alert(successMessage)
            onClose()
            
            setTimeout(() => {
              console.log('🔗 Redirecionamento de fallback para:', fallbackUrl)
              window.open(fallbackUrl, '_blank')
            }, 1000)
          } else {
            // Sem redirecionamento específico
            successMessage += '\n\nNossa equipe entrará em contato em breve!'
            alert(successMessage)
            onClose()
          }
        }
        
      } else {
        alert('❌ Erro ao enviar candidatura: ' + (result.message || 'Tente novamente'))
      }

    } catch (error) {
      console.error('❌ Erro ao enviar lead:', error)
      alert('❌ Erro ao enviar candidatura. Verifique sua conexão e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-govgray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-govgray-600">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                💼 Interessado na vaga?
              </h2>
              <p className="text-govgray-200 text-sm">
                <strong>{jobData?.title || 'Vaga de Emprego'}</strong> - {jobData?.company?.name || jobData?.company || 'Empresa não informada'}
              </p>
              <p className="text-govgreen-400 text-sm mt-1">
                💰 {jobData?.salary || 'Salário a combinar'} | 📍 Brasil
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-govgray-400 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Dados pessoais */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-4">📋 Seus Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Nome completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  WhatsApp * <span className="text-govgray-300 text-xs">(com DDD)</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="(11) 99999-9999"
                  maxLength="15"
                  autoComplete="tel"
                  required
                />
                <p className="text-govgray-400 text-xs mt-1">
                  Digite apenas números, a formatação será aplicada automaticamente
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </div>

          {/* Pergunta 1 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              🏢 Em qual foi sua última empresa? (opcional)
            </label>
            <input
              type="text"
              name="lastCompany"
              value={formData.lastCompany}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="Nome da empresa"
            />
          </div>

          {/* Pergunta 2 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              📄 Você trabalhou com ou sem carteira assinada?
            </label>
            <div className="space-y-2">
              {[
                'Com carteira assinada',
                'Sem carteira assinada',
                'Comecei sem, depois registraram',
                'Não tenho certeza'
              ].map((option) => (
                <label key={option} className="flex items-center text-slate-300 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="workStatus"
                    value={option}
                    checked={formData.workStatus === option}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Pergunta 3 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              💰 Quando saiu da empresa, recebeu tudo certinho?
            </label>
            <div className="space-y-2">
              {[
                'Sim, recebi tudo certinho',
                'Não recebi nada',
                'Recebi só uma parte',
                'Não sei dizer / Ainda trabalho lá'
              ].map((option) => (
                <label key={option} className="flex items-center text-slate-300 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="receivedRights"
                    value={option}
                    checked={formData.receivedRights === option}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Pergunta 4 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              ⚖️ Teve algum problema trabalhista? (opcional)
            </label>
            <textarea
              name="workIssues"
              value={formData.workIssues}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none h-24 resize-none"
              placeholder="Descreva brevemente se teve algum problema: horas extras não pagas, demissão sem justa causa, assédio, etc..."
            />
          </div>

          {/* Pergunta 5 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              🎯 Gostaria de uma consultoria trabalhista gratuita?
            </label>
            <div className="space-y-2">
              {[
                'Sim, quero saber meus direitos',
                'Não, só a vaga mesmo',
                'Talvez no futuro'
              ].map((option) => (
                <label key={option} className="flex items-center text-slate-300 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="wantConsultation"
                    value={option}
                    checked={formData.wantConsultation === option}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Consentimento LGPD */}
          <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-500">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="lgpdConsent"
                checked={formData.lgpdConsent}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
              <label className="text-slate-300 text-sm">
                <strong className="text-white">Aceito o tratamento dos meus dados</strong> conforme a{' '}
                <button type="button" className="text-blue-400 hover:underline">
                  Política de Privacidade
                </button>{' '}
                e autorizo o contato para oportunidades de trabalho e consultoria jurídica trabalhista gratuita. *
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              ❌ Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? '⏳ Enviando...' : '✅ Enviar Candidatura'}
            </button>
          </div>

          <div className="text-center text-slate-400 text-xs mt-4">
            🔒 Seus dados estão seguros e serão usados apenas para esta oportunidade
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadModal
