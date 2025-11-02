// src/pages/Eventos.jsx (REFACTORADO)

import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon } from "lucide-react";

// --- Importação dos Componentes Refatorados ---
import EventForm from 'C:/Users/Administrator/Downloads/testes gostoso/projeto igreja batista/igrejabpj/src/components/features/eventos/EventoForm.jsx'; 
import EventItem from 'C:/Users/Administrator/Downloads/testes gostoso/projeto igreja batista/igrejabpj/src/components/features/eventos/EventoItem.jsx'; 
import EventListSkeleton from 'C:/Users/Administrator/Downloads/testes gostoso/projeto igreja batista/igrejabpj/src/components/features/eventos/EsqueletoEventoList'; 
// ---------------------------------------------


// --- Funções Auxiliares (mantidas para uso interno da página) ---

// Formata data para o input type="date" (AAAA-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// --- FIM Funções Auxiliares ---


export default function EventosPage() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvento, setEditingEvento] = useState(null); 
    const [formData, setFormData] = useState({
        titulo: '',
        data: '',
        horaInicio: '19:00',
        descricao: '',
        local: 'Templo Principal'
    });
    
    // Variável de conveniência para determinar qual estado de dados usar no formulário
    const currentData = editingEvento || formData;
    
    const API_URL = 'http://localhost:3001/api/eventos';

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        
        if (editingEvento) {
            setEditingEvento(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Função de ordenação: data mais próxima primeiro
    const sortEvents = (list) => 
        list.sort((a, b) => new Date(a.data) - new Date(b.data));

    // --- READ (BUSCAR) ---
    const fetchEventos = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setEventos(sortEvents(data));
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    // --- CREATE (CRIAR) ---
    const handleAddEvento = async (e) => {
        e.preventDefault();
        if (!formData.titulo.trim() || !formData.data) { alert('Título e Data são obrigatórios!'); return; }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const novoEvento = await response.json();
            
            if (response.ok) {
                setEventos(sortEvents([...eventos, novoEvento]));
                handleCancel(); // Limpa o formulário e fecha
            } else {
                 alert(`Falha ao cadastrar: ${novoEvento.details || 'Verifique o console.'}`);
            }
        } catch (error) {
            console.error('Erro de rede ao cadastrar evento:', error);
        }
    };
    
    // --- DELETE (DELETAR) ---
    const handleDelete = async (eventoId) => {
        if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
        
        try {
            const response = await fetch(`${API_URL}/${eventoId}`, { method: 'DELETE' });
            
            if (response.status === 204) {
                setEventos(eventos.filter(e => e._id !== eventoId));
            } else {
                alert('Falha ao deletar o evento.');
            }
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
        }
    };
    
    // --- FUNÇÃO DE EDIÇÃO (Preparação) ---
    const handleEdit = (evento) => {
        // Formata a data para o input date e abre o modal
        setEditingEvento({ ...evento, data: formatDateForInput(evento.data) }); 
        setShowForm(true);
    };

    // --- UPDATE (ATUALIZAR) ---
    const handleUpdateEvento = async (e) => {
        e.preventDefault();

        if (!editingEvento.titulo.trim() || !editingEvento.data) { alert('Título e Data são obrigatórios!'); return; }

        try {
            const response = await fetch(`${API_URL}/${editingEvento._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingEvento),
            });
            const eventoAtualizado = await response.json();
            
            if (response.ok) {
                // Mapeia, atualiza e reordena a lista
                const newEventos = eventos.map(e => 
                    e._id === eventoAtualizado._id ? eventoAtualizado : e
                );
                
                setEventos(sortEvents(newEventos));
                handleCancel(); // Limpa o estado de edição e fecha
            } else {
                 alert(`Falha ao atualizar: ${eventoAtualizado.details || 'Verifique o console.'}`);
            }

        } catch (error) {
            console.error('Erro de rede ao atualizar evento:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingEvento(null);
        setFormData({ titulo: '', data: '', horaInicio: '19:00', descricao: '', local: 'Templo Principal' }); 
    };
    
    
    return (
        <div className="container mx-auto px-4 py-8">
            
            {/* Título e Botão Novo Evento */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Gestão de Eventos</h1>
                    <p className="text-gray-600">Confira a agenda da igreja</p>
                </div>
                
                <button
                    onClick={() => {
                        setEditingEvento(null);
                        setShowForm(true);
                    }}
                    className="flex items-center bg-[#D4AF37] hover:bg-[#B8941E] text-white font-semibold py-2 px-4 rounded transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Evento
                </button>
            </div>

            {/* Formulário Modal (Usa o componente EventForm) */}
            {showForm && (
                <EventForm 
                    isEditing={!!editingEvento}
                    data={currentData}
                    onFormChange={handleFormChange}
                    onSubmit={editingEvento ? handleUpdateEvento : handleAddEvento}
                    onCancel={handleCancel}
                />
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Coluna 1: Placeholder de Calendário (Integração) */}
                <div className="lg:col-span-1 border rounded-lg p-6 bg-white shadow-md h-fit">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-[#001B3D] border-b pb-3 mb-4">
                        <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                        Seletor de Data
                    </h3>
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed text-gray-500">
                        <CalendarIcon className="w-8 h-8 mb-3" />
                        <p className="text-sm font-medium">Pronto para o Calendário ShadCN</p>
                        <p className="text-xs text-center mt-1">
                            Você pode substituir este bloco pelo componente de calendário interativo.
                        </p>
                    </div>
                </div>

                {/* Coluna 2: Lista de Eventos (Ocupa 2 colunas) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border rounded-lg p-6 bg-white shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-[#001B3D]">Próximos Eventos</h3>
                        
                        {/* Renderização Condicional com Skeleton e Empty State */}
                        {loading ? (
                            <EventListSkeleton /> 
                        ) : eventos.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-4" />
                                <p>Nenhum evento agendado</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {eventos.map((evento) => (
                                    <EventItem 
                                        key={evento._id}
                                        evento={evento}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}