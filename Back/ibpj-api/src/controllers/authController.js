import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export const register = async (req, res) => {
    // 1. CORREÇÃO AQUI: Adicionar 'show_in_aniversariantes' à desestruturação
    const { email, password, full_name, data_nascimento, role = 'member', show_in_aniversariantes } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                full_name,
                data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                role,
                // 2. CORREÇÃO AQUI: Garantir que o valor (true/false) seja salvo
                // Usamos Boolean() para garantir que o valor seja salvo corretamente
                show_in_aniversariantes: Boolean(show_in_aniversariantes)
            },
            select: { id: true, email: true, full_name: true, role: true }
        });

        res.status(201).json({ 
            message: 'Usuário registrado com sucesso. Por favor, faça login.', 
            user
        });
    } catch (error) {
        if (error.code === 'P2002') { 
            return res.status(409).json({ error: 'O email fornecido já está em uso.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor durante o registro.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.json({
            token,
            user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor durante o login.' });
    }
};

export const me = async (req, res) => {
    if (!req.userId) {
        // Retorna 401 se o token não foi fornecido/validado pelo authMiddleware (caso de User.me() no frontend sem token)
        return res.status(401).json({ error: 'Token de autenticação ausente.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                full_name: true,
                role: true,
                data_nascimento: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar perfil.' });
    }
};