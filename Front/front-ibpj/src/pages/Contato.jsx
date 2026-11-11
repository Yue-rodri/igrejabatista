import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Clock,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Navigation,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MobilePageHeader } from '@/components/shared/GlassPrimitives';
import {
  copyToClipboard,
  openChurchLocationInMaps,
  shareContent,
} from '@/integrations/native';

export default function Contato() {
  const [copiedField, setCopiedField] = useState(null);

  const enderecoOficial = 'Rua Walderez Perez Xavier Giorgi, 39 — Parque Jandaia';
  const emailInstitucional = 'contato@ibpj.org.br';

  const handleCopy = async (text, key) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleShareLocation = async () => {
    await shareContent({
      title: 'Localização — Igreja Batista do Parque Jandaia (IBPJ)',
      text: `⛪ Igreja Batista do Parque Jandaia (IBPJ)\n📍 ${enderecoOficial}\n🕕 Cultos: Todos os dias das 18h00 às 20h00`,
      url: 'https://www.google.com/maps/search/?api=1&query=-23.5583706,-46.8261038',
    });
  };

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Fale Conosco"
        badgeIcon={MapPin}
        title="Contato e Localização"
        subtitle="Estamos de portas abertas para acolher você e sua família"
      />

      {/* Card de Endereço e Mapa Interativo */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl overflow-hidden"
      >
        <div className="h-56 w-full bg-[#07152D] relative">
          <iframe
            title="Localização da Igreja Batista do Parque Jandaia"
            src="https://www.google.com/maps/embed?pb=!3m2!1spt-BR!2sbr!4v1762152432603!5m2!1spt-BR!2sbr!6m8!1m7!1sN5fuga2wfJNTln9i6ROWQA!2m2!1d-23.55837061169701!2d-46.82610380342376!3f163.94645266015942!4f-8.223781712750153!5f0.7820865974627469"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/35 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                Endereço Presencial
              </span>
              <h2 className="text-base font-extrabold text-white leading-snug">
                Rua Walderez Perez Xavier Giorgi, 39
              </h2>
              <p className="text-xs text-white/70 mt-0.5">Parque Jandaia</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button
              onClick={openChurchLocationInMaps}
              className="h-11 rounded-xl btn-gold text-xs font-bold"
            >
              <Navigation className="w-4 h-4 mr-1.5" />
              Abrir no Mapa
            </Button>
            <Button
              onClick={() => handleCopy(enderecoOficial, 'endereco')}
              variant="outline"
              className="h-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold"
            >
              {copiedField === 'endereco' ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
                  Copiar Endereço
                </>
              )}
            </Button>
          </div>

          <Button
            onClick={handleShareLocation}
            variant="ghost"
            className="w-full h-10 rounded-xl bg-white/5 text-white/80 hover:text-white text-xs"
          >
            <Share2 className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
            Compartilhar localização com um convidado
          </Button>
        </div>
      </motion.section>

      {/* Horário de Culto */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-gold rounded-3xl p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center shadow-gold">
            <Clock className="w-5 h-5 text-[#001B30]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Horário de Culto</h2>
            <p className="text-xs text-[#D4AF37] font-semibold">Portas abertas diariamente</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#001B30]/65 border border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/80 font-medium">Todos os dias</span>
          <span className="text-base font-extrabold text-[#D4AF37]">18h00 às 20h00</span>
        </div>

        <p className="text-xs text-white/80 mt-3 leading-relaxed">
          Venha nos visitar! Todos são bem-vindos para adorar e compartilhar a Palavra de Deus conosco.
        </p>
      </motion.section>

      {/* Canais de Atendimento e Comunicação */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-3xl p-5 space-y-3"
      >
        <h2 className="text-base font-extrabold text-white">Canais de Comunicação</h2>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">E-mail Institucional</p>
              <p className="text-xs text-white/75 truncate">{emailInstitucional}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCopy(emailInstitucional, 'email')}
              aria-label="Copiar e-mail"
              className="h-9 px-3 rounded-xl bg-white/10 text-xs font-semibold text-white flex items-center gap-1"
            >
              {copiedField === 'email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#D4AF37]" /> Copiar
                </>
              )}
            </button>
            <a
              href={`mailto:${emailInstitucional}`}
              aria-label="Enviar e-mail"
              className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#001B30] flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/65 leading-relaxed">
          <strong className="text-white block mb-0.5">Atendimento Pastoral e Grupos (WhatsApp / Facebook)</strong>
          Os links diretos para o grupo oficial de WhatsApp e página do Facebook são disponibilizados presencialmente pela recepção da igreja nos cultos diários (18h00 às 20h00), garantindo a segurança e privacidade dos membros.
        </div>
      </motion.section>
    </div>
  );
}
