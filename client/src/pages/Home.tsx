import { Button } from "@/components/ui/button";
import { ArrowRight, Check, TrendingUp, Zap, Trophy, MessageCircle, ChevronRight, Target, Activity, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import generatedVideo from '@assets/generated_videos/professional_gym_rack_with_dumbbells_close_up.mp4';

const transformations = [
  '/transformations/a1.jpg',
  '/transformations/b1.jpg',
  '/transformations/b2.jpg',
  '/transformations/c1.jpg',
  '/transformations/c2.jpg',
  '/transformations/d1.jpg',
  '/transformations/d2.jpg',
  '/transformations/e1.jpg',
  '/transformations/f1.jpg',
  '/transformations/g1.jpg',
  '/transformations/g2.jpg',
  '/transformations/k1.jpg',
  '/transformations/k2.jpg',
  '/transformations/l1.jpg',
  '/transformations/q1.jpg'
];

export default function Home() {
  const ref = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [currentTransformation, setCurrentTransformation] = useState(0);

  const nextTransformation = useCallback(() => {
    setCurrentTransformation((prev) => (prev + 1) % transformations.length);
  }, []);

  const prevTransformation = useCallback(() => {
    setCurrentTransformation((prev) => (prev - 1 + transformations.length) % transformations.length);
  }, []);
  
  // Cycle through steps 0 -> 1 -> 2 every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide transformations every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTransformation((prev) => (prev + 1) % transformations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          
          {/* Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen grayscale-[50%]"
          >
            <source src={generatedVideo} type="video/mp4" />
          </video>

          {/* Overlays for blending */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50"></div>
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] lg:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        </div>

        {/* TEXT CONTENT - In container */}
        <div className="container mx-auto px-4 z-20 relative lg:absolute lg:inset-0 lg:flex lg:items-center">
          <div className="lg:w-1/2 relative z-30 text-center lg:text-left pt-[12vh] sm:pt-[14vh] md:pt-[16vh] lg:pt-0 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <a 
                href="https://proteinocean.com/d/x10" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 px-6 py-4 mb-6 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 border-2 border-blue-400 rounded-2xl hover:border-blue-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="absolute -top-1 -right-1 w-16 h-16 bg-blue-500/30 rounded-full blur-xl"></div>
                
                <div className="relative z-10 flex items-center gap-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-heading font-black text-xl sm:text-2xl px-3 sm:px-4 py-2 rounded-xl shadow-lg shadow-blue-500/50 animate-pulse">
                  <span>%10 İndirim</span>
                </div>
                
                <div className="flex flex-col items-start relative z-10">
                  <span className="text-blue-200 text-sm font-medium">Proteinocean'da</span>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-xl tracking-widest px-3 py-1 bg-gradient-to-r from-primary to-[#a8e600] text-black rounded-lg shadow-lg shadow-primary/30">ALAF10</span>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center text-blue-300">
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </a>
              
              <div className="relative inline-block mb-3 lg:mb-4 p-4 sm:p-6 lg:p-8">
                {/* Rotating Border Animation */}
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <div className="absolute inset-[-50%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,transparent_60deg,#ccff00_120deg,transparent_180deg,transparent_240deg,#ccff00_300deg,transparent_360deg)]"></div>
                </div>
                <div className="absolute inset-[2px] bg-[#050505] rounded-lg"></div>
                
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[90px] font-heading font-bold leading-[1.1] tracking-tighter uppercase text-white drop-shadow-2xl relative z-10">
                  Hedef Değil <br className="hidden lg:block" />
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse"></span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#eaff80] to-primary text-glow animate-gradient-x bg-[length:200%_auto] relative z-10">Sistem</span>
                  </span>
                </h1>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-xs sm:max-w-md mx-auto lg:mx-0 leading-relaxed font-light mb-4 lg:mb-8">
                Bilimsel veriler, kişiselleştirilmiş stratejiler ve disiplinli takip sistemiyle potansiyelini açığa çıkar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                <Link href="/paketler">
                  <Button className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase tracking-wide text-base md:text-lg h-12 md:h-14 px-8 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all relative overflow-hidden group">
                    <span className="relative z-10">Hemen Başla</span>
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                    <div className="absolute inset-0 rounded-md animate-pulse-ring opacity-50 border-2 border-primary z-0"></div>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* IMAGE - Absolute positioned to section bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:right-[5%] lg:translate-x-0 z-10 flex items-end justify-center pointer-events-none w-full lg:w-auto">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-t from-primary/20 to-transparent blur-[80px] lg:blur-[100px] rounded-full opacity-60"></div>
           
           <motion.img 
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             src="/images/gokalaf.webp"
             loading="eager" 
             alt="Gokalaf" 
             className="relative z-10 h-[90vh] sm:h-[92vh] md:h-[95vh] lg:h-auto lg:max-h-[100vh] w-auto max-w-[100vw] sm:max-w-none object-contain object-bottom [filter:drop-shadow(2px_0_0_#ccff00)_drop-shadow(-2px_0_0_#ccff00)_drop-shadow(0_2px_0_#ccff00)_drop-shadow(0_-2px_0_#ccff00)]"
           />
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
      <section className="py-12 md:py-16 bg-[#080808] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-3 tracking-tighter">
               Sistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Nasıl İşler?</span>
             </h2>
             <p className="text-gray-400 text-sm md:text-base font-light max-w-xl mx-auto">
               Başarı şansa bırakılmaz. Bilimsel döngü, sürekli analiz ve mükemmel sonuç.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative">
             {/* Connecting Line (Desktop only) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0"></div>

             {[
               { 
                 step: "01",
                 icon: <Activity size={28} />, 
                 title: "Analiz & Planlama", 
                 desc: "Detaylı anamnez formu ile metabolik durumun, yaşam tarzın ve hedeflerin analiz edilir." 
               },
               { 
                 step: "02",
                 icon: <Target size={28} />, 
                 title: "Uygulama & Takip", 
                 desc: "Antrenman ve beslenme programın başlar. Haftalık check-inler ile formun kontrol altında tutulur." 
               },
               { 
                 step: "03",
                 icon: <Trophy size={28} />, 
                 title: "Optimizasyon & Sonuç", 
                 desc: "Vücudunun verdiği tepkilere göre program revize edilir. Sürekli gelişim sağlanır." 
               }
             ].map((item, i) => (
               <div key={i} className="relative z-10">
                 <div className={`bg-[#0A0A0A] border p-5 md:p-6 rounded-2xl transition-all duration-700 h-full relative overflow-hidden shadow-xl ${
                   i === activeStep 
                     ? "border-primary/50 md:-translate-y-2 shadow-[0_0_30px_rgba(204,255,0,0.15)]" 
                     : "border-white/10"
                 }`}>
                   
                   {/* Animated Border Gradient - Active State */}
                   <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${i === activeStep ? "opacity-100" : "opacity-0"}`}>
                     <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,#ccff00_180deg,transparent_270deg,transparent_360deg)] animate-spin-slow-linear" style={{ animationDuration: '3s' }}></div>
                   </div>
                   
                   {/* Inner Content Background */}
                   <div className="absolute inset-[1px] bg-[#0A0A0A] rounded-[15px] z-0"></div>

                   {/* Background Gradient - Active State (Inner) */}
                   <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transition-opacity duration-700 z-10 ${i === activeStep ? "opacity-100" : "opacity-0"}`}></div>
                   
                   <div className="relative z-20">
                     <div className="flex justify-between items-start mb-4 relative">
                       <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-700 shadow-lg ${
                         i === activeStep 
                           ? "bg-primary text-black shadow-primary/30 scale-105" 
                           : "bg-white/5 text-white"
                       }`}>
                         {item.icon}
                       </div>
                       <span className={`text-4xl md:text-5xl font-heading font-bold transition-colors duration-700 select-none ${
                         i === activeStep ? "text-primary/20" : "text-white/5"
                       }`}>{item.step}</span>
                     </div>
                     
                     <h3 className={`text-lg md:text-xl font-heading font-bold uppercase mb-2 transition-colors duration-700 relative ${
                       i === activeStep ? "text-primary" : "text-white"
                     }`}>{item.title}</h3>
                     <p className="text-gray-400 text-sm leading-relaxed relative">
                       {item.desc}
                     </p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* TRANSFORMATIONS GALLERY */}
      <section className="py-12 md:py-16 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Gerçek Sonuçlar</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-2 tracking-tighter">
                Dönüşümler
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
                Danışanlarımın elde ettiği gerçek sonuçlar. Sıra sende.
              </p>
            </motion.div>
          </div>

          {/* Main Carousel */}
          <div className="relative max-w-2xl mx-auto flex flex-col items-center">
            {/* Navigation Arrows */}
            <button 
              onClick={prevTransformation}
              className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full flex items-center justify-center transition-all group"
              data-testid="button-prev-transformation"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
            </button>
            
            <button 
              onClick={nextTransformation}
              className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full flex items-center justify-center transition-all group"
              data-testid="button-next-transformation"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
            </button>

            {/* Main Image Display */}
            <div className="relative inline-flex mx-auto p-1.5 md:p-2 rounded-xl bg-gradient-to-b from-primary/30 via-primary/10 to-primary/30 shadow-xl shadow-black/50">
              <div className="relative rounded-lg overflow-hidden border border-primary/40">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentTransformation}
                    src={transformations[currentTransformation]}
                    alt={`Dönüşüm ${currentTransformation + 1}`}
                    className="block h-[350px] md:h-[450px] w-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>

                {/* Counter Badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/30 text-sm">
                  <span className="text-primary font-bold">{currentTransformation + 1}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-white">{transformations.length}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-4 flex gap-1.5 justify-center flex-wrap">
              {transformations.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTransformation(idx)}
                  className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    idx === currentTransformation 
                      ? "border-primary shadow-[0_0_10px_rgba(204,255,0,0.4)] scale-110" 
                      : "border-white/10 opacity-50 hover:opacity-80 hover:border-white/30"
                  }`}
                  data-testid={`thumbnail-${idx}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL CTA SECTION */}
      <section className="py-12 md:py-16 relative overflow-hidden flex items-center justify-center bg-[#050505]">
        <div className="absolute inset-0 bg-primary/5 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4 tracking-tighter">
             Hazır Mısın?
           </h2>
           <p className="text-sm md:text-base text-gray-300 max-w-lg mx-auto mb-6 font-light">
             En iyi versiyonuna ulaşmak için tek yapman gereken ilk adımı atmak.
           </p>
           <Link href="/paketler">
             <Button className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-heading font-bold uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] transition-all hover:scale-105 rounded-none -skew-x-12">
               <span className="skew-x-12 inline-flex items-center gap-2">Planı Seç ve Başla <ArrowRight className="w-5 h-5" /></span>
             </Button>
           </Link>
        </div>
      </section>

    </div>
  );
}
