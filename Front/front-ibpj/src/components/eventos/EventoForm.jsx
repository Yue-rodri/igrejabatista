import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Save, CalendarPlus } from 'lucide-react';
import { toInputDateString } from '@/utils';

const tiposEvento = [
  { value: 'culto', label: 'Culto' },
  { value: 'estudo_biblico', label: 'Estudo Bíblico' },
  { value: 'reuniao_oracao', label: 'Reunião de Oração' },
  { value: 'evento_especial', label: 'Evento Especial' },
  { value: 'vigilia', label: 'Vigília' },
  { value: 'encontro_jovens', label: 'Encontro de Jovens' },
  { value: 'escola_dominical', label: 'Escola Dominical' },
  { value: 'outro', label: 'Outro' },
];

export default function EventoForm({ evento, defaultDate, onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: toInputDateString(defaultDate || new Date()),
    hora: '18:00',
    tipo: 'culto',
    local: 'Igreja IBPJ',
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        titulo: evento.titulo || '',
        descricao: evento.descricao || '',
        data: toInputDateString(evento.data),
        hora: evento.hora || '18:00',
        tipo: evento.tipo || 'culto',
        local: evento.local || 'Igreja IBPJ',
      });
    } else if (defaultDate) {
      setFormData((prev) => ({
        ...prev,
        data: toInputDateString(defaultDate),
      }));
    }
  }, [evento, defaultDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="mb-6"
    >
      <div className="glass-card-solid rounded-3xl p-5 border border-[#D4AF37]/35">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {evento ? 'Editar Evento' : 'Novo Evento na Agenda'}
              </h3>
              <p className="text-xs text-white/60">Preencha os detalhes da atividade</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar formulário"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titulo" className="text-xs font-semibold text-white/80">
              Título do Evento *
            </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              placeholder="Ex.: Culto da Família, Santa Ceia..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="data" className="text-xs font-semibold text-white/80">
                Data *
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
                className="h-11 rounded-xl bg-white/10 border-white/20 text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hora" className="text-xs font-semibold text-white/80">
                Horário *
              </Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
                className="h-11 rounded-xl bg-white/10 border-white/20 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tipo" className="text-xs font-semibold text-white/80">
                Categoria *
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="h-11 rounded-xl bg-white/10 border-white/20 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#07152D] border-white/20 text-white">
                  {tiposEvento.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="local" className="text-xs font-semibold text-white/80">
                Local
              </Label>
              <Input
                id="local"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
                placeholder="Igreja IBPJ"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricao" className="text-xs font-semibold text-white/80">
              Descrição / Observações
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[84px] text-sm"
              placeholder="Informações adicionais sobre o encontro..."
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 px-4 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-5 rounded-xl btn-gold text-xs font-bold"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {isSubmitting ? 'Salvando...' : evento ? 'Salvar Alterações' : 'Publicar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
