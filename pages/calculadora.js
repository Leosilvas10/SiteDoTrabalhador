import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Header from '../src/components/Header/Header'
import CalculadoraTrabalhista from '../src/components/CalculadoraTrabalhista/CalculadoraTrabalhista'

const CalculadoraPage = () => {
  const [selectedCalculator, setSelectedCalculator] = useState(null)
  const [showDataForm, setShowDataForm] = useState(false)
  const [result, setResult] = useState(null)
  const [openFaqItem, setOpenFaqItem] = useState(null)
  const [showEducationalModal, setShowEducationalModal] = useState(false)
  const [selectedEducationalTopic, setSelectedEducationalTopic] = useState(null)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    problem: '',
    lgpdConsent: true
  })

  const calculators = [
    {
      id: 'rescisao',
      icon: '💰',
      title: 'Rescisão de Contrato',
      description: 'Calcule as verbas rescisórias que você pode ter direito em caso de demissão ou término de contrato. Inclui aviso prévio, férias, 13º e FGTS.',
      buttonText: 'Calcular Rescisão'
    },
    {
      id: 'ferias',
      icon: '🏖️',
      title: 'Férias',
      description: 'Descubra o valor exato das suas férias remuneradas, incluindo o terço constitucional. Não perca nenhum centavo do seu descanso!',
      buttonText: 'Calcular Férias'
    },
    {
      id: 'horasextras',
      icon: '⏰',
      title: 'Horas Extras',
      description: 'Trabalhou mais do que o combinado? Calcule o valor das suas horas extras com o adicional mínimo de 50%. Saiba o que é seu por direito!',
      buttonText: 'Calcular Horas Extras'
    },
    {
      id: 'adicionalnoturno',
      icon: '🌙',
      title: 'Adicional Noturno',
      description: 'Se você trabalha entre 22h e 5h, tem direito a um adicional! Calcule o valor extra do seu trabalho noturno.',
      buttonText: 'Calcular Adicional Noturno'
    },
    {
      id: 'salarioliquido',
      icon: '📊',
      title: 'Salário Líquido',
      description: 'Entenda os descontos do seu salário (INSS, IRRF) e saiba qual o valor real que cai na sua conta todo mês.',
      buttonText: 'Calcular Salário Líquido'
    }
  ]

  // Dados do FAQ
  const faqData = [
    {
      id: 1,
      question: "A calculadora é 100% precisa?",
      answer: "Não, a calculadora fornece uma ESTIMATIVA baseada nas informações que você insere e na legislação vigente. Para um cálculo exato e validado juridicamente, é sempre recomendável a consulta com um advogado trabalhista."
    },
    {
      id: 2,
      question: "Meus dados estão seguros?",
      answer: "Sim, seus dados são protegidos e utilizados apenas para enviar o resultado do cálculo e, com sua permissão, informações relevantes sobre seus direitos trabalhistas, conforme nossa Política de Privacidade e a LGPD."
    },
    {
      id: 3,
      question: "Posso usar a calculadora várias vezes?",
      answer: "Sim, use quantas vezes precisar! É uma ferramenta gratuita para te ajudar."
    },
    {
      id: 4,
      question: "Por que vocês pedem meus dados?",
      answer: "Pedimos seus dados para que possamos enviar um relatório detalhado do seu cálculo por e-mail e, se você desejar, oferecer um suporte mais personalizado ou conectar você a especialistas."
    },
    {
      id: 5,
      question: "O que devo fazer após usar a calculadora?",
      answer: "Se o resultado te trouxe dúvidas ou se você suspeita que seus direitos foram violados, o ideal é buscar orientação de um advogado trabalhista. Podemos te conectar a parceiros especializados."
    }
  ]

  // Dados dos tópicos educacionais simplificados
  const educationalTopics = [
    {
      id: 'fgts',
      title: '💰 O que é FGTS?',
      description: 'O Fundo de Garantia por Tempo de Serviço é uma poupança obrigatória criada para proteger o trabalhador.',
      content: {
        intro: 'O FGTS é um dos direitos trabalhistas mais importantes do trabalhador brasileiro.',
        sections: [
          { title: 'O que é o FGTS?', content: 'É uma conta vinculada ao trabalhador, onde o empregador deposita mensalmente 8% do salário bruto.' },
          { title: 'Quem tem direito?', content: 'Todos os trabalhadores com carteira assinada (CLT), trabalhadores rurais, temporários e outros.' },
          { title: 'Quando posso sacar?', content: 'Demissão sem justa causa, aposentadoria, compra da casa própria, doenças graves e outras situações.' }
        ]
      }
    },
    {
      id: 'ferias',
      title: '🏖️ Férias: Saiba Seus Direitos',
      description: 'Todo ano de trabalho gera direito a 30 dias de descanso remunerado, com um acréscimo de 1/3 do salário.',
      content: {
        intro: 'As férias são um direito fundamental do trabalhador, garantindo descanso remunerado.',
        sections: [
          { title: 'Período Aquisitivo', content: 'A cada 12 meses de trabalho, o trabalhador adquire direito a 30 dias de férias.' },
          { title: 'Terço constitucional', content: 'Além do salário normal, o trabalhador recebe um adicional de 1/3 sobre o valor das férias.' }
        ]
      }
    },
    {
      id: 'decimo-terceiro',
      title: '🎁 13º Salário',
      description: 'A gratificação de Natal é um direito de todo trabalhador com carteira assinada.',
      content: {
        intro: 'O 13º salário é um benefício equivalente a um salário extra pago anualmente.',
        sections: [
          { title: 'O que é?', content: 'É um benefício equivalente a um salário extra pago anualmente a todos os trabalhadores.' },
          { title: 'Quando é pago?', content: 'Em duas parcelas: primeira até 30 de novembro e segunda até 20 de dezembro.' }
        ]
      }
    }
  ]

  const handleSelectCalculator = (calculatorId) => {
    setSelectedCalculator(calculatorId)
    setShowDataForm(false)
    setResult(null)
    setTimeout(() => {
      document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleCalculate = (calculationResult) => {
    setResult(calculationResult)
    setShowDataForm(true)
    setTimeout(() => {
      document.getElementById('data-form-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitUserData = async (e) => {
    e.preventDefault()
    
    if (!userData.name || !userData.email || !userData.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    try {
      const leadData = {
        nome: userData.name,
        email: userData.email,
        telefone: userData.phone,
        problema: userData.problem,
        calculatorType: selectedCalculator,
        result: result,
        source: 'Calculadora de Direitos',
        timestamp: new Date().toISOString(),
        lgpdConsent: userData.lgpdConsent
      }

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      })

      const responseData = await response.json()

      if (responseData.success) {
        alert('✅ Resultado enviado com sucesso!')
        setTimeout(() => {
          document.getElementById('final-result-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        alert('❌ Erro ao enviar dados. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
      alert('❌ Erro ao enviar dados. Verifique sua conexão e tente novamente.')
    }
  }

  const toggleFaq = (itemId) => {
    setOpenFaqItem(openFaqItem === itemId ? null : itemId)
  }

  const openEducationalModal = (topicId) => {
    const topic = educationalTopics.find(t => t.id === topicId)
    setSelectedEducationalTopic(topic)
    setShowEducationalModal(true)
  }

  const closeEducationalModal = () => {
    setShowEducationalModal(false)
    setSelectedEducationalTopic(null)
  }

  return (
    <>
      <Head>
        <title>Calculadora de Direitos Trabalhistas Gratuita - Site do Trabalhador</title>
        <meta name="description" content="Calculadora gratuita de direitos trabalhistas. Calcule FGTS, rescisão, férias, 13º salário, horas extras e mais." />
        <meta name="keywords" content="calculadora direitos trabalhistas, FGTS, rescisão, férias, 13º salário, horas extras" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        {/* Hero Section */}
        <section className="bg-govblue-600 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Calculadora de Direitos Trabalhistas Gratuita
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-100 mb-8">
                Descubra o que você tem a receber!
              </h2>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
                <p className="text-lg text-white mb-6 leading-relaxed">
                  Não deixe seus direitos para trás! Calcule rapidamente FGTS, Rescisão, Férias, 13º e muito mais.
                </p>
              </div>

              {/* Prova Social */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-govyellow-300 mb-2">25K+</div>
                  <div className="text-sm">Cálculos Realizados</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-govyellow-300 mb-2">R$ 2.8M</div>
                  <div className="text-sm">Recuperados pelos Usuários*</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-govyellow-300 mb-2">4.9⭐</div>
                  <div className="text-sm">Avaliação dos Usuários</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Principal - Layout Lado a Lado */}
        <section className="py-20" id="calculator-section">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-3xl font-bold text-govblue-800 text-center mb-12">
                Escolha Qual Direito Você Quer Calcular:
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar - Opções de Calculadoras */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-xl shadow-lg border-2 border-govblue-200 p-6 lg:sticky lg:top-8">
                    <h4 className="text-xl font-bold text-govblue-800 mb-6 flex items-center">
                      <span className="mr-2">📋</span>
                      Calculadoras Disponíveis
                    </h4>
                    
                    <div className="space-y-3">
                      {calculators.map((calc) => (
                        <button
                          key={calc.id}
                          onClick={() => handleSelectCalculator(calc.id)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-300 border-2 ${
                            selectedCalculator === calc.id
                              ? 'bg-govblue-600 text-white border-govblue-500 shadow-md'
                              : 'bg-govgray-50 text-govblue-800 border-govgray-200 hover:border-govblue-300 hover:bg-govblue-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{calc.icon}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{calc.title}</div>
                              <div className={`text-xs mt-1 ${
                                selectedCalculator === calc.id ? 'text-blue-200' : 'text-govgray-600'
                              }`}>
                                {calc.description.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Área Principal - Calculadora */}
                <div className="lg:col-span-8">
                  {selectedCalculator ? (
                    <div className="bg-white rounded-xl shadow-lg border-2 border-govblue-200 p-8">
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-govblue-800 mb-2 flex items-center">
                          <span className="mr-3 text-3xl">
                            {calculators.find(c => c.id === selectedCalculator)?.icon}
                          </span>
                          {calculators.find(c => c.id === selectedCalculator)?.title}
                        </h4>
                        <p className="text-govgray-600 leading-relaxed">
                          {calculators.find(c => c.id === selectedCalculator)?.description}
                        </p>
                      </div>

                      <CalculadoraTrabalhista 
                        selectedCalculator={selectedCalculator}
                        onCalculate={handleCalculate}
                      />
                    </div>
                  ) : (
                    <div className="bg-govgray-50 rounded-xl border-2 border-dashed border-govgray-300 p-12 text-center">
                      <div className="text-6xl mb-4">🧮</div>
                      <h4 className="text-xl font-bold text-govblue-800 mb-4">
                        Selecione uma Calculadora
                      </h4>
                      <p className="text-govgray-600 max-w-md mx-auto leading-relaxed">
                        Escolha o tipo de cálculo que deseja realizar na lista ao lado.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário de Coleta de Dados */}
        {showDataForm && result && (
          <section id="data-form-section" className="py-20 bg-govblue-50">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-govblue-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-govblue-800 mb-4">
                      🎯 Pronto para Descobrir seu Resultado?
                    </h3>
                    <p className="text-govgray-600 leading-relaxed">
                      Para que possamos te entregar um relatório completo, precisamos de alguns dados.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitUserData} className="space-y-6">
                    <div>
                      <label className="block text-govblue-800 font-medium mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => handleUserDataChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-govblue-800 font-medium mb-2">E-mail *</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleUserDataChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-govblue-800 font-medium mb-2">Telefone *</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => handleUserDataChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-govgray-300 rounded-lg focus:ring-2 focus:ring-govblue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-lg"
                    >
                      📧 VER MEU RESULTADO AGORA!
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="py-20 bg-govgray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-govblue-800 mb-6 flex items-center justify-center">
                  <span className="mr-3">❓</span>
                  Dúvidas Frequentes
                </h3>
              </div>

              <div className="space-y-4">
                {faqData.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl shadow-md border-2 border-govgray-200 hover:border-govblue-300 transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-govblue-50 transition-all duration-300"
                    >
                      <h4 className="text-lg font-bold text-govblue-800 pr-4">
                        {item.question}
                      </h4>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-govblue-600 flex items-center justify-center transition-transform duration-300 ${
                        openFaqItem === item.id ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out ${
                      openFaqItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="px-6 pb-6 pt-0">
                        <div className="border-t border-govgray-200 pt-4">
                          <p className="text-govgray-700 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção Educativa */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-govblue-800 mb-6">
                📚 Aprofunde Seus Conhecimentos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {educationalTopics.map((topic) => (
                <div key={topic.id} className="bg-govgray-50 rounded-xl p-6 border border-govgray-200 hover:border-govblue-300 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-bold text-govblue-800 mb-3">{topic.title}</h3>
                  <p className="text-govgray-600 mb-4">{topic.description}</p>
                  <button 
                    onClick={() => openEducationalModal(topic.id)}
                    className="text-govblue-600 hover:text-govblue-800 font-medium hover:underline transition-colors duration-200"
                  >
                    Saiba mais →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada Final para Contato */}
        <section className="py-20 bg-govblue-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                🤝 Ainda com Dúvidas?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Nossa equipe está pronta para te auxiliar em qualquer questão sobre seus direitos trabalhistas.
              </p>
              
              <div className="space-x-4">
                <Link href="/contato">
                  <button className="bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    📞 FALE COM NOSSOS ESPECIALISTAS
                  </button>
                </Link>
                
                <a 
                  href="https://wa.me/5511999999999?text=Olá! Preciso de ajuda com meus direitos trabalhistas." 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <button className="bg-govyellow-500 hover:bg-govyellow-600 text-govblue-800 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    💬 WhatsApp Direto
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Educacional */}
      {showEducationalModal && selectedEducationalTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-govgray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-govblue-800">
                {selectedEducationalTopic.title}
              </h2>
              <button
                onClick={closeEducationalModal}
                className="text-govgray-500 hover:text-govgray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-govgray-100 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-lg text-govgray-700 mb-8 leading-relaxed border-l-4 border-govblue-500 pl-4 bg-govblue-50 p-4 rounded">
                {selectedEducationalTopic.content.intro}
              </p>
              
              <div className="space-y-6">
                {selectedEducationalTopic.content.sections.map((section, index) => (
                  <div key={index} className="bg-govgray-50 rounded-lg p-6 border border-govgray-200">
                    <h3 className="text-xl font-bold text-govblue-800 mb-4">
                      {section.title}
                    </h3>
                    <p className="text-govgray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CalculadoraPage
