import { Router } from 'express';
import { createEvento, listEventos, updateEvento, deleteEvento } from '../controllers/eventoController.js';
import { adminMiddleware, authMiddleware } from '../utils/authMiddleware.js';

const router = Router();

// Rota pública para LISTAR todos os eventos (o frontend a usa para o calendário)
router.get('/', listEventos);

// Rotas que exigem autenticação e permissão de Administrador
// O frontend em Eventos.jsx só mostra botões de edição/criação se o usuário for admin
router.post('/', authMiddleware, adminMiddleware, createEvento);
router.put('/:id', authMiddleware, adminMiddleware, updateEvento);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvento);

export default router;