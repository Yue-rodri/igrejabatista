import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Inicializa barra de status e splash screen no Android nativo.
 */
export async function initNativeShell() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#001B30' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    // Ignora se indisponível
  }
  try {
    await SplashScreen.hide();
  } catch {
    // Ignora se indisponível
  }
}

/**
 * Compartilhamento nativo Android (com fallback para Web Share API ou área de transferência).
 */
export async function shareContent({ title, text, url }) {
  try {
    const canShare = await Share.canShare();
    if (canShare.value) {
      await Share.share({
        title: title || 'IBPJ — Igreja Batista do Parque Jandaia',
        text: text || '',
        url: url || undefined,
        dialogTitle: 'Compartilhar via',
      });
      return { shared: true, method: 'native' };
    }
  } catch (err) {
    if (err?.message?.includes('canceled') || err?.message?.includes('cancelled')) {
      return { shared: false, cancelled: true };
    }
  }

  // Fallback para cópia na área de transferência
  const fullText = [title, text, url].filter(Boolean).join('\n');
  const copied = await copyToClipboard(fullText);
  return { shared: copied, method: 'clipboard' };
}

/**
 * Copia texto para a área de transferência com fallback seguro para WebView.
 */
export async function copyToClipboard(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback abaixo
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Abre o endereço da Igreja Batista do Parque Jandaia no app de Mapas do Android ou Google Maps.
 */
export function openChurchLocationInMaps() {
  const query = encodeURIComponent('Rua Walderez Perez Xavier Giorgi, Parque Jandaia, Carapicuíba - SP');
  const coords = '-23.5583706,-46.8261038';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords}&query_place_id=${query}`;
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
}
