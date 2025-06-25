import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Configurar o multer para salvar arquivos na pasta public/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    cb(null, 'logo-' + uniqueSuffix + extension)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de arquivo não permitido. Aceitos: JPG, PNG, GIF, SVG'), false)
    }
  }
})

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const uploadSingle = upload.single('logo')

  uploadSingle(req, res, function (err) {
    if (err) {
      console.error('Erro no upload:', err)
      return res.status(400).json({ error: err.message })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' })
    }

    // Retornar a URL do arquivo
    const fileUrl = `/uploads/${req.file.filename}`
    
    console.log('Upload realizado com sucesso:', fileUrl)
    
    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    })
  })
}

export const config = {
  api: {
    bodyParser: false, // Desabilitar bodyParser para multer funcionar
  },
}
