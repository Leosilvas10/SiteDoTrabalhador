import Head from 'next/head'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'
import { useState } from 'react'

const Contato = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Aqui você implementaria a lógica de envio
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <>
      <Head>
        <title>Contato - Site do Trabalhador</title>
        <meta name="description" content="Entre em contato com o Site do Trabalhador. Estamos aqui para ajudar com suas dúvidas sobre direitos trabalhistas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-govblue-800 mb-6">
                Entre em Contato Conosco
              </h1>
              <p className="text-xl text-govgray-600 leading-relaxed">
                Estamos aqui para ajudar com suas dúvidas sobre direitos trabalhistas. 
                Nossa equipe de especialistas está pronta para atendê-lo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulário de Contato */}
              <div className="bg-white rounded-xl shadow-lg border border-govgray-200 p-8">
                <h2 className="text-2xl font-bold text-govblue-800 mb-6">
                  📧 Envie sua Mensagem
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-govblue-800 font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-govblue-800 font-medium mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-govblue-800 font-medium mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-govblue-800 font-medium mb-2">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o assunto</option>
                      <option value="duvida-calculadora">Dúvida sobre calculadora</option>
                      <option value="direitos-trabalhistas">Direitos trabalhistas</option>
                      <option value="suporte-tecnico">Suporte técnico</option>
                      <option value="parceria">Parceria</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-govblue-800 font-medium mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent resize-vertical"
                      placeholder="Descreva sua dúvida ou mensagem..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-govblue-600 hover:bg-govblue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-lg"
                  >
                    📤 Enviar Mensagem
                  </button>
                </form>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-8">
                {/* Contato Direto */}
                <div className="bg-white rounded-xl shadow-lg border border-govgray-200 p-8">
                  <h2 className="text-2xl font-bold text-govblue-800 mb-6">
                    💬 Fale Conosco Diretamente
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-govgreen-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-govblue-800">WhatsApp</h3>
                        <p className="text-govgray-600">Atendimento rápido via WhatsApp</p>
                        <a 
                          href="https://wa.me/5511999999999?text=Olá! Gostaria de falar sobre direitos trabalhistas."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-govgreen-600 hover:text-govgreen-700 font-medium"
                        >
                          Iniciar conversa →
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-govblue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">📧</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-govblue-800">E-mail</h3>
                        <p className="text-govgray-600">contato@sitedotrabalhador.com.br</p>
                        <p className="text-sm text-govgray-500">Resposta em até 24h</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horário de Atendimento */}
                <div className="bg-govyellow-50 border border-govyellow-200 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-govblue-800 mb-6">
                    🕐 Horário de Atendimento
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-govblue-800">Segunda a Sexta:</span>
                      <span className="text-govgray-700">8h às 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-govblue-800">Sábado:</span>
                      <span className="text-govgray-700">8h às 12h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-govblue-800">Domingo:</span>
                      <span className="text-govgray-700">Fechado</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-govgray-600 mt-4">
                    * WhatsApp disponível 24h para emergências trabalhistas
                  </p>
                </div>

                {/* FAQ Rápido */}
                <div className="bg-white rounded-xl shadow-lg border border-govgray-200 p-8">
                  <h2 className="text-2xl font-bold text-govblue-800 mb-6">
                    ❓ Dúvidas Frequentes
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-govblue-800 mb-2">A calculadora é gratuita?</h3>
                      <p className="text-govgray-600 text-sm">Sim, todas as calculadoras são 100% gratuitas.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-govblue-800 mb-2">Posso confiar nos resultados?</h3>
                      <p className="text-govgray-600 text-sm">Os cálculos são estimativos. Para análise jurídica precisa, consulte um especialista.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-govblue-800 mb-2">Vocês oferecem consulta jurídica?</h3>
                      <p className="text-govgray-600 text-sm">Conectamos você com parceiros especializados em direito trabalhista.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Contato
