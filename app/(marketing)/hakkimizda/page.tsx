import { Metadata } from 'next';
import Script from 'next/script';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: 'Göktuğ Alaf Kimdir? | Online Fitness Koçu',
  description: 'Göktuğ Alaf - Profesyonel online fitness ve vücut geliştirme koçu. 4+ yıllık deneyim, yüzlerce başarılı dönüşüm hikayesi. 2021 Türkiye Genç Erkek Klasik Fizik Şampiyonu.',
  keywords: ['Göktuğ Alaf', 'Gokalaf', 'online fitness koçu', 'vücut geliştirme koçu', 'personal trainer', 'kişisel antrenör', 'fitness koçu', 'online PT'],
  alternates: {
    canonical: 'https://gokalaf.com/hakkimizda',
  },
  openGraph: {
    title: 'Göktuğ Alaf Kimdir? | Online Fitness Koçu | Gokalaf',
    description: 'Profesyonel online fitness ve vücut geliştirme koçu. 4+ yıllık deneyim, yüzlerce başarılı dönüşüm.',
    type: 'profile',
    locale: 'tr_TR',
    url: 'https://gokalaf.com/hakkimizda',
    images: [
      {
        url: '/goktug-alaf.jpg',
        width: 800,
        height: 1067,
        alt: 'Göktuğ Alaf - Online Fitness Koçu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Göktuğ Alaf Kimdir? | Online Fitness Koçu',
    description: 'Profesyonel online fitness ve vücut geliştirme koçu.',
    images: ['/goktug-alaf.jpg'],
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Göktuğ Alaf',
  alternateName: 'Gokalaf',
  jobTitle: 'Online Fitness ve Vücut Geliştirme Koçu',
  description: 'Profesyonel online fitness ve vücut geliştirme koçu. 2021 Türkiye Genç Erkek Klasik Fizik Şampiyonu.',
  url: 'https://gokalaf.com/hakkimizda',
  image: 'https://gokalaf.com/goktug-alaf.jpg',
  sameAs: [
    'https://instagram.com/gokalaf',
    'https://youtube.com/@gokalaf',
  ],
  knowsAbout: ['Fitness', 'Vücut Geliştirme', 'Beslenme', 'Antrenman Programlama'],
  award: '2021 Türkiye Genç Erkek Klasik Fizik Şampiyonu',
};

export default function AboutPage() {
  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AboutContent />
    </>
  );
}
