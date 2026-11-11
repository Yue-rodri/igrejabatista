import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Sparkles,
  Users,
  Menu,
} from 'lucide-react';
import { createPageUrl } from '@/utils';

const NAV_TABS = [
  {
    id: 'home',
    label: 'Início',
    url: createPageUrl('Home'),
    icon: Home,
    matchPaths: ['/'],
  },
  {
    id: 'eventos',
    label: 'Eventos',
    url: createPageUrl('Eventos'),
    icon: Calendar,
    matchPaths: ['/eventos'],
  },
  {
    id: 'programacao',
    label: 'Programação',
    url: createPageUrl('Programacao'),
    icon: Sparkles,
    matchPaths: ['/programacao'],
  },
  {
    id: 'comunidade',
    label: 'Comunidade',
    url: createPageUrl('Comunidade'),
    icon: Users,
    matchPaths: ['/comunidade', '/aniversariantes'],
  },
  {
    id: 'mais',
    label: 'Mais',
    url: createPageUrl('Mais'),
    icon: Menu,
    matchPaths: ['/mais', '/generosidade', '/principios', '/quem-somos', '/contato'],
  },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Navegação principal"
      className="glass-bottom-nav fixed bottom-0 inset-x-0 z-40 pb-safe"
    >
      <div className="max-w-2xl mx-auto px-2 h-16 grid grid-cols-5 items-center">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.matchPaths.includes(location.pathname);

          return (
            <NavLink
              key={tab.id}
              to={tab.url}
              className="relative flex flex-col items-center justify-center h-full py-1 select-none group active:scale-95 transition-transform"
            >
              <div
                className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    : 'text-white/60 group-hover:text-white/85'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-105 stroke-[2.4px]' : 'stroke-[1.9px]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                  isActive ? 'text-[#D4AF37] font-bold' : 'text-white/60 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
