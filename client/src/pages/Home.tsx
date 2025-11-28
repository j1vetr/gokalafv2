import { Button } from "@/components/ui/button";
import { ArrowRight, Check, TrendingUp, Zap, Trophy, MessageCircle, ChevronRight, Target, Activity } from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  return (
    <div className="overflow-hidden bg-[#050505]">
      {/* HERO SECTION */}
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
          
          {/* 1. TEXT CONTENT */}
          <div className="lg:w-1/2 relative z-30 text-center lg:text-left pt-8 lg:pt-0 order-1 lg:order-1 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Removed Online Koçluk Pill */}
              
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
                <Link href="/contact">
                  <Button variant="outline" className="w-full sm:w-auto border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white text-lg h-14 px-8 uppercase font-bold">
                    İletişime Geç
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* 2. IMAGE */}
          <div className="lg:w-1/2 relative h-[50vh] lg:h-screen order-2 lg:order-2 flex items-end justify-center lg:justify-end mt-8 lg:mt-0 overflow-visible pointer-events-none">
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] lg:w-[500px] lg:h-[500px] bg-gradient-to-t from-primary/20 to-transparent blur-[60px] lg:blur-[100px] rounded-full opacity-60"></div>
             
             <motion.img 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               src="https://www.gokalaf.com/wp-content/uploads/2025/05/53e0affa-b231-4296-b408-d66a1f4ff838-min.png" 
               alt="Gokalaf" 
               className="relative z-10 h-full max-h-[50vh] lg:max-h-[90vh] w-auto object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
             />
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

      {/* SYSTEM / PILLARS SECTION - REDESIGNED FOR WOW FACTOR */}
      <section className="py-32 bg-[#080808] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-4xl mx-auto text-center mb-24">
             <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase text-white mb-6 tracking-tighter">
               Sistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Nasıl İşler?</span>
             </h2>
             <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto">
               Başarı şansa bırakılmaz. Bilimsel döngü, sürekli analiz ve mükemmel sonuç.
             </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
             {/* Connecting Line (Desktop only) */}
             <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0"></div>

             {[
               { 
                 step: "01",
                 icon: <Activity size={40} />, 
                 title: "Analiz & Planlama", 
                 desc: "Detaylı anamnez formu ile metabolik durumun, yaşam tarzın ve hedeflerin analiz edilir. Sana özel yol haritası çizilir." 
               },
               { 
                 step: "02",
                 icon: <Target size={40} />, 
                 title: "Uygulama & Takip", 
                 desc: "Antrenman ve beslenme programın başlar. Haftalık check-inler ve video analizlerle formun sürekli kontrol altında tutulur." 
               },
               { 
                 step: "03",
                 icon: <Trophy size={40} />, 
                 title: "Optimizasyon & Sonuç", 
                 desc: "Vücudunun verdiği tepkilere göre program revize edilir. Plato çizmeden, sürekli gelişim ve hedefe ulaşım sağlanır." 
               }
             ].map((item, i) => (
               <div key={i} className="relative z-10 group">
                 <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-all duration-500 h-full relative overflow-hidden hover:-translate-y-2 shadow-2xl">
                   {/* Background Gradient on Hover */}
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   
                   <div className="flex justify-between items-start mb-8 relative">
                     <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                       {item.icon}
                     </div>
                     <span className="text-6xl font-heading font-bold text-white/5 group-hover:text-primary/20 transition-colors select-none">{item.step}</span>
                   </div>
                   
                   <h3 className="text-2xl font-heading font-bold uppercase text-white mb-4 group-hover:text-primary transition-colors relative">{item.title}</h3>
                   <p className="text-gray-400 leading-relaxed relative">
                     {item.desc}
                   </p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* MINIMAL CTA SECTION */}
      <section className="py-32 relative overflow-hidden flex items-center justify-center bg-[#050505]">
        <div className="absolute inset-0 bg-primary/5 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase text-white mb-8 tracking-tighter">
             Hazır Mısın?
           </h2>
           <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 font-light">
             En iyi versiyonuna ulaşmak için tek yapman gereken ilk adımı atmak.
           </p>
           <Link href="/packages">
             <Button className="h-20 px-16 text-2xl font-heading font-bold uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_40px_rgba(204,255,0,0.4)] hover:shadow-[0_0_60px_rgba(204,255,0,0.6)] transition-all hover:scale-105 rounded-none -skew-x-12">
               <span className="skew-x-12 inline-flex items-center gap-3">Planı Seç ve Başla <ArrowRight className="w-8 h-8" /></span>
             </Button>
           </Link>
        </div>
      </section>

    </div>
  );
}
