import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import './App.css'; // REMOVIDO: A importação do App.css não pôde ser resolvida
import { Users, LayoutDashboard, Calendar, Heart } from 'lucide-react';

// Importa as Telas - Adicionado .jsx nos paths
import HomePage from './pages/Home.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import MembrosPage from './pages/Membros.jsx'; 
import EventosPage from './pages/Eventos.jsx';

// Componente de Navegação (Menu)
const Navigation = () => (
    // Estilo adaptado para o Tailwind/ShadCN que está no index.css
    <nav className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex justify-center gap-6 p-4 text-sm font-medium">
            <li><Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><span>🏠</span> Início</Link></li>
            <li><Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link></li>
            {/* O link principal para a sua nova tela de CRUD de membros! */}
            <li><Link to="/membros" className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200 transition-colors font-bold"><Users className="w-4 h-4" /> Membros</Link></li> 
            <li><Link to="/eventos" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Calendar className="w-4 h-4" /> Eventos</Link></li>
            <li><Link to="/dizimos" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Heart className="w-4 h-4" /> Dízimos</Link></li>
        </ul>
    </nav>
);

function App() {
    return (
        <BrowserRouter>
            {/* O fundo é definido pelo Tailwind/index.css, o div só garante a altura mínima */}
            <div className="min-h-screen bg-background text-foreground"> 
                
                {/* A navegação fica fixa no topo */}
                <Navigation />

                {/* O conteúdo principal. A HomePage não recebe padding para ocupar a tela toda */}
                <main> 
                    <Routes>
                        <Route path="/" element={<HomePage />} /> {/* Landing Page */}
                        <Route path="/dashboard" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><DashboardPage /></div>} /> 
                        <Route path="/membros" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><MembrosPage /></div>} /> {/* ROTA DO SEU CRUD */}
                        <Route path="/eventos" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><EventosPage /></div>} />
                        
                        {/* Rotas de Placeholder para os links da Landing Page */}
                        <Route path="/dizimos" element={<h2 className="mt-8 text-xl text-center">Dízimos/Ofertas - Em Desenvolvimento</h2>} />
                        <Route path="/principios" element={<h2 className="mt-8 text-xl text-center">Princípios - Em Desenvolvimento</h2>} />
                        <Route path="/contato" element={<h2 className="mt-8 text-xl text-center">Contato - Em Desenvolvimento</h2>} />

                        <Route path="*" element={<h2 className="mt-8 text-xl text-red-500 text-center">404 | Página Não Encontrada</h2>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;