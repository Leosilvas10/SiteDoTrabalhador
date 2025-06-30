
import fs from 'fs/promises'
import path from 'path'

const LANDING_PAGES_FILE = path.join(process.cwd(), 'data', 'landing-pages.json')

async function getLandingPages() {
  try {
    const data = await fs.readFile(LANDING_PAGES_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export default async function handler(req, res) {
  const { slug } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const pages = await getLandingPages()
    const page = pages.find(p => p.slug === slug && p.ativo)

    if (!page) {
      return res.status(404).json({ success: false, message: 'Página não encontrada' })
    }

    res.status(200).json({ success: true, data: page })
  } catch (error) {
    console.error('Erro ao buscar landing page:', error)
    res.status(500).json({ success: false, message: 'Erro interno do servidor' })
  }
}
