import { Metadata } from 'next';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: 'Göktuğ Alaf Kimdir? | Online Fitness Koçu',
  description: 'Göktuğ Alaf - Profesyonel online fitness ve vücut geliştirme koçu. 4+ yıllık deneyim, yüzlerce başarılı dönüşüm hikayesi. Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş.',
  keywords: ['Göktuğ Alaf', 'Gokalaf', 'online fitness koçu', 'vücut geliştirme koçu', 'personal trainer', 'kişisel antrenör'],
  openGraph: {
    title: 'Göktuğ Alaf Kimdir? | Online Fitness Koçu | Gokalaf',
    description: 'Profesyonel online fitness ve vücut geliştirme koçu. Kişiye özel antrenman ve beslenme programları.',
    type: 'profile',
    locale: 'tr_TR',
    url: 'https://gokalaf.com/hakkimizda',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
