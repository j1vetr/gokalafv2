import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, HelpCircle, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Packages() {
  const packages = [
    { 
      name: "Başlangıç Paketi", 
      duration: "4 Hafta", 
      price: "3.500 ₺", 
      desc: "Fitness dünyasına sağlam bir giriş yapmak isteyenler için ideal.",
      features: [
        "Kişiye Özel Antrenman Programı", 
        "Beslenme & Makro Rehberliği", 
        "Haftalık Check-in & Raporlama", 
        "WhatsApp Desteği (Mesai Saatleri)",
        "Video Form Analizi (Sınırlı)"
      ] 
    },
    { 
      name: "Değişim Paketi", 
      duration: "12 Hafta", 
      price: "9.000 ₺", 
      isPopular: true,
      desc: "Gözle görülür, kalıcı bir değişim hedefleyenler için en çok tercih edilen plan.",
      features: [
        "Kişiye Özel Antrenman Programı (Aylık Güncelleme)", 
        "Detaylı Beslenme Planı & Tarifler", 
        "Haftalık Detaylı Video Analiz", 
        "7/24 WhatsApp Desteği",
        "Form Düzeltme & Teknik Analiz",
        "Kardiyo & Supplement Planlaması"
      ] 
    },
    { 
      name: "VIP Koçluk", 
      duration: "24 Hafta", 
      price: "16.000 ₺", 
      desc: "Profesyonel sporcu disiplini ve maksimum ilgi isteyenler için.",
      features: [
        "Her Hafta Birebir Görüntülü Görüşme", 
        "Tamamen Dinamik Program (Haftalık Revize)", 
        "İleri Seviye Periodizasyon", 
        "Yarışma/Fotoğraf Çekimi Hazırlığı", 
        "Öncelikli 7/24 Destek",
        "Tüm E-Kitaplara Erişim"
      ] 
    }
  ];

  const faqs = [
    {
      q: "Ödemeyi nasıl yapabilirim?",
      a: "Ödemeleri Havale/EFT veya Kredi Kartı (iyzico güvencesiyle) ile peşin veya taksitli olarak yapabilirsiniz."
    },
    {
      q: "Programlar nasıl teslim ediliyor?",
      a: "Kayıt sonrası size özel panelinize giriş bilgileriniz iletilir. Antrenman ve beslenme programlarınız bu panel üzerinden yönetilir. Mobil uyumludur."
    },
    {
      q: "Salona gitmek zorunda mıyım?",
      a: "Hayır. Evde veya parkta antrenman yapmak istiyorsanız, ekipman durumunuza göre program hazırlanır. Ancak en iyi sonuçlar için spor salonu üyeliği önerilir."
    },
    {
      q: "İptal ve iade hakkım var mı?",
      a: "Dijital içerik ve kişiye özel hizmet olduğu için program hazırlandıktan sonra iade yapılmamaktadır. Ancak sağlık sorunu gibi durumlarda üyelik dondurma hakkınız saklıdır."
    },
    {
      q: "Yurt dışından katılabilir miyim?",
      a: "Evet, dünyanın her yerinden online koçluk alabilirsiniz. İletişim ve program takibi tamamen online yürütülmektedir."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
           <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider">
            Planlar & Fiyatlandırma
           </Badge>
           <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-6">
             Hedefine Uygun <span className="text-primary">Paketi Seç</span>
           </h1>
           <p className="text-lg text-muted-foreground">
             Sadece bir program değil, bir yaşam tarzı değişikliği satın alıyorsun. 
             Disiplin, bilgi ve takip ile hedefine ulaşman için yanındayım.
           </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {packages.map((pkg, i) => (
            <Card key={i} className={`flex flex-col relative transition-all duration-300 ${pkg.isPopular ? 'border-primary shadow-[0_0_40px_rgba(132,204,22,0.1)] bg-card scale-105 z-10' : 'bg-card/60 border-white/5 hover:border-primary/30'}`}>
              {pkg.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border-4 border-background">
                  En Çok Tercih Edilen
                </div>
              )}
              <CardHeader className="text-center pb-4 pt-8">
                <h3 className="text-2xl font-heading font-bold uppercase">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground min-h-[40px]">{pkg.desc}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-primary mb-1">{pkg.price}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{pkg.duration}</div>
                </div>
                <div className="space-y-4">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-8">
                <Link href="/contact">
                  <Button className={`w-full uppercase font-bold h-12 text-base ${pkg.isPopular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    Hemen Başla
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto" id="faq">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold uppercase mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="text-primary" /> Sıkça Sorulan Sorular
            </h2>
            <p className="text-muted-foreground">Aklına takılan diğer sorular için iletişime geçebilirsin.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-lg bg-card/30 px-4">
                <AccordionTrigger className="text-lg font-medium hover:text-primary hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
