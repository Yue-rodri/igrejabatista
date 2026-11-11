import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Cake,
  HeartHandshake,
  Baby,
  Camera,
  HandHeart,
  Sparkles,
  Send,
  Lock,
  Globe,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User } from '@/entities/User';
import { Postagem } from '@/entities/Postagem';
import { useAuth } from '@/context/AuthContext';
import { resolveMediaUrl } from '@/api/core';
import {
  createPageUrl,
  parseLocalDate,
  formatLocalDate,
  isBirthdayToday,
} from '@/utils';
import { MobilePageHeader, EmptyStateCard } from '@/components/shared/GlassPrimitives';

const PRAYER_STORAGE_KEY = 'ibpj_my_prayer_requests_v1';

const PRAYER_CATEGORIES = [
  'Saúde',
  'Família',
  'Espiritual',
  'Trabalho',
  'Gratidão',
  'Outro',
];

const MINISTERIOS_IBPJ = [
  {
    titulo: 'Som e Transmissão',
    area: 'Áudio e Projeção',
    descricao: 'Apoio técnico na sonorização dos cultos diários e projeção de louvores e textos bíblicos.',
  },
  {
    titulo: 'Recepção e Boas-Vindas',
    area: 'Acolhimento',
    descricao: 'Receber membros e visitantes com alegria, orientando e demonstrando o amor de Cristo.',
  },
  {
    titulo: 'Ação Social',
    area: 'Diaconia e Cuidado',
    descricao: 'Mobilização solidária para suprir necessidades práticas de famílias da comunidade.',
  },
  {
    titulo: 'Ministério Infantil (IBPJ Kids)',
    area: 'Ensino Bíblico Infantil',
    descricao: 'Ensino da Palavra de Deus adaptado para crianças em ambiente seguro e acolhedor.',
  },
  {
    titulo: 'Intercessão e Oração',
    area: 'Vida Espiritual',
    descricao: 'Sustentação espiritual da igreja, famílias, enfermos e liderança pastoral.',
  },
  {
    titulo: 'Mídia e Comunicação',
    area: 'Comunicação Visual',
    descricao: 'Divulgação da programação, eventos e avisos para edificação da igreja.',
  },
];

const GRUPOS_E_CLASSES = [
  {
    nome: 'Escola Bíblica Dominical (EBD)',
    categoria: 'Todos',
    encontro: 'Domingos • Estudo Bíblico Sistemático',
    local: 'Templo IBPJ — Parque Jandaia',
    descricao: 'Classes organizadas para crianças, adolescentes, jovens e adultos.',
  },
  {
    nome: 'Jovens e Adolescentes IBPJ',
    categoria: 'Jovens',
    encontro: 'Encontros e Cultos de Jovens (conforme agenda)',
    local: 'Igreja IBPJ',
    descricao: 'Comunhão, louvor, estudo da Palavra e integração da juventude.',
  },
  {
    nome: 'Comunhão de Casais e Famílias',
    categoria: 'Casais',
    encontro: 'Reuniões e cultos familiares',
    local: 'Igreja IBPJ',
    descricao: 'Edificação do lar cristão à luz dos princípios bíblicos.',
  },
  {
    nome: 'Estudo Bíblico e Oração de Adultos',
    categoria: 'Adultos',
    encontro: 'Diariamente • 18h00 às 20h00',
    local: 'Igreja IBPJ',
    descricao: 'Aprofundamento nas Escrituras e comunhão fraternal diária.',
  },
];

export default function Comunidade() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('oracao');
  const [aniversariantesMes, setAniversariantesMes] = useState([]);
  const [galeriaPosts, setGaleriaPosts] = useState([]);

  // Estado de Pedidos de Oração com controle de privacidade e consentimento
  const [prayerForm, setPrayerForm] = useState({
    nome: user?.full_name || '',
    categoria: 'Família',
    pedido: '',
    anonimo: false,
    autorizaPublico: false, // Por padrão PRIVADO (respeitando privacidade e LGPD)
  });
  const [myPrayers, setMyPrayers] = useState(() => {
    try {
      const saved = localStorage.getItem(PRAYER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [prayerSuccess, setPrayerSuccess] = useState(false);

  // Filtro de Pequenos Grupos
  const [groupFilter, setGroupFilter] = useState('Todos');

  useEffect(() => {
    // Carrega dados reais de aniversariantes e fotos reais de postagens
    User.list()
      .then((users) => {
        const currentMonth = new Date().getMonth();
        const filtered = users
          .filter((u) => {
            const d = parseLocalDate(u.data_nascimento);
            return d && d.getMonth() === currentMonth;
          })
          .sort(
            (a, b) =>
              parseLocalDate(a.data_nascimento).getDate() -
              parseLocalDate(b.data_nascimento).getDate()
          );
        setAniversariantesMes(filtered);
      })
      .catch(() => {});

    Postagem.list()
      .then((posts) => {
        setGaleriaPosts(posts.filter((p) => Boolean(p.imagem_url)));
      })
      .catch(() => {});
  }, []);

  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    if (!prayerForm.pedido.trim()) return;

    const novoPedido = {
      id: Date.now(),
      nome: prayerForm.anonimo
        ? 'Anônimo'
        : prayerForm.nome.trim() || user?.full_name || 'Membro IBPJ',
      categoria: prayerForm.categoria,
      pedido: prayerForm.pedido.trim(),
      privado: !prayerForm.autorizaPublico,
      criadoEm: new Date().toISOString(),
    };

    const updated = [novoPedido, ...myPrayers];
    setMyPrayers(updated);
    try {
      localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setPrayerForm((prev) => ({
      ...prev,
      pedido: '',
      autorizaPublico: false,
    }));
    setPrayerSuccess(true);
    setTimeout(() => setPrayerSuccess(false), 3500);
  };

  const handleDeletePrayer = (id) => {
    const updated = myPrayers.filter((p) => p.id !== id);
    setMyPrayers(updated);
    try {
      localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const sections = [
    { id: 'oracao', label: 'Oração', icon: HeartHandshake },
    { id: 'aniversariantes', label: 'Aniversariantes', icon: Cake },
    { id: 'grupos', label: 'Grupos & EBD', icon: Users },
    { id: 'voluntariado', label: 'Ministérios', icon: HandHeart },
    { id: 'kids', label: 'IBPJ Kids', icon: Baby },
    { id: 'galeria', label: 'Galeria', icon: Camera },
  ];

  const filteredGroups =
    groupFilter === 'Todos'
      ? GRUPOS_E_CLASSES
      : GRUPOS_E_CLASSES.filter((g) => g.categoria === groupFilter);

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Vida em Família"
        badgeIcon={Users}
        title="Comunidade IBPJ"
        subtitle="Intercessão, comunhão, ministérios e celebração da vida na igreja"
      />

      {/* Navegação Horizontal de Módulos Comunitários */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveTab(sec.id)}
              className={`h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-[#D4AF37] text-[#001B30] shadow-gold'
                  : 'glass-card text-white/75 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PEDIDOS DE ORAÇÃO (Com Privacidade e Consentimento) */}
      {activeTab === 'oracao' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="glass-card-gold rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center shadow-gold">
                <HeartHandshake className="w-5 h-5 text-[#001B30]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">
                  Central de Oração e Intercessão
                </h2>
                <p className="text-xs text-[#D4AF37] font-semibold">
                  “Orai uns pelos outros” — Tiago 5:16
                </p>
              </div>
            </div>
            <p className="text-xs text-white/85 leading-relaxed">
              Registre seus motivos de oração. Por padrão, todo pedido é marcado como{' '}
              <strong className="text-white">privado</strong> para proteger sua privacidade.
            </p>
          </div>

          <form
            onSubmit={handlePrayerSubmit}
            className="glass-card rounded-3xl p-5 space-y-4"
          >
            <h3 className="text-sm font-extrabold text-white">
              Registrar Pedido de Oração
            </h3>

            {!prayerForm.anonimo && (
              <div className="space-y-1.5">
                <Label htmlFor="prayer-name" className="text-xs font-semibold text-white/80">
                  Seu Nome (Opcional)
                </Label>
                <Input
                  id="prayer-name"
                  value={prayerForm.nome}
                  onChange={(e) =>
                    setPrayerForm({ ...prayerForm, nome: e.target.value })
                  }
                  placeholder="Como podemos chamar você?"
                  className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/80">Categoria</Label>
              <div className="flex flex-wrap gap-2">
                {PRAYER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPrayerForm({ ...prayerForm, categoria: cat })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      prayerForm.categoria === cat
                        ? 'bg-[#D4AF37] text-[#001B30] font-bold'
                        : 'bg-white/5 border border-white/15 text-white/75'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prayer-text" className="text-xs font-semibold text-white/80">
                Motivo de Oração *
              </Label>
              <Textarea
                id="prayer-text"
                required
                value={prayerForm.pedido}
                onChange={(e) =>
                  setPrayerForm({ ...prayerForm, pedido: e.target.value })
                }
                placeholder="Compartilhe seu pedido ou agradecimento..."
                className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[96px] text-sm"
              />
            </div>

            {/* Controles de Privacidade e Consentimento */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="min-w-0">
                  <Label
                    htmlFor="prayer-anon"
                    className="text-xs font-semibold text-white block"
                  >
                    Enviar de forma anônima
                  </Label>
                  <span className="text-[11px] text-white/55 block">
                    Oculta seu nome na identificação do pedido.
                  </span>
                </div>
                <Switch
                  id="prayer-anon"
                  checked={prayerForm.anonimo}
                  onCheckedChange={(checked) =>
                    setPrayerForm({ ...prayerForm, anonimo: checked })
                  }
                  className="data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-white/20"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="min-w-0">
                  <Label
                    htmlFor="prayer-public"
                    className="text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    {prayerForm.autorizaPublico ? (
                      <>
                        <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Autorizo exibição pública
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        Pedido Privado (Apenas Intercessão Pastoral)
                      </>
                    )}
                  </Label>
                  <span className="text-[11px] text-white/55 block mt-0.5">
                    Nenhum pedido privado é publicado automaticamente sem seu consentimento.
                  </span>
                </div>
                <Switch
                  id="prayer-public"
                  checked={prayerForm.autorizaPublico}
                  onCheckedChange={(checked) =>
                    setPrayerForm({ ...prayerForm, autorizaPublico: checked })
                  }
                  className="data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-white/20"
                />
              </div>
            </div>

            {prayerSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Pedido registrado no seu caderno de oração! Leve-o também ao momento de intercessão no culto.
                </span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl btn-gold text-xs font-bold"
            >
              <Send className="w-4 h-4 mr-2" />
              Registrar Pedido de Oração
            </Button>
          </form>

          {/* Lista de Pedidos Registrados no Dispositivo */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white px-0.5">
              Meus Pedidos Registrados ({myPrayers.length})
            </h3>
            {myPrayers.length === 0 ? (
              <EmptyStateCard
                icon={HeartHandshake}
                title="Nenhum pedido registrado neste aparelho"
                description="Utilize o formulário acima para registrar seus motivos de oração com total privacidade."
              />
            ) : (
              <div className="space-y-2.5">
                {myPrayers.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card rounded-2xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 text-[10px]">
                          {item.categoria}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[11px] text-white/60">
                          {item.privado ? (
                            <>
                              <Lock className="w-3 h-3 text-emerald-400" /> Privado
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3 text-[#D4AF37]" /> Público autorizado
                            </>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePrayer(item.id)}
                        aria-label="Remover pedido"
                        className="text-white/45 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                      {item.pedido}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                      <span>Por: {item.nome}</span>
                      <span>{formatLocalDate(item.criadoEm, "d 'de' MMM")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 2. ANIVERSARIANTES DO MÊS */}
      {activeTab === 'aniversariantes' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Aniversariantes do Mês
              </h2>
              <p className="text-xs text-white/60">
                Membros com privacidade autorizada no sistema
              </p>
            </div>
            <Link
              to={createPageUrl('Aniversariantes')}
              className="text-xs font-bold text-[#D4AF37] inline-flex items-center gap-1"
            >
              Tela cheia <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {aniversariantesMes.length === 0 ? (
            <EmptyStateCard
              icon={Cake}
              title="Nenhum aniversariante neste mês"
              description="Quando houver aniversariantes com exibição autorizada no mês atual, eles aparecerão aqui."
            />
          ) : (
            <div className="space-y-2.5">
              {aniversariantesMes.map((u) => {
                const hoje = isBirthdayToday(u.data_nascimento);
                return (
                  <div
                    key={u.id}
                    className={`rounded-2xl p-4 flex items-center gap-3.5 ${
                      hoje ? 'glass-card-gold' : 'glass-card'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/35 flex items-center justify-center text-base font-extrabold text-[#D4AF37]">
                      {u.full_name?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">
                          {u.full_name}
                        </h3>
                        {hoje && (
                          <Badge className="bg-[#D4AF37] text-[#001B30] text-[10px] border-0 font-bold">
                            Hoje!
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-white/70 mt-0.5">
                        {formatLocalDate(u.data_nascimento, "d 'de' MMMM")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* 3. PEQUENOS GRUPOS, CÉLULAS E EBD */}
      {activeTab === 'grupos' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['Todos', 'Jovens', 'Casais', 'Adultos'].map((filtro) => (
              <button
                key={filtro}
                type="button"
                onClick={() => setGroupFilter(filtro)}
                className={`h-9 px-4 rounded-full text-xs font-bold transition-all ${
                  groupFilter === filtro
                    ? 'bg-[#D4AF37] text-[#001B30]'
                    : 'bg-white/5 border border-white/10 text-white/75'
                }`}
              >
                {filtro}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredGroups.map((grupo, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 text-[10px]">
                    {grupo.categoria}
                  </Badge>
                  <span className="text-[11px] text-white/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    {grupo.encontro}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{grupo.nome}</h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  {grupo.descricao}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/55">{grupo.local}</span>
                  <Link
                    to={createPageUrl('Contato')}
                    className="text-[#D4AF37] font-bold inline-flex items-center gap-0.5"
                  >
                    Participar <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4. MINISTÉRIOS E VOLUNTARIADO */}
      {activeTab === 'voluntariado' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass-card-gold rounded-3xl p-5">
            <h2 className="text-base font-extrabold text-white">
              Descubra o seu Propósito Servindo a Comunidade
            </h2>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              Conheça as áreas de serviço da Igreja Batista do Parque Jandaia. Para integrar
              um ministério, converse pessoalmente com a liderança pastoral após o culto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MINISTERIOS_IBPJ.map((min, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    {min.area}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {min.titulo}
                  </h3>
                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                    {min.descricao}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-white/60 flex items-center justify-between">
                  <span>Inscrição presencial na igreja</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. IBPJ KIDS */}
      {activeTab === 'kids' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass-card-gold rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-gold">
                <Baby className="w-6 h-6 text-[#001B30]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">IBPJ Kids</h2>
                <p className="text-xs text-[#D4AF37] font-semibold">
                  Crescendo com Jesus, aprendendo a Palavra em amor
                </p>
              </div>
            </div>
            <p className="text-xs text-white/85 leading-relaxed">
              Espaço dedicado ao ensino bíblico infantil durante as atividades da igreja,
              apoiando os pais na formação espiritual das crianças.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                Atividades Infantis e EBD
              </h3>
              <p className="text-xs text-white/75 leading-relaxed">
                A Igreja Batista do Parque Jandaia conta com classe de Escola Bíblica Dominical (EBD) e acompanhamento infantil integrado aos horários de culto e ensino da igreja.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                Orientação para os Pais
              </h3>
              <p className="text-xs text-white/75 leading-relaxed">
                Traga seus filhos aos cultos e à EBD! Os materiais didáticos e estudos bíblicos infantis são entregues presencialmente pela equipe do Ministério Infantil.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 6. GALERIA E TESTEMUNHOS (Sincronizada com fotos reais publicadas na API) */}
      {activeTab === 'galeria' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Registros da Comunidade
              </h2>
              <p className="text-xs text-white/60">
                Imagens reais publicadas nas programações da IBPJ
              </p>
            </div>
          </div>

          {galeriaPosts.length === 0 ? (
            <EmptyStateCard
              icon={Camera}
              title="Nenhuma foto publicada no momento"
              description="À medida que a administração publicar programações com fotos pela aba Programação, elas serão reunidas automaticamente nesta galeria."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {galeriaPosts.map((post) => (
                <Link
                  key={post.id}
                  to={createPageUrl('Programacao')}
                  className="glass-card rounded-2xl overflow-hidden group block"
                >
                  <div className="aspect-square bg-[#07152D] overflow-hidden">
                    <img
                      src={resolveMediaUrl(post.imagem_url)}
                      alt={post.titulo}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-white truncate">
                      {post.titulo}
                    </h3>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      {formatLocalDate(post.data, "d 'de' MMM yyyy")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
