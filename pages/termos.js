
import Head from 'next/head';

const TermosPage = () => {
  return (
    <>
      <Head>
        <title>Termos de Uso - Site do Trabalhador</title>
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Termos de Uso</h1>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-300 mb-6">
              Ao acessar e utilizar o Site do Trabalhador, você concorda com estes Termos de Uso. 
              Se não concordar com qualquer parte destes termos, não utilize nosso serviço.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-300 mb-6">
              O Site do Trabalhador é uma plataforma gratuita que agrega vagas de emprego de 
              diversas fontes e oferece orientação sobre direitos trabalhistas através de parceiros especializados.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">3. Uso do Serviço</h2>
            <p className="text-gray-300 mb-6">
              Você pode navegar e visualizar as vagas gratuitamente. Ao se candidatar a uma vaga, 
              você fornece informações que podem ser compartilhadas com nossos parceiros jurídicos 
              para orientação sobre direitos trabalhistas.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">4. Coleta e Uso de Dados</h2>
            <p className="text-gray-300 mb-6">
              Coletamos apenas as informações necessárias para o funcionamento do serviço. 
              Consulte nossa Política de Privacidade para mais detalhes.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">5. Limitação de Responsabilidade</h2>
            <p className="text-gray-300 mb-6">
              O Site do Trabalhador atua como intermediário entre candidatos e vagas. 
              Não somos responsáveis por processos seletivos ou relações de trabalho estabelecidas.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">6. Modificações</h2>
            <p className="text-gray-300 mb-6">
              Reservamos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">7. Contato</h2>
            <p className="text-gray-300">
              Para dúvidas sobre estes termos, entre em contato através do e-mail: 
              contato@sitedotrabalhador.com.br
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermosPage;
