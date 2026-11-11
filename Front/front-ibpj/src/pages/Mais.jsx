import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  LogOut,
  LogIn,
  ShieldCheck,
  Heart,
  Book,
  Users,
  MapPin,
  Cake,
  Server,
  ChevronRight,
  Church,
  CheckCircle2,
  WifiOff,
  Globe,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { createPageUrl, formatLocalDate } from '@/utils';
import { MobilePageHeader } from '@/components/shared/GlassPrimitives';
import {
  PUBLIC_APK_RELEASE_URL,
  PUBLIC_DOWNLOAD_PAGE_URL,
  discoverTunnelInfo,
  getCachedTunnelInfo,
} from '@/api/core';
import { copyToClipboard, shareContent } from '@/integrations/native';

export default function Mais() {
  const {
    user,
    isAdmin,
    apiStatus,
    logout,
    setIsAuthSheetOpen,
    setIsDebugModalOpen,
    setIsApiConfigOpen,
    updateApiEndpoint,
  } = useAuth();

  const [tunnelInfo, setTunnelInfo] = useState(getCachedTunnelInfo());
  const [copiedTunnel, setCopiedTunnel] = useState(false);
  const [switchingTunnel, setSwitchingTunnel] = useState(false);

  useEffect(() => {
    discoverTunnelInfo().then((info) => {
      if (info) setTunnelInfo(info);
    });
  }, [apiStatus.baseUrl]);

  const activeTunnelUrl =
    tunnelInfo?.apiTunnelUrl || apiStatus?.data?.tunnel?.apiTunnelUrl || null;
  const isUsingTunnel =
    Boolean(activeTunnelUrl) && apiStatus.baseUrl === activeTunnelUrl;

  const handleCopyTunnel = async () => {
    if (!activeTunnelUrl) return;
    await copyToClipboard(activeTunnelUrl);
    setCopiedTunnel(true);
    setTimeout(() => setCopiedTunnel(false), 2500);
  };

  const handleToggleTunnel = async () => {
    if (!activeTunnelUrl) return;
    setSwitchingTunnel(true);
    if (isUsingTunnel) {
      await updateApiEndpoint('');
    } else {
      await updateApiEndpoint(activeTunnelUrl);
    }
    setSwitchingTunnel(false);
  };

  const institutionalLinks = [
    {
      title: 'Momento Generosidade',
      subtitle: 'Dízimos, ofertas e transparência',
      icon: Heart,
      url: createPageUrl('Generosidade'),
      color: 'text-rose-300 bg-rose-500/20 border-rose-400/30',
    },
    {
      title: 'Aniversariantes do Mês',
      subtitle: 'Celebre a vida dos irmãos da IBPJ',
      icon: Cake,
      url: createPageUrl('Aniversariantes'),
      color: 'text-amber-300 bg-amber-500/20 border-amber-400/30',
    },
    {
      title: 'Quem Somos',
      subtitle: 'Nossa história, identidade e pilares',
      icon: Users,
      url: createPageUrl('QuemSomos'),
      color: 'text-blue-300 bg-blue-500/20 border-blue-400/30',
    },
    {
      title: 'Princípios, Missão e Visão',
      subtitle: 'Declaração doutrinária e valores batistas',
      icon: Book,
      url: createPageUrl('Principios'),
      color: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30',
    },
    {
      title: 'Contato e Localização',
      subtitle: 'Endereço, mapa e horário dos cultos',
      icon: MapPin,
      url: createPageUrl('Contato'),
      color: 'text-cyan-300 bg-cyan-500/20 border-cyan-400/30',
    },
  ];

  const getRoleLabel = (role) => {
    if (role === 'DESENVOLVEDOR') return 'Desenvolvedor / Admin';
    if (role === 'admin') return 'Administrador';
    return 'Membro da Comunidade';
  };

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Menu e Conta"
        badgeIcon={Church}
        title="Perfil e Institucional"
        subtitle="Gerencie sua conta, acesse páginas da igreja e configurações"
      />

      {/* 1. Card de Conta / Autenticação */}
      {user ? (
        <section className="glass-card-gold rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-[#001B30] flex items-center justify-center text-xl font-extrabold shadow-gold flex-shrink-0">
              {user.full_name?.charAt(0)?.toUpperCase() || <UserIcon className="w-6 h-6" />}
            </div>
            <div className="min-w-0 flex-1">
              <Badge className="bg-[#001B30]/75 text-[#D4AF37] border-[#D4AF37]/40 text-[10px] mb-1">
                {getRoleLabel(user.role)}
              </Badge>
              <h2 className="text-lg font-extrabold text-white truncate">
                {user.full_name || 'Usuário IBPJ'}
              </h2>
              <p className="text-xs text-white/75 truncate">{user.email}</p>
              {user.data_nascimento && (
                <p className="text-[11px] text-white/60 mt-0.5">
                  Nascimento: {formatLocalDate(user.data_nascimento, "d 'de' MMMM")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {isAdmin && (
              <Button
                onClick={() => setIsDebugModalOpen(true)}
                className="h-11 rounded-xl btn-gold text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Abrir Painel Administrativo
              </Button>
            )}
            <Button
              onClick={logout}
              variant="outline"
              className="h-11 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4 mr-1.5 text-rose-300" />
              Encerrar Sessão
            </Button>
          </div>
        </section>
      ) : (
        <section className="glass-card-gold rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#001B30] flex items-center justify-center shadow-gold flex-shrink-0">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Acesse sua Conta IBPJ
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Faça login ou cadastre-se para participar do mural de aniversariantes ou gerenciar conteúdos administrativos.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsAuthSheetOpen(true)}
            className="w-full h-11 rounded-xl btn-gold text-xs font-bold"
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            Entrar ou Criar Conta
          </Button>
        </section>
      )}

      {/* 2. Navegação Institucional Completa */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white/55 px-1">
          Institucional e Módulos
        </h2>
        <div className="space-y-2.5">
          {institutionalLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.url}
                className="glass-card rounded-2xl p-4 flex items-center justify-between gap-3 active:scale-[0.99] transition-transform block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/65 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2.5. Download do App Android & QR Code Permanente */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white/55 px-1">
          Distribuição Oficial Android (APK & QR Code)
        </h2>
        <div className="glass-card-gold rounded-2xl p-4 space-y-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-20 h-20 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-lg">
              <img
                src="/qrcode-ibpj-mobile.svg"
                alt="QR Code IBPJ Mobile"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <Badge className="bg-[#001B30]/80 text-[#D4AF37] border-[#D4AF37]/40 text-[10px]">
                <QrCode className="w-3 h-3 mr-1 inline" /> QR Code Permanente
              </Badge>
              <h3 className="text-sm font-extrabold text-white">
                Compartilhe o App IBPJ Mobile
              </h3>
              <p className="text-[11px] text-white/75 leading-relaxed">
                Aponte a câmera de outro celular Android para o QR Code ou baixe o pacote oficial <code className="text-[#D4AF37]">IBPJ-Mobile-release.apk</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={PUBLIC_APK_RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 rounded-xl btn-gold text-xs font-bold inline-flex items-center justify-center gap-1.5 px-3"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar APK
            </a>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                shareContent({
                  title: 'IBPJ Mobile — Aplicativo Android Oficial',
                  text: 'Baixe o aplicativo oficial da Igreja Batista do Parque Jandaia (IBPJ Mobile):',
                  url: PUBLIC_DOWNLOAD_PAGE_URL,
                })
              }
              className="h-10 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15 text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
              Compartilhar Link
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Status da API e Túnel Remoto (4G/5G) */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white/55 px-1">
          Conexão e Sistema
        </h2>
        <div className="glass-card rounded-2xl p-4 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white">Servidor da API IBPJ</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      apiStatus.baseUrl?.startsWith('https://')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {apiStatus.baseUrl?.startsWith('https://') ? 'Túnel HTTPS' : 'Local'}
                  </span>
                </div>
                <p className="text-[11px] text-[#D4AF37] font-mono truncate mt-0.5">
                  {apiStatus.baseUrl}
                </p>
              </div>
            </div>
            {apiStatus.online ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" /> Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
                <WifiOff className="w-4 h-4" /> Offline
              </span>
            )}
          </div>

          {activeTunnelUrl && (
            <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#D4AF37]">
                  <Globe className="w-3.5 h-3.5" />
                  Túnel Remoto Ativo (4G / 5G)
                </span>
                <button
                  type="button"
                  onClick={handleCopyTunnel}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors"
                >
                  {copiedTunnel ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copiar Link
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] font-mono text-emerald-300 break-all">
                {activeTunnelUrl}
              </p>
              <Button
                type="button"
                onClick={handleToggleTunnel}
                disabled={switchingTunnel}
                className="w-full h-9 rounded-xl btn-gold text-xs font-bold"
              >
                {switchingTunnel
                  ? 'Alternando conexão...'
                  : isUsingTunnel
                    ? 'Conectado via Túnel HTTPS (Voltar para Localhost)'
                    : 'Ativar Conexão via Túnel HTTPS Agora'}
              </Button>
            </div>
          )}

          <Button
            onClick={() => setIsApiConfigOpen(true)}
            variant="outline"
            className="w-full h-10 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold"
          >
            Configurar Endereço da API Manualmente
          </Button>
        </div>
      </section>

      {/* Rodapé Institucional */}
      <footer className="text-center pt-2 pb-4 text-xs text-white/45 space-y-1">
        <p className="font-semibold text-white/65">
          IBPJ Mobile • Igreja Batista do Parque Jandaia
        </p>
        <p>Versão 1.0.0 (Android Production Build)</p>
      </footer>
    </div>
  );
}
