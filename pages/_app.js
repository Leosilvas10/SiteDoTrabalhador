
import '../pages/style.css'
import Head from 'next/head'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'
import ScrollToTop from '../src/components/ScrollToTop/ScrollToTop'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <main className="pt-16">
          <Component {...pageProps} />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}
