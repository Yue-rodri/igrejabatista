import prisma from '../lib/prisma.js';

// 1. Criar Evento (POST /eventos) - Exige Admin
export const createEvento = async (req, res) => {
    const { titulo, descricao, data, hora, tipo, local } = req.body;
    
    // Validação básica conforme o schema
    if (!titulo || !data || !hora || !tipo) {
        return res.status(400).json({ error: 'Título, data, hora e tipo são obrigatórios.' });
    }

    try {
        const novoEvento = await prisma.evento.create({
            data: {
                titulo,
                descricao,
                data: new Date(data), // Converte a string de data para objeto Date
                hora,
                tipo,
                local
            }
        });
        res.status(201).json(novoEvento);
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: 'Falha ao criar evento.' });
    }
};

// 2. Listar Eventos (GET /eventos) - Público
export const listEventos = async (req, res) => {
    // O frontend usa a lista de eventos (Evento.list("-data")) 
    // para a página de calendário e lista
    const { orderBy = 'data' } = req.query; // Permite ordenação, por exemplo, por data

    try {
        const eventos = await prisma.evento.findMany({
            // Ordena por data descendente (do mais novo para o mais antigo)
            orderBy: {
                [orderBy.replace('-', '')]: orderBy.startsWith('-') ? 'desc' : 'asc',
            },
        });
        res.status(200).json(eventos);
    } catch (error) {
        console.error("Erro ao listar eventos:", error);
        res.status(500).json({ error: 'Falha ao listar eventos.' });
    }
};

// 3. Atualizar Evento (PUT /eventos/:id) - Exige Admin
export const updateEvento = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, data, hora, tipo, local } = req.body;

    try {
        const eventoAtualizado = await prisma.evento.update({
            where: { id: parseInt(id) },
            data: {
                titulo,
                descricao,
                data: data ? new Date(data) : undefined, // Só atualiza se a data for fornecida
                hora,
                tipo,
                local
            }
        });
        res.status(200).json(eventoAtualizado);
    } catch (error) {
        if (error.code === 'P2025') { // Erro de registro não encontrado do Prisma
            return res.status(404).json({ error: 'Evento não encontrado.' });
        }
        console.error("Erro ao atualizar evento:", error);
        res.status(500).json({ error: 'Falha ao atualizar evento.' });
    }
};

// 4. Deletar Evento (DELETE /eventos/:id) - Exige Admin
export const deleteEvento = async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.evento.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send(); // 204 No Content (Sucesso sem corpo de resposta)
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Evento não encontrado.' });
        }
        console.error("Erro ao deletar evento:", error);
        res.status(500).json({ error: 'Falha ao deletar evento.' });
    }
};