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
  title: {
    default: 'Gokalaf - Online Fitness Koçluğu',
    template: '%s | Gokalaf',
  },
  description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş. Profesyonel online fitness koçluğu.',
  keywords: ['fitness', 'koçluk', 'antrenman', 'beslenme', 'online fitness', 'personal trainer'],
  authors: [{ name: 'Gokalaf' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gokalaf.com',
    siteName: 'Gokalaf',
    title: 'Gokalaf - Online Fitness Koçluğu',
    description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gokalaf - Online Fitness Koçluğu',
    description: 'Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş.',
  },
  robots: {
    index: true,
    follow: true,
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
