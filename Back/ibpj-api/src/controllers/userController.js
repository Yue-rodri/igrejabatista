import prisma from '../lib/prisma.js';

// Lista usuários com data de nascimento (para a página de Aniversariantes)
export const listAniversariantes = async (req, res) => {
    try {
        const aniversariantes = await prisma.user.findMany({
            where: {
                // Filtra apenas usuários que têm uma data de nascimento registrada
                data_nascimento: {
                    not: null, 
                },
                show_in_aniversariantes: true
            },
            select: { 
                id: true, 
                full_name: true, 
                data_nascimento: true,
                email: true // Email é opcional, mas está no frontend
            },
            // O frontend ordena depois, mas aqui garantimos que a busca é eficiente
        });
        res.status(200).json(aniversariantes);
    } catch (error) {
        console.error("Erro ao listar aniversariantes:", error);
        res.status(500).json({ error: 'Falha ao listar aniversariantes.' });
    }
};

export const listAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { 
                id: true, 
                full_name: true, 
                email: true, 
                role: true 
            },
            orderBy: { full_name: 'asc' }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao listar usuários.' });
    }
};

// Atualiza a role de um usuário
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { role: role }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao atualizar role.' });
    }
};

// Deleta um usuário
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Falha ao deletar usuário.' });
    }
};