
import Head from 'next/head';

const PrivacidadePage = () => {
  return (
    <>
      <Head>
        <title>Política de Privacidade - Site do Trabalhador</title>
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-white mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-300 mb-6">
              Coletamos apenas as informações fornecidas voluntariamente ao se candidatar a vagas:
            </p>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Nome completo</li>
              <li>Número de WhatsApp</li>
              <li>Informações sobre experiência trabalhista anterior</li>
              <li>Dados sobre situações trabalhistas vivenciadas</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mb-4">2. Como Usamos suas Informações</h2>
            <p className="text-gray-300 mb-6">
              Suas informações são utilizadas para:
            </p>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Conectá-lo com oportunidades de emprego</li>
              <li>Fornecer orientação sobre direitos trabalhistas através de parceiros</li>
              <li>Melhorar nossos serviços</li>
              <li>Comunicação relacionada ao serviço</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mb-4">3. Compartilhamento de Dados</h2>
            <p className="text-gray-300 mb-6">
              Compartilhamos suas informações apenas com:
            </p>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Parceiros especializados em consultoria trabalhista (apenas se você autorizar)</li>
              <li>Empresas anunciantes (apenas dados necessários para candidatura)</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mb-4">4. Seus Direitos (LGPD)</h2>
            <p className="text-gray-300 mb-6">
              Conforme a Lei Geral de Proteção de Dados, você tem direito a:
            </p>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão dos dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mb-4">5. Segurança</h2>
            <p className="text-gray-300 mb-6">
              Implementamos medidas de segurança adequadas para proteger suas informações 
              contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
            <p className="text-gray-300 mb-6">
              Utilizamos cookies apenas para melhorar a funcionalidade do site. 
              Você pode desabilitar os cookies nas configurações do seu navegador.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">7. Alterações na Política</h2>
            <p className="text-gray-300 mb-6">
              Esta política pode ser atualizada periodicamente. Notificaremos sobre 
              mudanças significativas através do site.
            </p>

            <h2 className="text-xl font-semibold text-white mb-4">8. Contato</h2>
            <p className="text-gray-300">
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
              <br />
              E-mail: privacidade@sitedotrabalhador.com.br
              <br />
              Responsável pela proteção de dados: [Nome do Responsável]
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacidadePage;
