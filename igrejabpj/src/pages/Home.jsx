// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Book, Phone, Home as HomeIcon } from 'lucide-react';

const QuickAccessCard = ({ title, description, icon: Icon, link }) => (
    <Link to={link} className="block p-6 rounded-lg shadow-xl bg-gray-800 border border-gray-700 hover:bg-gray-700/80 transition-all duration-300">
        <Icon className="w-8 h-8 text-yellow-400 mb-3" />
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        <span className="mt-3 text-yellow-400 text-sm flex items-center">
            Acessar →
        </span>
    </Link>
);

export default function HomePage() {
    const PRIMARY_COLOR = 'text-yellow-400';
    const BACKGROUND_COLOR = 'bg-gray-900';
    const TEXT_COLOR = 'text-white';
    
    return (
        <div className={`min-h-screen ${BACKGROUND_COLOR} pt-16 pb-20`}> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                
                <header className="mb-16">
                    <span className={`inline-block py-1 px-3 mb-4 text-sm font-medium ${PRIMARY_COLOR} border border-yellow-400 rounded-full`}>
                        Bem-vindo à Família IBPI
                    </span>
                    <h1 className={`text-5xl md:text-6xl font-extrabold ${TEXT_COLOR} mb-3`}>
                        Igreja Batista <br/> Parque Jandaia
                    </h1>
                    <p className={`text-xl ${TEXT_COLOR}/80 mb-8`}>
                        Uma comunidade de fé, amor e adoração a Deus
                    </p>
                    
                    <div className="flex justify-center space-x-4">
                        <Link to="/membros" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300 flex items-center">
                            Conheça-nos →
                        </Link>
                        <Link to="/contato" className="bg-white hover:bg-gray-200 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300">
                            Fale Conosco
                        </Link>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto p-8 mb-16 rounded-xl shadow-2xl bg-gray-800 border border-gray-700">
                    <HomeIcon className={`w-10 h-10 ${PRIMARY_COLOR} mx-auto mb-3`} />
                    <h2 className={`text-2xl font-bold ${TEXT_COLOR} mb-1`}>Horário de Culto</h2>
                    <p className="text-lg text-white/90">Todos os dias das **19h00 às 20h00**</p>
                    <p className="text-sm text-gray-400 mt-2">Venha nos visitar e faça parte desta família!</p>
                </div>

                <section className="mb-16">
                    <h2 className={`text-3xl font-bold ${TEXT_COLOR} mb-8`}>Acesso Rápido</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <QuickAccessCard 
                            title="Eventos" 
                            description="Confira nossa agenda" 
                            icon={Calendar} 
                            link="/eventos" 
                        />
                        <QuickAccessCard 
                            title="Generosidade" 
                            description="Contribua conosco" 
                            icon={Heart} 
                            link="/dizimos" 
                        />
                        <QuickAccessCard 
                            title="Princípios" 
                            description="Nossa base de fé" 
                            icon={Book} 
                            link="/principios" 
                        />
                        <QuickAccessCard 
                            title="Contato" 
                            description="Fale conosco" 
                            icon={Phone} 
                            link="/contato" 
                        />
                    </div>
                </section>

                <div className="max-w-4xl mx-auto p-10 bg-yellow-50/20 border border-yellow-400/50 rounded-lg shadow-xl">
                    <p className={`text-xl italic ${TEXT_COLOR}/90 mb-2`}>
                        "Porque onde estiverem dois ou três reunidos em meu nome, ali estou eu no meio deles."
                    </p>
                    <p className={`font-semibold ${PRIMARY_COLOR}`}>Mateus 18:20</p>
                </div>

            </div>
        </div>
    );
}