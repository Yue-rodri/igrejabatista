// src/components/EventItem.jsx
import React from 'react';

// Reutilizar a função de formatação de data (DD/MM/AAAA)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

/**
 * Componente que renderiza um único item da lista de eventos.
 */
export default function EventItem({ evento, onEdit, onDelete }) {
    return (
        <div 
            className="border-l-4 border-[#D4AF37] p-4 bg-gray-50 rounded shadow-sm flex justify-between items-center transition duration-150 ease-in-out hover:bg-gray-100"
        >
            <div>
                <p className="font-semibold text-gray-800">{evento.titulo}</p>
                <p className="text-sm text-gray-600">
                    {formatDate(evento.data)} às {evento.horaInicio} ({evento.local})
                </p>
                <p className="text-xs mt-1 text-gray-500 italic">{evento.descricao}</p>
            </div>
            <div className="flex gap-2 shrink-0">
                <button 
                    onClick={() => onEdit(evento)}
                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition-colors shadow-sm"
                >
                    Editar
                </button>
                <button 
                    onClick={() => onDelete(evento._id)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors shadow-sm"
                >
                    Excluir
                </button>
            </div>
        </div>
    );
}