
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../src/components/Admin/AdminLayout'

export default function EditarLandingPage() {
  const router = useRouter()
  const { id } = router.query
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    slug: '',
    titulo: '',
    subtitulo: '',
    heroDescription: '',
    sobre: {
      titulo: '',
      texto: '',
      imagem: ''
    },
    servicos: {
      titulo: '',
      subtitulo: '',
      lista: [
        { titulo: '', descricao: '', icone: '' },
        { titulo: '', descricao: '', icone: '' },
        { titulo: '', descricao: '', icone: '' }
      ]
    },
    bonus: {
      titulo: '',
      descricao: '',
      imagem: '',
      ctaTexto: ''
    },
    formulario: {
      titulo: '',
      subtitulo: '',
      ctaTexto: ''
    },
    whatsapp: {
      numero: '',
      mensagem: '',
      ctaTexto: ''
    },
    pdfs: [],
    imagens: {
      hero: '',
      sobre: '',
      bonus: '',
      logo: ''
    },
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ativo: true
  })

  useEffect(() => {
    if (id) {
      fetchLandingPage()
    }
  }, [id])

  const fetchLandingPage = async () => {
    try {
      const response = await fetch('/api/landing-pages')
      const data = await response.json()
      
      if (data.success) {
        const page = data.data.find(p => p.id === id || p.slug === id)
        if (page) {
          console.log('Landing page encontrada:', page)
          setFormData(page)
        } else {
          console.log('Landing page não encontrada para ID:', id)
          setMessage('Landing page não encontrada')
        }
      }
    } catch (error) {
      console.error('Erro ao buscar landing page:', error)
      setMessage('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch(`/api/landing-pages?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Landing page atualizada com sucesso!')
        setTimeout(() => {
          router.push('/admin/landing-pages')
        }, 2000)
      } else {
        setMessage('Erro ao atualizar: ' + data.message)
      }
    } catch (error) {
      console.error('Erro:', error)
      setMessage('Erro ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleServicoChange = (index, field, value) => {
    const newServicos = [...formData.servicos.lista]
    newServicos[index][field] = value
    handleChange('servicos.lista', newServicos)
  }

  const addPdf = () => {
    const newPdfs = [...formData.pdfs, { nome: '', url: '', descricao: '' }]
    handleChange('pdfs', newPdfs)
  }

  const removePdf = (index) => {
    const newPdfs = formData.pdfs.filter((_, i) => i !== index)
    handleChange('pdfs', newPdfs)
  }

  const handlePdfChange = (index, field, value) => {
    const newPdfs = [...formData.pdfs]
    newPdfs[index][field] = value
    handleChange('pdfs', newPdfs)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Editar Landing Page - Admin</title>
      </Head>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Landing Page
              </h1>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Informações Básicas */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Informações Básicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="jotasolucoes"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.ativo}
                        onChange={(e) => handleChange('ativo', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Página Ativa
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => handleChange('titulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Título que aparece no topo da página"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={formData.subtitulo}
                      onChange={(e) => handleChange('subtitulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Subtítulo que aparece abaixo do título"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição Hero
                    </label>
                    <textarea
                      value={formData.heroDescription}
                      onChange={(e) => handleChange('heroDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descrição que aparece na seção principal"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Sobre */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Seção Sobre
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={formData.sobre.titulo}
                      onChange={(e) => handleChange('sobre.titulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto da Seção
                    </label>
                    <textarea
                      value={formData.sobre.texto}
                      onChange={(e) => handleChange('sobre.texto', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={formData.sobre.imagem}
                      onChange={(e) => handleChange('sobre.imagem', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Serviços */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Seção Serviços
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título da Seção
                      </label>
                      <input
                        type="text"
                        value={formData.servicos.titulo}
                        onChange={(e) => handleChange('servicos.titulo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtítulo da Seção
                      </label>
                      <input
                        type="text"
                        value={formData.servicos.subtitulo}
                        onChange={(e) => handleChange('servicos.subtitulo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-3">
                      Lista de Serviços
                    </h3>
                    {formData.servicos.lista.map((servico, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Ícone (emoji)
                            </label>
                            <input
                              type="text"
                              value={servico.icone}
                              onChange={(e) => handleServicoChange(index, 'icone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="💼"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Título do Serviço
                            </label>
                            <input
                              type="text"
                              value={servico.titulo}
                              onChange={(e) => handleServicoChange(index, 'titulo', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Descrição
                            </label>
                            <textarea
                              value={servico.descricao}
                              onChange={(e) => handleServicoChange(index, 'descricao', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seção Bônus */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Seção Bônus/Oferta
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Bônus
                    </label>
                    <input
                      type="text"
                      value={formData.bonus.titulo}
                      onChange={(e) => handleChange('bonus.titulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição do Bônus
                    </label>
                    <textarea
                      value={formData.bonus.descricao}
                      onChange={(e) => handleChange('bonus.descricao', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagem do Bônus
                      </label>
                      <input
                        type="url"
                        value={formData.bonus.imagem}
                        onChange={(e) => handleChange('bonus.imagem', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto do Botão
                      </label>
                      <input
                        type="text"
                        value={formData.bonus.ctaTexto}
                        onChange={(e) => handleChange('bonus.ctaTexto', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Configurações do Formulário */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Configurações do Formulário
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Formulário
                    </label>
                    <input
                      type="text"
                      value={formData.formulario.titulo}
                      onChange={(e) => handleChange('formulario.titulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo do Formulário
                    </label>
                    <input
                      type="text"
                      value={formData.formulario.subtitulo}
                      onChange={(e) => handleChange('formulario.subtitulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto do Botão de Envio
                    </label>
                    <input
                      type="text"
                      value={formData.formulario.ctaTexto}
                      onChange={(e) => handleChange('formulario.ctaTexto', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Configurações do WhatsApp */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Configurações do WhatsApp
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número do WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp.numero}
                      onChange={(e) => handleChange('whatsapp.numero', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5511999999999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem Padrão
                    </label>
                    <textarea
                      value={formData.whatsapp.mensagem}
                      onChange={(e) => handleChange('whatsapp.mensagem', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto do Botão WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp.ctaTexto}
                      onChange={(e) => handleChange('whatsapp.ctaTexto', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* PDFs */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  PDFs para Download
                </h2>
                <div className="space-y-4">
                  {formData.pdfs.map((pdf, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nome do PDF
                          </label>
                          <input
                            type="text"
                            value={pdf.nome}
                            onChange={(e) => handlePdfChange(index, 'nome', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            URL do PDF
                          </label>
                          <input
                            type="url"
                            value={pdf.url}
                            onChange={(e) => handlePdfChange(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removePdf(index)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Descrição
                        </label>
                        <input
                          type="text"
                          value={pdf.descricao}
                          onChange={(e) => handlePdfChange(index, 'descricao', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addPdf}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Adicionar PDF
                  </button>
                </div>
              </div>

              {/* Imagens */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Imagens
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem Hero
                    </label>
                    <input
                      type="url"
                      value={formData.imagens.hero}
                      onChange={(e) => handleChange('imagens.hero', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <input
                      type="url"
                      value={formData.imagens.logo}
                      onChange={(e) => handleChange('imagens.logo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  SEO
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Título
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleChange('metaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Descrição
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleChange('metaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palavras-chave
                    </label>
                    <input
                      type="text"
                      value={formData.metaKeywords}
                      onChange={(e) => handleChange('metaKeywords', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="palavra1, palavra2, palavra3"
                    />
                  </div>
                </div>
              </div>

              {/* Mensagem de Status */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('sucesso')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex space-x-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/admin/landing-pages')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                
                <a
                  href={`/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block text-center"
                >
                  Visualizar Página
                </a>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
