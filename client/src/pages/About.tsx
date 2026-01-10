import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Trophy, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

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

function KickIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256S397.385 0 256 0zm-82.95 358.026h-48.07V153.974h48.07v76.308l67.418-76.308h57.864l-76.65 85.13 82.98 119.922h-59.442l-55.726-85.13-16.444 17.514v67.616z"/>
    </svg>
  );
}

export default function About() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Göktuğ Alaf",
    "alternateName": "Gokalaf",
    "jobTitle": "Online Fitness ve Vücut Geliştirme Koçu",
    "description": "Profesyonel online fitness ve vücut geliştirme koçu. Kişiye özel antrenman ve beslenme programları ile yüzlerce danışana rehberlik.",
    "url": "https://gokalaf.com/hakkimizda",
    "image": "https://gokalaf.com/goktug-alaf.jpg",
    "sameAs": [
      "https://instagram.com/gokalaf",
      "https://youtube.com/@gokalaf",
      "https://kick.com/gokalaf"
    ]
  };

  return (
    <>
      <SEO
        title="Göktuğ Alaf Kimdir? | Online Fitness Koçu | Gokalaf"
        description="Göktuğ Alaf - Profesyonel online fitness ve vücut geliştirme koçu. 4+ yıllık deneyim, yüzlerce başarılı dönüşüm hikayesi. Kişiye özel antrenman ve beslenme programları ile hedeflerine ulaş."
        keywords="Göktuğ Alaf, Gokalaf, online fitness koçu, vücut geliştirme koçu, personal trainer, kişisel antrenör, fitness koçluğu, beslenme koçu, online PT, spor koçu"
        canonical="/hakkimizda"
        schema={aboutSchema}
      />
      <div className="min-h-screen bg-[#050505]">
      
        {/* IMMERSIVE HERO */}
      <section className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://www.gokalaf.com/wp-content/uploads/2023/02/PXL0024-scaled-1.jpg" 
            alt="Hakkımızda" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase mb-2 text-xs md:text-sm">Profesyonel Koçluk</h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white mb-4 tracking-tighter drop-shadow-2xl">
              Hakkımızda
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed font-light">
              "Amacım sadece sana bir antrenman programı vermek değil; vücudunu tanımanı, sınırlarını zorlamanı ve disiplini bir yaşam tarzı haline getirmeni sağlamak."
            </p>
          </motion.div>
        </div>
      </section>

      {/* BIO & STATS SECTION */}
      <section className="py-10 md:py-14 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
            <div className="relative max-w-xs mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-xl group">
                <img 
                  src="/goktug-alaf.jpg" 
                  alt="Göktuğ Alaf" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                   <div className="text-white text-base font-bold uppercase mb-0.5">Göktuğ Alaf</div>
                   <div className="text-primary font-medium uppercase tracking-wider text-[10px]">Head Coach & Founder</div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-primary opacity-50"></div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-primary opacity-50"></div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-3">
                  Potansiyelini <span className="text-primary">Keşfet</span>
                </h2>
                <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
                  <p>
                    16 yaşında çelimsiz görüntümü değiştirmek için başladığım bu süreç, her geçen yıl gelişmenin verdiği özgüven ve görünümle hayatımdaki en büyük tutkum oldu. Tutkuya dönüşmesiyle beraber Elektronik Mühendisliği okuduğum yıllarda kendimi güncel, bilime dayalı kaynak ve kanallardan eğittim.
                  </p>
                  <p>
                    2021 Yılında Türkiye Genç Erkek Klasik Fizik kategorisinde şampiyon olup, bir atlet olarak kariyerimi başlattım ve yurt dışından profesyonel koçlar ile çalışmaya başladım.
                  </p>
                  <p>
                    Aldığım ve almakta olduğum eğitim ve hizmetleri en iyi şekilde yorumlayıp, yüzlerce kişiye istekleri ve ihtiyaçlarını doğrultusunda aktardım. Bir atlet ve antrenör olarak uzun yıllar buradayım.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/paketler">
                  <Button className="h-11 px-6 text-sm font-bold uppercase bg-white text-black hover:bg-gray-200 rounded-none">
                    Benimle Çalış <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Takip Et:</span>
                  <a href="https://www.instagram.com/gokalaf/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a href="https://www.youtube.com/gokalaf" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white hover:border-transparent transition-all">
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                  <a href="https://kick.com/gokalaf/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-transparent transition-all">
                    <KickIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS & ACHIEVEMENTS */}
      <section className="py-12 md:py-16 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-2">Deneyim & Başarılar</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
              Yılların deneyimi ve kanıtlanmış sonuçlar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { value: "6+", label: "Yıl Deneyim", desc: "Aktif koçluk" },
              { value: "1000+", label: "Mutlu Danışan", desc: "Başarılı dönüşüm" },
              { value: "100%", label: "Kişiye Özel", desc: "Bireysel programlar" },
              { value: "7/24", label: "Destek", desc: "WhatsApp iletişim" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#050505] border border-white/10 rounded-xl p-4 text-center hover:border-primary/30 transition-colors">
                <div className="text-2xl md:text-3xl font-heading font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-white text-sm font-medium">{stat.label}</div>
                <div className="text-gray-500 text-xs">{stat.desc}</div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Sertifikalar & Eğitimler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "6+ Yıllık Aktif Koçluk Deneyimi",
                "Uluslararası Koçlardan Profesyonel Eğitim",
                "Bilime Dayalı Beslenme ve Antrenman Metodolojisi",
                "1000+ Başarılı Dönüşüm Hikayesi"
              ].map((cert, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-gray-300 text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY CARDS - REDESIGNED */}
      <section className="py-12 md:py-16 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-2">Koçluk Felsefem</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
              Başarı tesadüf değildir. Doğru planlama, istikrar ve bilimin birleşimidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: "Performans", icon: <Trophy size={24} />, desc: "Sadece estetik değil, fonksiyonel güç ve dayanıklılık. Hayatın her alanında daha güçlü olman için çalışıyoruz." },
              { title: "Disiplin", icon: <Target size={24} />, desc: "Motivasyon geçicidir, disiplin kalıcı. Seni hedeflerine ulaştıracak alışkanlıkları birlikte inşa ediyoruz." },
              { title: "Sürdürülebilirlik", icon: <Zap size={24} />, desc: "Kısa süreli şok diyetler değil, ömür boyu uygulayabileceğin, seninle yaşayan esnek bir sistem." }
            ].map((item, i) => (
              <div key={i} className="group bg-[#050505] border border-white/10 p-6 rounded-2xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>
                
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-heading font-bold uppercase text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3 group-hover:border-primary/20 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>
    </>
  );
}
