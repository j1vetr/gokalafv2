import { Metadata } from 'next';
import Script from 'next/script';
import { ToolsContent } from './ToolsContent';

export const metadata: Metadata = {
  title: 'Fitness Hesaplayıcıları | Ücretsiz Araçlar',
  description: 'Ücretsiz fitness hesaplayıcıları: VKİ (BMI), kalori, TDEE, makro, ideal kilo, vücut yağı oranı ve daha fazlası. Bilimsel hesaplayıcılarla hedeflerine ulaş.',
  keywords: ['BMI hesaplama', 'VKİ hesaplama', 'kalori hesaplama', 'TDEE hesaplama', 'makro hesaplama', 'fitness araçları', 'vücut kitle indeksi', 'ideal kilo hesaplama', 'vücut yağ oranı'],
  alternates: {
    canonical: 'https://gokalaf.com/araclar',
  },
  openGraph: {
    title: 'Fitness Hesaplayıcıları | Ücretsiz Araçlar | Gokalaf',
    description: 'Ücretsiz fitness hesaplayıcıları: VKİ, kalori, TDEE, makro ve daha fazlası.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com/araclar',
    images: [
      {
        url: '/opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Gokalaf Fitness Hesaplayıcıları',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitness Hesaplayıcıları | Ücretsiz Araçlar',
    description: 'Ücretsiz fitness hesaplayıcıları ile hedeflerine ulaş.',
    images: ['/opengraph.jpg'],
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Gokalaf Fitness Hesaplayıcıları',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'TRY',
  },
  description: 'Ücretsiz online fitness hesaplayıcıları: VKİ, kalori, TDEE, makro hesaplama araçları',
  url: 'https://gokalaf.com/araclar',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'VKİ (Vücut Kitle İndeksi) nasıl hesaplanır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VKİ, kilonuzun (kg) boyunuzun karesine (m²) bölünmesiyle hesaplanır. VKİ = Kilo / (Boy x Boy). Örneğin, 70 kg ağırlığında ve 1.75 m boyunda birinin VKİsi 22.9 olur.',
      },
    },
    {
      '@type': 'Question',
      name: 'TDEE nedir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TDEE (Total Daily Energy Expenditure), günlük toplam enerji harcamanızdır. Bazal metabolizma hızınıza aktivite seviyeniz eklenerek hesaplanır.',
      },
    },
  ],
};

export default function ToolsPage() {
  return (
    <>
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ToolsContent />
    </>
  );
}
