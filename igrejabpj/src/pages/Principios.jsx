import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Heart, Target, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Principios() {
  const principios = [
    {
      titulo: "Autoridade das Escrituras",
      texto: "A Bíblia é a Palavra de Deus e única regra de fé e prática",
      versiculo: "2 Timóteo 3:16-17"
    },
    {
      titulo: "Autonomia da Igreja Local",
      texto: "Cada igreja local é autônoma e independente",
      versiculo: "Mateus 18:17"
    },
    {
      titulo: "Sacerdócio Universal",
      texto: "Todo crente tem acesso direto a Deus através de Jesus Cristo",
      versiculo: "1 Pedro 2:9"
    },
    {
      titulo: "Batismo por Imersão",
      texto: "O batismo é por imersão dos que professam fé em Cristo",
      versiculo: "Romanos 6:3-4"
    },
    {
      titulo: "Salvação pela Graça",
      texto: "A salvação é pela graça mediante a fé em Jesus Cristo",
      versiculo: "Efésios 2:8-9"
    },
    {
      titulo: "Liberdade Religiosa",
      texto: "Liberdade de consciência e separação entre Igreja e Estado",
      versiculo: "João 8:32"
    }
  ];

  const valores = [
    "Amor a Deus e ao próximo",
    "Comunhão e unidade",
    "Ensino bíblico fundamentado",
    "Evangelização e missões",
    "Adoração genuína",
    "Serviço cristão"
  ];

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
          <span className="text-[#D4AF37] text-sm font-medium">Nossa Base de Fé</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Princípios, Missão e Visão
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Os fundamentos que guiam nossa caminhada cristã
        </p>
      </motion.div>

      <div className="space-y-12">
        {/* Princípios Batistas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <Book className="w-7 h-7 text-[#D4AF37]" />
                Princípios Batistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {principios.map((principio, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {principio.titulo}
                    </h3>
                    <p className="text-white/70 mb-3">
                      {principio.texto}
                    </p>
                    <p className="text-[#D4AF37] text-sm font-medium">
                      {principio.versiculo}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Missão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941E]/10 backdrop-blur-md border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <Target className="w-7 h-7 text-[#D4AF37]" />
                Nossa Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg leading-relaxed">
                Proclamar o Evangelho de Jesus Cristo, fazendo discípulos de todas as nações, 
                ensinando-os a guardar todas as coisas que Cristo ordenou, promovendo a adoração 
                a Deus, a comunhão entre os irmãos e o serviço cristão, com amor e dedicação.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <Award className="w-7 h-7 text-[#D4AF37]" />
                Nossa Visão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                Ser uma comunidade cristã transformada pelo poder do Evangelho, que impacta 
                vidas através do amor de Cristo, formando discípulos maduros e comprometidos 
                com o Reino de Deus, sendo referência de fé, esperança e amor na região de 
                Ponta da Ilha e além.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <Heart className="w-7 h-7 text-[#D4AF37]" />
                Nossos Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {valores.map((valor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                    className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <p className="text-white font-medium">{valor}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}