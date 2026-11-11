import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Heart,
  Book,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Church,
  Clock,
  Cake,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Evento } from '@/entities/Evento';
import { Postagem } from '@/entities/Postagem';
import { useAuth } from '@/context/AuthContext';
import { createPageUrl, parseLocalDate, formatLocalDate } from '@/utils';
import { tipoLabels } from '@/components/eventos/EventoCard';
import { resolveMediaUrl } from '@/api/core';

function getContextualGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Home() {
  const navigate = useNavigate();
  const { user, isAdmin, setIsDebugModalOpen } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  const loadHomeSummary = useCallback(async () => {
    setLoadingFeed(true);
    try {
      const [eventosData, postagensData] = await Promise.all([
        Evento.list('data').catch(() => []),
        Postagem.list().catch(() => []),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filtra próximos eventos a partir de hoje (ou mostra os mais recentes se todos forem passados)
      const futureEvents = eventosData
        .filter((ev) => {
          const d = parseLocalDate(ev.data);
          return d && d >= today;
        })
        .sort((a, b) => parseLocalDate(a.data) - parseLocalDate(b.data));

      setUpcomingEvents(
        (futureEvents.length > 0 ? futureEvents : eventosData).slice(0, 3)
      );

      const highlights = postagensData.filter((p) => p.destaque);
      setFeaturedPosts(
        (highlights.length > 0 ? highlights : postagensData).slice(0, 2)
      );
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    loadHomeSummary();
  }, [loadHomeSummary]);

  const firstName = user?.full_name?.split(' ')[0];
  const greeting = getContextualGreeting();

  const quickActions = [
    {
      title: 'Eventos',
      subtitle: 'Agenda e calendário',
      icon: Calendar,
      url: createPageUrl('Eventos'),
      gradient: 'from-blue-500/25 to-blue-600/10 border-blue-400/30',
      iconColor: 'text-blue-300',
    },
    {
      title: 'Programação',
      subtitle: 'Cultos e avisos',
      icon: Sparkles,
      url: createPageUrl('Programacao'),
      gradient: 'from-amber-500/25 to-amber-600/10 border-amber-400/30',
      iconColor: 'text-[#D4AF37]',
    },
    {
      title: 'Generosidade',
      subtitle: 'Dízimos e ofertas',
      icon: Heart,
      url: createPageUrl('Generosidade'),
      gradient: 'from-rose-500/25 to-rose-600/10 border-rose-400/30',
      iconColor: 'text-rose-300',
    },
    {
      title: 'Comunidade',
      subtitle: 'Oração, grupos e vidas',
      icon: Users,
      url: createPageUrl('Comunidade'),
      gradient: 'from-purple-500/25 to-purple-600/10 border-purple-400/30',
      iconColor: 'text-purple-300',
    },
    {
      title: 'Princípios',
      subtitle: 'Missão, visão e fé',
      icon: Book,
      url: createPageUrl('Principios'),
      gradient: 'from-emerald-500/25 to-emerald-600/10 border-emerald-400/30',
      iconColor: 'text-emerald-300',
    },
    {
      title: 'Localização',
      subtitle: 'Mapa e contato',
      icon: MapPin,
      url: createPageUrl('Contato'),
      gradient: 'from-cyan-500/25 to-cyan-600/10 border-cyan-400/30',
      iconColor: 'text-cyan-300',
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* 1. Hero Contextual Mobile */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card-gold rounded-3xl p-5 sm:p-6 relative overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#D4AF37]/15 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001B30]/60 border border-[#D4AF37]/35 text-[11px] font-semibold text-[#D4AF37]">
            <Church className="w-3.5 h-3.5" />
            {greeting}
            {firstName ? `, ${firstName}` : ' • Família IBPJ'}
          </span>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsDebugModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] bg-[#001B30]/70 px-2.5 py-1 rounded-full border border-[#D4AF37]/30"
            >
              <ShieldCheck className="w-3 h-3" /> Painel Admin
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          Igreja Batista{' '}
          <span className="text-[#D4AF37] block sm:inline">Parque Jandaia</span>
        </h1>

        <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed max-w-md">
          Uma comunidade de fé, amor e adoração a Deus. Acompanhe nossa agenda,
          programações e participe da família IBPJ.
        </p>

        {/* Banner de Culto Diário */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#001B30]/65 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">Horário de Culto Presencial</p>
              <p className="text-xs text-[#D4AF37] font-semibold">
                Todos os dias • 18h00 às 20h00
              </p>
            </div>
          </div>
          <Link
            to={createPageUrl('Contato')}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex-shrink-0 active:scale-95 transition-transform"
          >
            Como chegar
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <Button
            onClick={() => navigate(createPageUrl('Eventos'))}
            className="h-11 rounded-xl btn-gold text-xs font-bold"
          >
            Ver Agenda
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button
            onClick={() => navigate(createPageUrl('QuemSomos'))}
            variant="outline"
            className="h-11 rounded-xl border-white/25 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold"
          >
            Conheça a IBPJ
          </Button>
        </div>
      </motion.section>

      {/* 2. Acesso Rápido Mobile (Grade 2x3 para toque confortável) */}
      <section aria-label="Acesso Rápido">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-base font-extrabold text-white tracking-tight">
            Acesso Rápido
          </h2>
          <Link
            to={createPageUrl('Aniversariantes')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37]"
          >
            <Cake className="w-3.5 h-3.5" />
            Aniversariantes
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <Link
                  to={item.url}
                  className="glass-card rounded-2xl p-3.5 flex flex-col justify-between h-full active:scale-[0.98] transition-all block"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} border flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/35" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Próximos Eventos (Dados reais da API) */}
      <section aria-label="Próximos Eventos">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Próximos Eventos
            </h2>
            <p className="text-xs text-white/60">Agenda atualizada da igreja</p>
          </div>
          <Link
            to={createPageUrl('Eventos')}
            className="text-xs font-bold text-[#D4AF37] inline-flex items-center gap-0.5"
          >
            Ver calendário <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingFeed ? (
          <div className="glass-card rounded-2xl p-6 text-center text-xs text-white/60">
            Sincronizando agenda...
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Nenhum evento agendado</p>
                <p className="text-xs text-white/60">
                  Nossos cultos regulares acontecem diariamente às 18h00.
                </p>
              </div>
            </div>
            <Link
              to={createPageUrl('Eventos')}
              className="text-xs font-bold text-[#D4AF37] flex-shrink-0"
            >
              Abrir
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingEvents.map((ev) => (
              <Link
                key={ev.id}
                to={createPageUrl('Eventos')}
                className="glass-card rounded-2xl p-3.5 flex items-center gap-3.5 active:scale-[0.99] transition-transform block"
              >
                <div className="w-12 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/35 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-base font-extrabold text-white leading-none">
                    {formatLocalDate(ev.data, 'dd')}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#D4AF37] mt-0.5">
                    {formatLocalDate(ev.data, 'MMM')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      {tipoLabels[ev.tipo] || 'Evento'}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-[11px] text-white/70">{ev.hora}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{ev.titulo}</h3>
                  {ev.local && (
                    <p className="text-xs text-white/55 truncate">{ev.local}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. Programação em Destaque (Dados reais da API) */}
      {featuredPosts.length > 0 && (
        <section aria-label="Destaques da Programação">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Destaques da Programação
              </h2>
              <p className="text-xs text-white/60">Avisos e atividades especiais</p>
            </div>
            <Link
              to={createPageUrl('Programacao')}
              className="text-xs font-bold text-[#D4AF37] inline-flex items-center gap-0.5"
            >
              Ver tudo <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {featuredPosts.map((post) => {
              const img = resolveMediaUrl(post.imagem_url);
              return (
                <Link
                  key={post.id}
                  to={createPageUrl('Programacao')}
                  className="glass-card rounded-2xl overflow-hidden flex items-center gap-3.5 p-3 active:scale-[0.99] transition-transform block"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={post.titulo}
                      loading="lazy"
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-[#07152D]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {post.destaque && (
                        <Badge className="bg-[#D4AF37] text-[#001B30] text-[10px] px-2 py-0 border-0 font-bold">
                          Destaque
                        </Badge>
                      )}
                      <span className="text-[11px] text-white/60">
                        {formatLocalDate(post.data, "d 'de' MMM")}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">{post.titulo}</h3>
                    <p className="text-xs text-white/70 line-clamp-2 mt-0.5">
                      {post.descricao}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Palavra Institucional */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="glass-card rounded-3xl p-5 text-center border border-[#D4AF37]/25"
      >
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-3">
          <Book className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <blockquote className="text-sm sm:text-base text-white/90 italic leading-relaxed max-w-lg mx-auto">
          “Porque onde estiverem dois ou três reunidos em meu nome, ali estou eu no meio deles.”
        </blockquote>
        <p className="text-xs font-bold text-[#D4AF37] mt-2">Mateus 18:20</p>
      </motion.section>
    </div>
  );
}
