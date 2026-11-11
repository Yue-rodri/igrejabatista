import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Church,
  Heart,
  Users,
  Book,
  Calendar,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MobilePageHeader } from '@/components/shared/GlassPrimitives';

export default function QuemSomos() {
  const pilares = [
    {
      icon: Book,
      title: 'Ensino Bíblico',
      description: 'Fundamentados na Palavra de Deus como única regra de fé e prática.',
      color: 'from-blue-500/30 to-blue-600/10 border-blue-400/30 text-blue-300',
    },
    {
      icon: Heart,
      title: 'Amor e Comunhão',
      description: 'Uma família acolhedora e unida no amor de Cristo.',
      color: 'from-rose-500/30 to-rose-600/10 border-rose-400/30 text-rose-300',
    },
    {
      icon: Users,
      title: 'Serviço Cristão',
      description: 'Servindo a Deus e suprindo necessidades reais do próximo.',
      color: 'from-emerald-500/30 to-emerald-600/10 border-emerald-400/30 text-emerald-300',
    },
    {
      icon: Church,
      title: 'Adoração Genuína',
      description: 'Culto diário sincero e cristocêntrico para toda a família.',
      color: 'from-amber-500/30 to-amber-600/10 border-amber-400/30 text-[#D4AF37]',
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Nossa Identidade"
        badgeIcon={Sparkles}
        title="Quem Somos"
        subtitle="Uma família de fé que ama a Deus e serve ao próximo no Parque Jandaia"
      />

      {/* Hero Institucional */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card-gold rounded-3xl p-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37] flex items-center justify-center mx-auto mb-3.5 shadow-gold">
          <Church className="w-8 h-8 text-[#001B30]" />
        </div>
        <h2 className="text-xl font-extrabold text-white">
          Igreja Batista Parque Jandaia
        </h2>
        <p className="text-xs sm:text-sm text-white/80 mt-1">
          Comunidade cristã comprometida com o Evangelho e a transformação de vidas
        </p>
      </motion.section>

      {/* Nossa História */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-5 sm:p-6 space-y-3.5"
      >
        <div className="flex items-center gap-2.5">
          <Book className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-base font-extrabold text-white">Nossa História</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed">
          <p>
            A Igreja Batista Parque Jandaia (IBPJ) é uma comunidade cristã fundamentada
            nos princípios bíblicos e na tradição batista. Nascemos do desejo de levar o
            amor de Cristo e a mensagem do Evangelho para a região do Parque Jandaia e
            adjacências.
          </p>
          <p>
            Somos uma igreja que acredita na autoridade das Escrituras, na salvação pela
            graça mediante a fé em Jesus Cristo, e no sacerdócio universal dos crentes.
            Nossa missão é proclamar o Evangelho, fazer discípulos e transformar vidas
            através do poder do amor de Deus.
          </p>
          <p>
            Reunimo-nos diariamente para adoração, estudo bíblico (EBD), comunhão e oração.
            Acreditamos que a igreja é mais do que um edifício — é uma família onde crianças,
            jovens, adolescentes e adultos são bem-vindos e amados em Cristo.
          </p>
        </div>
      </motion.section>

      {/* O Que Nos Define */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-white px-0.5">
          O Que Nos Define
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pilares.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4 flex items-start gap-3.5"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Convite para Visitação */}
      <section className="glass-card-gold rounded-3xl p-5 text-center space-y-3">
        <h2 className="text-lg font-extrabold text-white">Venha Nos Visitar!</h2>
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-md mx-auto">
          Você e sua família são muito bem-vindos em nossa comunidade. Participe de nossos
          cultos diários das 18h00 às 20h00.
        </p>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Link to={createPageUrl('Eventos')}>
            <Button className="w-full h-11 rounded-xl btn-gold text-xs font-bold">
              <Calendar className="w-4 h-4 mr-1.5" />
              Ver Eventos
            </Button>
          </Link>
          <Link to={createPageUrl('Contato')}>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-white/25 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold"
            >
              <MapPin className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
              Localização
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
