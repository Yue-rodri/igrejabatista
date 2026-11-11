import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence } from 'framer-motion';
import { Evento } from '@/entities/Evento';
import { useAuth } from '@/context/AuthContext';
import {
  parseLocalDate,
  formatLocalDate,
  isSameLocalDay,
  isInSelectedMonth,
} from '@/utils';
import EventoForm from '../components/eventos/EventoForm';
import EventoCard, { tipoLabels } from '../components/eventos/EventoCard';
import {
  MobilePageHeader,
  LoadingStateCard,
  EmptyStateCard,
  ErrorRetryCard,
  ConfirmDeleteDialog,
} from '@/components/shared/GlassPrimitives';

export default function Eventos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin, setIsApiConfigOpen } = useAuth();

  const [eventos, setEventos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [eventoToDelete, setEventoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const safeSelectedDate = selectedDate || new Date();

  const loadEventos = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await Evento.list('-data');
      setEventos(data);
    } catch (error) {
      setLoadError(
        error.response?.data?.error ||
          'Não foi possível carregar a agenda de eventos.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEventos();
  }, [loadEventos]);

  // Suporte a query params vindos do Painel Administrativo (?edit=ID ou ?new=1)
  useEffect(() => {
    if (!isAdmin) return;
    const editId = searchParams.get('edit');
    const isNew = searchParams.get('new');
    if (editId && eventos.length > 0) {
      const found = eventos.find((e) => String(e.id) === String(editId));
      if (found) {
        setEditingEvento(found);
        setShowForm(true);
        setSearchParams({}, { replace: true });
      }
    } else if (isNew === '1') {
      setEditingEvento(null);
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [isAdmin, searchParams, eventos, setSearchParams]);

  const handleSubmit = async (eventoData) => {
    if (editingEvento) {
      await Evento.update(editingEvento.id, eventoData);
    } else {
      await Evento.create(eventoData);
    }
    setShowForm(false);
    setEditingEvento(null);
    await loadEventos();
  };

  const handleEdit = (evento) => {
    setEditingEvento(evento);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!eventoToDelete) return;
    setIsDeleting(true);
    try {
      await Evento.delete(eventoToDelete.id);
      setEventoToDelete(null);
      await loadEventos();
    } finally {
      setIsDeleting(false);
    }
  };

  // Datas que possuem eventos (para destacar no calendário)
  const eventDays = useMemo(() => {
    return eventos.map((e) => parseLocalDate(e.data)).filter(Boolean);
  }, [eventos]);

  const filteredEventos = useMemo(() => {
    if (selectedTipo === 'todos') return eventos;
    return eventos.filter((e) => e.tipo === selectedTipo);
  }, [eventos, selectedTipo]);

  const eventosDoDia = useMemo(() => {
    return filteredEventos.filter((evento) =>
      isSameLocalDay(evento.data, safeSelectedDate)
    );
  }, [filteredEventos, safeSelectedDate]);

  const eventosDoMes = useMemo(() => {
    return filteredEventos
      .filter((evento) => isInSelectedMonth(evento.data, currentMonth))
      .sort((a, b) => parseLocalDate(a.data) - parseLocalDate(b.data));
  }, [filteredEventos, currentMonth]);

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Agenda IBPJ"
        badgeIcon={CalendarIcon}
        title="Eventos e Calendário"
        subtitle="Toque em uma data para consultar as atividades do dia"
        action={
          isAdmin && (
            <Button
              onClick={() => {
                setEditingEvento(null);
                setShowForm((prev) => !prev);
              }}
              className="h-11 px-4 rounded-2xl btn-gold text-xs font-bold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Novo Evento
            </Button>
          )
        }
      />

      <AnimatePresence>
        {showForm && (
          <EventoForm
            evento={editingEvento}
            defaultDate={safeSelectedDate}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEvento(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Filtro rápido por categoria (horizontal scroll para toque mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick={() => setSelectedTipo('todos')}
          className={`h-9 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
            selectedTipo === 'todos'
              ? 'bg-[#D4AF37] text-[#001B30] shadow-sm'
              : 'bg-white/5 border border-white/10 text-white/75'
          }`}
        >
          Todos ({eventos.length})
        </button>
        {Object.entries(tipoLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedTipo(key)}
            className={`h-9 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedTipo === key
                ? 'bg-[#D4AF37] text-[#001B30] font-bold shadow-sm'
                : 'bg-white/5 border border-white/10 text-white/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Calendário Mobile Otimizado para Toque */}
      <div className="glass-card rounded-3xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Calendário Mensal
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setSelectedDate(now);
              setCurrentMonth(now);
            }}
            className="text-xs font-bold text-[#D4AF37] px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30"
          >
            Hoje
          </button>
        </div>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            onSelect={(day) => {
              if (day) {
                setSelectedDate(day);
                setCurrentMonth(day);
              }
            }}
            locale={ptBR}
            modifiers={{
              hasEvent: eventDays,
            }}
            modifiersClassNames={{
              hasEvent:
                'after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-[#D4AF37]',
            }}
            className="w-full max-w-sm rounded-2xl border-0 bg-transparent p-1 [--cell-size:2.55rem]"
          />
        </div>

        <div className="flex items-center justify-center gap-4 pt-3 mt-2 border-t border-white/10 text-[11px] text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            Dia selecionado / Com evento
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
            Data atual
          </span>
        </div>
      </div>

      {isLoading ? (
        <LoadingStateCard label="Carregando eventos da agenda..." />
      ) : loadError ? (
        <ErrorRetryCard
          title="Erro ao carregar eventos"
          message={loadError}
          onRetry={loadEventos}
          onConfigureApi={() => setIsApiConfigOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Eventos do Dia Selecionado */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-base font-extrabold text-white">
                Eventos em {formatLocalDate(safeSelectedDate, "d 'de' MMMM")}
              </h2>
              <span className="text-xs font-semibold text-[#D4AF37]">
                {eventosDoDia.length}{' '}
                {eventosDoDia.length === 1 ? 'atividade' : 'atividades'}
              </span>
            </div>

            {eventosDoDia.length === 0 ? (
              <EmptyStateCard
                icon={CalendarIcon}
                title="Nenhum evento específico nesta data"
                description="Lembre-se: nossos cultos regulares acontecem todos os dias das 18h00 às 20h00 na Igreja IBPJ."
                action={
                  isAdmin && (
                    <Button
                      onClick={() => {
                        setEditingEvento(null);
                        setShowForm(true);
                      }}
                      size="sm"
                      className="btn-gold h-10 px-4 rounded-xl text-xs font-bold"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Agendar nesta data
                    </Button>
                  )
                }
              />
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {eventosDoDia.map((evento) => (
                    <EventoCard
                      key={evento.id}
                      evento={evento}
                      isAdmin={isAdmin}
                      onEdit={handleEdit}
                      onDelete={(ev) => setEventoToDelete(ev)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Todos os Eventos do Mês */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-base font-extrabold text-white capitalize">
                Agenda de {formatLocalDate(currentMonth, 'MMMM yyyy')}
              </h2>
              <span className="text-xs text-white/60">
                {eventosDoMes.length} no mês
              </span>
            </div>

            {eventosDoMes.length === 0 ? (
              <EmptyStateCard
                icon={Sparkles}
                title="Sem eventos extras cadastrados neste mês"
                description="Navegue entre os meses no calendário acima para consultar outras datas."
              />
            ) : (
              <div className="space-y-3">
                {eventosDoMes.map((evento) => (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={(ev) => setEventoToDelete(ev)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <ConfirmDeleteDialog
        open={Boolean(eventoToDelete)}
        onOpenChange={(open) => !open && setEventoToDelete(null)}
        title="Excluir Evento"
        description={
          eventoToDelete
            ? `Tem certeza que deseja excluir o evento "${eventoToDelete.titulo}"?`
            : ''
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
