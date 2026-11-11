import prisma from '../lib/prisma.js';

// 1. Criar Postagem (POST /postagens) - Exige Admin
export const createPostagem = async (req, res) => {
    const { titulo, descricao, data, hora, imagem_url, destaque } = req.body;
    
    if (!titulo || !descricao || !data) {
        return res.status(400).json({ error: 'Título, descrição e data são obrigatórios.' });
    }

    try {
        const novaPostagem = await prisma.postagem.create({
            data: {
                titulo,
                descricao,
                data: new Date(data),
                hora,
                imagem_url,
                destaque: Boolean(destaque)
            }
        });
        res.status(201).json(novaPostagem);
    } catch (error) {
        console.error("Erro ao criar postagem:", error);
        res.status(500).json({ error: 'Falha ao criar postagem.' });
    }
};

// 2. Listar Postagens (GET /postagens) - Público
export const listPostagens = async (req, res) => {
    // O frontend lista todas as postagens ordenadas por data descendente
    try {
        const postagens = await prisma.postagem.findMany({
            orderBy: { data: 'desc' },
        });
        res.status(200).json(postagens);
    } catch (error) {
        console.error("Erro ao listar postagens:", error);
        res.status(500).json({ error: 'Falha ao listar postagens.' });
    }
};

// 3. Atualizar Postagem (PUT /postagens/:id) - Exige Admin
export const updatePostagem = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, data, hora, imagem_url, destaque } = req.body;

    try {
        const postagemAtualizada = await prisma.postagem.update({
            where: { id: parseInt(id) },
            data: {
                titulo,
                descricao,
                data: data ? new Date(data) : undefined,
                hora,
                imagem_url,
                destaque: destaque !== undefined ? Boolean(destaque) : undefined
            }
        });
        res.status(200).json(postagemAtualizada);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Postagem não encontrada.' });
        }
        console.error("Erro ao atualizar postagem:", error);
        res.status(500).json({ error: 'Falha ao atualizar postagem.' });
    }
};

// 4. Deletar Postagem (DELETE /postagens/:id) - Exige Admin
export const deletePostagem = async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.postagem.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Postagem não encontrada.' });
        }
        console.error("Erro ao deletar postagem:", error);
        res.status(500).json({ error: 'Falha ao deletar postagem.' });
    }
};