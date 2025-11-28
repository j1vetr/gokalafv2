import { Button } from "@/components/ui/button";
import { ArrowRight, Check, TrendingUp, Activity, Dumbbell, Calendar, Users, Star, ChevronRight, Play, ShieldCheck, Zap, Trophy } from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="overflow-hidden bg-[#050505]">
      {/* MOBILE-FIRST REDESIGNED HERO */}
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

      {/* NUMBERS SECTION - HIGH IMPACT */}
      <section className="py-16 lg:py-20 bg-[#080808] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            {[
              { number: "10+", label: "Yıl Deneyim" },
              { number: "500+", label: "Mutlu Danışan" },
              { number: "%100", label: "Bilimsel Yaklaşım" },
              { number: "7/24", label: "Kesintisiz Destek" }
            ].map((stat, i) => (
              <div key={i} className="p-2 md:p-4 group hover:bg-white/5 transition-colors rounded-lg">
                <div className="text-3xl md:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 group-hover:from-primary group-hover:to-primary/50 transition-all mb-2">
                  {stat.number}
                </div>
                <div className="text-[10px] md:text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATION / VALUE PROP SECTION */}
      <section className="py-24 lg:py-32 bg-[#050505] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="lg:w-1/2 relative w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] lg:aspect-auto">
                <img 
                  src="https://www.gokalaf.com/wp-content/uploads/2023/02/PXL0049-scaled-1.jpg" 
                  alt="Training" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 text-left">
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white uppercase mb-2">Sadece Antrenman Değil</h3>
                  <p className="text-gray-300 max-w-md text-sm lg:text-base">
                    Yaşam tarzını, beslenmeni ve zihniyetini yeniden inşa ediyoruz.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-8 lg:space-y-10">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-4 lg:mb-6">
                  Neden Herkes <br/> <span className="text-primary">Gokalaf Seçiyor?</span>
                </h2>
                <p className="text-lg lg:text-xl text-gray-400 leading-relaxed">
                  Çünkü burada "kopyala-yapıştır" listeler yok. Senin anatomine, metabolizmana ve hedeflerine özel, yaşayan bir sistem var.
                </p>
              </div>

              <div className="space-y-4 lg:space-y-6">
                {[
                  { title: "Veri Odaklı Analiz", desc: "Tüm süreç matematiksel veriler ve vücut analizlerine dayanır." },
                  { title: "Sürdürülebilir Beslenme", desc: "Aç kalarak değil, doğru beslenerek hedefe ulaşırsın." },
                  { title: "Teknik & Form Düzeltme", desc: "Videolu analizlerle hareketleri en doğru formda yapmanı sağlarım." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all group text-left">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Check size={20} className="lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg lg:text-xl font-heading font-bold uppercase text-white mb-1">{item.title}</h4>
                      <p className="text-sm lg:text-base text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS CAROUSEL SECTION */}
      <section className="py-24 lg:py-32 bg-[#080808] border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-12 lg:mb-16">
          <Badge className="mb-6 bg-primary text-black hover:bg-primary px-4 py-1 text-sm uppercase font-bold">
            Ücretsiz Kullan
          </Badge>
          <h2 className="text-3xl md:text-6xl font-heading font-bold uppercase text-white mb-6">
            Vücudunu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Tanı</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
            Profesyonel araçlarımla gelişimini şansa bırakma. Hemen hesapla, rotanı çiz.
          </p>
        </div>

        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "BMI Hesapla", icon: <Activity />, bg: "from-blue-500/20 to-blue-900/20", color: "text-blue-400" },
                { title: "Kalori İhtiyacı", icon: <Zap />, bg: "from-orange-500/20 to-orange-900/20", color: "text-orange-400" },
                { title: "Yağ Oranı", icon: <Users />, bg: "from-green-500/20 to-green-900/20", color: "text-green-400" },
                { title: "1RM Kuvvet", icon: <Dumbbell />, bg: "from-purple-500/20 to-purple-900/20", color: "text-purple-400" }
              ].map((tool, i) => (
                <Link key={i} href="/tools">
                  <div className={`relative group p-6 lg:p-8 rounded-2xl border border-white/10 bg-gradient-to-br ${tool.bg} hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden h-56 lg:h-64 flex flex-col justify-between`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity ${tool.color}`}>
                      <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                    <div className={`${tool.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                      {/* Clone element with bigger size */}
                      {/* @ts-ignore */}
                      <tool.icon.type {...tool.icon.props} size={40} className="lg:w-12 lg:h-12" />
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-heading font-bold uppercase text-white mb-2">{tool.title}</h3>
                      <p className="text-xs lg:text-sm text-gray-400">Hemen analiz et ve sonucunu gör.</p>
                    </div>
                  </div>
                </Link>
              ))}
           </div>
           
           <div className="text-center mt-12">
             <Link href="/tools">
               <Button variant="link" className="text-primary text-lg uppercase font-bold hover:text-white transition-colors">
                 Tüm Araçları İncele <ArrowRight className="ml-2" />
               </Button>
             </Link>
           </div>
        </div>
      </section>

      {/* PRICING TEASER - DARK MODE */}
      <section className="py-24 lg:py-32 bg-[#050505] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-16">
            <div className="max-w-3xl text-center lg:text-left mx-auto lg:mx-0">
              <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase text-white mb-6">
                Hangi Paket <br/><span className="text-primary">Sana Uygun?</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-400">
                Hedefin ne olursa olsun, seni oraya götürecek bir planım var.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Card 1 */}
             <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-primary/50 transition-all duration-500">
               <div className="bg-[#0A0A0A] rounded-xl p-6 lg:p-8 h-full flex flex-col relative z-10">
                 <div className="mb-6">
                   <h3 className="text-2xl font-heading font-bold uppercase text-white">Başlangıç</h3>
                   <p className="text-gray-500 mt-2">Temel koçluk desteği</p>
                 </div>
                 <div className="text-3xl lg:text-4xl font-bold text-white mb-8">₺3.500<span className="text-base lg:text-lg text-gray-500 font-normal">/4 hafta</span></div>
                 <ul className="space-y-4 mb-8 flex-grow">
                   <li className="flex items-center gap-3 text-gray-300"><Check className="text-primary w-5 h-5" /> Kişiye Özel Program</li>
                   <li className="flex items-center gap-3 text-gray-300"><Check className="text-primary w-5 h-5" /> Beslenme Planı</li>
                   <li className="flex items-center gap-3 text-gray-300"><Check className="text-primary w-5 h-5" /> Haftalık Kontrol</li>
                 </ul>
                 <Link href="/packages">
                   <Button className="w-full bg-white/5 hover:bg-white text-white hover:text-black font-bold uppercase h-12 border border-white/10">İncele</Button>
                 </Link>
               </div>
             </div>

             {/* Card 2 - Featured */}
             <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-primary to-primary/20 transform lg:-translate-y-8 shadow-[0_0_50px_rgba(204,255,0,0.15)]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                 En Popüler
               </div>
               <div className="bg-[#080808] rounded-xl p-6 lg:p-8 h-full flex flex-col relative z-10">
                 <div className="mb-6">
                   <h3 className="text-3xl font-heading font-bold uppercase text-primary">Değişim</h3>
                   <p className="text-gray-400 mt-2">Tam kapsamlı dönüşüm</p>
                 </div>
                 <div className="text-4xl lg:text-5xl font-bold text-white mb-8">₺9.000<span className="text-base lg:text-lg text-gray-500 font-normal">/12 hafta</span></div>
                 <ul className="space-y-4 mb-8 flex-grow">
                   <li className="flex items-center gap-3 text-white"><Check className="text-primary w-5 h-5" /> Detaylı Video Analiz</li>
                   <li className="flex items-center gap-3 text-white"><Check className="text-primary w-5 h-5" /> 7/24 WhatsApp</li>
                   <li className="flex items-center gap-3 text-white"><Check className="text-primary w-5 h-5" /> Supplement Planı</li>
                   <li className="flex items-center gap-3 text-white"><Check className="text-primary w-5 h-5" /> İleri Seviye Taktikler</li>
                 </ul>
                 <Link href="/packages">
                   <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold uppercase h-14 text-lg">Hemen Başla</Button>
                 </Link>
               </div>
             </div>

             {/* Card 3 */}
             <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-primary/50 transition-all duration-500">
               <div className="bg-[#0A0A0A] rounded-xl p-6 lg:p-8 h-full flex flex-col relative z-10">
                 <div className="mb-6">
                   <h3 className="text-2xl font-heading font-bold uppercase text-white">VIP</h3>
                   <p className="text-gray-500 mt-2">Profesyonel Sporcu Düzeyi</p>
                 </div>
                 <div className="text-3xl lg:text-4xl font-bold text-white mb-8">₺16.000<span className="text-base lg:text-lg text-gray-500 font-normal">/24 hafta</span></div>
                 <ul className="space-y-4 mb-8 flex-grow">
                   <li className="flex items-center gap-3 text-gray-300"><Check className="text-primary w-5 h-5" /> Birebir Görüntülü Görüşme</li>
                   <li className="flex items-center gap-3 text-gray-300"><Check className="text-primary w-5 h-5" /> Yarışma Hazırlığı</li>
                   <li className="flex items-center gap-3 text-gray-300"><Check className="text-primary w-5 h-5" /> Öncelikli Destek</li>
                 </ul>
                 <Link href="/packages">
                   <Button className="w-full bg-white/5 hover:bg-white text-white hover:text-black font-bold uppercase h-12 border border-white/10">İncele</Button>
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-0 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase text-white mb-8 leading-none">
             Bahane Yok. <br/> <span className="text-primary text-glow">Sonuç Var.</span>
           </h2>
           <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12">
             Hayatının en iyi formuna girmek için ihtiyacın olan her şey burada. 
             Tek eksik sensin.
           </p>
           <Link href="/packages">
             <Button className="h-16 lg:h-20 px-8 lg:px-12 text-xl lg:text-2xl font-heading font-bold uppercase bg-primary text-black hover:bg-primary/90 shadow-[0_0_40px_rgba(204,255,0,0.5)] rounded-none skew-x-[-10deg] hover:skew-x-0 transition-all w-full sm:w-auto">
               <span className="skew-x-[10deg] group-hover:skew-x-0 inline-block">Şimdi Başla</span>
             </Button>
           </Link>
        </div>
      </section>

    </div>
  );
}
