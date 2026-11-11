import { Router } from 'express';
import { createPostagem, listPostagens, updatePostagem, deletePostagem } from '../controllers/postagemController.js';
import { uploadImage, handleUpload } from '../utils/uploadMiddleware.js'; // Importa Multer
import { adminMiddleware, authMiddleware } from '../utils/authMiddleware.js';

const router = Router();

// Rota de Upload de Imagem (Simula a função UploadFile)
// Usa o middleware de upload e o controlador para retornar a URL
router.post('/upload', authMiddleware, adminMiddleware, uploadImage, handleUpload);

// Rotas de CRUD
router.get('/', listPostagens);
router.post('/', authMiddleware, adminMiddleware, createPostagem);
router.put('/:id', authMiddleware, adminMiddleware, updatePostagem);
router.delete('/:id', authMiddleware, adminMiddleware, deletePostagem);

export default router;