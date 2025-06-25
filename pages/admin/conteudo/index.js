import { useState, useEffect } from 'react'
import AdminLayout from '../../../src/components/Admin/AdminLayout'
import { useSiteContext } from '../../../src/contexts/SiteContext'

const ConteudoAdmin = () => {
  const { siteConfig, updateSiteConfig, uploadLogo } = useSiteContext()
  
  const [conteudo, setConteudo] = useState({
    heroTitulo: 'Encontre sua próxima oportunidade',
    heroSubtitulo: 'Conectamos trabalhadores a empresas em todo o Brasil',
    sobreTitulo: 'Sobre o Site do Trabalhador',
    sobreTexto: 'Plataforma dedicada a conectar trabalhadores e empresas.',
    contatoEmail: 'contato@sitedotrabalhador.com.br',
    contatoTelefone: '(11) 99999-9999',
    logoUrl: '/logo.png' // Nova logo sem fundo
  })

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Sincronizar com o contexto
  useEffect(() => {
    if (siteConfig) {
      setConteudo(prev => ({ ...prev, ...siteConfig }))
    }
  }, [siteConfig])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload da nova logo se selecionada
      if (logoFile) {
        console.log('Fazendo upload da logo:', logoFile.name)
        const logoUrl = await uploadLogo(logoFile)
        console.log('Logo uploaded com sucesso:', logoUrl)
      }
      
      // Atualizar outras configurações
      updateSiteConfig(conteudo)
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Conteúdo atualizado com sucesso!')
      setTimeout(() => setMessage(''), 3000)
      
      // Limpar preview
      setLogoFile(null)
      setLogoPreview(null)
      const fileInput = document.getElementById('logo-upload')
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error)
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      
      // Criar preview da imagem
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogoPreview = () => {
    setLogoFile(null)
    setLogoPreview(null)
    // Reset do input file
    const fileInput = document.getElementById('logo-upload')
    if (fileInput) {
      fileInput.value = ''
    }
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
            {/* Seção Logo */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Logo do Site</h4>
              <div className="space-y-4">
                {/* Logo Atual */}
                <div>
                  <label className="block text-slate-300 mb-2">Logo Atual</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {conteudo.logoUrl ? (
                        <img 
                          src={conteudo.logoUrl} 
                          alt="Logo atual" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-400 text-sm">Sem logo</span>
                      )}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Tamanho recomendado: 200x200px<br />
                      Formatos: PNG, JPG, SVG
                    </div>
                  </div>
                </div>

                {/* Upload Nova Logo */}
                <div>
                  <label className="block text-slate-300 mb-2">Alterar Logo</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block w-full text-sm text-slate-300
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-600 file:text-white
                        hover:file:bg-blue-700
                        file:cursor-pointer cursor-pointer"
                    />
                    
                    {/* Preview da nova logo */}
                    {logoPreview && (
                      <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                        <div className="w-16 h-16 bg-slate-600 rounded-lg overflow-hidden">
                          <img 
                            src={logoPreview} 
                            alt="Preview da nova logo" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">Nova logo selecionada</p>
                          <p className="text-slate-400 text-xs">{logoFile?.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeLogoPreview}
                          className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-600 rounded hover:bg-red-600/10 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
