import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Cake, Sparkles, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '@/entities/User';
import { useAuth } from '@/context/AuthContext';
import {
  parseLocalDate,
  formatLocalDate,
  isBirthdayToday,
} from '@/utils';
import {
  MobilePageHeader,
  LoadingStateCard,
  EmptyStateCard,
  ErrorRetryCard,
} from '@/components/shared/GlassPrimitives';

export default function Aniversariantes() {
  const { setIsApiConfigOpen } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadUsuarios = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await User.list();
      const usuariosComAniversario = data.filter((u) => u.data_nascimento);
      setUsuarios(usuariosComAniversario);
    } catch (error) {
      setLoadError(
        error.response?.data?.error ||
          'Não foi possível carregar os aniversariantes do mês.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const hoje = new Date();
  const nomeMesAtual = formatLocalDate(hoje, 'MMMM');

  // Filtra usuários do mês corrente (comparando apenas mês 0-11 no fuso local) e ordena por dia
  const aniversariantesDoMes = usuarios
    .filter((usuario) => {
      const dataCorrigida = parseLocalDate(usuario.data_nascimento);
      if (!dataCorrigida) return false;
      return dataCorrigida.getMonth() === hoje.getMonth();
    })
    .sort((a, b) => {
      const diaA = parseLocalDate(a.data_nascimento).getDate();
      const diaB = parseLocalDate(b.data_nascimento).getDate();
      return diaA - diaB;
    });

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Celebrando Vidas"
        badgeIcon={Cake}
        title={`Aniversariantes de ${nomeMesAtual.charAt(0).toUpperCase() + nomeMesAtual.slice(1)}`}
        subtitle="Celebre e ore pela vida dos nossos irmãos neste mês"
      />

      {/* Nota de Privacidade */}
      <div className="glass-card rounded-2xl p-3.5 flex items-center gap-3 text-xs text-white/75">
        <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <p className="leading-relaxed">
          Exibimos apenas membros que autorizaram a divulgação de aniversário no momento do cadastro, preservando a privacidade de dados pessoais.
        </p>
      </div>

      {isLoading ? (
        <LoadingStateCard label="Carregando mural de aniversariantes..." />
      ) : loadError ? (
        <ErrorRetryCard
          title="Falha ao carregar aniversariantes"
          message={loadError}
          onRetry={loadUsuarios}
          onConfigureApi={() => setIsApiConfigOpen(true)}
        />
      ) : aniversariantesDoMes.length === 0 ? (
        <EmptyStateCard
          icon={Cake}
          title="Nenhum aniversariante registrado para este mês"
          description="Membros cadastrados que optarem por aparecer no mural serão listados aqui automaticamente."
        />
      ) : (
        <div className="space-y-3">
          {aniversariantesDoMes.map((usuario, index) => {
            const ehHoje = isBirthdayToday(usuario.data_nascimento);

            return (
              <motion.div
                key={usuario.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`rounded-3xl p-4 transition-all ${
                  ehHoje ? 'glass-card-gold' : 'glass-card'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold flex-shrink-0 ${
                      ehHoje
                        ? 'bg-[#D4AF37] text-[#001B30] shadow-gold'
                        : 'bg-white/10 text-white border border-white/15'
                    }`}
                  >
                    {usuario.full_name?.charAt(0)?.toUpperCase() || 'M'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white truncate">
                        {usuario.full_name}
                      </h3>
                      {ehHoje && (
                        <Badge className="bg-[#D4AF37] text-[#001B30] border-0 font-bold text-[10px]">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Hoje!
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-white/75 mt-1">
                      <Cake className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>
                        {formatLocalDate(usuario.data_nascimento, "d 'de' MMMM")}
                      </span>
                    </div>
                  </div>
                </div>

                {ehHoje && (
                  <div className="mt-3 p-3 rounded-2xl bg-[#001B30]/60 border border-[#D4AF37]/30 text-center">
                    <p className="text-xs text-white/95 italic font-medium">
                      🎉 Feliz Aniversário! Que o Senhor abençoe ricamente seu novo ano de vida!
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
