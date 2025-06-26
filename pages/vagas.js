import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../src/components/Header/Header'
import SimpleCopyright from '../src/components/Copyright/SimpleCopyright'

const VagasPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Buscar vagas da API
    fetch('/api/fetch-real-jobs?limit=120')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJobs(data.jobs || [])
        } else {
          setError('Erro ao carregar vagas')
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Erro ao carregar vagas')
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Head>
        <title>Vagas de Emprego - Site do Trabalhador</title>
        <meta name="description" content="Encontre vagas de emprego em todo o Brasil. Oportunidades atualizadas em tempo real." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        {/* Hero Section */}
        <section className="bg-govblue-600 relative overflow-hidden border-b-4 border-govyellow-400">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                💼 Vagas em Destaque
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {loading ? "Carregando vagas..." : `${jobs.length} vagas em destaque de todo o Brasil`}
              </p>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govblue-600 mx-auto mb-4"></div>
              <p className="text-govgray-600 font-medium">Carregando vagas reais...</p>
            </div>  
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-govgray-800 mb-2">Erro ao carregar vagas</h3>
              <p className="text-govgray-600 mb-6">{error}</p>
            </div>
          </section>
        )}

        {/* Lista de Vagas Simples */}
        {!loading && !error && jobs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 12).map((job, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-govgray-800 mb-1">{job.title || 'Vaga sem título'}</h3>
                    <p className="text-govgray-600 text-sm font-medium">{job.company?.name || job.company || 'Empresa não informada'}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">💰</span>
                      <span className="text-sm font-semibold text-govgreen-600">{job.salary || 'Salário a combinar'}</span>
                    </div>
                    <div className="flex items-center text-govgray-600">
                      <span className="mr-3 text-govblue-600">⏰</span>
                      <span className="text-sm">Recente</span>
                    </div>
                  </div>

                  <p className="text-govgray-600 text-sm mb-4 line-clamp-2">
                    {job.description || 'Descrição não disponível'}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-govblue-600 text-white py-2 px-4 rounded-lg hover:bg-govblue-700 transition-colors font-medium">
                      ✅ Ver Vaga
                    </button>
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-govgray-100 text-govgray-700 py-2 px-3 rounded-lg hover:bg-govgray-200 transition-colors font-medium"
                      >
                        🔗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center bg-white rounded-xl p-12 shadow-lg">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-govgray-800 mb-4">Nenhuma vaga encontrada</h3>
              <p className="text-govgray-600 mb-8 max-w-md mx-auto">
                Não há vagas disponíveis no momento. Nossas fontes estão sendo atualizadas constantemente.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Espaço branco antes do footer */}
      <div className="bg-white py-12">
        {/* Espaço em branco intencional */}
      </div>

      {/* Footer simples */}
      <SimpleCopyright />
    </>
  )
}

export default VagasPage
