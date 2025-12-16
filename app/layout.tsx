import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gokalaf.com'),
  title: {
    default: 'Gokalaf - Online Fitness Koçluğu',
    template: '%s | Gokalaf',
  },
  description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş. Profesyonel online fitness koçluğu.',
  keywords: ['fitness', 'koçluk', 'antrenman', 'beslenme', 'online fitness', 'personal trainer', 'vücut geliştirme', 'diyet'],
  authors: [{ name: 'Göktuğ Alaf', url: 'https://gokalaf.com' }],
  creator: 'Gokalaf',
  publisher: 'Gokalaf',
  alternates: {
    canonical: 'https://gokalaf.com',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com',
    siteName: 'Gokalaf',
    title: 'Gokalaf - Online Fitness Koçluğu',
    description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş.',
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
    title: 'Gokalaf - Online Fitness Koçluğu',
    description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş.',
    images: ['/opengraph.jpg'],
    creator: '@gokalaf',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}
