import { useState, useEffect } from 'react'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

const ConteudoAdmin = () => {
  const [conteudo, setConteudo] = useState({
    heroTitulo: 'Encontre sua próxima oportunidade',
    heroSubtitulo: 'Conectamos trabalhadores a empresas em todo o Brasil',
    sobreTitulo: 'Sobre o Site do Trabalhador',
    sobreTexto: 'Plataforma dedicada a conectar trabalhadores e empresas.',
    contatoEmail: 'contato@sitedotrabalhador.com.br',
    contatoTelefone: '(11) 99999-9999'
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Conteúdo atualizado com sucesso!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Erro ao atualizar conteúdo')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setConteudo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <AdminLayout title="Gerenciar Conteúdo">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Editar Conteúdo do Site</h3>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('sucesso') ? 'bg-green-900/20 border border-green-600 text-green-400' : 'bg-red-900/20 border border-red-600 text-red-400'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção Hero */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Seção Principal (Hero)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">Título Principal</label>
                  <input
                    type="text"
                    value={conteudo.heroTitulo}
                    onChange={(e) => handleChange('heroTitulo', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Subtítulo</label>
                  <textarea
                    value={conteudo.heroSubtitulo}
                    onChange={(e) => handleChange('heroSubtitulo', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção Sobre */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Seção Sobre</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">Título da Seção</label>
                  <input
                    type="text"
                    value={conteudo.sobreTitulo}
                    onChange={(e) => handleChange('sobreTitulo', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Texto Descritivo</label>
                  <textarea
                    value={conteudo.sobreTexto}
                    onChange={(e) => handleChange('sobreTexto', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção Contato */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Informações de Contato</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Email de Contato</label>
                  <input
                    type="email"
                    value={conteudo.contatoEmail}
                    onChange={(e) => handleChange('contatoEmail', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Telefone de Contato</label>
                  <input
                    type="tel"
                    value={conteudo.contatoTelefone}
                    onChange={(e) => handleChange('contatoTelefone', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ConteudoAdmin