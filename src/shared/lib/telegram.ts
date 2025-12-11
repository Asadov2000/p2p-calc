type WebAppType = {
  isExpanded?: boolean;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  showAlert?: (text: string) => void;
  openTelegramLink?: (url: string) => void;
  HapticFeedback?: {
    impactOccurred?: (style: string) => void;
    notificationOccurred?: (type: string) => void;
    selectionChanged?: () => void;
  };
};

const getWebApp = (): WebAppType | null => {
  try {
    const tg = (window as any).Telegram;
    if (!tg || !tg.WebApp) return null;
    return tg.WebApp as WebAppType;
  } catch (e) {
    return null;
  }
};

export const safeTelegram = {
  ready: () => {
    try { const w = getWebApp(); w?.ready?.(); } catch (e) {}
  },
  expand: () => { try { const w = getWebApp(); w?.expand?.(); } catch (e) {} },
  close: () => { try { const w = getWebApp(); w?.close?.(); } catch (e) {} },
  showAlert: (text: string) => { try { const w = getWebApp(); w?.showAlert?.(text); } catch (e) { alert(text); } },
  openTelegramLink: (url: string) => { try { const w = getWebApp(); w?.openTelegramLink?.(url); } catch (e) { window.open(url, '_blank'); } },
  haptic: {
    impactOccurred: (style: 'light'|'medium'|'heavy' = 'medium') => { try { const w = getWebApp(); w?.HapticFeedback?.impactOccurred?.(style); } catch (e) {} },
    notificationOccurred: (type: 'success'|'error'|'warning' = 'success') => { try { const w = getWebApp(); w?.HapticFeedback?.notificationOccurred?.(type); } catch (e) {} },
    selectionChanged: () => { try { const w = getWebApp(); w?.HapticFeedback?.selectionChanged?.(); } catch (e) {} }
  }
};

export default getWebApp;
