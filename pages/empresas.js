
import { useState } from 'react'
import Head from 'next/head'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'

const EmpresasPage = () => {
  const [formData, setFormData] = useState({
    // Dados da empresa
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    segmento: '',
    cidade: '',
    descricaoEmpresa: '',
    
    // Dados da vaga
    cargo: '',
    area: '',
    tipoContrato: 'CLT',
    salario: '',
    descricaoVaga: '',
    requisitos: '',
    beneficios: '',
    localTrabalho: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/submit-empresa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          nomeEmpresa: '',
          cnpj: '',
          email: '',
          telefone: '',
          segmento: '',
          cidade: '',
          descricaoEmpresa: '',
          cargo: '',
          area: '',
          tipoContrato: 'CLT',
          salario: '',
          descricaoVaga: '',
          requisitos: '',
          beneficios: '',
          localTrabalho: ''
        })
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Para Empresas - Site do Trabalhador</title>
        <meta name="description" content="Publique suas vagas no Site do Trabalhador e encontre os melhores candidatos" />
      </Head>

      <Header />

      <main className="min-h-screen bg-slate-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🏢 Área para Empresas
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Publique suas vagas no maior portal de empregos do Brasil e encontre 
              os melhores profissionais para sua empresa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-white mb-2">Mais Visibilidade</h3>
                <p className="text-slate-400 text-sm">Suas vagas serão vistas por milhares de candidatos qualificados</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-white mb-2">Processo Rápido</h3>
                <p className="text-slate-400 text-sm">Análise e publicação em até 24 horas úteis</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="text-3xl mb-3">💯</div>
                <h3 className="font-semibold text-white mb-2">Candidatos Pré-Filtrados</h3>
                <p className="text-slate-400 text-sm">Receba apenas candidatos que atendem aos requisitos</p>
              </div>
            </div>
          </div>

          {success ? (
            /* Mensagem de Sucesso */
            <div className="max-w-2xl mx-auto bg-green-600/20 border border-green-500 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-white mb-4">Solicitação Enviada com Sucesso!</h2>
              <p className="text-slate-300 mb-6">
                Recebemos sua solicitação e entraremos em contato em até 24 horas úteis 
                para análise e publicação da vaga.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="btn-primary"
              >
                Enviar Nova Solicitação
              </button>
            </div>
          ) : (
            /* Formulário */
            <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                📝 Solicitar Publicação de Vaga
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Dados da Empresa */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    🏢 Dados da Empresa
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nome da Empresa *
                      </label>
                      <input
                        type="text"
                        name="nomeEmpresa"
                        value={formData.nomeEmpresa}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        CNPJ *
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        placeholder="00.000.000/0000-00"
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        E-mail Corporativo *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Segmento *
                      </label>
                      <select
                        name="segmento"
                        value={formData.segmento}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="">Selecione o segmento</option>
                        <option value="servicos-gerais">Serviços Gerais</option>
                        <option value="limpeza">Limpeza e Conservação</option>
                        <option value="seguranca">Segurança e Portaria</option>
                        <option value="alimentacao">Alimentação e Hotelaria</option>
                        <option value="saude">Saúde e Cuidados</option>
                        <option value="construcao">Construção Civil</option>
                        <option value="comercio">Comércio e Varejo</option>
                        <option value="industria">Indústria</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="São Paulo, SP"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Descrição da Empresa
                    </label>
                    <textarea
                      name="descricaoEmpresa"
                      value={formData.descricaoEmpresa}
                      onChange={handleChange}
                      rows={3}
                      className="form-input"
                      placeholder="Conte um pouco sobre sua empresa..."
                    />
                  </div>
                </div>

                {/* Dados da Vaga */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    💼 Dados da Vaga
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Cargo/Função *
                      </label>
                      <input
                        type="text"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        placeholder="Ex: Auxiliar de Limpeza"
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Área *
                      </label>
                      <select
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="">Selecione a área</option>
                        <option value="limpeza">Limpeza e Conservação</option>
                        <option value="portaria">Portaria e Segurança</option>
                        <option value="servicos-gerais">Serviços Gerais</option>
                        <option value="cuidados">Cuidados e Saúde</option>
                        <option value="alimentacao">Alimentação</option>
                        <option value="construcao">Construção</option>
                        <option value="comercio">Comércio</option>
                        <option value="manutencao">Manutenção</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Tipo de Contrato *
                      </label>
                      <select
                        name="tipoContrato"
                        value={formData.tipoContrato}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="CLT">CLT</option>
                        <option value="Temporário">Temporário</option>
                        <option value="Terceirizado">Terceirizado</option>
                        <option value="PJ">Pessoa Jurídica</option>
                        <option value="Estágio">Estágio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Faixa Salarial
                      </label>
                      <input
                        type="text"
                        name="salario"
                        value={formData.salario}
                        onChange={handleChange}
                        placeholder="Ex: R$ 1.320,00"
                        className="form-input"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Local de Trabalho *
                      </label>
                      <input
                        type="text"
                        name="localTrabalho"
                        value={formData.localTrabalho}
                        onChange={handleChange}
                        placeholder="Ex: São Paulo, SP - Centro"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Descrição da Vaga *
                      </label>
                      <textarea
                        name="descricaoVaga"
                        value={formData.descricaoVaga}
                        onChange={handleChange}
                        rows={4}
                        className="form-input"
                        placeholder="Descreva as principais atividades e responsabilidades..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Requisitos
                      </label>
                      <textarea
                        name="requisitos"
                        value={formData.requisitos}
                        onChange={handleChange}
                        rows={3}
                        className="form-input"
                        placeholder="Ex: Ensino fundamental, experiência anterior..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Benefícios
                      </label>
                      <textarea
                        name="beneficios"
                        value={formData.beneficios}
                        onChange={handleChange}
                        rows={3}
                        className="form-input"
                        placeholder="Ex: Vale transporte, vale alimentação..."
                      />
                    </div>
                  </div>
                </div>

                {/* Botão de envio */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin inline-block mr-2">⏳</span>
                        Enviando Solicitação...
                      </>
                    ) : (
                      <>
                        📤 Enviar Solicitação
                      </>
                    )}
                  </button>
                  
                  <p className="text-slate-400 text-sm mt-4">
                    * Campos obrigatórios. Analisaremos sua solicitação em até 24 horas úteis.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default EmpresasPage
