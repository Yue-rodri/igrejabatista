import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UploadFile } from '../../integrations/Core.js';
import { resolveMediaUrl } from '@/api/core';
import { toInputDateString } from '@/utils';
import { X, Save, Upload, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function PostagemForm({ postagem, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: toInputDateString(new Date()),
    hora: '',
    imagem_url: '',
    destaque: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (postagem) {
      setFormData({
        titulo: postagem.titulo || '',
        descricao: postagem.descricao || '',
        data: toInputDateString(postagem.data),
        hora: postagem.hora || '',
        imagem_url: postagem.imagem_url || '',
        destaque: Boolean(postagem.destaque),
      });
    }
  }, [postagem]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData((prev) => ({ ...prev, imagem_url: file_url }));
    } catch (error) {
      setUploadError(error.message || 'Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewUrl = resolveMediaUrl(formData.imagem_url);

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
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {postagem ? 'Editar Publicação' : 'Nova Publicação na Programação'}
              </h3>
              <p className="text-xs text-white/60">Divulgue cultos, avisos e programações</p>
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
            <Label htmlFor="post_titulo" className="text-xs font-semibold text-white/80">
              Título *
            </Label>
            <Input
              id="post_titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              placeholder="Título da programação ou aviso"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post_descricao" className="text-xs font-semibold text-white/80">
              Descrição *
            </Label>
            <Textarea
              id="post_descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              className="rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[96px] text-sm"
              placeholder="Descreva os detalhes da programação..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="post_data" className="text-xs font-semibold text-white/80">
                Data *
              </Label>
              <Input
                id="post_data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
                className="h-11 rounded-xl bg-white/10 border-white/20 text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="post_hora" className="text-xs font-semibold text-white/80">
                Horário (Opcional)
              </Label>
              <Input
                id="post_hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="h-11 rounded-xl bg-white/10 border-white/20 text-white text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white/80">Imagem de Capa (Opcional)</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById('image-upload')?.click()}
              className="w-full h-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#D4AF37]" />
                  Enviando imagem...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  Selecionar Imagem do Dispositivo
                </>
              )}
            </Button>

            {uploadError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {previewUrl && (
              <div className="relative mt-2 rounded-2xl overflow-hidden border border-white/15">
                <img src={previewUrl} alt="Pré-visualização" className="w-full h-44 object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imagem_url: '' })}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs font-semibold"
                >
                  Remover
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/15 p-3.5 rounded-2xl">
            <div>
              <Label htmlFor="destaque-switch" className="text-xs font-semibold text-white block">
                Destacar publicação no topo?
              </Label>
              <span className="text-[11px] text-white/55 block">
                Exibe em destaque na Programação e na tela Início.
              </span>
            </div>
            <Switch
              id="destaque-switch"
              checked={formData.destaque}
              onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked })}
              className="data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-white/20"
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
              disabled={isSubmitting || isUploading}
              className="h-11 px-5 rounded-xl btn-gold text-xs font-bold"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {isSubmitting ? 'Salvando...' : postagem ? 'Salvar Alterações' : 'Publicar'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
