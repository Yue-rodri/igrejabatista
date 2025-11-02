
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Church, Heart, Users, Book, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function QuemSomos() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] text-sm font-medium">Conheça Nossa História</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Quem Somos
        </h1>
        <p className="text-white/70 text-lg">
          Uma família de fé que ama a Deus e serve ao próximo
        </p>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12"
      >
        <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden">
          <div className="relative h-64 md:h-96 bg-gradient-to-br from-[#D4AF37]/20 to-[#001B3D]/50 flex items-center justify-center">
            <div className="text-center">
              <Church className="w-24 h-24 text-[#D4AF37] mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Igreja Batista Parque Jandaia
              </h2>
              <p className="text-white/70 mt-2">
                Uma comunidade cristã comprometida com o Evangelho
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Nossa História */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-12"
      >
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardContent className="p-8 md:p-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Book className="w-8 h-8 text-[#D4AF37]" />
                Nossa História
              </h2>
              
              <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                <p>
                  A Igreja Batista Parque Jandaia (IBPJ) é uma comunidade cristã fundamentada 
                  nos princípios bíblicos e na tradição batista. Nascemos do desejo de levar o 
                  amor de Cristo e a mensagem do Evangelho para a região de Parque Jandaia e 
                  adjacências.
                </p>
                
                <p>
                  Somos uma igreja que acredita na autoridade das Escrituras, na salvação pela 
                  graça mediante a fé em Jesus Cristo, e no sacerdócio universal dos crentes. 
                  Nossa missão é proclamar o Evangelho, fazer discípulos e transformar vidas 
                  através do poder do amor de Deus.
                </p>
                
                <p>
                  Reunimo-nos diariamente para adoração, estudo bíblico, comunhão e oração. 
                  Acreditamos que a igreja é mais do que um edifício - é uma família onde todos 
                  são bem-vindos e amados em Cristo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Características */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          O Que Nos Define
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Book,
              title: "Ensino Bíblico",
              description: "Fundamentados na Palavra de Deus",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Heart,
              title: "Amor e Comunhão",
              description: "Uma família unida em Cristo",
              color: "from-rose-500 to-rose-600"
            },
            {
              icon: Users,
              title: "Serviço Cristão",
              description: "Servindo a Deus e ao próximo",
              color: "from-green-500 to-green-600"
            },
            {
              icon: Church,
              title: "Adoração",
              description: "Culto genuíno ao Senhor",
              color: "from-amber-500 to-amber-600"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 h-full hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/70">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941E]/10 backdrop-blur-md border-[#D4AF37]/30">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Venha Nos Visitar!
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Você é muito bem-vindo em nossa comunidade. Participe de nossos cultos e 
              experimente o amor e a comunhão da família IBPJ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Eventos")}>
                <Button 
                  size="lg" 
                  className="bg-[#D4AF37] hover:bg-[#B8941E] text-[#001B3D] px-8"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Ver Próximos Eventos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contato")}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8"
                >
                  Entre em Contato
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
