import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Church,
  ArrowLeft,
  User as UserIcon,
  ShieldCheck,
  WifiOff,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createPageUrl } from '@/utils';

const PRIMARY_TABS = new Set([
  '/',
  '/eventos',
  '/programacao',
  '/comunidade',
  '/mais',
]);

const SUBPAGE_TITLES = {
  '/aniversariantes': 'Aniversariantes',
  '/generosidade': 'Generosidade',
  '/principios': 'Princípios e Visão',
  '/contato': 'Contato e Localização',
  '/quem-somos': 'Quem Somos',
};

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    apiStatus,
    setIsAuthSheetOpen,
    setIsDebugModalOpen,
    setIsApiConfigOpen,
  } = useAuth();

  const isPrimaryTab = PRIMARY_TABS.has(location.pathname);
  const subpageTitle = SUBPAGE_TITLES[location.pathname];

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="glass-header sticky top-0 z-40 pt-safe">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Esquerda: Botão Voltar (em subpáginas) ou Identidade IBPJ */}
        {!isPrimaryTab ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Voltar"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-[#D4AF37]" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                IBPJ Mobile
              </p>
              <h2 className="text-base font-bold text-white truncate">
                {subpageTitle || 'Voltar'}
              </h2>
            </div>
          </div>
        ) : (
          <Link to={createPageUrl('Home')} className="flex items-center gap-3 min-w-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B89416] flex items-center justify-center shadow-gold flex-shrink-0">
              <Church className="w-5 h-5 text-[#001B30]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">
                  IBPJ
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[11px] font-semibold text-[#D4AF37] truncate">
                  Parque Jandaia
                </span>
              </div>
              <p className="text-[11px] text-white/60 truncate">
                Igreja Batista do Parque Jandaia
              </p>
            </div>
          </Link>
        )}

        {/* Direita: Ações Contextuais (Status API, Painel Admin, Perfil/Login) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!apiStatus.online && !apiStatus.checking && (
            <button
              type="button"
              onClick={() => setIsApiConfigOpen(true)}
              title="Servidor API desconectado. Toque para configurar."
              className="h-9 px-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 flex items-center gap-1.5 text-xs font-semibold active:scale-95 transition-transform"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">API</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsDebugModalOpen(true)}
              title="Painel Administrativo"
              className="h-10 px-3 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-transform"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {user ? (
            <button
              type="button"
              onClick={() => navigate(createPageUrl('Mais'))}
              aria-label="Abrir perfil e opções"
              className="flex items-center gap-2 pl-1.5 pr-3 h-10 rounded-full bg-white/10 border border-white/15 text-white active:scale-95 transition-transform"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B89416] flex items-center justify-center text-xs font-extrabold text-[#001B30]">
                {user.full_name?.charAt(0)?.toUpperCase() || <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-semibold max-w-[84px] truncate">
                {user.full_name?.split(' ')[0] || 'Conta'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthSheetOpen(true)}
              className="h-10 px-3.5 rounded-full btn-gold flex items-center gap-1.5 text-xs font-bold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
