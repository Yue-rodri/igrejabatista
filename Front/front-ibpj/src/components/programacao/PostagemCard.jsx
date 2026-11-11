import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  Sparkles,
  Share2,
  Check,
  ChevronRight,
} from 'lucide-react';
import { formatLocalDate } from '@/utils';
import { resolveMediaUrl } from '@/api/core';
import { shareContent } from '@/integrations/native';

export default function PostagemCard({
  postagem,
  isAdmin,
  onEdit,
  onDelete,
  isDestaque = false,
}) {
  const [shared, setShared] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const imageUrl = resolveMediaUrl(postagem.imagem_url);
  const formattedDate = formatLocalDate(postagem.data, "d 'de' MMMM");

  const handleShare = async (e) => {
    e?.stopPropagation();
    const text = [
      `✨ ${postagem.titulo}`,
      postagem.descricao,
      `🗓 ${formattedDate}${postagem.hora ? ` às ${postagem.hora}` : ''}`,
      '📍 Igreja Batista do Parque Jandaia (IBPJ)',
    ]
      .filter(Boolean)
      .join('\n\n');

    const res = await shareContent({
      title: `${postagem.titulo} — IBPJ`,
      text,
    });
    if (res.shared) {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        onClick={() => setDetailOpen(true)}
        className={`rounded-3xl overflow-hidden cursor-pointer transition-all active:scale-[0.99] ${
          isDestaque ? 'glass-card-gold' : 'glass-card'
        }`}
      >
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-[#07152D]">
            <img
              src={imageUrl}
              alt={postagem.titulo}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07152D] via-transparent to-transparent opacity-80" />
            {postagem.destaque && (
              <Badge className="absolute top-3.5 left-3.5 bg-[#D4AF37] text-[#001B30] font-bold border-0 shadow-md">
                <Sparkles className="w-3 h-3 mr-1" />
                Em Destaque
              </Badge>
            )}
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0 flex-1">
              {!imageUrl && postagem.destaque && (
                <Badge className="bg-[#D4AF37] text-[#001B30] font-bold border-0 mb-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Em Destaque
                </Badge>
              )}
              <h3 className="text-lg font-extrabold text-white leading-snug break-words">
                {postagem.titulo}
              </h3>
            </div>

            <div
              className="flex items-center gap-1 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleShare}
                aria-label="Compartilhar programação"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-[#D4AF37]"
              >
                {shared ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit?.(postagem)}
                    aria-label="Editar postagem"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(postagem)}
                    aria-label="Excluir postagem"
                    className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-300 hover:bg-rose-500/25"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/75 line-clamp-3 leading-relaxed mb-4">
            {postagem.descricao}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/65">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                {formattedDate}
              </span>
              {postagem.hora && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {postagem.hora}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-0.5 text-[#D4AF37] font-semibold">
              Detalhes <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* Modal de Leitura Completa da Programação */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="glass-card-solid border-white/15 text-white rounded-3xl max-w-[92vw] sm:max-w-lg p-0 overflow-hidden">
          {imageUrl && (
            <div className="relative h-56 w-full bg-[#07152D]">
              <img src={imageUrl} alt={postagem.titulo} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6 space-y-4">
            <DialogHeader className="text-left">
              {postagem.destaque && (
                <Badge className="w-fit bg-[#D4AF37] text-[#001B30] font-bold border-0 mb-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Em Destaque
                </Badge>
              )}
              <DialogTitle className="text-xl font-extrabold text-white leading-snug">
                {postagem.titulo}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#D4AF37] font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatLocalDate(postagem.data, "d 'de' MMMM 'de' yyyy")}
              </span>
              {postagem.hora && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {postagem.hora}
                </span>
              )}
            </div>

            <p className="text-sm text-white/85 whitespace-pre-line leading-relaxed">
              {postagem.descricao}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
