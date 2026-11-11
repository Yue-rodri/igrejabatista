import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'ibpj_token';
const API_URL_STORAGE_KEY = 'ibpj_api_url';

// URL Pública Oficial da API em Nuvem (Cloudflare / Render / Produção)
export const CLOUD_PRODUCTION_API_URL =
  import.meta.env.VITE_API_URL || 'https://apartments-wanted-reviewer-earth.trycloudflare.com';

export const RENDER_CLOUD_API_URL = 'https://ibpj-api.onrender.com';

export const PUBLIC_DOWNLOAD_PAGE_URL =
  import.meta.env.VITE_DOWNLOAD_PAGE_URL || `${CLOUD_PRODUCTION_API_URL}/download`;

export const PUBLIC_APK_RELEASE_URL =
  import.meta.env.VITE_APK_DOWNLOAD_URL ||
  `${CLOUD_PRODUCTION_API_URL}/apk/IBPJ-Mobile-release.apk`;

let cachedTunnelInfo = null;
let runtimeFallbackUrl = null;

/**
 * Normaliza qualquer URL de API informada pelo utilizador:
 * - Suporta URLs seguras em nuvem (https://ibpj-api.onrender.com, https://*.up.railway.app)
 * - Suporta URLs de túnel (https://*.loca.lt, https://*.trycloudflare.com, https://*.ngrok-free.app)
 * - Suporta URLs locais (http://localhost:4000, http://10.0.2.2:4000, http://192.168.x.x:4000)
 */
export function normalizeApiUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let cleaned = rawUrl.trim().replace(/\/+$/, '');
  if (!cleaned) return '';

  if (!/^https?:\/\//i.test(cleaned)) {
    const isLocalAddress =
      cleaned.startsWith('localhost') ||
      cleaned.startsWith('127.') ||
      cleaned.startsWith('10.') ||
      cleaned.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(cleaned);
    cleaned = `${isLocalAddress ? 'http' : 'https'}://${cleaned}`;
  }
  return cleaned.replace(/\/+$/, '');
}

/**
 * Resolve a URL base padrão apontando prioritariamente para a Nuvem (CLOUD_PRODUCTION_API_URL),
 * eliminando a dependência de IPs locais (localhost / 192.168.x.x) no app distribuído.
 */
export function getDefaultApiBaseUrl() {
  if (runtimeFallbackUrl) {
    return runtimeFallbackUrl;
  }
  return normalizeApiUrl(CLOUD_PRODUCTION_API_URL);
}

export function getLocalFallbackCandidates() {
  const candidates = [RENDER_CLOUD_API_URL];
  if (cachedTunnelInfo?.apiTunnelUrl) {
    candidates.unshift(normalizeApiUrl(cachedTunnelInfo.apiTunnelUrl));
  }
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    candidates.push('http://10.0.2.2:4000');
  } else {
    candidates.push('http://localhost:4000');
  }
  return [...new Set(candidates)];
}

export function getApiBaseUrl() {
  try {
    const customUrl = localStorage.getItem(API_URL_STORAGE_KEY);
    const normalized = normalizeApiUrl(customUrl);
    if (normalized) {
      return normalized;
    }
  } catch {
    // ignore storage errors
  }
  return getDefaultApiBaseUrl();
}

export function setApiBaseUrl(newUrl) {
  const normalized = normalizeApiUrl(newUrl);
  runtimeFallbackUrl = null;
  try {
    if (!normalized) {
      localStorage.removeItem(API_URL_STORAGE_KEY);
      Preferences.remove({ key: API_URL_STORAGE_KEY }).catch(() => {});
    } else {
      localStorage.setItem(API_URL_STORAGE_KEY, normalized);
      Preferences.set({ key: API_URL_STORAGE_KEY, value: normalized }).catch(() => {});
    }
  } catch {
    // ignore storage errors
  }
  api.defaults.baseURL = getApiBaseUrl();
  return api.defaults.baseURL;
}

/**
 * Descobre informações de túnel ativo (/tunnel-info.json) caso esteja em ambiente de desenvolvimento.
 */
export async function discoverTunnelInfo() {
  try {
    const res = await fetch('/tunnel-info.json?t=' + Date.now(), {
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.apiTunnelUrl) {
        cachedTunnelInfo = data;
        return data;
      }
    }
  } catch {
    // ignore
  }
  return cachedTunnelInfo;
}

export function getCachedTunnelInfo() {
  return cachedTunnelInfo;
}

/**
 * Resolve URLs de mídia retornadas pelo backend (ex: "/uploads/imagem.jpg").
 */
export function resolveMediaUrl(pathOrUrl) {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('data:')) {
    return pathOrUrl;
  }
  const base = getApiBaseUrl();
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${normalizedPath}`;
}

// 1. Instância do Axios apontando por padrão para a URL pública da nuvem
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Cache em memória sincronizado com Capacitor Preferences (SharedPreferences no Android) e localStorage
let memoryToken = null;
try {
  memoryToken = localStorage.getItem(TOKEN_KEY);
} catch {
  memoryToken = null;
}

export const AuthStorage = {
  init: async () => {
    try {
      await discoverTunnelInfo();
      const savedApiUrl = await Preferences.get({ key: API_URL_STORAGE_KEY });
      if (savedApiUrl?.value && !localStorage.getItem(API_URL_STORAGE_KEY)) {
        localStorage.setItem(API_URL_STORAGE_KEY, normalizeApiUrl(savedApiUrl.value));
      }
      api.defaults.baseURL = getApiBaseUrl();

      const { value } = await Preferences.get({ key: TOKEN_KEY });
      if (value) {
        memoryToken = value;
        localStorage.setItem(TOKEN_KEY, value);
      } else if (memoryToken) {
        await Preferences.set({ key: TOKEN_KEY, value: memoryToken });
      }
    } catch {
      // Fallback silencioso para localStorage
    }
    return memoryToken;
  },
  setToken: (token) => {
    memoryToken = token;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      Preferences.set({ key: TOKEN_KEY, value: token }).catch(() => {});
    } catch {
      // ignore
    }
  },
  getToken: () => {
    if (memoryToken) return memoryToken;
    try {
      memoryToken = localStorage.getItem(TOKEN_KEY);
    } catch {
      memoryToken = null;
    }
    return memoryToken;
  },
  clear: () => {
    memoryToken = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
      Preferences.remove({ key: TOKEN_KEY }).catch(() => {});
    } catch {
      // ignore
    }
  },
};

// 2. Interceptor de Requisição: atualiza baseURL, injeta Token JWT e garante cabeçalhos de túnel
api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    config.headers['Bypass-Tunnel-Reminder'] = 'true';
    config.headers['ngrok-skip-browser-warning'] = 'true';
    const token = AuthStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor de Resposta: padroniza mensagens de erro e faz failover automático se a nuvem ainda não foi publicada
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && url.includes('/auth/me')) {
        AuthStorage.clear();
      }
    }

    // Se a URL de nuvem padrão ainda não estiver publicada e não houver override manual,
    // tenta automaticamente o túnel ativo ou o servidor local na primeira falha de rede
    const originalConfig = error.config;
    if (
      originalConfig &&
      !originalConfig.__retriedFallback &&
      (!error.response || error.response.status >= 502) &&
      !localStorage.getItem(API_URL_STORAGE_KEY)
    ) {
      originalConfig.__retriedFallback = true;
      for (const candidate of getLocalFallbackCandidates()) {
        try {
          const probe = await axios.get(`${candidate}/`, {
            timeout: 3500,
            headers: { 'Bypass-Tunnel-Reminder': 'true' },
          });
          if (probe.data && typeof probe.data === 'object' && probe.data.message) {
            runtimeFallbackUrl = candidate;
            api.defaults.baseURL = candidate;
            originalConfig.baseURL = candidate;
            return api.request(originalConfig);
          }
        } catch {
          // tenta próximo candidato
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Verifica conectividade real com a API IBPJ (Nuvem Produção, Túnel HTTPS ou Local).
 */
export async function checkApiHealth() {
  await discoverTunnelInfo();
  const activeUrl = getApiBaseUrl();
  try {
    const response = await api.get('/', {
      timeout: 7000,
      headers: {
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    const isValidJson =
      response.data &&
      typeof response.data === 'object' &&
      typeof response.data.message === 'string';

    if (!isValidJson) {
      return {
        online: false,
        baseUrl: getApiBaseUrl(),
        cloudDefaultUrl: normalizeApiUrl(CLOUD_PRODUCTION_API_URL),
        isSecure: getApiBaseUrl().startsWith('https://'),
        tunnelInfo: cachedTunnelInfo,
        error: 'O endereço respondeu, mas não retornou JSON válido da API IBPJ.',
      };
    }

    if (response.data?.tunnel?.apiTunnelUrl) {
      cachedTunnelInfo = response.data.tunnel;
    }

    const finalUrl = getApiBaseUrl();
    return {
      online: true,
      baseUrl: finalUrl,
      cloudDefaultUrl: normalizeApiUrl(CLOUD_PRODUCTION_API_URL),
      isSecure: finalUrl.startsWith('https://'),
      tunnelInfo: cachedTunnelInfo,
      data: response.data,
    };
  } catch (error) {
    return {
      online: false,
      baseUrl: activeUrl,
      cloudDefaultUrl: normalizeApiUrl(CLOUD_PRODUCTION_API_URL),
      isSecure: activeUrl.startsWith('https://'),
      tunnelInfo: cachedTunnelInfo,
      error: error.response?.status
        ? `HTTP ${error.response.status} (${error.message})`
        : error.message || 'Servidor inacessível',
    };
  }
}
