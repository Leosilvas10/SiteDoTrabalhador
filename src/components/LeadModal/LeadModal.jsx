import React, { useState } from 'react'

const LeadModal = ({ isOpen, onClose, jobData }) => {
  const [formData, setFormData] = useState({
    // Dados de contato
    name: '',
    whatsapp: '',
    
    // Perguntas obrigatórias
    lastCompany: '',
    workStatus: '',
    receivedRights: '',
    workProblems: [],
    wantConsultation: '',
    
    // Consentimento
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
    } else if (name === 'workProblems') {
      // Lidar com checkboxes múltiplos
      const currentProblems = formData.workProblems || []
      if (checked) {
        // Se "Nenhuma dessas" foi selecionada, limpar outros
        if (value === 'nenhuma') {
          setFormData(prev => ({ ...prev, workProblems: ['nenhuma'] }))
        } else {
          // Se outra opção foi selecionada, remover "nenhuma"
          const newProblems = currentProblems.filter(p => p !== 'nenhuma').concat(value)
          setFormData(prev => ({ ...prev, workProblems: newProblems }))
        }
      } else {
        const newProblems = currentProblems.filter(p => p !== value)
        setFormData(prev => ({ ...prev, workProblems: newProblems }))
      }
    } else if (name === 'wantConsultation') {
      setFormData(prev => ({
        ...prev,
        [name]: value
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
    
    // Validações básicas - TODOS OS CAMPOS OBRIGATÓRIOS
    if (!formData.name || !formData.whatsapp || !formData.lastCompany || 
        !formData.workStatus || !formData.receivedRights || 
        !formData.workProblems.length || !formData.wantConsultation || 
        !formData.lgpdConsent) {
      alert('❌ Por favor, preencha todos os campos obrigatórios marcados com *')
      return
    }

    // Validação rigorosa do WhatsApp
    if (!validateWhatsApp(formData.whatsapp)) {
      alert('❌ Por favor, insira um número de WhatsApp válido com DDD.\\n\\nFormato esperado: (11) 99999-9999\\n- DDD entre 11 e 99\\n- Para celular, deve começar com 9 após o DDD')
      return
    }

    setIsSubmitting(true)

    try {
      // Formatar WhatsApp - manter apenas números
      const whatsappFormatted = formData.whatsapp.replace(/\D/g, '')
      
      const leadSubmission = {
        // Dados pessoais - SEMPRE OBRIGATÓRIOS
        nome: formData.name,
        telefone: whatsappFormatted,
        whatsapp: whatsappFormatted,
        email: 'Não informado', // Email removido do formulário
        
        // Respostas da pesquisa - TODAS OBRIGATÓRIAS
        ultimaEmpresa: formData.lastCompany,
        statusTrabalho: formData.workStatus,
        recebeuDireitos: formData.receivedRights,
        problemasTrabalho: formData.workProblems.join(', '),
        desejaConsultoria: formData.wantConsultation,
        
        // Campo experiência combinado (para compatibilidade)
        experiencia: `Última empresa: ${formData.lastCompany}. Status: ${formData.workStatus}. Recebeu direitos: ${formData.receivedRights}. Problemas: ${formData.workProblems.join(', ')}. Quer consultoria: ${formData.wantConsultation}`,
        
        // Consentimento LGPD - SEMPRE OBRIGATÓRIO
        lgpdConsent: formData.lgpdConsent,
        
        // Dados da vaga para redirecionamento  
        jobId: jobData?.id || jobData?.jobId,
        jobTitle: jobData?.title || jobData?.jobTitle || 'Vaga não especificada',
        company: jobData?.company?.name || jobData?.company || 'Empresa não especificada',
        jobLink: jobData?.url || jobData?.link || jobData?.apply_url || jobData?.original_url || '#',
        originalLocation: jobData?.originalLocation || jobData?.location || 'Brasil',
        
        // Metadados adicionais
        fonte: 'Site do Trabalhador - Pesquisa Trabalhista',
        paginaOrigem: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        dataChegada: new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        source: 'Site do Trabalhador - Formulário Único'
      }

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadSubmission),
      })

      const result = await response.json()

      if (result.success) {
        // Mostrar mensagem de sucesso primeiro
        let successMessage = '✅ Candidatura enviada com sucesso!'
        successMessage += '\\n\\n📋 Dados registrados:'
        successMessage += `\\n• Nome: ${formData.name}`
        successMessage += `\\n• WhatsApp: ${formData.whatsapp}`
        
        // Verificar se há dados de redirecionamento
        if (result.redirect && result.redirect.url && result.redirect.url !== '#') {
          const { url, originalLocation, company, jobTitle } = result.redirect
          
          if (originalLocation && originalLocation !== 'Brasil') {
            successMessage += `\\n\\n📍 Localização da vaga: ${originalLocation}`
          }
          
          if (company) {
            successMessage += `\\n🏢 Empresa: ${company}`
          }
          
          successMessage += '\\n\\n🔗 Redirecionando para a vaga original...'
          
          alert(successMessage)
          
          // Fechar modal
          onClose()
          
          // Redirecionamento único para a vaga original
          setTimeout(() => {
            window.open(url, '_blank')
          }, 1000)
          
        } else {
          // Tentar gerar URL manual se possível
          if (jobData?.title && jobData?.location) {
            const encodedTitle = encodeURIComponent(jobData.title.replace(/[^\\w\\s]/gi, '').replace(/\\s+/g, '+'))
            const encodedLocation = encodeURIComponent(jobData.location.split(',')[0].replace(/\\s+/g, '+'))
            const fallbackUrl = `https://www.indeed.com.br/jobs?q=${encodedTitle}&l=${encodedLocation}`
            
            successMessage += '\\n\\n🔗 Redirecionando para buscar vagas similares...'
            alert(successMessage)
            onClose()
            
            setTimeout(() => {
              window.open(fallbackUrl, '_blank')
            }, 1000)
          } else {
            // Sem redirecionamento específico
            successMessage += '\\n\\nNossa equipe entrará em contato em breve!'
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
                PESQUISA RÁPIDA SOBRE SEU ÚLTIMO EMPREGO
              </h2>
              <p className="text-govgray-300 text-sm">
                Leva menos de 1 minuto! Suas respostas podem te ajudar a descobrir se a empresa te deve algum valor.
              </p>
              <p className="text-govgreen-400 text-sm mt-2">
                <strong>{jobData?.title || 'Vaga de Emprego'}</strong> - {jobData?.company?.name || jobData?.company || 'Empresa não informada'}
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

          {/* Pergunta 1 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              1. Qual foi o nome da última empresa onde você trabalhou? *
            </label>
            <input
              type="text"
              name="lastCompany"
              value={formData.lastCompany}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="Nome da empresa (ex: 'Lojas Americanas', 'Condomínio XYZ')"
              required
            />
          </div>

          {/* Pergunta 2 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              2. Você trabalhou com ou sem carteira assinada? *
            </label>
            <div className="space-y-2">
              {[
                'Com carteira assinada',
                'Sem carteira assinada',
                'Comecei sem, depois registraram',
                'Não tenho certeza'
              ].map((option) => (
                <label key={option} className="flex items-center text-govgray-300 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="workStatus"
                    value={option}
                    checked={formData.workStatus === option}
                    onChange={handleInputChange}
                    className="mr-3"
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Pergunta 3 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              3. Quando saiu da empresa, recebeu tudo certinho? *
            </label>
            <div className="space-y-2">
              {[
                'Sim',
                'Não recebi nada',
                'Recebi só uma parte',
                'Não sei dizer'
              ].map((option) => (
                <label key={option} className="flex items-center text-govgray-300 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="receivedRights"
                    value={option}
                    checked={formData.receivedRights === option}
                    onChange={handleInputChange}
                    className="mr-3"
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Pergunta 4 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              4. Durante o trabalho, você passou por alguma dessas situações? *
            </label>
            <div className="space-y-2">
              {[
                { value: 'hora-extra', label: 'Fazia hora extra sem receber' },
                { value: 'domingos-feriados', label: 'Trabalhei domingos/feriados sem adicional ou folga' },
                { value: 'assedio', label: 'Sofri assédio ou humilhações' },
                { value: 'acumulo-funcoes', label: 'Acúmulo de funções sem aumento salarial' },
                { value: 'nenhuma', label: 'Nenhuma dessas' }
              ].map((option) => (
                <label key={option.value} className="flex items-center text-govgray-300 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    name="workProblems"
                    value={option.value}
                    checked={formData.workProblems.includes(option.value)}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Pergunta 5 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              5. Podemos encaminhar suas respostas para um parceiro especializado em consultas trabalhistas gratuitas, que pode te orientar sobre seus direitos? *
            </label>
            <div className="space-y-2">
              {[
                { value: 'sim', label: 'Sim, quero saber se tenho algo a receber' },
                { value: 'nao', label: 'Não, obrigado(a)' }
              ].map((option) => (
                <label key={option.value} className="flex items-center text-govgray-300 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="wantConsultation"
                    value={option.value}
                    checked={formData.wantConsultation === option.value}
                    onChange={handleInputChange}
                    className="mr-3"
                    required
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Pergunta 6 - Dados de Contato */}
          <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-500">
            <h3 className="text-white font-semibold mb-4">
              6. Para isso, informe seu nome e WhatsApp para contato: *
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Nome Completo: *
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
                  WhatsApp: * <span className="text-govgray-300 text-xs">(com DDD)</span>
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
                <p className="text-govgray-300 text-xs mt-1">
                  Digite apenas números, a formatação será aplicada automaticamente
                </p>
              </div>
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
              <label className="text-govgray-300 text-sm">
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

          <div className="text-center text-govgray-300 text-xs mt-4">
            🔒 Seus dados estão seguros e serão usados apenas para esta oportunidade
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadModal