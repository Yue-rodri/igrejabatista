import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Edit,
  Trash2,
  Share2,
  Check,
} from 'lucide-react';
import { formatLocalDate } from '@/utils';
import { shareContent } from '@/integrations/native';

export const tipoColors = {
  culto: 'bg-blue-500/20 text-blue-200 border-blue-400/35',
  estudo_biblico: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/35',
  reuniao_oracao: 'bg-purple-500/20 text-purple-200 border-purple-400/35',
  evento_especial: 'bg-rose-500/20 text-rose-200 border-rose-400/35',
  vigilia: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/35',
  encontro_jovens: 'bg-amber-500/20 text-amber-200 border-amber-400/35',
  escola_dominical: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/35',
  outro: 'bg-slate-500/20 text-slate-200 border-slate-400/35',
};

export const tipoLabels = {
  culto: 'Culto',
  estudo_biblico: 'Estudo Bíblico',
  reuniao_oracao: 'Reunião de Oração',
  evento_especial: 'Evento Especial',
  vigilia: 'Vigília',
  encontro_jovens: 'Encontro de Jovens',
  escola_dominical: 'Escola Dominical',
  outro: 'Outro',
};

export default function EventoCard({ evento, isAdmin, onEdit, onDelete }) {
  const [sharedFeedback, setSharedFeedback] = useState(false);

  const formattedDate = formatLocalDate(evento.data, "d 'de' MMMM 'de' yyyy");
  const dayNumber = formatLocalDate(evento.data, 'dd');
  const monthShort = formatLocalDate(evento.data, 'MMM');

  const handleShare = async () => {
    const text = [
      `📅 ${evento.titulo} (${tipoLabels[evento.tipo] || 'Evento'})`,
      evento.descricao ? `${evento.descricao}` : null,
      `🗓 Data: ${formattedDate} às ${evento.hora}`,
      evento.local ? `📍 Local: ${evento.local}` : '📍 Igreja Batista do Parque Jandaia (IBPJ)',
    ]
      .filter(Boolean)
      .join('\n');

    const res = await shareContent({
      title: `${evento.titulo} — IBPJ`,
      text,
    });
    if (res.shared) {
      setSharedFeedback(true);
      setTimeout(() => setSharedFeedback(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="glass-card rounded-2xl p-4 transition-all"
    >
      <div className="flex items-start gap-3.5">
        {/* Bloco visual de Data */}
        <div className="w-14 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/25 to-[#B89416]/10 border border-[#D4AF37]/35 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-lg font-extrabold text-white leading-none">{dayNumber}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mt-1">
            {monthShort}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Badge
                className={`${
                  tipoColors[evento.tipo] || tipoColors.outro
                } border text-[10px] font-semibold px-2 py-0.5 mb-1.5 inline-flex items-center`}
              >
                <Tag className="w-2.5 h-2.5 mr-1" />
                {tipoLabels[evento.tipo] || 'Atividade'}
              </Badge>
              <h3 className="text-base font-bold text-white leading-snug break-words">
                {evento.titulo}
              </h3>
            </div>

            {/* Botões de ação com área de toque confortável */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleShare}
                title="Compartilhar evento"
                aria-label="Compartilhar evento"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-[#D4AF37] active:scale-95 transition-all"
              >
                {sharedFeedback ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit?.(evento)}
                    aria-label="Editar evento"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(evento)}
                    aria-label="Excluir evento"
                    className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-300 hover:bg-rose-500/25 active:scale-95 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {evento.descricao && (
            <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
              {evento.descricao}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-2.5 border-t border-white/10 text-xs text-white/65">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              {evento.hora}
            </span>
            {evento.local && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {evento.local}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
