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
    logoUrl: null, // Iniciar como null para verificar se há logo customizada
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
        setSiteConfig(prev => ({ ...prev, ...config }))
      } catch (error) {
        console.error('Erro ao carregar configurações do site:', error)
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
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoDataUrl = e.target.result
        const updatedConfig = { ...siteConfig, logoUrl: logoDataUrl }
        setSiteConfig(updatedConfig)
        localStorage.setItem('site_config', JSON.stringify(updatedConfig))
        resolve(logoDataUrl)
      }
      reader.onerror = () => {
        reject(new Error('Erro ao processar arquivo'))
      }
      reader.readAsDataURL(file)
    })
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
