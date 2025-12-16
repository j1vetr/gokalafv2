'use client';

import Link from 'next/link';
import { Check, ArrowRight, Zap, Crown, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Package {
  id: number;
  name: string;
  weeks: number;
  price: string;
  features: string[];
  isActive: boolean;
}

export function PackagesContent() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        setPackages(data.filter((p: Package) => p.isActive));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getIcon = (weeks: number) => {
    if (weeks <= 8) return <Zap className="w-6 h-6" />;
    if (weeks <= 16) return <Rocket className="w-6 h-6" />;
    return <Crown className="w-6 h-6" />;
  };

  const getPopular = (weeks: number) => weeks === 12;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
            Koçluk Paketleri
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase text-white mb-4 tracking-tighter">
            Hedefe Giden <span className="text-primary">Yol</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            İhtiyacına uygun paketi seç ve dönüşümüne bugün başla.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg) => {
            const isPopular = getPopular(pkg.weeks);

            return (
              <div
                key={pkg.id}
                className={`relative bg-[#0a0a0a] border rounded-2xl p-6 transition-all duration-300 ${
                  isPopular
                    ? 'border-primary shadow-[0_0_30px_rgba(204,255,0,0.2)] scale-105'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-black text-xs font-bold uppercase rounded-full">
                    En Popüler
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isPopular ? 'bg-primary text-black' : 'bg-white/5 text-primary'
                    }`}
                  >
                    {getIcon(pkg.weeks)}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-white">{pkg.name}</h3>
                    <p className="text-gray-400 text-sm">{pkg.weeks} Hafta</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-heading font-bold text-white">{pkg.price}</span>
                  <span className="text-gray-400 ml-1">₺</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/odeme?paket=${pkg.id}`}>
                  <button
                    className={`w-full h-12 font-heading font-bold uppercase tracking-wide rounded-lg transition-all ${
                      isPopular
                        ? 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    Seç
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-white text-center mb-10">
            Tüm Paketlerde
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Kişiye özel Antrenman Programı',
              'Detaylı Beslenme Planlaması',
              'Haftalık Form Takibi',
              'Video Analizi ile Hareket Düzeltme',
              '7/24 WhatsApp İletişim',
              'Sürekli Program Güncellemesi',
              'Motivasyon ve Destek',
              'Sorularına Anında Yanıt',
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 mb-4">Sorularını sormak için</p>
          <a
            href="https://wa.me/905312822402"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            WhatsApp ile İletişime Geç
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
