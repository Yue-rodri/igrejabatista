import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShieldCheck } from 'lucide-react';
import MobileHeader from '@/components/navigation/MobileHeader';
import BottomNav from '@/components/navigation/BottomNav';
import AuthForm from '@/components/shared/AuthForm';
import DebugPanel from '@/components/debug/DebugPanel';
import ApiConfigModal from '@/components/shared/ApiConfigModal';
import { useAuth } from '@/context/AuthContext';
import { initNativeShell } from '@/integrations/native';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAdmin,
    isAuthSheetOpen,
    setIsAuthSheetOpen,
    isDebugModalOpen,
    setIsDebugModalOpen,
    isApiConfigOpen,
    setIsApiConfigOpen,
    onLoginSuccess,
  } = useAuth();

  // Inicializa StatusBar e SplashScreen no Android nativo
  useEffect(() => {
    initNativeShell();
  }, []);

  // Faz scroll suave para o topo ao trocar de rota
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Intercepta o botão Voltar físico/gestual do Android (@capacitor/app)
  useEffect(() => {
    let listenerHandle = null;

    const registerBackButton = async () => {
      try {
        listenerHandle = await CapacitorApp.addListener('backButton', () => {
          if (isAuthSheetOpen) {
            setIsAuthSheetOpen(false);
            return;
          }
          if (isDebugModalOpen) {
            setIsDebugModalOpen(false);
            return;
          }
          if (isApiConfigOpen) {
            setIsApiConfigOpen(false);
            return;
          }
          if (location.pathname !== '/') {
            navigate('/');
          } else {
            CapacitorApp.exitApp();
          }
        });
      } catch {
        // Ignora em ambiente browser comum
      }
    };

    registerBackButton();
    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [
    location.pathname,
    navigate,
    isAuthSheetOpen,
    isDebugModalOpen,
    isApiConfigOpen,
    setIsAuthSheetOpen,
    setIsDebugModalOpen,
    setIsApiConfigOpen,
  ]);

  return (
    <div className="min-h-dvh ibpj-bg-canvas text-white flex flex-col">
      {/* Cabeçalho Mobile Contextual */}
      <MobileHeader />

      {/* Área Principal de Conteúdo com espaçamento seguro para a BottomNav */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-5 pb-24">
        <Outlet />
      </main>

      {/* Barra de Navegação Inferior Fixa */}
      <BottomNav />

      {/* Modal de Login / Cadastro Mobile */}
      <Dialog open={isAuthSheetOpen} onOpenChange={setIsAuthSheetOpen}>
        <DialogContent className="glass-card-solid border-white/15 text-white rounded-3xl max-w-[92vw] sm:max-w-md p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Autenticação IBPJ</DialogTitle>
          </DialogHeader>
          <AuthForm onLoginSuccess={onLoginSuccess} />
        </DialogContent>
      </Dialog>

      {/* Modal de Administração / Desenvolvedor (Disponível para roles 'admin' e 'DESENVOLVEDOR') */}
      {isAdmin && (
        <Dialog open={isDebugModalOpen} onOpenChange={setIsDebugModalOpen}>
          <DialogContent className="glass-card-solid border-white/15 text-white rounded-3xl max-w-[94vw] sm:max-w-xl p-5 max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-extrabold text-white">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/35 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <span>Painel Administrativo IBPJ</span>
              </DialogTitle>
            </DialogHeader>
            <DebugPanel closePanel={() => setIsDebugModalOpen(false)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Configuração de Conexão com a API */}
      <ApiConfigModal />
    </div>
  );
}
