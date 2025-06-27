import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Header from '../src/components/Header/Header'

const CalculadoraTestPage = () => {
  return (
    <>
      <Head>
        <title>Calculadora de Direitos Trabalhistas - Teste</title>
        <meta name="description" content="Calculadora gratuita de direitos trabalhistas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-govgray-50 pt-28">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-govblue-800 mb-8">
                Calculadora de Direitos Trabalhistas - Teste
              </h1>
              
              <p className="text-lg text-govgray-700 mb-8">
                Esta é uma página de teste para verificar se a calculadora está funcionando.
              </p>

              <div className="bg-white rounded-xl shadow-lg border-2 border-govblue-200 p-8">
                <h2 className="text-2xl font-bold text-govblue-800 mb-4">
                  Teste Básico
                </h2>
                <p className="text-govgray-600">
                  Se você consegue ver esta página, o problema pode estar na versão completa da calculadora.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default CalculadoraTestPage
