
import { useState } from 'react'

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      question: 'Como cadastrar minha empresa?',
      answer: 'Para cadastrar sua empresa, acesse o painel administrativo através do menu superior e siga o processo de registro. Você precisará fornecer CNPJ, dados de contato e informações sobre a empresa.'
    },
    {
      question: 'Como denunciar irregularidades?',
      answer: 'Você pode denunciar irregularidades através do nosso formulário de contato, selecionando "Denúncia" como assunto. Também pode entrar em contato pelo WhatsApp ou email. Todas as denúncias são tratadas com confidencialidade.'
    },
    {
      question: 'Posso usar a calculadora gratuitamente?',
      answer: 'Sim! Todas as nossas calculadoras trabalhistas são completamente gratuitas. Você pode calcular rescisão, férias, horas extras, adicional noturno e salário líquido sem nenhum custo.'
    },
    {
      question: 'Como receber alertas de vagas?',
      answer: 'Após se cadastrar no nosso site, você pode configurar alertas personalizados por área de interesse, localização e tipo de vaga. Enviaremos notificações por email sempre que houver novas oportunidades.'
    },
    {
      question: 'As vagas são verificadas?',
      answer: 'Sim! Todas as vagas em nosso site passam por verificação. Buscamos apenas oportunidades reais de fontes confiáveis e atualizamos a base de dados automaticamente a cada 30 minutos.'
    },
    {
      question: 'Como funciona o processo de candidatura?',
      answer: 'Para se candidatar a uma vaga, você deve preencher nosso formulário de lead com suas informações. Após o envio, você será redirecionado para o site oficial da vaga para completar o processo.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="mt-12">
      <h4 className="text-xl font-bold text-govblue-800 mb-4">❓ Perguntas Frequentes</h4>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border-2 border-govblue-200 rounded-lg overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-4 hover:bg-govblue-50 transition-all duration-300 flex justify-between items-center"
            >
              <span className="text-govblue-800 hover:text-govblue-900 font-medium">
                {faq.question}
              </span>
              <span className={`text-govblue-600 transition-transform duration-300 ${
                openFAQ === index ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </button>
            {openFAQ === index && (
              <div className="px-4 pb-4 text-govblue-700 border-t border-govblue-200 pt-3 animate-fade-in bg-govblue-50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQSection
