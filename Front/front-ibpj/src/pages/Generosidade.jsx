import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Share2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobilePageHeader } from '@/components/shared/GlassPrimitives';
import { shareContent } from '@/integrations/native';

export default function Generosidade() {
  const [sharedVerse, setSharedVerse] = useState(false);

  const handleShareVerse = async () => {
    const res = await shareContent({
      title: 'Momento Generosidade — IBPJ',
      text: '“Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.” (2 Coríntios 9:7) — Igreja Batista do Parque Jandaia',
    });
    if (res.shared) {
      setSharedVerse(true);
      setTimeout(() => setSharedVerse(false), 2500);
    }
  };

  const pilaresContribuicao = [
    {
      title: 'Manutenção e Despesas da IBPJ',
      desc: 'Cuidado com o templo, estrutura de cultos diários e acolhimento.',
    },
    {
      title: 'Ações Sociais e Diaconia',
      desc: 'Apoio prático a famílias e pessoas em necessidade na comunidade.',
    },
    {
      title: 'Missões e Evangelização',
      desc: 'Proclamação do Evangelho no Parque Jandaia e além.',
    },
    {
      title: 'Programas e Ministérios',
      desc: 'Ensino bíblico, discipulado, jovens, crianças e famílias.',
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Contribua com Alegria"
        badgeIcon={Heart}
        title="Momento Generosidade"
        subtitle="Sua contribuição voluntária apoia a missão e as obras da IBPJ"
      />

      {/* Card Bíblico Principal */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-gold rounded-3xl p-5 sm:p-6 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center mx-auto mb-4 shadow-gold">
          <Heart className="w-7 h-7 text-[#001B30]" />
        </div>

        <blockquote className="text-base sm:text-lg text-white italic leading-relaxed mb-3">
          “Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.”
        </blockquote>

        <div className="flex items-center justify-center gap-3">
          <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider">
            2 Coríntios 9:7
          </span>
          <button
            type="button"
            onClick={handleShareVerse}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white/75 hover:text-[#D4AF37] bg-white/10 px-2.5 py-1 rounded-full"
          >
            {sharedVerse ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copiado
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" /> Compartilhar
              </>
            )}
          </button>
        </div>
      </motion.section>

      {/* Seção PIX — Estado Honesto e Transparente (Sem chaves falsas) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-5 sm:p-6"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-base font-extrabold text-white">
            Contribuição via PIX
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 max-w-[230px] mx-auto shadow-lg">
          <div className="aspect-square bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <QrCode className="w-16 h-16 text-[#001B30]/40 mb-2" />
            <p className="text-xs font-bold text-[#001B30]">
              QR Code PIX para Doações
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              (Aguardando configuração oficial da tesouraria)
            </p>
          </div>
        </div>

        <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
          <p className="text-xs font-semibold text-white">
            Contribuição Segura e Presencial
          </p>
          <p className="text-xs text-white/65 leading-relaxed">
            Por segurança, o aplicativo não exibe chaves financeiras não homologadas. Você também pode realizar seus dízimos e ofertas presencialmente nos cultos diários (18h00 às 20h00) ou confirmar a chave oficial diretamente com a liderança da IBPJ.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-4 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <Heart className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-white/85">Voluntária</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <Sparkles className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-white/85">100% para a Obra</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-white/85">Transparência</p>
          </div>
        </div>
      </motion.section>

      {/* Destinação das Contribuições */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl p-5"
      >
        <div className="flex items-center gap-2 mb-3.5">
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-sm font-extrabold text-white">
            Como suas contribuições são utilizadas
          </h3>
        </div>

        <div className="space-y-2.5">
          {pilaresContribuicao.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xs font-extrabold text-[#D4AF37] flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-xs text-white/65 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
