
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, QrCode } from "lucide-react";
import { motion } from "framer-motion";

export default function Generosidade() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-medium">Contribua com Alegria</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Momento Generosidade
          </h1>
          <p className="text-white/70 text-lg">
            Sua contribuição ajuda a IBPJ a continuar sua missão
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941E]/10 backdrop-blur-md border-[#D4AF37]/30 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-[#001B3D]" />
                </div>
                
                <blockquote className="text-xl md:text-2xl text-white italic mb-6 leading-relaxed">
                  "Cada um dê conforme determinou em seu coração,<br />
                  não com pesar ou por obrigação,<br />
                  pois Deus ama quem dá com alegria."
                </blockquote>
                
                <p className="text-[#D4AF37] font-semibold text-lg mb-8">
                  2 Coríntios 9:7
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <QrCode className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-xl font-semibold text-white">
                    Escaneie o QR Code
                  </h3>
                </div>
                
                <div className="bg-white rounded-xl p-6 max-w-xs mx-auto">
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-sm">
                        QR Code para doações<br />
                        (Aguardando configuração)
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-center mt-6">
                  Use o aplicativo do seu banco para fazer a leitura do QR Code<br />
                  e realizar sua contribuição via PIX
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <Heart className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-white/70 text-sm">Contribuição voluntária</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-white/70 text-sm">100% para a obra</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <Heart className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-white/70 text-sm">Deus ama quem dá</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Como suas contribuições são utilizadas:
              </h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Manutenção e despesas da IBPJ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Ações sociais e ajuda aos necessitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Missões e evangelização</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Programas e atividades da IBPJ</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
