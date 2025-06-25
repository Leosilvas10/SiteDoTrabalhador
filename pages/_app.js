
import '../pages/style.css'
import Head from 'next/head'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'
import ScrollToTop from '../src/components/ScrollToTop/ScrollToTop'
import { SiteProvider, useSiteContext } from '../src/contexts/SiteContext'
import { useRouter } from 'next/router'

function AppContent({ Component, pageProps }) {
  const { siteConfig } = useSiteContext()
  const router = useRouter()
  
  // Páginas que não devem ter Header/Footer padrão
  const excludeLayout = [
    '/empresas',
    '/admin',
    '/admin/login',
    '/admin/dashboard',
    '/admin/vagas',
    '/admin/leads',
    '/admin/empresas', 
    '/admin/usuarios',
    '/admin/conteudo',
    '/admin/configuracoes'
  ]
  
  const shouldExcludeLayout = excludeLayout.some(path => 
    router.pathname === path || router.pathname.startsWith(path)
  )
  
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={siteConfig?.logoUrl || "/logo.jpeg"} />
      </Head>
      
      {shouldExcludeLayout ? (
        // Páginas sem layout padrão (empresas, admin)
        <Component {...pageProps} />
      ) : (
        // Páginas com layout padrão
        <div className="min-h-screen bg-slate-900 text-white">
          <Header />
          <main className="pt-16">
            <Component {...pageProps} />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      )}
    </>
  )
}

export default function MyApp({ Component, pageProps }) {
  return (
    <SiteProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </SiteProvider>
  )
}
