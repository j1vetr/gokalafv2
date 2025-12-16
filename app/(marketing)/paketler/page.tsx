import { Metadata } from 'next';
import { PackagesContent } from './PackagesContent';

export const metadata: Metadata = {
  title: 'Koçluk Paketleri | Online Fitness Programları',
  description: 'Kişiye özel online fitness koçluk paketleri. 8, 12, 16 veya 24 haftalık programlarla hedeflerine ulaş. Antrenman, beslenme ve 7/24 destek.',
  keywords: ['fitness paketleri', 'online koçluk', 'antrenman programı', 'beslenme programı', 'personal trainer fiyat'],
  openGraph: {
    title: 'Koçluk Paketleri | Online Fitness Programları | Gokalaf',
    description: 'Kişiye özel online fitness koçluk paketleri. Hedeflerine profesyonel rehberlikle ulaş.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com/paketler',
  },
};

export default function PackagesPage() {
  return <PackagesContent />;
}
