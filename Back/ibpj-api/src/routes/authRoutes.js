import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = Router();

// Rota de Registro (Criação de novo usuário)
router.post('/register', register); 

// Rota de Login (Gera JWT)
router.post('/login', login); 

// Rota do Perfil (Exige JWT e será chamada pelo User.me() do frontend)
router.get('/me', authMiddleware, me); 

export default router;