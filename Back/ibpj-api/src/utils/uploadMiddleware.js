import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Configuração do caminho de destino
// O Multer precisa do __dirname, que não existe em ES Modules. 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define o diretório base (volta 3 níveis: utils -> src -> ibpj-api)
const baseDir = path.resolve(__dirname, '..', '..'); 
const uploadDir = path.join(baseDir, 'public', 'uploads');

// 2. Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nome do arquivo será: data-timestamp-nomeoriginal.ext
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

// 3. Middleware para upload de imagem única
export const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
    fileFilter: (req, file, cb) => {
        // Verifica se o arquivo é uma imagem
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
    }
}).single('file'); // O nome 'file' é o que esperamos que o frontend use

// 4. Controller Simples para o Upload (Simula a chamada UploadFile)
export const handleUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    
    // Constrói a URL acessível publicamente (Ex: http://localhost:4000/uploads/nome-do-arquivo.jpg)
    const file_url = `/uploads/${req.file.filename}`;

    // O frontend espera { file_url }
    res.status(200).json({ 
        message: 'Upload realizado com sucesso.', 
        file_url: file_url 
    });
};