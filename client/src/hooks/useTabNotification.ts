import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

const pageMessages: Record<string, string> = {
  '/paketler': '🛒 Paketini Seç! | Gokalaf',
  '/odeme': '⏰ Fırsatı Kaçırma! | Gokalaf',
  '/kayit': '💪 Aramıza Katıl! | Gokalaf',
};

const defaultAwayMessage = '👀 Gokalaf Seni Bekliyor!';

export function useTabNotification() {
  const [location] = useLocation();
  const originalTitle = useRef<string>('');

  useEffect(() => {
    originalTitle.current = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const awayMessage = pageMessages[location] || defaultAwayMessage;
        document.title = awayMessage;
      } else {
        document.title = originalTitle.current;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.title = originalTitle.current;
    };
  }, [location]);
}
