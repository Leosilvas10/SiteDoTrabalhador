import { useState, useEffect } from 'react'
import AdminLayout from '../../../src/components/Admin/AdminLayout'
import { useSiteContext } from '../../../src/contexts/SiteContext'
import Link from 'next/link'

const ConteudoAdmin = () => {
  const { siteConfig, updateSiteConfig, uploadLogo } = useSiteContext()
  
  const [conteudo, setConteudo] = useState({
    heroTitulo: 'Encontre sua próxima oportunidade',
    heroSubtitulo: 'Conectamos trabalhadores a empresas em todo o Brasil',
    sobreTitulo: 'Sobre o Site do Trabalhador',
    sobreTexto: 'Plataforma dedicada a conectar trabalhadores e empresas.',
    contatoEmail: 'contato@sitedotrabalhador.com.br',
    contatoTelefone: '(11) 99999-9999',
    logoUrl: '/logo.png' // Logo atual
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
    setMessage('')

    try {
      // Upload da nova logo se selecionada
      if (logoFile) {
        console.log('Fazendo upload da logo:', logoFile.name)
        setMessage('Fazendo upload da logo...')
        
        try {
          const logoUrl = await uploadLogo(logoFile)
          console.log('Logo uploaded com sucesso:', logoUrl)
          setMessage('Logo atualizada com sucesso!')
        } catch (uploadError) {
          console.error('Erro no upload da logo:', uploadError)
          setMessage('Erro no upload da logo: ' + uploadError.message)
          setLoading(false)
          return
        }
      }
      
      // Atualizar outras configurações
      updateSiteConfig(conteudo)
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!logoFile) {
        setMessage('Conteúdo atualizado com sucesso!')
      }
      
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
      setMessage('Erro ao atualizar conteúdo: ' + error.message)
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
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('sucesso') || message.includes('realizado') 
                ? 'bg-green-900/20 border border-green-600 text-green-400' 
                : message.includes('upload') 
                ? 'bg-blue-900/20 border border-blue-600 text-blue-400'
                : 'bg-red-900/20 border border-red-600 text-red-400'
            }`}>
              <div className="flex items-center">
                {loading && message.includes('upload') && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                )}
                {message}
              </div>
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
                      {siteConfig.logoUrl ? (
                        <img 
                          src={`${siteConfig.logoUrl}?t=${Date.now()}`}
                          alt="Logo atual" 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.error('Erro ao carregar logo:', siteConfig.logoUrl)
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="text-slate-400 text-sm">Sem logo</span>
                      )}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Tamanho recomendado: 200x200px<br />
                      Formatos: PNG, JPG, SVG<br />
                      {siteConfig.logoUrl && (
                        <span className="text-xs text-green-400">
                          URL atual: {siteConfig.logoUrl}
                        </span>
                      )}
                    </div>
                    {siteConfig.logoUrl && (
                      <button
                        type="button"
                        onClick={() => window.open('/', '_blank')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Ver no Site
                      </button>
                    )}
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

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Administração do Site</h2>
            <Link 
              href="/admin/leads"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              👥 Gerenciar Leads
            </Link>
          </div>
          
          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700">Leads Hoje</h3>
              <p className="text-2xl font-bold text-blue-900">-</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">Total de Leads</h3>
              <p className="text-2xl font-bold text-green-900">-</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-700">Taxa de Conversão</h3>
              <p className="text-2xl font-bold text-purple-900">-</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ConteudoAdmin
