import Head from 'next/head'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'

const LGPD = () => {
  return (
    <>
      <Head>
        <title>LGPD - Proteção de Dados - Site do Trabalhador</title>
        <meta name="description" content="Informações sobre LGPD e proteção de dados pessoais no Site do Trabalhador. Seus direitos e nossa responsabilidade." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-govgray-200 p-8">
            <h1 className="text-3xl font-bold text-govblue-800 mb-8 text-center">
              LGPD - Lei Geral de Proteção de Dados
            </h1>

            <div className="space-y-8 text-govgray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">O que é a LGPD?</h2>
                <p>
                  A Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) é a legislação 
                  brasileira que regula o tratamento de dados pessoais, garantindo maior controle aos 
                  titulares sobre suas informações pessoais e estabelecendo regras claras para empresas 
                  que coletam e processam esses dados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">Nosso Compromisso</h2>
                <p>
                  O Site do Trabalhador está comprometido com a proteção dos seus dados pessoais e 
                  com o cumprimento integral da LGPD. Implementamos medidas técnicas e organizacionais 
                  adequadas para garantir a segurança e privacidade das suas informações.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">Seus Direitos como Titular</h2>
                <p>De acordo com a LGPD, você tem os seguintes direitos:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-govblue-50 p-4 rounded-lg border border-govblue-200">
                    <h3 className="font-semibold text-govblue-800 mb-2">📋 Confirmação</h3>
                    <p className="text-sm">Confirmar a existência de tratamento dos seus dados</p>
                  </div>
                  <div className="bg-govblue-50 p-4 rounded-lg border border-govblue-200">
                    <h3 className="font-semibold text-govblue-800 mb-2">👁️ Acesso</h3>
                    <p className="text-sm">Acessar os dados pessoais que temos sobre você</p>
                  </div>
                  <div className="bg-govblue-50 p-4 rounded-lg border border-govblue-200">
                    <h3 className="font-semibold text-govblue-800 mb-2">✏️ Correção</h3>
                    <p className="text-sm">Corrigir dados incompletos, inexatos ou desatualizados</p>
                  </div>
                  <div className="bg-govblue-50 p-4 rounded-lg border border-govblue-200">
                    <h3 className="font-semibold text-govblue-800 mb-2">🗑️ Eliminação</h3>
                    <p className="text-sm">Eliminar dados pessoais tratados com consentimento</p>
                  </div>
                  <div className="bg-govblue-50 p-4 rounded-lg border border-govblue-200">
                    <h3 className="font-semibold text-govblue-800 mb-2">📤 Portabilidade</h3>
                    <p className="text-sm">Solicitar a portabilidade dos dados para outro fornecedor</p>
                  </div>
                  <div className="bg-govblue-50 p-4 rounded-lg border border-govblue-200">
                    <h3 className="font-semibold text-govblue-800 mb-2">🚫 Revogação</h3>
                    <p className="text-sm">Revogar o consentimento para tratamento dos dados</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">Base Legal para Tratamento</h2>
                <p>Tratamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Consentimento:</strong> Quando você autoriza expressamente</li>
                  <li><strong>Execução de contrato:</strong> Para fornecimento dos serviços</li>
                  <li><strong>Interesse legítimo:</strong> Para melhoria dos serviços</li>
                  <li><strong>Cumprimento de obrigação legal:</strong> Quando exigido por lei</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">Segurança dos Dados</h2>
                <p>Implementamos medidas de segurança que incluem:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Criptografia de dados sensíveis</li>
                  <li>Controle de acesso restrito</li>
                  <li>Monitoramento de segurança</li>
                  <li>Backups seguros e regulares</li>
                  <li>Treinamento da equipe em proteção de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">Compartilhamento de Dados</h2>
                <p>
                  Seus dados podem ser compartilhados apenas nas seguintes situações:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Com seu consentimento expresso</li>
                  <li>Com parceiros especializados para prestação de serviços jurídicos</li>
                  <li>Quando exigido por ordem judicial ou autoridade competente</li>
                  <li>Para proteção da vida ou da incolumidade física</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">Exercendo Seus Direitos</h2>
                <p>
                  Para exercer qualquer um dos seus direitos ou esclarecer dúvidas sobre o 
                  tratamento dos seus dados pessoais, entre em contato conosco:
                </p>
                <div className="bg-govgreen-50 border border-govgreen-200 rounded-lg p-4 mt-4">
                  <p><strong>E-mail:</strong> <a href="mailto:lgpd@sitedotrabalhador.com.br" className="text-govblue-600 hover:text-govblue-800 underline">lgpd@sitedotrabalhador.com.br</a></p>
                  <p><strong>Prazo de resposta:</strong> Até 15 dias úteis</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">Autoridade Nacional de Proteção de Dados (ANPD)</h2>
                <p>
                  Se não estiver satisfeito com nossas respostas, você pode registrar uma 
                  reclamação junto à ANPD através do site:{' '}
                  <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-govblue-600 hover:text-govblue-800 underline">
                    www.gov.br/anpd
                  </a>
                </p>
              </section>

              <div className="mt-8 pt-6 border-t border-govgray-200 text-sm text-govgray-600">
                <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default LGPD
