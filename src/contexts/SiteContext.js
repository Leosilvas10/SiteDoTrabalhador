import React, { createContext, useContext, useState, useEffect } from 'react'

const SiteContext = createContext()

export const useSiteContext = () => {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSiteContext deve ser usado dentro de um SiteProvider')
  }
  return context
}

export const SiteProvider = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState({
    logoUrl: '/logo-site-trabalhador.svg', // Logo padrão
    heroTitulo: 'Encontre sua próxima oportunidade',
    heroSubtitulo: 'Conectamos trabalhadores a empresas em todo o Brasil',
    sobreTitulo: 'Sobre o Site do Trabalhador',
    sobreTexto: 'Plataforma dedicada a conectar trabalhadores e empresas.',
    contatoEmail: 'contato@sitedotrabalhador.com.br',
    contatoTelefone: '(11) 99999-9999'
  })

  // Carregar configurações do localStorage ao inicializar
  useEffect(() => {
    const savedConfig = localStorage.getItem('site_config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        // Garantir que sempre tenha uma logo
        if (!config.logoUrl) {
          config.logoUrl = '/logo-site-trabalhador.svg'
        }
        setSiteConfig(prev => ({ ...prev, ...config }))
      } catch (error) {
        console.error('Erro ao carregar configurações do site:', error)
        // Forçar logo padrão em caso de erro
        setSiteConfig(prev => ({ ...prev, logoUrl: '/logo-site-trabalhador.svg' }))
      }
    }
  }, [])

  // Salvar configurações no localStorage
  const updateSiteConfig = (newConfig) => {
    const updatedConfig = { ...siteConfig, ...newConfig }
    setSiteConfig(updatedConfig)
    localStorage.setItem('site_config', JSON.stringify(updatedConfig))
  }

  // Upload de logo
  const uploadLogo = async (file) => {
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro no upload')
      }

      const result = await response.json()
      const logoUrl = result.url

      // Atualizar configuração com a nova URL
      const updatedConfig = { ...siteConfig, logoUrl: logoUrl }
      console.log('Configuração antes do upload:', siteConfig)
      console.log('Nova configuração:', updatedConfig)
      
      setSiteConfig(updatedConfig)
      localStorage.setItem('site_config', JSON.stringify(updatedConfig))

      console.log('Upload realizado com sucesso:', logoUrl)
      console.log('Configuração salva no localStorage')
      return logoUrl
    } catch (error) {
      console.error('Erro no upload da logo:', error)
      throw error
    }
  }

  const value = {
    siteConfig,
    updateSiteConfig,
    uploadLogo
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  )
}
