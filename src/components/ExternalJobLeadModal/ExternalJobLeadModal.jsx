import React, { useState } from 'react'

const ExternalJobLeadModal = ({ isOpen, onClose, job, onSubmit }) => {
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

  // Se o modal nao esta aberto, nao renderiza nada
  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'whatsapp') {
      // Aplicar formatacao automatica no WhatsApp
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
    // Remove tudo que nao e numero
    const onlyNumbers = value.replace(/\D/g, '')
    
    // Aplica formatacao brasileira
    if (onlyNumbers.length <= 2) {
      return `(${onlyNumbers}`
    } else if (onlyNumbers.length <= 7) {
      return `(${onlyNumbers.substring(0, 2)}) ${onlyNumbers.substring(2)}`
    } else if (onlyNumbers.length <= 11) {
      return `(${onlyNumbers.substring(0, 2)}) ${onlyNumbers.substring(2, 7)}-${onlyNumbers.substring(7)}`
    }
    
    return `(${onlyNumbers.substring(0, 2)}) ${onlyNumbers.substring(2, 7)}-${onlyNumbers.substring(7, 11)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validacoes basicas
    if (!formData.name.trim()) {
      alert('Por favor, preencha seu nome')
      return
    }
    
    if (!formData.whatsapp.trim()) {
      alert('Por favor, preencha seu WhatsApp')
      return
    }
    
    if (!formData.lgpdConsent) {
      alert('Por favor, aceite os termos de privacidade')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Dados do formulario (vaga externa):', formData)
      console.log('Dados da vaga externa:', job)

      // Preparar dados do lead EXATAMENTE como nas vagas internas
      const leadSubmission = {
        ...formData,
        job: {
          title: job?.title || 'Vaga Externa',
          company: job?.company || 'Empresa nao informada',
          location: 'Brasil', // SEMPRE Brasil, nunca mostrar cidade real
          salary: job?.salary || 'A combinar',
          type: job?.type || 'Externa',
          source: job?.source || 'API Externa',
          description: job?.description || '',
          requirements: job?.requirements || '',
          url: job?.url || '#'
        },
        timestamp: new Date().toISOString(),
        source: 'Site do Trabalhador - Vaga Externa'
      }

      console.log('Enviando lead da vaga externa:', leadSubmission)

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadSubmission),
      })

      const result = await response.json()
      console.log('Resposta do lead da vaga externa:', result)

      if (result.success) {
        // Mostrar mensagem de sucesso
        let successMessage = 'Candidatura enviada com sucesso!'
        successMessage += '\n\nDados registrados:'
        successMessage += `\nNome: ${formData.name}`
        successMessage += `\nWhatsApp: ${formData.whatsapp}`
        
        // Verificar se ha URL da vaga externa
        if (job?.url && job.url !== '#') {
          successMessage += '\n\nRedirecionando para a vaga original...'
          alert(successMessage)
          onClose()
          
          // Redirecionamento para a vaga externa
          setTimeout(() => {
            console.log('Redirecionando para vaga externa:', job.url)
            window.open(job.url, '_blank')
          }, 1000)
          
        } else {
          successMessage += '\n\nNossa equipe entrara em contato em breve!'
          alert(successMessage)
          onClose()
        }
        
      } else {
        alert('Erro ao enviar candidatura: ' + (result.message || 'Tente novamente'))
      }

    } catch (error) {
      console.error('Erro ao enviar lead da vaga externa:', error)
      alert('Erro ao enviar candidatura. Verifique sua conexao e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-govgray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-govgray-600">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabecalho */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Interessado na vaga?
              </h2>
              <p className="text-govgray-200 text-sm">
                <strong>{job?.title || 'Vaga de Emprego'}</strong> - {job?.company || 'Empresa nao informada'}
              </p>
              <p className="text-govgreen-400 text-sm mt-1">
                {job?.salary || 'Salario a combinar'} | Brasil
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
            <h3 className="text-white font-semibold mb-4">Seus Dados</h3>
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
                  Digite apenas numeros, a formatacao sera aplicada automaticamente
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
              Em qual foi sua ultima empresa? (opcional)
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
              Voce trabalhou com ou sem carteira assinada?
            </label>
            <div className="space-y-2">
              {[
                'Com carteira assinada',
                'Sem carteira assinada',
                'Comecei sem, depois registraram',
                'Nao tenho certeza'
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
              Quando saiu da empresa, recebeu tudo certinho?
            </label>
            <div className="space-y-2">
              {[
                'Sim, recebi tudo certinho',
                'Nao recebi nada',
                'Recebi so uma parte',
                'Nao sei dizer / Ainda trabalho la'
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
              Teve algum problema trabalhista? (opcional)
            </label>
            <textarea
              name="workIssues"
              value={formData.workIssues}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none h-24 resize-none"
              placeholder="Descreva brevemente se teve algum problema: horas extras nao pagas, demissao sem justa causa, assedio, etc..."
            />
          </div>

          {/* Pergunta 5 */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <label className="block text-white font-medium mb-3">
              Gostaria de uma consultoria trabalhista gratuita?
            </label>
            <div className="space-y-2">
              {[
                'Sim, quero saber meus direitos',
                'Nao, so a vaga mesmo',
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
                  Politica de Privacidade
                </button>{' '}
                e autorizo o contato para oportunidades de trabalho e consultoria juridica trabalhista gratuita. *
              </label>
            </div>
          </div>

          {/* Botoes */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Candidatura'}
            </button>
          </div>

          <div className="text-center text-slate-400 text-xs mt-4">
            Seus dados estao seguros e serao usados apenas para esta oportunidade
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExternalJobLeadModal
