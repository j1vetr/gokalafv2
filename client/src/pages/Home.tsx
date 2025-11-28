import { Button } from "@/components/ui/button";
import { ArrowRight, Check, TrendingUp, Zap, Trophy, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  return (
    <div className="overflow-hidden bg-[#050505]">
      {/* HERO SECTION - KEPT AS IS */}
      <section ref={ref} className="relative min-h-[100svh] flex flex-col lg:flex-row items-center pt-20 lg:pt-0 overflow-hidden">
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] lg:w-[50vw] lg:h-[50vw] bg-primary/15 rounded-full blur-[100px] animate-pulse duration-[8s]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] lg:w-[40vw] lg:h-[40vw] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] lg:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative h-full flex flex-col lg:flex-row lg:items-center">
          
          {/* CONTENT STACK FOR MOBILE: Text -> Image -> Buttons */}
          
          {/* 1. TEXT CONTENT */}
          <div className="lg:w-1/2 relative z-30 text-center lg:text-left pt-8 lg:pt-0 order-1 lg:order-1 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 mx-auto lg:mx-0 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]"></span>
                <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Online Koçluk</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-heading font-bold leading-[0.9] tracking-tighter uppercase text-white drop-shadow-2xl mb-4">
                Sınırları <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#eaff80] to-primary text-glow">Yok Et</span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto lg:mx-0 leading-relaxed font-light mb-6 lg:mb-8">
                Bilimsel veriler, kişiselleştirilmiş stratejiler ve disiplinli takip sistemiyle potansiyelini açığa çıkar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                <Link href="/packages">
                  <Button className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase tracking-wide text-lg h-14 px-8 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all">
                    Hemen Başla
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button variant="outline" className="w-full sm:w-auto border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white text-lg h-14 px-8 uppercase font-bold">
                    Ücretsiz Analiz
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* 2. IMAGE (Mobile Optimized) */}
          <div className="lg:w-1/2 relative h-[50vh] lg:h-screen order-2 lg:order-2 flex items-end justify-center lg:justify-end mt-8 lg:mt-0 overflow-visible pointer-events-none">
             {/* Glow behind image */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] lg:w-[500px] lg:h-[500px] bg-gradient-to-t from-primary/20 to-transparent blur-[60px] lg:blur-[100px] rounded-full opacity-60"></div>
             
             <motion.img 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               src="https://www.gokalaf.com/wp-content/uploads/2025/05/53e0affa-b231-4296-b408-d66a1f4ff838-min.png" 
               alt="Gokalaf" 
               className="relative z-10 h-full max-h-[50vh] lg:max-h-[90vh] w-auto object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
             />
             
             {/* Floating Stats (Hidden on very small screens, visible on md+) */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.8 }}
               className="absolute top-1/4 right-0 lg:right-12 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl z-20 hidden md:block"
             >
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold">
                   <Trophy size={20} />
                 </div>
                 <div>
                   <div className="text-2xl font-heading font-bold text-white">500+</div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-wider">Dönüşüm</div>
                 </div>
               </div>
             </motion.div>
          </div>

        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2 z-20 hidden lg:flex"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Aşağı Kaydır</span>
          <ChevronRight className="rotate-90 w-4 h-4" />
        </motion.div>
      </section>

      {/* SYSTEM / PILLARS SECTION - SIMPLIFIED */}
      <section className="py-20 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-4">
               Sistem Nasıl <span className="text-primary">İşler?</span>
             </h2>
             <p className="text-gray-400 text-lg">
               Karmaşık diyetler veya işe yaramayan programlar yok. Sadece sonuç odaklı, bilimsel bir süreç.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {[
               { 
                 icon: <Zap size={32} />, 
                 title: "Antrenman", 
                 desc: "Senin anatomine, geçmişine ve hedeflerine göre dizayn edilmiş, bilimsel antrenman periyotlaması." 
               },
               { 
                 icon: <TrendingUp size={32} />, 
                 title: "Beslenme", 
                 desc: "Sürdürülebilir, yasaksız ve makro takibine dayalı esnek beslenme stratejisi." 
               },
               { 
                 icon: <MessageCircle size={32} />, 
                 title: "İletişim", 
                 desc: "WhatsApp üzerinden 7/24 soru-cevap, haftalık form kontrolleri ve sürekli motivasyon." 
               }
             ].map((item, i) => (
               <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors text-center group">
                 <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                   {item.icon}
                 </div>
                 <h3 className="text-xl font-heading font-bold uppercase text-white mb-3">{item.title}</h3>
                 <p className="text-gray-400 leading-relaxed">
                   {item.desc}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* MINIMAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase text-white mb-6">
             Hazır Mısın?
           </h2>
           <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
             En iyi versiyonuna ulaşmak için tek yapman gereken ilk adımı atmak.
           </p>
           <Link href="/packages">
             <Button className="h-16 px-12 text-xl font-bold uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all hover:scale-105">
               Planı Seç ve Başla <ArrowRight className="ml-2" />
             </Button>
           </Link>
        </div>
      </section>

    </div>
  );
}
