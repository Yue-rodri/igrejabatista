import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; 

const app = express();
const port = process.env.PORT || 3001; 

// --- 1. CONFIGURAÇÃO DO BANCO DE DADOS ---
const MONGODB_URI = process.env.MONGODB_URI; 

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI não definida. Crie um arquivo .env na raiz do projeto.');
    process.exit(1); 
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
    .catch(err => {
        console.error('❌ Erro na conexão com o MongoDB:', err);
    });

// --- 2. DEFINIÇÃO DOS SCHEMAS ---

// Modelo Membro (Membro - Inalterado)
const membroSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    dataNascimento: {
        type: Date,
        required: true,
    },
    telefone: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Ativo', 'Ausente', 'Afastado'],
        default: 'Ativo',
    },
}, { timestamps: true });

const Membro = mongoose.model('Membro', membroSchema); 

// NOVO: Modelo Evento
const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    data: {
        type: Date,
        required: true,
    },
    horaInicio: {
        type: String, // Ex: "19:00"
    },
    descricao: {
        type: String,
        trim: true,
    },
    local: {
        type: String,
        default: 'Templo Principal',
    },
}, { timestamps: true });

const Evento = mongoose.model('Evento', eventoSchema);


// --- Middlewares ---
app.use(cors());
app.use(express.json());


// --- 3. ROTAS DA API ---

// ------------------------------------
// ROTAS DE MEMBROS (Inalteradas)
// ------------------------------------

// GET /api/membros: Retorna todos os membros
app.get('/api/membros', async (req, res) => {
    try {
        const membros = await Membro.find().sort({ nome: 1 });
        res.json(membros);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar membros', error });
    }
});

// POST /api/membros: Adiciona um novo membro
app.post('/api/membros', async (req, res) => {
    try {
        const novoMembro = new Membro(req.body);
        await novoMembro.save();
        res.status(201).json(novoMembro);
    } catch (error) {
        res.status(400).send({ message: 'Erro de validação ao criar membro', details: error.message });
    }
});

// PUT /api/membros/:id: Atualiza um membro
app.put('/api/membros/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const membroAtualizado = await Membro.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!membroAtualizado) {
            return res.status(404).send({ message: 'Membro não encontrado' });
        }
        res.json(membroAtualizado);
    } catch (error) {
        res.status(400).send({ message: 'Erro ao atualizar membro', details: error.message });
    }
});

// DELETE /api/membros/:id: Deleta um membro
app.delete('/api/membros/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const membroDeletado = await Membro.findByIdAndDelete(id);

        if (!membroDeletado) {
            return res.status(404).send({ message: 'Membro não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ message: 'Erro ao deletar membro', error });
    }
});

// ------------------------------------
// NOVO: ROTAS DE EVENTOS
// ------------------------------------

// GET /api/eventos: Retorna todos os eventos
app.get('/api/eventos', async (req, res) => {
    try {
        // Ordena por data mais próxima
        const eventos = await Evento.find().sort({ data: 1 }); 
        res.json(eventos);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar eventos', error });
    }
});

// POST /api/eventos: Adiciona um novo evento
app.post('/api/eventos', async (req, res) => {
    try {
        const novoEvento = new Evento(req.body);
        await novoEvento.save();
        res.status(201).json(novoEvento);
    } catch (error) {
        res.status(400).send({ message: 'Erro de validação ao criar evento', details: error.message });
    }
});

// DELETE /api/eventos/:id: Deleta um evento
app.delete('/api/eventos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const eventoDeletado = await Evento.findByIdAndDelete(id);

        if (!eventoDeletado) {
            return res.status(404).send({ message: 'Evento não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ message: 'Erro ao deletar evento', error });
    }
});

// PUT /api/eventos/:id: Atualiza um evento
app.put('/api/eventos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const eventoAtualizado = await Evento.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!eventoAtualizado) {
            return res.status(404).send({ message: 'Evento não encontrado' });
        }
        res.json(eventoAtualizado);
    } catch (error) {
        res.status(400).send({ message: 'Erro ao atualizar evento', details: error.message });
    }
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
});