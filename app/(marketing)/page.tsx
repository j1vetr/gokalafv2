import { Metadata } from 'next';
import { HomeContent } from './HomeContent';

export const metadata: Metadata = {
  title: 'Gokalaf - Online Fitness Koçluğu | Hedef Değil, Sistem',
  description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş. Bilimsel veriler, kişiselleştirilmiş stratejiler ve disiplinli takip sistemiyle potansiyelini açığa çıkar.',
  keywords: ['fitness koçluğu', 'online personal trainer', 'kişisel antrenman', 'beslenme programı', 'vücut geliştirme'],
  openGraph: {
    title: 'Gokalaf - Online Fitness Koçluğu',
    description: 'Hedef Değil, Sistem. Kişiye özel antrenman ve beslenme programları.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com',
  },
};

export default function HomePage() {
  return <HomeContent />;
}
