
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Facebook, MessageCircle, Mail, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Contato() {
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
          <span className="text-[#D4AF37] text-sm font-medium">Fale Conosco</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Entre em Contato
        </h1>
        <p className="text-white/70 text-lg">
          Estamos aqui para servir e te acolher
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Endereço */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg mb-4">
                Rua Walderez Perez Xavier Giorgi
              </p>
              <p className="text-white/70 mb-6">
                Parque Jandaia
              </p>
              <Button
                className="w-full bg-[#D4AF37] hover:bg-[#B8941E] text-[#001B3D]"
                onClick={() => window.open('https://maps.google.com/?q=Rua Walderez Perez Xavier Giorgi, Parque Jandaia', '_blank')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Ver no Mapa
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Horários */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941E]/10 backdrop-blur-md border-[#D4AF37]/30 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                Horário de Culto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/70 text-sm mb-1">Todos os dias</p>
                  <p className="text-white text-xl font-semibold">18h00 - 20h00</p>
                </div>
                <p className="text-white/70">
                  Venha nos visitar! Todos são bem-vindos para adorar e compartilhar 
                  a Palavra de Deus conosco.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Redes Sociais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Conecte-se Conosco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 border-white/20 hover:bg-white/10 flex-col gap-3"
                onClick={() => window.open('https://facebook.com/ibpi', '_blank')}
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">Facebook</p>
                  <p className="text-white/60 text-sm">Siga nossa página</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 border-white/20 hover:bg-white/10 flex-col gap-3"
                onClick={() => window.open('https://wa.me/5521999999999', '_blank')}
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">WhatsApp</p>
                  <p className="text-white/60 text-sm">Fale conosco</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Informações Adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  Email
                </h3>
                <p className="text-white/70">contato@ibpj.org.br</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  Telefone
                </h3>
                <p className="text-white/70">(21) 99999-9999</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
