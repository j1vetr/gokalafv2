import { Button } from "@/components/ui/button";
import { ArrowRight, Check, TrendingUp, Activity, Dumbbell, Calendar, Users, User, Star, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 md:pt-0 bg-[#050505] text-foreground overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_40%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>

        <div className="container mx-auto px-4 z-10 relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6 text-center lg:text-left order-2 lg:order-1"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <Badge variant="outline" className="px-4 py-1 text-primary border-primary/30 bg-primary/10 uppercase tracking-widest text-xs font-bold mb-4 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Online Koçluk
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[0.9] tracking-tight uppercase">
              <span className="text-outline-white block">Bedenini</span>
              <span className="text-primary text-glow block">İnşa Et</span>
              <span className="block">Sınırları Aş</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Bilimsel verilerle desteklenen antrenman ve beslenme sistemleriyle potansiyelini açığa çıkar. 
              Rastgele programlar yok, sadece sonuç var.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/packages">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wide text-lg h-14 px-8">
                  Paketleri İncele <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 hover:text-primary text-lg h-14 px-8 uppercase font-bold">
                  Ön Görüşme Talep Et
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 mt-8">
              <div>
                <h4 className="text-3xl font-heading font-bold text-primary">500+</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Mutlu Danışan</p>
              </div>
              <div>
                <h4 className="text-3xl font-heading font-bold text-white">12</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Hafta Ort. Dönüşüm</p>
              </div>
              <div>
                <h4 className="text-3xl font-heading font-bold text-primary">100%</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Bilimsel Yaklaşım</p>
              </div>
            </div>
          </motion.div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            {/* Main Hero Image */}
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[3/4] lg:aspect-square">
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 bottom-0 h-40"></div>
               <img 
                 src="https://www.gokalaf.com/wp-content/uploads/2025/05/53e0affa-b231-4296-b408-d66a1f4ff838-min.png" 
                 alt="Gokalaf Fitness Coach" 
                 className="w-full h-full object-cover object-center lg:object-top drop-shadow-[0_0_30px_rgba(132,204,22,0.2)] mask-image-gradient"
               />
               
               {/* Floating Element */}
               <motion.div 
                 className="absolute bottom-20 left-0 bg-card/80 backdrop-blur-md border border-primary/30 p-4 rounded-lg z-20 max-w-[200px]"
                 initial={{ x: -50, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.8 }}
               >
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-primary/20 rounded-full text-primary">
                     <Activity size={20} />
                   </div>
                   <div className="text-sm font-bold">Günlük Aktivite</div>
                 </div>
                 <div className="text-xs text-muted-foreground">Hedefine doğru ilerliyorsun.</div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY GOKALAF SECTION */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4">
              Neden <span className="text-primary">Gokalaf?</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Sadece antrenman yazmıyorum, yaşam tarzını optimize ediyorum. 
              Sürdürülebilir, gerçekçi ve bilimsel metotlar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <User className="w-8 h-8" />,
                title: "Kişiye Özel Planlama",
                desc: "Senin hedeflerine, yaşam tarzına ve vücut tipine özel olarak hazırlanmış %100 kişiselleştirilmiş programlar."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Sürekli Takip & Analiz",
                desc: "Haftalık check-in'ler, form analizleri ve duruma göre anlık revizyonlarla sürekli gelişim halindeyiz."
              },
              {
                icon: <Dumbbell className="w-8 h-8" />,
                title: "Bilimsel Yaklaşım",
                desc: "Kulaktan dolma bilgiler değil; anatomi, biyomekanik ve beslenme bilimine dayalı kanıtlanmış stratejiler."
              }
            ].map((item, i) => (
              <Card key={i} className="bg-card border-white/5 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl font-heading uppercase">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS TEASER SECTION */}
      <section className="py-24 bg-secondary/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-none uppercase">Ücretsiz Araçlar</Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4">
                Gelişimini <span className="text-primary">Hesapla</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Vücut analizini yapmak ve hedeflerini belirlemek için profesyonel hesaplama araçlarımı ücretsiz kullanabilirsin.
              </p>
            </div>
            <Link href="/tools">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold">
                Tüm Araçları Gör <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Vücut Kitle İndeksi", desc: "İdeal kilonuzda mısınız?", icon: <Activity /> },
              { title: "Kalori İhtiyacı", desc: "Günlük alman gereken kalori.", icon: <TrendingUp /> },
              { title: "Yağ Oranı", desc: "Vücut yağ yüzdenizi tahmin edin.", icon: <User /> },
              { title: "Maksimum Kuvvet", desc: "1RM kuvvet potansiyelin.", icon: <Dumbbell /> }
            ].map((tool, i) => (
              <Link key={i} href="/tools">
                <div className="bg-card p-6 rounded-lg border border-white/5 hover:border-primary/50 transition-all cursor-pointer group h-full flex flex-col">
                  <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-bold font-heading uppercase mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{tool.desc}</p>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    Hesapla <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PACKAGES SECTION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4">
              Koçluk <span className="text-primary">Paketleri</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Senin için en uygun planı seç ve değişime hemen başla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                name: "Başlangıç", 
                duration: "4 Hafta", 
                price: "₺3.500", 
                features: ["Kişiye Özel Antrenman", "Beslenme Rehberliği", "Haftalık Check-in", "WhatsApp Desteği"] 
              },
              { 
                name: "Gelişim", 
                duration: "12 Hafta", 
                price: "₺9.000", 
                isPopular: true,
                features: ["Kişiye Özel Antrenman", "Detaylı Makro Planı", "Haftalık Video Analiz", "7/24 WhatsApp", "Form Düzeltme"] 
              },
              { 
                name: "Premium", 
                duration: "24 Hafta", 
                price: "₺16.000", 
                features: ["VIP Koçluk", "İleri Seviye Periodizasyon", "Supplement Danışmanlığı", "Birebir Görüntülü Görüşme", "Öncelikli Destek"] 
              }
            ].map((pkg, i) => (
              <Card key={i} className={`relative flex flex-col ${pkg.isPopular ? 'border-primary shadow-[0_0_30px_rgba(132,204,22,0.15)] scale-105 z-10 bg-card' : 'bg-card/50 border-white/10 hover:border-primary/30'}`}>
                {pkg.isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    En Popüler
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <h3 className="text-2xl font-heading font-bold uppercase">{pkg.name}</h3>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{pkg.duration}</div>
                </CardHeader>
                <CardContent className="text-center flex-grow flex flex-col">
                  <div className="text-4xl font-bold text-primary mb-6">{pkg.price}</div>
                  <ul className="space-y-3 text-left mb-8 flex-grow">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-foreground/80">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Check size={12} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/packages">
                    <Button className={`w-full uppercase font-bold h-12 ${pkg.isPopular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80'}`}>
                      Paketi Seç
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE / HOW IT WORKS */}
      <section className="py-24 bg-secondary/20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4">
              Nasıl <span className="text-primary">Çalışıyorum?</span>
            </h2>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 hidden md:block"></div>
            
            {[
              { step: "01", title: "Değerlendirme", desc: "Başvuru formunu dolduruyorsun. Mevcut durumunu, hedeflerini ve sağlık geçmişini analiz ediyorum." },
              { step: "02", title: "Planlama", desc: "Sana özel antrenman ve beslenme programını hazırlayıp sisteme yüklüyorum." },
              { step: "03", title: "Takip & Gelişim", desc: "Haftalık raporlarla gelişimini takip ediyor, gerekirse programını güncelliyoruz." }
            ].map((item, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-8 mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 text-center md:text-left md:px-8">
                  <h3 className="text-xl font-heading font-bold uppercase text-white mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                  <span className="text-xl font-bold text-primary font-heading">{item.step}</span>
                </div>
                <div className="flex-1 md:px-8"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-6 text-white">
            Sınırlarını Zorlamaya <br/><span className="text-primary text-glow">Hazır Mısın?</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Yarın başlarım deme. Şimdi harekete geç ve hayatının en iyi formuna ulaş.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/packages">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase text-lg h-16 px-10 shadow-lg shadow-primary/20">
                Hemen Başla
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black font-bold uppercase text-lg h-16 px-10">
                İletişime Geç
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
