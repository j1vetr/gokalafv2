'use client';

import Link from 'next/link';
import { Calculator, Activity, Flame, Target, Scale, Droplets, Heart, Dumbbell, Timer, Beef } from 'lucide-react';

const tools = [
  {
    title: 'VKİ Hesaplayıcı',
    description: 'Vücut Kitle İndeksini hesapla ve sağlık durumunu öğren.',
    icon: <Scale className="w-8 h-8" />,
    href: '/araclar/vki',
    color: 'from-blue-500/20 to-blue-600/20',
  },
  {
    title: 'Kalori Hesaplayıcı',
    description: 'Günlük kalori ihtiyacını hesapla.',
    icon: <Flame className="w-8 h-8" />,
    href: '/araclar/kalori',
    color: 'from-orange-500/20 to-red-500/20',
  },
  {
    title: 'TDEE Hesaplayıcı',
    description: 'Toplam günlük enerji harcamanı öğren.',
    icon: <Activity className="w-8 h-8" />,
    href: '/araclar/tdee',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    title: 'Makro Hesaplayıcı',
    description: 'Protein, karbonhidrat ve yağ ihtiyacını hesapla.',
    icon: <Target className="w-8 h-8" />,
    href: '/araclar/makro',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    title: 'İdeal Kilo Hesaplayıcı',
    description: 'Boy ve yaşına göre ideal kilonu öğren.',
    icon: <Calculator className="w-8 h-8" />,
    href: '/araclar/ideal-kilo',
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    title: 'Vücut Yağı Hesaplayıcı',
    description: 'Vücut yağ oranını hesapla.',
    icon: <Scale className="w-8 h-8" />,
    href: '/araclar/vucut-yagi',
    color: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    title: '1RM Hesaplayıcı',
    description: 'Maksimum kaldırabileceğin ağırlığı hesapla.',
    icon: <Dumbbell className="w-8 h-8" />,
    href: '/araclar/bir-tekrar-max',
    color: 'from-red-500/20 to-rose-500/20',
  },
  {
    title: 'Su Tüketimi Hesaplayıcı',
    description: 'Günlük su ihtiyacını öğren.',
    icon: <Droplets className="w-8 h-8" />,
    href: '/araclar/su-tuketimi',
    color: 'from-sky-500/20 to-cyan-500/20',
  },
  {
    title: 'Kalp Atış Bölgeleri',
    description: 'Antrenman için hedef kalp atış hızını hesapla.',
    icon: <Heart className="w-8 h-8" />,
    href: '/araclar/kalp-atisi',
    color: 'from-rose-500/20 to-pink-500/20',
  },
  {
    title: 'Protein İhtiyacı',
    description: 'Günlük protein ihtiyacını hesapla.',
    icon: <Beef className="w-8 h-8" />,
    href: '/araclar/protein',
    color: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    title: 'Dinlenme Süresi',
    description: 'Setler arası ideal dinlenme süresini öğren.',
    icon: <Timer className="w-8 h-8" />,
    href: '/araclar/dinlenme',
    color: 'from-indigo-500/20 to-violet-500/20',
  },
];

export function ToolsContent() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
            Ücretsiz Araçlar
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase text-white mb-4 tracking-tighter">
            Fitness <span className="text-primary">Hesaplayıcıları</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hedeflerine ulaşmak için bilimsel hesaplayıcıları kullan. Tüm araçlar tamamen ücretsiz.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <div className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                    {tool.icon}
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 mb-6">
            Daha kişiselleştirilmiş bir yaklaşım için profesyonel koçluk al.
          </p>
          <Link href="/paketler">
            <button className="h-14 px-10 bg-primary text-black font-heading font-bold uppercase tracking-wide rounded-md shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.5)] transition-all hover:scale-105">
              Paketleri İncele
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
