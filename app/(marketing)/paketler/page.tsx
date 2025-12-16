import { Metadata } from 'next';
import Script from 'next/script';
import { PackagesContent } from './PackagesContent';

export const metadata: Metadata = {
  title: 'Koçluk Paketleri | Online Fitness Programları',
  description: 'Kişiye özel online fitness koçluk paketleri. 8, 12, 16 veya 24 haftalık programlarla hedeflerine ulaş. Antrenman, beslenme ve 7/24 WhatsApp destek.',
  keywords: ['fitness paketleri', 'online koçluk', 'antrenman programı', 'beslenme programı', 'personal trainer fiyat', 'online PT fiyat', 'fitness koçu fiyat'],
  alternates: {
    canonical: 'https://gokalaf.com/paketler',
  },
  openGraph: {
    title: 'Koçluk Paketleri | Online Fitness Programları | Gokalaf',
    description: 'Kişiye özel online fitness koçluk paketleri. 8-24 haftalık programlar.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com/paketler',
    images: [
      {
        url: '/opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Gokalaf Koçluk Paketleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koçluk Paketleri | Online Fitness Programları',
    description: 'Kişiye özel online fitness koçluk paketleri.',
    images: ['/opengraph.jpg'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Online Fitness Koçluğu',
  provider: {
    '@type': 'Person',
    name: 'Göktuğ Alaf',
    url: 'https://gokalaf.com/hakkimizda',
  },
  serviceType: 'Online Personal Training',
  description: 'Kişiye özel antrenman ve beslenme programları ile online fitness koçluğu hizmeti',
  url: 'https://gokalaf.com/paketler',
  areaServed: {
    '@type': 'Country',
    name: 'Turkey',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Koçluk Paketleri',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '8 Haftalık Program',
          description: 'Kişiye özel 8 haftalık antrenman ve beslenme programı',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '12 Haftalık Program',
          description: 'Kişiye özel 12 haftalık antrenman ve beslenme programı',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '16 Haftalık Program',
          description: 'Kişiye özel 16 haftalık antrenman ve beslenme programı',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '24 Haftalık Program',
          description: 'Kişiye özel 24 haftalık antrenman ve beslenme programı',
        },
      },
    ],
  },
};

export default function PackagesPage() {
  return (
    <>
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <PackagesContent />
    </>
  );
}
