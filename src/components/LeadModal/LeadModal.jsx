
import React, { useState } from 'react'

const LeadModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.lgpdConsent) {
      alert('Você deve aceitar os termos para continuar.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          jobTitle: job.title,
          jobCompany: job.company?.name,
          jobUrl: job.url,
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        alert('Dados enviados com sucesso! Em breve um especialista entrará em contato.')
        
        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          if (job.url && job.url !== '#') {
            window.open(job.url, '_blank')
          }
          onClose()
        }, 1500)
      } else {
        throw new Error('Erro ao enviar dados')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao enviar dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!job) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Cabeçalho */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Interessado na vaga?
              </h2>
              <p className="text-slate-300 text-sm">
                {job.title} - {job.company?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pergunta 1 */}
            <div>
              <label className="block text-white font-medium mb-2">
                Qual foi o nome da última empresa onde você trabalhou?
              </label>
              <input
                type="text"
                name="lastCompany"
                value={formData.lastCompany}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nome da empresa"
                required
              />
            </div>

            {/* Pergunta 2 */}
            <div>
              <label className="block text-white font-medium mb-3">
                Você trabalhou com ou sem carteira assinada?
              </label>
              <div className="space-y-2">
                {[
                  'Com carteira assinada',
                  'Sem carteira assinada',
                  'Comecei sem, depois registraram',
                  'Não tenho certeza'
                ].map((option) => (
                  <label key={option} className="flex items-center text-slate-300">
                    <input
                      type="radio"
                      name="workStatus"
                      value={option}
                      checked={formData.workStatus === option}
                      onChange={handleInputChange}
                      className="mr-2"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Pergunta 3 */}
            <div>
              <label className="block text-white font-medium mb-3">
                Quando saiu da empresa, recebeu tudo certinho?
              </label>
              <div className="space-y-2">
                {[
                  'Sim',
                  'Não recebi nada',
                  'Recebi só uma parte',
                  'Não sei dizer'
                ].map((option) => (
                  <label key={option} className="flex items-center text-slate-300">
                    <input
                      type="radio"
                      name="receivedRights"
                      value={option}
                      checked={formData.receivedRights === option}
                      onChange={handleInputChange}
                      className="mr-2"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Pergunta 4 */}
            <div>
              <label className="block text-white font-medium mb-3">
                Durante o trabalho, você passou por alguma dessas situações?
              </label>
              <div className="space-y-2">
                {[
                  'Fazia hora extra sem receber',
                  'Trabalhei domingos/feriados sem adicional ou folga',
                  'Sofri assédio ou humilhações',
                  'Acúmulo de funções sem aumento salarial',
                  'Nenhuma dessas'
                ].map((option) => (
                  <label key={option} className="flex items-center text-slate-300">
                    <input
                      type="radio"
                      name="workIssues"
                      value={option}
                      checked={formData.workIssues === option}
                      onChange={handleInputChange}
                      className="mr-2"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Pergunta 5 */}
            <div>
              <label className="block text-white font-medium mb-3">
                Podemos encaminhar suas respostas para um parceiro especializado em consultas trabalhistas gratuitas?
              </label>
              <div className="space-y-2">
                {[
                  'Sim, quero saber se tenho algo a receber',
                  'Não, obrigado(a)'
                ].map((option) => (
                  <label key={option} className="flex items-center text-slate-300">
                    <input
                      type="radio"
                      name="wantConsultation"
                      value={option}
                      checked={formData.wantConsultation === option}
                      onChange={handleInputChange}
                      className="mr-2"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Dados de contato */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            {/* Consentimento LGPD */}
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
                Li e concordo com os{' '}
                <button type="button" className="text-blue-400 hover:underline">
                  Termos de Uso
                </button>
                {' '}e{' '}
                <button type="button" className="text-blue-400 hover:underline">
                  Política de Privacidade
                </button>
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar e Ver Vaga'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LeadModal
