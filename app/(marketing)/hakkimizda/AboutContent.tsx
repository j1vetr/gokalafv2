'use client';

import Link from 'next/link';
import { ArrowRight, Trophy, Target, Award, Star, Users } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function AboutContent() {
  const stats = [
    { value: '4+', label: 'Yıl Deneyim', icon: <Award className="w-6 h-6" /> },
    { value: '500+', label: 'Danışan', icon: <Users className="w-6 h-6" /> },
    { value: '2021', label: 'Türkiye Şampiyonu', icon: <Trophy className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://www.gokalaf.com/wp-content/uploads/2023/02/PXL0024-scaled-1.jpg"
            alt="Gokalaf Training"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center mt-20">
          <h2 className="text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base">
            Profesyonel Koçluk
          </h2>
          <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase text-white mb-6 tracking-tighter drop-shadow-2xl">
            Gokalaf
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            &quot;Amacım sadece sana bir antrenman programı vermek değil; vücudunu tanımanı, sınırlarını
            zorlamanı ve disiplini bir yaşam tarzı haline getirmeni sağlamak.&quot;
          </p>
        </div>
      </section>

      {/* BIO SECTION */}
      <section className="pt-8 pb-20 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src="/goktug-alaf.jpg"
                  alt="Göktuğ Alaf"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <div className="text-white text-xl font-bold uppercase mb-1">Göktuğ Alaf</div>
                  <div className="text-primary font-medium uppercase tracking-wider text-xs">
                    Head Coach & Founder
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-primary opacity-50"></div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-primary opacity-50"></div>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase text-white mb-6">
                  Potansiyelini <span className="text-primary">Keşfet</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                  <p>
                    16 yaşında çelimsiz görüntümü değiştirmek için başladığım bu süreç, her geçen yıl
                    gelişmenin verdiği özgüven ve görünümle hayatımdaki en büyük tutkum oldu. Tutkuya
                    dönüşmesiyle beraber Elektronik Mühendisliği okuduğum yıllarda kendimi güncel, bilime
                    dayalı kaynak ve kanallardan eğittim.
                  </p>
                  <p>
                    2021 Yılında Türkiye Genç Erkek Klasik Fizik kategorisinde şampiyon olup, bir atlet
                    olarak kariyerimi başlattım ve yurt dışından profesyonel koçlar ile çalışmaya
                    başladım.
                  </p>
                  <p>
                    Aldığım ve almakta olduğum eğitim ve hizmetleri en iyi şekilde yorumlayıp, yüzlerce
                    kişiye istekleri ve ihtiyaçlarını doğrultusunda aktardım. Hala da aktarmaya devam
                    ediyorum. Bir atlet ve antrenör olarak uzun yıllar buradayım.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                  >
                    <div className="text-primary mb-2 flex justify-center">{stat.icon}</div>
                    <div className="text-2xl md:text-3xl font-heading font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/gokalaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  <InstagramIcon className="w-5 h-5 text-primary" />
                  <span className="text-white text-sm">Instagram</span>
                </a>
                <a
                  href="https://youtube.com/@gokalaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  <YoutubeIcon className="w-5 h-5 text-primary" />
                  <span className="text-white text-sm">YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-6">
            Hazırsan <span className="text-primary">Başlayalım</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Hedeflerine ulaşmak için profesyonel rehberlik al. İlk adımı bugün at.
          </p>
          <Link href="/paketler">
            <button className="inline-flex items-center gap-3 h-14 px-10 bg-primary text-black font-heading font-bold uppercase tracking-wide rounded-md shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.5)] transition-all hover:scale-105">
              Paketleri İncele <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
