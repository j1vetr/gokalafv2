import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Trophy, Target, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* HERO */}
      <section className="relative py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative">
               {/* Using Vertical Image 2 */}
               <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                 <img 
                   src="https://www.gokalaf.com/wp-content/uploads/2023/02/PXL0024-scaled-1.jpg" 
                   alt="Gokalaf Portrait" 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 <div className="absolute bottom-6 left-6">
                   <h2 className="text-3xl font-heading font-bold text-white uppercase">Gokalaf</h2>
                   <p className="text-primary font-medium">Profesyonel Fitness Koçu</p>
                 </div>
               </div>
               {/* Decorative Element */}
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase">
                Potansiyelini <span className="text-primary">Keşfet</span>
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Merhaba, ben Gokalaf. Yıllardır fitness ve vücut geliştirme alanında edindiğim tecrübeyi, 
                  bilimsel verilerle harmanlayarak danışanlarıma aktarıyorum.
                </p>
                <p>
                  Amacım sadece sana bir antrenman programı vermek değil; vücudunu tanımanı, 
                  sınırlarını zorlamanı ve disiplini bir yaşam tarzı haline getirmeni sağlamak.
                </p>
                <p>
                  Her bireyin fizyolojisi farklıdır. Bu yüzden kopyala-yapıştır programlara karşıyım. 
                  Senin hedeflerine, metabolizmana ve yaşam rutinine uygun, sürdürülebilir bir sistem kuruyoruz.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                  <span className="font-bold">Bilimsel Temelli</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                  <span className="font-bold">Sonuç Odaklı</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                  <span className="font-bold">7/24 İletişim</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                  <span className="font-bold">Kişiye Özel</span>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase">
                    Benimle Çalış <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4">Koçluk Felsefem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Başarı tesadüf değildir. Doğru planlama, istikrar ve bilimin birleşimidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-white/5 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Trophy size={32} />
                </div>
                <h3 className="text-xl font-heading font-bold uppercase">Performans</h3>
                <p className="text-muted-foreground">
                  Sadece estetik değil, fonksiyonel güç ve dayanıklılık. Hayatın her alanında daha güçlü olman için çalışıyoruz.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Target size={32} />
                </div>
                <h3 className="text-xl font-heading font-bold uppercase">Disiplin</h3>
                <p className="text-muted-foreground">
                  Motivasyon geçicidir, disiplin kalıcı. Seni hedeflerine ulaştıracak alışkanlıkları birlikte inşa ediyoruz.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-heading font-bold uppercase">Sürdürülebilirlik</h3>
                <p className="text-muted-foreground">
                  Kısa süreli şok diyetler değil, ömür boyu uygulayabileceğin, seninle yaşayan esnek bir sistem.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase mb-6">Değişim Şimdi Başlıyor</h2>
           <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium opacity-90">
             Bahane üretmeyi bırak. Kendinin en iyi versiyonuna ulaşmak için ilk adımı at.
           </p>
           <Link href="/packages">
             <Button size="lg" variant="secondary" className="font-bold uppercase text-lg h-14 px-8">
               Paketleri İncele
             </Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
