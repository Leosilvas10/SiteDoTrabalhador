import React, { useState } from 'react';

const ExternalJobModal = ({ job, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    experiencia: 'com-carteira',
    lgpdConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.telefone || !formData.lgpdConsent) {
      setError('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Enviar lead COMPLETO para o painel admin - MESMA ESTRUTURA
      const leadData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        empresa: formData.empresa,
        experiencia: formData.experiencia,
        vaga: job.title,
        empresa_vaga: job.company?.name || 'Não informado',
        salario: job.salary,
        source: `Vaga Externa - ${job.title}`,
        jobId: job.id,
        isExternal: true,
        externalUrl: job.externalUrl,
        lgpdConsent: formData.lgpdConsent,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Enviando lead COMPLETO de vaga externa:', leadData);

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Lead COMPLETO enviado para painel admin');
        
        // Fechar modal
        onClose();
        
        // Resetar formulário
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          empresa: '',
          experiencia: 'com-carteira',
          lgpdConsent: false
        });

        // Redirecionar para a vaga externa APÓS capturar o lead
        setTimeout(() => {
          if (job.externalUrl) {
            window.open(job.externalUrl, '_blank');
          }
        }, 1000);

        if (onSubmit) {
          onSubmit(result);
        }
      } else {
        setError(result.message || 'Erro ao processar sua candidatura');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar lead:', error);
      setError('Erro ao processar sua candidatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-900 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">🌟 Interessado na vaga?</h3>
              <p className="text-sm opacity-90">{job.title} - {job.company?.name}</p>
              <p className="text-sm opacity-75">💰 {job.salary} | 📍 Brasil</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-800">
              📋 Seus Dados
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              WhatsApp * <span className="text-xs text-gray-500">(com DDD)</span>
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(11) 99999-9999"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Digite apenas números, a formatação será aplicada automaticamente
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email (opcional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              💼 Em qual foi sua última empresa? (opcional)
            </label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome da empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Você trabalhou com ou sem carteira assinada?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="experiencia"
                  value="com-carteira"
                  checked={formData.experiencia === 'com-carteira'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Com carteira assinada
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="experiencia"
                  value="sem-carteira"
                  checked={formData.experiencia === 'sem-carteira'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Sem carteira assinada
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="experiencia"
                  value="primeiro-emprego"
                  checked={formData.experiencia === 'primeiro-emprego'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Começei sem, depois registraram
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="experiencia"
                  value="nao-tenho"
                  checked={formData.experiencia === 'nao-tenho'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Não tenho certeza
              </label>
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="lgpdConsent"
                checked={formData.lgpdConsent}
                onChange={handleInputChange}
                className="mt-1 mr-2"
                required
              />
              <span className="text-sm text-gray-700">
                ⚠️ <strong>Quando saiu da empresa, recebeu tudo certinho?</strong>
                <br />
                <span className="text-xs text-gray-600">
                  Ao aceitar, você concorda com nossa{' '}
                  <a href="/politica-privacidade" target="_blank" className="text-blue-600 underline">
                    Política de Privacidade
                  </a>{' '}
                  e em receber informações sobre seus direitos trabalhistas por WhatsApp.
                </span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              '✨ Quero me Candidatar'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Após o envio, você será redirecionado para a página da vaga para completar sua candidatura.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ExternalJobModal;
