import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Se o token estiver ausente/inválido, o req.userId será null. 
        // O controller 'me' lidará com o erro 401.
        req.userId = null; 
        return next(); 
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

export const adminMiddleware = async (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ error: 'Autenticação necessária.' });
    }
    
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });

       if (user && (user.role === 'admin' || user.role === 'DESENVOLVEDOR')) {
            next();
        } else {
            res.status(403).json({ error: 'Permissão de administrador necessária.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar permissão.' });
    }
};