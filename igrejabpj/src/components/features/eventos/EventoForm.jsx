// src/components/EventForm.jsx
import React from 'react';

/**
 * Componente de Formulário Modal para Criar ou Editar Eventos.
 * Recebe todos os dados e handlers (manipuladores) via props.
 */
export default function EventForm({ 
    isEditing, 
    data, // O estado do evento (editingEvento ou formData)
    onFormChange, // handleFormChange
    onSubmit, // handleUpdateEvento ou handleAddEvento
    onCancel // handleCancel
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-[#001B3D]">
                    {isEditing ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
                    
                    {/* Título */}
                    <input 
                        type="text" 
                        name="titulo" 
                        placeholder="Título *" 
                        value={data.titulo || ''} 
                        onChange={onFormChange} 
                        required 
                        className="col-span-2 p-2 border border-gray-300 rounded" 
                    />
                    
                    {/* Data */}
                    <input 
                        type="date" 
                        name="data" 
                        placeholder="Data *" 
                        value={data.data || ''} 
                        onChange={onFormChange} 
                        required 
                        className="p-2 border border-gray-300 rounded" 
                    />
                    
                    {/* Hora */}
                    <input 
                        type="time" 
                        name="horaInicio" 
                        placeholder="Hora (19:00)" 
                        value={data.horaInicio || '19:00'} 
                        onChange={onFormChange} 
                        className="p-2 border border-gray-300 rounded" 
                    />
                    
                    {/* Local */}
                    <input 
                        type="text" 
                        name="local" 
                        placeholder="Local" 
                        value={data.local || ''} 
                        onChange={onFormChange} 
                        className="col-span-2 p-2 border border-gray-300 rounded" 
                    />
                    
                    {/* Descrição */}
                    <textarea 
                        name="descricao" 
                        placeholder="Descrição do Evento (Opcional)" 
                        value={data.descricao || ''} 
                        onChange={onFormChange} 
                        className="col-span-2 h-20 p-2 border border-gray-300 rounded"
                    ></textarea>

                    {/* Botões */}
                    <div className="col-span-2 flex gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="flex-grow bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors shadow-md"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="flex-grow bg-[#D4AF37] hover:bg-[#B8941E] text-[#001B3D] font-bold py-2 px-4 rounded transition-colors shadow-md"
                        >
                            {isEditing ? 'Salvar Edição' : 'Cadastrar Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}