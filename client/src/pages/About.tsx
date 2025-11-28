import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Trophy, Target, Zap, User, Award, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505]">
      
      {/* IMMERSIVE HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base">Profesyonel Koçluk</h2>
            <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase text-white mb-6 tracking-tighter drop-shadow-2xl">
              Gokalaf
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              "Amacım sadece sana bir antrenman programı vermek değil; vücudunu tanımanı, sınırlarını zorlamanı ve disiplini bir yaşam tarzı haline getirmeni sağlamak."
            </p>
          </motion.div>
        </div>
      </section>

      {/* BIO & STATS SECTION */}
      <section className="py-20 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <img 
                  src="https://www.gokalaf.com/wp-content/uploads/2023/02/PXL0049-scaled-1.jpg" 
                  alt="Gokalaf Portrait" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                   <div className="text-white text-2xl font-bold uppercase mb-1">Gökhan Kalafatoğlu</div>
                   <div className="text-primary font-medium uppercase tracking-wider text-sm">Head Coach & Founder</div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary opacity-50"></div>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase text-white mb-6">
                  Potansiyelini <span className="text-primary">Keşfet</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                  <p>
                    16 yaşında çelimsiz görüntümü değiştirmek için başladığım bu süreç, her geçen yıl gelişmenin verdiği özgüven ve görünümle hayatımdaki en büyük tutkum oldu. Tutkuya dönüşmesiyle beraber Elektronik Mühendisliği okuduğum yıllarda kendimi güncel, bilime dayalı kaynak ve kanallardan eğittim. Son sınıf öğrencisi olduğumda alt yapımın verdiği özgüven ve vücut geliştirme tutkum neticesinde insanlara yardım etmeye ve aynı zamanda sosyal medyaya içerik üreticiliğine başladım.
                  </p>
                  <p>
                    2021 Yılında Türkiye Genç Erkek Klasik Fizik kategorisinde şampiyon olup, bir atlet olarak kariyerimi başlattım ve yurt dışından profesyonel koçlar ile çalışmaya başladım.
                  </p>
                  <p>
                    Aldığım ve almakta olduğum eğitim ve hizmetleri en iyi şekilde yorumlayıp, yüzlerce kişiye istekleri ve ihtiyaçlarını doğrultusunda aktardım. Hala da aktarmaya devam ediyorum. Bir atlet ve antrenör olarak uzun yıllar buradayım.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Award />, title: "Deneyim", desc: "10+ Yıllık Tecrübe" },
                  { icon: <User />, title: "Odak", desc: "Birebir İlgi" },
                  { icon: <Star />, title: "Kalite", desc: "Premium Hizmet" },
                  { icon: <Zap />, title: "Hız", desc: "Hızlı İletişim" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase text-sm mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/contact">
                <Button className="h-14 px-8 text-lg font-bold uppercase bg-white text-black hover:bg-gray-200 rounded-none">
                  Benimle Çalış <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY CARDS - REDESIGNED */}
      <section className="py-24 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase text-white mb-4">Koçluk Felsefem</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Başarı tesadüf değildir. Doğru planlama, istikrar ve bilimin birleşimidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Performans", icon: <Trophy size={32} />, desc: "Sadece estetik değil, fonksiyonel güç ve dayanıklılık. Hayatın her alanında daha güçlü olman için çalışıyoruz." },
              { title: "Disiplin", icon: <Target size={32} />, desc: "Motivasyon geçicidir, disiplin kalıcı. Seni hedeflerine ulaştıracak alışkanlıkları birlikte inşa ediyoruz." },
              { title: "Sürdürülebilirlik", icon: <Zap size={32} />, desc: "Kısa süreli şok diyetler değil, ömür boyu uygulayabileceğin, seninle yaşayan esnek bir sistem." }
            ].map((item, i) => (
              <div key={i} className="group bg-[#050505] border border-white/10 p-10 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold uppercase text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed border-t border-white/5 pt-4 group-hover:border-primary/20 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
