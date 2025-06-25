import { useEffect } from 'react'
import { useSiteContext } from '../src/contexts/SiteContext'

export default function ResetLogo() {
  const { siteConfig, updateSiteConfig } = useSiteContext()
  
  useEffect(() => {
    // Limpar localStorage
    localStorage.removeItem('site_config')
    
    // Forçar logo padrão
    updateSiteConfig({
      logoUrl: '/logo-site-trabalhador.svg'
    })
    
    console.log('Logo resetada para:', '/logo-site-trabalhador.svg')
    
    // Redirecionar para home depois de 2 segundos
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl mb-4">🔄 Resetando Logo...</h1>
        <p>Redirecionando para a página inicial...</p>
        <div className="mt-4">
          <img 
            src="/logo-site-trabalhador.svg" 
            alt="Nova Logo" 
            className="w-32 h-auto mx-auto"
          />
        </div>
      </div>
    </div>
  )
}
