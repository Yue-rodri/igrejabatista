import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, WifiOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Selo institucional dourado usado no topo de seções mobile.
 */
export function SectionBadge({ icon: Icon = Sparkles, children, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-3.5 py-1 text-xs font-semibold text-[#D4AF37] tracking-wide ${className}`}
    >
      <Icon className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/**
 * Cabeçalho padronizado para páginas internas mobile.
 */
export function MobilePageHeader({ badge, badgeIcon, title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {badge && (
            <div className="mb-2.5">
              <SectionBadge icon={badgeIcon}>{badge}</SectionBadge>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-white/70 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0 pt-1">{action}</div>}
      </div>
    </motion.div>
  );
}

/**
 * Card de carregamento elegante para conexões móveis.
 */
export function LoadingStateCard({ label = 'Carregando informações...' }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/25 border-t-[#D4AF37] animate-spin mb-3" />
      <p className="text-sm text-white/70 font-medium">{label}</p>
    </div>
  );
}

/**
 * Card de estado vazio elegante e honesto.
 */
export function EmptyStateCard({ icon: Icon, title, description, action }) {
  return (
    <div className="glass-card rounded-2xl p-7 text-center flex flex-col items-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3.5">
          <Icon className="w-7 h-7 text-[#D4AF37]/75" />
        </div>
      )}
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-white/65 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/**
 * Card de erro de comunicação com a API com botão de "Tentar novamente" e "Configurar Servidor".
 */
export function ErrorRetryCard({
  title = 'Não foi possível carregar os dados',
  message = 'Verifique se o servidor da API IBPJ está online e acessível a partir deste dispositivo.',
  onRetry,
  onConfigureApi,
}) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-amber-500/30 text-center">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
        <WifiOff className="w-6 h-6 text-amber-400" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto mb-4 leading-relaxed">
        {message}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            className="btn-gold h-10 px-4 rounded-xl text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Tentar novamente
          </Button>
        )}
        {onConfigureApi && (
          <Button
            onClick={onConfigureApi}
            variant="outline"
            size="sm"
            className="h-10 px-4 rounded-xl text-xs border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            Configurar conexão API
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Modal de confirmação mobile para ações destrutivas (substitui window.confirm).
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = 'Confirmar exclusão',
  description = 'Tem certeza que deseja excluir este item? Esta ação não poderá ser desfeita.',
  confirmLabel = 'Sim, excluir',
  onConfirm,
  isLoading = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card-solid border-white/15 text-white rounded-3xl max-w-[92vw] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2.5 text-lg">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/75 text-sm leading-relaxed pt-1">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2.5 sm:justify-end pt-2">
          <AlertDialogCancel className="flex-1 sm:flex-none mt-0 h-11 rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-none h-11 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-semibold"
          >
            {isLoading ? 'Excluindo...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
