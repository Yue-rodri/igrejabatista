import React, { useState } from 'react';
import { Book, Heart, Target, Award, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { MobilePageHeader } from '@/components/shared/GlassPrimitives';

export default function Principios() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const principios = [
    {
      titulo: 'Autoridade das Escrituras',
      texto: 'A Bíblia é a Palavra de Deus e única regra de fé e prática.',
      versiculo: '2 Timóteo 3:16-17',
    },
    {
      titulo: 'Autonomia da Igreja Local',
      texto: 'Cada igreja local é autônoma e independente.',
      versiculo: 'Mateus 18:17',
    },
    {
      titulo: 'Sacerdócio Universal',
      texto: 'Todo crente tem acesso direto a Deus através de Jesus Cristo.',
      versiculo: '1 Pedro 2:9',
    },
    {
      titulo: 'Batismo por Imersão',
      texto: 'O batismo é por imersão dos que professam fé em Cristo.',
      versiculo: 'Romanos 6:3-4',
    },
    {
      titulo: 'Salvação pela Graça',
      texto: 'A salvação é pela graça mediante a fé em Jesus Cristo.',
      versiculo: 'Efésios 2:8-9',
    },
    {
      titulo: 'Liberdade Religiosa',
      texto: 'Liberdade de consciência e separação entre Igreja e Estado.',
      versiculo: 'João 8:32',
    },
  ];

  const valores = [
    'Amor a Deus e ao próximo',
    'Comunhão e unidade',
    'Ensino bíblico fundamentado',
    'Evangelização e missões',
    'Adoração genuína',
    'Serviço cristão',
  ];

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Nossa Base de Fé"
        badgeIcon={Book}
        title="Princípios, Missão e Visão"
        subtitle="Os fundamentos bíblicos que guiam a caminhada da IBPJ"
      />

      {/* Missão e Visão em Destaque */}
      <div className="grid grid-cols-1 gap-4">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-gold rounded-3xl p-5"
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center shadow-gold">
              <Target className="w-5 h-5 text-[#001B30]" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Nossa Missão</h2>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Proclamar o Evangelho de Jesus Cristo, fazendo discípulos de todas as nações,
            ensinando-os a guardar todas as coisas que Cristo ordenou, promovendo a adoração
            a Deus, a comunhão entre os irmãos e o serviço cristão, com amor e dedicação.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/35 flex items-center justify-center">
              <Award className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Nossa Visão</h2>
          </div>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Ser uma comunidade cristã transformada pelo poder do Evangelho, que impacta
            vidas através do amor de Cristo, formando discípulos maduros e comprometidos
            com o Reino de Deus, sendo referência de fé, esperança e amor na região.
          </p>
        </motion.section>
      </div>

      {/* Princípios Batistas (Cards interativos expansíveis para leitura mobile) */}
      <section className="glass-card rounded-3xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Book className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-base font-extrabold text-white">
            Princípios Batistas
          </h2>
        </div>

        <div className="space-y-2.5">
          {principios.map((principio, index) => {
            const isOpen = expandedIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-[#D4AF37]/12 border-[#D4AF37]/40'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isOpen ? -1 : index)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {principio.titulo}
                      </h3>
                      <span className="text-[11px] font-semibold text-[#D4AF37]">
                        {principio.versiculo}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform ${
                      isOpen ? 'rotate-180 text-[#D4AF37]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 text-xs sm:text-sm text-white/80 leading-relaxed border-t border-white/10 mt-1 pt-3">
                    {principio.texto}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="glass-card rounded-3xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Heart className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-base font-extrabold text-white">Nossos Valores</h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {valores.map((valor, index) => (
            <div
              key={index}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center justify-center"
            >
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center mb-2">
                <Heart className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="text-xs font-bold text-white leading-snug">{valor}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
