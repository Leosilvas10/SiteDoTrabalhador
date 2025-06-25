import React, { useState } from 'react'

const LeadModal = ({ job, onClose }) => {
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'whatsapp') {
      // Formatação automática do WhatsApp
      const onlyNumbers = value.replace(/\D/g, '')
      let formatted = onlyNumbers
      
      if (onlyNumbers.length >= 11) {
        // Formato: (11) 99999-9999
        formatted = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`
      } else if (onlyNumbers.length >= 7) {
        // Formato parcial: (11) 99999
        formatted = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`
      } else if (onlyNumbers.length >= 2) {
        // Formato parcial: (11
        formatted = `(${onlyNumbers.slice(0, 2)})`
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const validateWhatsApp = (whatsapp) => {
    // Remove tudo que não é número
    const onlyNumbers = whatsapp.replace(/\D/g, '')
    
    // Deve ter 11 dígitos (DDD + 9 dígitos)
    if (onlyNumbers.length !== 11) {
      return false
    }
    
    // DDD deve estar entre 11 e 99
    const ddd = parseInt(onlyNumbers.substring(0, 2))
    if (ddd < 11 || ddd > 99) {
      return false
    }
    
    // Primeiro dígito do número deve ser 9 (celular)
    const firstDigit = onlyNumbers.charAt(2)
    if (firstDigit !== '9') {
      return false
    }
    
    // Não pode ter todos os dígitos iguais
    if (onlyNumbers.split('').every(digit => digit === onlyNumbers[0])) {
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
      alert('❌ Por favor, insira um número de WhatsApp válido com DDD.\nExemplo: (11) 99999-9999')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          jobTitle: job.title,
          jobCompany: job.company?.name || job.company,
          jobUrl: job.url || '',
          jobLocation: job.location || '',
          jobSalary: job.salary || '',
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Fechar modal primeiro
        onClose()
        
        // Criar mensagem personalizada
        let successMessage = '✅ Candidatura enviada com sucesso! Nossa equipe entrará em contato em breve.'
        
        // Tentar redirecionar para a vaga real sempre que possível
        const redirectUrl = job.url || job.link || job.apply_url || job.original_url
        
        if (redirectUrl && redirectUrl !== '#' && redirectUrl !== '' && redirectUrl !== 'null') {
          successMessage += '\n\n🔗 Agora você será redirecionado para buscar vagas similares nos principais sites de emprego do Brasil!'
          
          alert(successMessage)
          
          // Redirecionamento mais robusto com múltiplas tentativas
          setTimeout(() => {
            console.log('🔗 Iniciando redirecionamento para:', redirectUrl)
            
            // Criar elemento de link temporário para garantir redirecionamento
            const link = document.createElement('a')
            link.href = redirectUrl
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            
            // Adicionar ao DOM temporariamente
            document.body.appendChild(link)
            
            try {
              // Primeira tentativa: Click programático
              link.click()
              console.log('✅ Redirecionamento via click() executado')
            } catch (error) {
              console.log('⚠️ Click falhou, tentando window.open...')
              try {
                // Segunda tentativa: window.open
                const newWindow = window.open(redirectUrl, '_blank', 'noopener,noreferrer')
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                  throw new Error('Popup bloqueado')
                }
                console.log('✅ Redirecionamento via window.open executado')
              } catch (finalError) {
                console.log('⚠️ Window.open falhou, usando location.href...')
                // Terceira tentativa: location.href
                window.location.href = redirectUrl
              }
            } finally {
              // Remover link temporário
              document.body.removeChild(link)
            }
          }, 1500)
        } else {
          alert(successMessage)
        }
      } else {
        alert('❌ Erro ao enviar candidatura: ' + (result.message || 'Tente novamente'))
      }

    } catch (error) {
      console.error('Erro ao enviar lead:', error)
      alert('❌ Erro ao enviar candidatura. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!job) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                💼 Interessado na vaga?
              </h2>
              <p className="text-slate-300 text-sm">
                <strong>{job.title}</strong> - {job.company?.name || job.company}
              </p>
              <p className="text-green-400 text-sm mt-1">
                💰 {job.salary} | 📍 {job.location}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
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
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="(11) 99999-9999"
                  required
                />
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
