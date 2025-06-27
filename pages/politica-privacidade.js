import Head from 'next/head'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'

const PoliticaPrivacidade = () => {
  return (
    <>
      <Head>
        <title>Política de Privacidade - Site do Trabalhador</title>
        <meta name="description" content="Política de Privacidade do Site do Trabalhador. Saiba como protegemos e utilizamos seus dados pessoais." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-govgray-200 p-8">
            <h1 className="text-3xl font-bold text-govblue-800 mb-8 text-center">
              Política de Privacidade
            </h1>

            <div className="space-y-8 text-govgray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">1. Informações Gerais</h2>
                <p>
                  Esta Política de Privacidade descreve como o Site do Trabalhador coleta, usa e protege 
                  as informações pessoais dos usuários de nossos serviços, em conformidade com a Lei Geral 
                  de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">2. Dados Coletados</h2>
                <p>Coletamos as seguintes informações:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Número de telefone</li>
                  <li>Informações sobre problemas trabalhistas</li>
                  <li>Dados de uso do site (cookies, logs de acesso)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">3. Finalidade do Tratamento</h2>
                <p>Utilizamos seus dados para:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Fornecer resultados de cálculos trabalhistas</li>
                  <li>Enviar informações relevantes sobre direitos trabalhistas</li>
                  <li>Melhorar nossos serviços</li>
                  <li>Conectar você com especialistas parceiros</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">4. Compartilhamento de Dados</h2>
                <p>
                  Seus dados podem ser compartilhados apenas com parceiros especializados em direito 
                  trabalhista, mediante seu consentimento expresso, para oferecer orientação jurídica 
                  personalizada.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">5. Segurança</h2>
                <p>
                  Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados 
                  pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">6. Seus Direitos</h2>
                <p>Você tem direito a:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Confirmação da existência de tratamento</li>
                  <li>Acesso aos dados</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                  <li>Eliminação dos dados pessoais tratados com consentimento</li>
                  <li>Informações sobre entidades com as quais compartilhamos dados</li>
                  <li>Revogação do consentimento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">7. Contato</h2>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato 
                  conosco através do e-mail: <a href="mailto:privacidade@sitedotrabalhador.com.br" className="text-govblue-600 hover:text-govblue-800 underline">privacidade@sitedotrabalhador.com.br</a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">8. Alterações</h2>
                <p>
                  Esta política pode ser atualizada periodicamente. Recomendamos que você a consulte 
                  regularmente para se manter informado sobre como protegemos seus dados.
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

export default PoliticaPrivacidade
