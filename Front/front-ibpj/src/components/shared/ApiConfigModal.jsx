import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Server,
  CheckCircle2,
  WifiOff,
  RotateCcw,
  RefreshCw,
  Globe,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import {
  CLOUD_PRODUCTION_API_URL,
  getApiBaseUrl,
  getDefaultApiBaseUrl,
  normalizeApiUrl,
  checkApiHealth,
  discoverTunnelInfo,
  getCachedTunnelInfo,
} from '@/api/core';
import { useAuth } from '@/context/AuthContext';

const BASE_PRESETS = [
  {
    label: 'Nuvem Produção (Render / Cloud Oficial)',
    url: CLOUD_PRODUCTION_API_URL,
    badge: 'Nuvem HTTPS',
  },
  {
    label: 'Localhost (Desenvolvimento Web / ADB)',
    url: 'http://localhost:4000',
    badge: 'Local',
  },
  {
    label: 'Emulador Android Padrão (AVD)',
    url: 'http://10.0.2.2:4000',
    badge: 'Emulador',
  },
];

export default function ApiConfigModal() {
  const { isApiConfigOpen, setIsApiConfigOpen, updateApiEndpoint, apiStatus } = useAuth();
  const [urlInput, setUrlInput] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [tunnelInfo, setTunnelInfo] = useState(getCachedTunnelInfo());

  useEffect(() => {
    if (isApiConfigOpen) {
      setUrlInput(getApiBaseUrl());
      setTestResult(null);
      discoverTunnelInfo().then((info) => {
        if (info) setTunnelInfo(info);
      });
    }
  }, [isApiConfigOpen]);

  const activeTunnelUrl =
    tunnelInfo?.apiTunnelUrl || apiStatus?.data?.tunnel?.apiTunnelUrl || null;

  const presetUrls = activeTunnelUrl
    ? [
        {
          label: 'Túnel HTTPS Ativo (4G / 5G / Wi-Fi Externo)',
          url: activeTunnelUrl,
          badge: 'Túnel HTTPS',
        },
        ...BASE_PRESETS,
      ]
    : BASE_PRESETS;

  const normalizedPreview = normalizeApiUrl(urlInput);
  const isHttps = normalizedPreview.startsWith('https://');
  const isTunnelUrl =
    normalizedPreview.includes('.loca.lt') ||
    normalizedPreview.includes('.trycloudflare.com') ||
    normalizedPreview.includes('.ngrok');

  const handleSaveAndTest = async (e) => {
    e?.preventDefault();
    const finalUrl = normalizeApiUrl(urlInput);
    if (!finalUrl) return;
    setUrlInput(finalUrl);
    setTesting(true);
    await updateApiEndpoint(finalUrl);
    const result = await checkApiHealth();
    setTestResult(result);
    setTesting(false);
  };

  const handleResetDefault = async () => {
    const def = getDefaultApiBaseUrl();
    setUrlInput(def);
    setTesting(true);
    await updateApiEndpoint('');
    const result = await checkApiHealth();
    setTestResult(result);
    setTesting(false);
  };

  return (
    <Dialog open={isApiConfigOpen} onOpenChange={setIsApiConfigOpen}>
      <DialogContent className="glass-card-solid border-white/15 text-white rounded-3xl max-w-[94vw] sm:max-w-md p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-white">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span>Conexão com o Servidor IBPJ</span>
              <p className="text-[11px] font-normal text-white/60 mt-0.5">
                Suporte a rede local, emulador e túnel HTTPS (4G/5G)
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSaveAndTest} className="space-y-4 pt-2">
          {/* Status Atual */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/75 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white">Status atual:</span>
              {apiStatus.online ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                  <WifiOff className="w-3.5 h-3.5" /> Sem resposta
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/60 break-all">
              Endpoint ativo: <code className="text-[#D4AF37]">{getApiBaseUrl()}</code>
            </div>
          </div>

          {/* Guia Rápido de Túnel Remoto (4G/5G) */}
          <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#D4AF37]">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>Acesso Remoto (4G / 5G ou Wi-Fi Externo)</span>
            </div>
            {activeTunnelUrl ? (
              <p className="text-[11px] text-white/80 leading-relaxed">
                Túnel ativo detetado: <code className="text-emerald-300 font-semibold">{activeTunnelUrl}</code>. Selecione-o abaixo ou cole no telemóvel.
              </p>
            ) : (
              <>
                <p className="text-[11px] text-white/75 leading-relaxed">
                  Para ligar o telemóvel fora da sua rede Wi-Fi local, execute no terminal do backend (<code className="text-white">Back/ibpj-api</code>):
                </p>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#040D1A]/80 border border-white/10 font-mono text-[11px] text-[#D4AF37]">
                  <Terminal className="w-3.5 h-3.5 text-white/50 shrink-0" />
                  <span>npm run tunnel</span>
                </div>
              </>
            )}
            <p className="text-[11px] text-white/65 leading-relaxed">
              O cabeçalho <code className="text-white/90">Bypass-Tunnel-Reminder</code> já é enviado automaticamente em todas as requisições.
            </p>
          </div>

          {/* Campo de URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-url-input" className="text-xs font-semibold text-white/85">
                URL da API (HTTPS do Túnel ou HTTP Local)
              </Label>
              {normalizedPreview && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isHttps
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {isHttps ? (
                    <>
                      <ShieldCheck className="w-3 h-3" />
                      {isTunnelUrl ? 'Túnel HTTPS' : 'HTTPS Seguro'}
                    </>
                  ) : (
                    'HTTP Local'
                  )}
                </span>
              )}
            </div>
            <Input
              id="api-url-input"
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Ex: https://seu-tunel.loca.lt ou http://192.168.1.10:4000"
              required
              className="h-11 rounded-xl bg-white/10 border-white/20 text-white text-sm font-mono"
            />
            {normalizedPreview && normalizedPreview !== urlInput.trim() && (
              <p className="text-[11px] text-white/55">
                Será salvo como: <code className="text-[#D4AF37]">{normalizedPreview}</code>
              </p>
            )}
          </div>

          {/* Atalhos Rápidos */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Atalhos de Ambiente Disponíveis
            </span>
            <div className="grid grid-cols-1 gap-2">
              {presetUrls.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setUrlInput(preset.url)}
                  className={`flex items-center justify-between text-left px-3 py-2 rounded-xl border text-xs transition-all ${
                    normalizedPreview === preset.url
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-white font-semibold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-white truncate">{preset.label}</div>
                    <div className="text-[11px] text-[#D4AF37] font-mono truncate">{preset.url}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/70 shrink-0">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Resultado do Teste */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs border leading-relaxed ${
                testResult.online
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.online ? (
                <div>
                  <div className="font-semibold">
                    ✅ Conexão confirmada com {testResult.baseUrl}!
                  </div>
                  {testResult.data?.message && (
                    <div className="text-[11px] opacity-85 mt-0.5">
                      Resposta: {testResult.data.message}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="font-semibold">
                    ❌ Falha ao conectar a {testResult.baseUrl}
                  </div>
                  <div className="text-[11px] opacity-85 mt-0.5">{testResult.error}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetDefault}
              disabled={testing}
              className="h-11 rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/10 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Padrão
            </Button>
            <Button
              type="submit"
              disabled={testing}
              className="flex-1 h-11 rounded-xl btn-gold text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Verificando...' : 'Salvar e Testar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
