import Head from 'next/head'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'

const TermosUso = () => {
  return (
    <>
      <Head>
        <title>Termos de Uso - Site do Trabalhador</title>
        <meta name="description" content="Termos de Uso do Site do Trabalhador. Conheça as condições para utilização de nossos serviços." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-govgray-200 p-8">
            <h1 className="text-3xl font-bold text-govblue-800 mb-8 text-center">
              Termos de Uso
            </h1>

            <div className="space-y-8 text-govgray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">1. Aceitação dos Termos</h2>
                <p>
                  Ao utilizar o Site do Trabalhador, você concorda com estes Termos de Uso. 
                  Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">2. Descrição do Serviço</h2>
                <p>
                  O Site do Trabalhador oferece:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Calculadoras de direitos trabalhistas</li>
                  <li>Informações educativas sobre legislação trabalhista</li>
                  <li>Conexão com especialistas em direito do trabalho</li>
                  <li>Portal de vagas de emprego</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">3. Natureza das Calculadoras</h2>
                <p>
                  <strong>IMPORTANTE:</strong> Os cálculos fornecidos por nossas calculadoras são 
                  <strong>estimativos</strong> e baseados na legislação vigente. Eles não constituem 
                  aconselhamento jurídico ou garantia de valores. Para análise jurídica precisa, 
                  consulte sempre um advogado especializado em direito do trabalho.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">4. Responsabilidades do Usuário</h2>
                <p>Você se compromete a:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Usar o serviço apenas para fins legais</li>
                  <li>Não tentar violar a segurança do sistema</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">5. Isenção de Responsabilidade</h2>
                <p>
                  O Site do Trabalhador não se responsabiliza por:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Decisões tomadas com base nos cálculos fornecidos</li>
                  <li>Perdas ou danos decorrentes do uso do serviço</li>
                  <li>Informações fornecidas por terceiros</li>
                  <li>Interrupções temporárias do serviço</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">6. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo do site, incluindo textos, imagens, logotipos e código, 
                  é de propriedade do Site do Trabalhador e protegido por leis de direitos autorais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">7. Modificações</h2>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação no site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">8. Lei Aplicável</h2>
                <p>
                  Estes termos são regidos pela legislação brasileira, e qualquer disputa 
                  será resolvida nos tribunais competentes do Brasil.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-govblue-800 mb-4">9. Contato</h2>
                <p>
                  Para dúvidas sobre estes termos, entre em contato conosco através do 
                  e-mail: <a href="mailto:contato@sitedotrabalhador.com.br" className="text-govblue-600 hover:text-govblue-800 underline">contato@sitedotrabalhador.com.br</a>
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

export default TermosUso
