import { Metadata } from 'next';
import Script from 'next/script';
import { HomeContent } from './HomeContent';

export const metadata: Metadata = {
  title: 'Gokalaf - Online Fitness Koçluğu | Hedef Değil, Sistem',
  description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş. Bilimsel veriler, kişiselleştirilmiş stratejiler ve disiplinli takip sistemiyle potansiyelini açığa çıkar.',
  keywords: ['fitness koçluğu', 'online personal trainer', 'kişisel antrenman', 'beslenme programı', 'vücut geliştirme', 'online PT', 'fitness koçu'],
  alternates: {
    canonical: 'https://gokalaf.com',
  },
  openGraph: {
    title: 'Gokalaf - Online Fitness Koçluğu | Hedef Değil, Sistem',
    description: 'Hedef Değil, Sistem. Kişiye özel antrenman ve beslenme programları ile potansiyelini açığa çıkar.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com',
    images: [
      {
        url: '/opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Gokalaf - Online Fitness Koçluğu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gokalaf - Online Fitness Koçluğu | Hedef Değil, Sistem',
    description: 'Hedef Değil, Sistem. Kişiye özel antrenman ve beslenme programları.',
    images: ['/opengraph.jpg'],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gokalaf',
  url: 'https://gokalaf.com',
  logo: 'https://gokalaf.com/images/logo.webp',
  description: 'Profesyonel online fitness ve vücut geliştirme koçluğu',
  founder: {
    '@type': 'Person',
    name: 'Göktuğ Alaf',
  },
  sameAs: [
    'https://instagram.com/gokalaf',
    'https://youtube.com/@gokalaf',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Turkish',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Gokalaf',
  url: 'https://gokalaf.com',
  description: 'Online Fitness Koçluğu - Kişiye özel antrenman ve beslenme programları',
  inLanguage: 'tr-TR',
};

export default function HomePage() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeContent />
    </>
  );
}
