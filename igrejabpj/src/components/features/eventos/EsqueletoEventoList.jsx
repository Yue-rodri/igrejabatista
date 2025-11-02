// src/components/EventListSkeleton.jsx
import React from 'react';

/**
 * Componente de Esqueleto (Skeleton) para exibir durante o carregamento da lista de eventos.
 */
export default function EventListSkeleton() {
    // Renderiza 4 "cartões" de esqueleto para preencher a tela
    const skeletons = [1, 2, 3, 4];

    return (
        <div className="space-y-4 animate-pulse">
            {skeletons.map((i) => (
                <div key={i} className="border-l-4 border-gray-300 p-4 bg-gray-200 rounded shadow-sm flex justify-between items-center h-20">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-48"></div> {/* Título */}
                        <div className="h-3 bg-gray-300 rounded w-64"></div> {/* Data/Local */}
                    </div>
                    <div className="flex gap-2">
                        <div className="h-6 w-14 bg-gray-300 rounded"></div> {/* Botão Editar */}
                        <div className="h-6 w-14 bg-gray-300 rounded"></div> {/* Botão Excluir */}
                    </div>
                </div>
            ))}
        </div>
    );
}