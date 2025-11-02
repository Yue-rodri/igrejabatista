import React from 'react';
// Importe o 'Link' do seu sistema de roteamento (e.g., react-router-dom)
import { Link } from 'react-router-dom';

// --- PLACEHOLDERS DE COMPONENTES ---
// Em uma aplicação real, você importaria esses componentes de outra pasta (e.g., '../components')

// Exemplo de um componente DashboardCard simples (com classes de UI/shadcn/tailwind)
const DashboardCard = ({ title, value, description }) => (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
    </div>
);

// Exemplo de um componente de Gráfico simples
const OverviewChart = () => (
    <div className="h-[350px] flex items-center justify-center text-muted-foreground bg-secondary/30 rounded-md">
        [GRÁFICO DE SÉRIE TEMPORAL - Atividade de Membros]
    </div>
);
// ------------------------------------


export default function DashboardPage() {
    // Aqui você incluiria hooks para buscar dados:
    // const { members, events } = useDataFetchingHook();
    
    // ... variáveis de dados de membros/eventos/etc ...

    return (
        <div className="space-y-8 p-4 md:p-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard: Visão Geral</h2>
            
            {/* 1. SEÇÃO DE CARTÕES DE MÉTRICAS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard 
                    title="Total de Membros" 
                    value="1.234" 
                    description="+20 desde o mês passado"
                />
                <DashboardCard 
                    title="Novos Membros (Mês)" 
                    value="35" 
                    description="5% de aumento em relação ao mês anterior"
                />
                <DashboardCard 
                    title="Próximos Eventos" 
                    value="5" 
                    description="Agendados para a próxima semana"
                />
                 <DashboardCard 
                    title="Taxa de Participação" 
                    value="78%" 
                    description="Média anual de eventos"
                />
            </div>
            
            {/* 2. SEÇÕES DE ANÁLISE/GRÁFICOS E ACESSO RÁPIDO */}
            <div className="grid gap-4 lg:grid-cols-3">
                
                {/* Gráfico Principal (Ocupa 2/3 da largura) */}
                <div className="lg:col-span-2 border rounded-lg shadow-sm">
                     <div className="p-6">
                        <h3 className="text-lg font-semibold mb-3">Atividade de Membros ao Longo do Tempo</h3>
                        <OverviewChart />
                    </div>
                </div>
                
                {/* Acesso Rápido (Ocupa 1/3 da largura) */}
                <div className="lg:col-span-1 border rounded-lg shadow-sm">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-3">Acesso Rápido</h3>
                        
                        {/* 3. LINKS DE ACESSO RÁPIDO */}
                        <ul className="space-y-2">
                            <li>
                                <Link to="/membros" className="text-primary hover:underline block py-1">
                                    Ver Lista de Membros
                                </Link>
                            </li>
                            <li>
                                <Link to="/eventos/novo" className="text-primary hover:underline block py-1">
                                    Agendar Novo Evento
                                </Link>
                            </li>
                            <li>
                                <Link to="/relatorios" className="text-primary hover:underline block py-1">
                                    Gerar Relatório Financeiro
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* Aviso/Citação */}
            <div className="p-4 bg-yellow-50/70 border-l-4 border-yellow-500 rounded-lg text-sm">
                 <p className="text-yellow-800">
                    **Atenção:** Os dados do último trimestre indicam uma queda de 10% no engajamento. Considere agendar novos eventos.
                 </p>
            </div>
        </div>
    );
}