import { Router } from 'express';
// 1. Importar as novas funções e middlewares
import { listAniversariantes, listAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { adminMiddleware, authMiddleware } from '../utils/authMiddleware.js';

const router = Router();

// Rota pública
router.get('/aniversariantes', listAniversariantes);

// --- NOVAS ROTAS (Protegidas) ---
// (O adminMiddleware agora aceita 'DESENVOLVEDOR')
router.get('/', authMiddleware, adminMiddleware, listAllUsers);
router.put('/:id/role', authMiddleware, adminMiddleware, updateUserRole);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;