import { Metadata } from 'next';
import { ToolsContent } from './ToolsContent';

export const metadata: Metadata = {
  title: 'Fitness Hesaplayıcıları | Ücretsiz Araçlar',
  description: 'Ücretsiz fitness hesaplayıcıları: BMI, kalori, TDEE, makro hesaplama ve daha fazlası. Hedeflerine ulaşmak için bilimsel araçları kullan.',
  keywords: ['BMI hesaplama', 'kalori hesaplama', 'TDEE hesaplama', 'makro hesaplama', 'fitness araçları', 'vücut kitle indeksi'],
  openGraph: {
    title: 'Fitness Hesaplayıcıları | Ücretsiz Araçlar | Gokalaf',
    description: 'Ücretsiz fitness hesaplayıcıları ile hedeflerine ulaş.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com/araclar',
  },
};

export default function ToolsPage() {
  return <ToolsContent />;
}
