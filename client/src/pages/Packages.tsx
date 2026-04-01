import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, HelpCircle, Loader2, Flame } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";
import { trackViewContent, trackAddToCart } from "@/lib/facebook-pixel";

interface Package {
  id: string;
  name: string;
  weeks: number;
  price: string;
  features: string[];
  isActive: boolean;
}

const NATURAL_FEATURES = [
  "Kişisel antrenman programı",
  "Beslenme planlaması",
  "Kardiyo planlaması",
  "Vitamin & supplement önerisi",
  "Form analizi (foto/video)",
  "Teknik düzeltme geri bildirimleri",
  "Haftalık kontrol",
  "Geri dönüşe göre plan güncelleme",
  "Haftalık teknik video analizi",
  "Makro güncellemesi (gelişime göre)",
  "Yaşam tarzına uygun planlama",
  "Haftalık Q&A destek",
  "7/24 WhatsApp iletişim",
];

const TEAM_ALAF_EXTRAS = [
  "Kişiye özel ileri seviye performans protokolü",
  "Süreç boyunca detaylı analiz ve ilerleme takibi",
  "Kan değerlerine göre gelişim değerlendirmesi",
  "Sporcu sağlığı odaklı haftalık ölçüm rehberi",
  "Düzenli kan tahlili kontrol listesi",
];

const faqs = [
  {
    q: "Ödemeyi nasıl yapabilirim?",
    a: "Ödemeleri kredi kartı ile (Shopier güvencesiyle) güvenle yapabilirsiniz.",
  },
  {
    q: "Programlar nasıl teslim ediliyor?",
    a: "Satın alım sonrası WhatsApp üzerinden iletişime geçiyorum. Antrenman ve beslenme programlarınız size özel Google Sheets dosyası üzerinden eş zamanlı olarak paylaşılır. Tüm güncellemeler anında senkronize edilir ve her yerden erişebilirsiniz.",
  },
  {
    q: "Salona gitmek zorunda mıyım?",
    a: "Evet. Programlar spor salonu ekipmanlarına göre hazırlanmaktadır. Etkili sonuçlar için spor salonu üyeliği gerekmektedir.",
  },
  {
    q: "Natural ve Team Alaf arasındaki fark nedir?",
    a: "Team Alaf Paketi, Natural Paket'teki tüm hizmetleri kapsar; bunlara ek olarak ileri seviye performans protokolü, kan değerleri takibi ve sporcu sağlığı odaklı detaylı analiz hizmetleri de dahildir.",
  },
  {
    q: "İptal ve iade hakkım var mı?",
    a: "Dijital içerik ve kişiye özel hizmet olduğu için program hazırlandıktan sonra iade yapılmamaktadır. Ancak sağlık sorunu gibi durumlarda üyelik dondurma hakkınız saklıdır.",
  },
];

function DurationSelector({
  options,
  selected,
  onSelect,
  accent,
}: {
  options: number[];
  selected: number;
  onSelect: (w: number) => void;
  accent: "green" | "gold";
}) {
  return (
    <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.07]">
      {options.map((w) => {
        const active = selected === w;
        return (
          <button
            key={w}
            onClick={() => onSelect(w)}
            data-testid={`button-duration-${w}`}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-bold uppercase tracking-wide transition-all duration-200 ${
              active
                ? accent === "green"
                  ? "bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.25)]"
                  : "bg-[#d4a017] text-black shadow-[0_0_12px_rgba(212,160,23,0.35)]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {w}h
          </button>
        );
      })}
    </div>
  );
}

export default function Packages() {
  const [naturalWeeks, setNaturalWeeks] = useState(12);
  const [teamWeeks, setTeamWeeks] = useState(12);
  const [mobileTab, setMobileTab] = useState<"natural" | "team">("natural");

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Paketler yüklenemedi");
      const data = await res.json();
      return data.packages || [];
    },
  });

  const activePackages = Array.isArray(packages) ? packages.filter((p) => p.isActive) : [];
  const naturalPackages = activePackages
    .filter((p) => !p.name.includes("Team Alaf"))
    .sort((a, b) => a.weeks - b.weeks);
  const teamPackages = activePackages
    .filter((p) => p.name.includes("Team Alaf"))
    .sort((a, b) => a.weeks - b.weeks);

  const naturalPkg = naturalPackages.find((p) => p.weeks === naturalWeeks);
  const teamPkg = teamPackages.find((p) => p.weeks === teamWeeks);

  const naturalDurations = naturalPackages.length > 0 ? naturalPackages.map((p) => p.weeks) : [8, 12, 16, 24];
  const teamDurations = teamPackages.length > 0 ? teamPackages.map((p) => p.weeks) : [12, 24];

  useEffect(() => {
    if (naturalDurations.length && !naturalDurations.includes(naturalWeeks)) {
      setNaturalWeeks(naturalDurations[0]);
    }
  }, [naturalDurations]);

  useEffect(() => {
    if (teamDurations.length && !teamDurations.includes(teamWeeks)) {
      setTeamWeeks(teamDurations[0]);
    }
  }, [teamDurations]);

  const viewContentTracked = useRef(false);
  useEffect(() => {
    if (!viewContentTracked.current && !isLoading) {
      trackViewContent("Koçluk Paketleri", "Fitness Koçluk");
      viewContentTracked.current = true;
    }
  }, [isLoading]);

  const packagesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Online Fitness Koçluk Paketleri",
    description: "Natural Paket ve Team Alaf Paketi — 8 ila 24 haftalık kişiye özel online fitness koçluk programları.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Natural Paket",
          offers: { "@type": "AggregateOffer", priceCurrency: "TRY", lowPrice: "5950", highPrice: "12000" },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Team Alaf Paketi",
          offers: { "@type": "AggregateOffer", priceCurrency: "TRY", lowPrice: "12995", highPrice: "23500" },
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-12 bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ccff00]" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Online Fitness Koçluk Paketleri | Natural & Team Alaf | Gokalaf"
        description="Natural Paket ve Team Alaf Paketi — kişiye özel online fitness koçluk programları. 8 ila 24 haftalık seçenekler, antrenman, beslenme, haftalık takip ve WhatsApp iletişimi dahil."
        keywords="online fitness paketi, koçluk paketi, team alaf, natural paket, antrenman programı, beslenme programı, online PT fiyatları, vücut geliştirme programı"
        canonical="https://gokalaf.com/paketler"
        schema={packagesSchema}
      />

      <div className="min-h-screen bg-[#050505] pt-36 pb-20">
        {/* Background texture */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ccff00]/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4a017]/[0.015] rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-14"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white leading-tight mb-3">
              Hedefine uygun <br />
              <span className="text-[#ccff00]">paketi seç</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              İki farklı seviyede profesyonel koçluk. Süreyi ve planı belirle, değişim başlasın.
            </p>
          </motion.div>

          {/* Mobile Tab Switcher */}
          <div className="lg:hidden max-w-xs mx-auto mb-6">
            <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-2xl p-1 gap-1">
              <button
                onClick={() => setMobileTab("natural")}
                data-testid="button-tab-natural"
                className={`flex-1 py-2.5 px-3 rounded-xl text-[12px] font-bold uppercase tracking-wide transition-all duration-200 ${
                  mobileTab === "natural"
                    ? "bg-[#ccff00] text-black shadow-[0_0_16px_rgba(204,255,0,0.25)]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Natural
              </button>
              <button
                onClick={() => setMobileTab("team")}
                data-testid="button-tab-team"
                className={`flex-1 py-2.5 px-3 rounded-xl text-[12px] font-bold uppercase tracking-wide transition-all duration-200 ${
                  mobileTab === "team"
                    ? "bg-[#d4a017] text-black shadow-[0_0_16px_rgba(212,160,23,0.35)]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Team Alaf
              </button>
            </div>
          </div>

          {/* Package Cards */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 mb-20">

            {/* ── Natural Paket ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className={`relative ${mobileTab === "team" ? "hidden lg:block" : ""}`}
            >
              <div className="relative h-full bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col">
                <div className="h-px bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent" />

                <div className="p-5 flex flex-col flex-1">
                  {/* Title block */}
                  <div className="mb-4">
                    <h2 className="text-lg font-heading font-bold uppercase text-white tracking-tight">Natural Paket</h2>
                    <p className="text-gray-500 text-[11px] mt-0.5">Kapsamlı Temel Koçluk Programı</p>
                  </div>

                  {/* Duration */}
                  <div className="mb-3">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] mb-1.5">Program süresi</p>
                    <DurationSelector
                      options={naturalDurations}
                      selected={naturalWeeks}
                      onSelect={setNaturalWeeks}
                      accent="green"
                    />
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={naturalWeeks}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <p className="text-[30px] font-bold text-white tabular-nums leading-none tracking-tight" data-testid="text-package-price">
                          ₺{naturalPkg ? parseFloat(naturalPkg.price).toLocaleString("tr-TR") : "—"}
                        </p>
                        <p className="text-white/70 text-[11px] mt-0.5">{naturalWeeks} Haftalık Program</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-4">
                    <div className="space-y-1.5">
                      {NATURAL_FEATURES.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/25 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={8} className="text-[#ccff00]" />
                          </div>
                          <span className="text-gray-400 text-[12px] leading-snug">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href={naturalPkg ? `/odeme?weeks=${naturalWeeks}` : "#"}>
                    <button
                      onClick={() => naturalPkg && trackAddToCart(`${naturalWeeks} Haftalık Natural Paket`, naturalPkg.id, parseFloat(naturalPkg.price))}
                      disabled={!naturalPkg}
                      data-testid="button-buy-natural"
                      className="w-full h-10 rounded-xl bg-[#ccff00] text-black font-bold text-[12px] uppercase tracking-wider hover:bg-[#ccff00]/90 transition-all hover:shadow-[0_0_20px_rgba(204,255,0,0.25)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Satın al
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* ── Team Alaf Paketi ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className={`relative ${mobileTab === "natural" ? "hidden lg:block" : ""}`}
            >
              {/* Gold glow border */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#d4a017]/35 via-[#d4a017]/08 to-transparent pointer-events-none z-10" />

              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-1.5 bg-[#d4a017] text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] shadow-[0_0_18px_rgba(212,160,23,0.5)]">
                  <Flame size={10} />
                  Sık tercih edilen
                </div>
              </div>

              <div className="relative h-full bg-[#0d0b04] border border-[#d4a017]/25 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-px bg-gradient-to-r from-transparent via-[#d4a017]/70 to-transparent" />

                {/* Warm inner glow */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-[#d4a017]/[0.06] rounded-full blur-[70px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />

                <div className="p-5 flex flex-col flex-1 relative z-10">
                  {/* Title block */}
                  <div className="mb-4">
                    <h2 className="text-lg font-heading font-bold uppercase text-white tracking-tight">Team Alaf Paketi</h2>
                    <p className="text-gray-500 text-[11px] mt-0.5">İleri Seviye Performans Koçluğu</p>
                  </div>

                  {/* Duration */}
                  <div className="mb-3">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] mb-1.5">Program süresi</p>
                    <DurationSelector
                      options={teamDurations}
                      selected={teamWeeks}
                      onSelect={setTeamWeeks}
                      accent="gold"
                    />
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={teamWeeks}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <p className="text-[30px] font-bold text-white tabular-nums leading-none tracking-tight" data-testid="text-team-alaf-price">
                          ₺{teamPkg ? parseFloat(teamPkg.price).toLocaleString("tr-TR") : "—"}
                        </p>
                        <p className="text-white/70 text-[11px] mt-0.5">{teamWeeks} Haftalık Program</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-4 space-y-3">

                    {/* Natural base — muted/secondary */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-white/[0.07]" />
                        <span className="text-[10px] text-gray-600 uppercase tracking-[0.15em] whitespace-nowrap">Natural paket'teki her şey</span>
                        <div className="h-px flex-1 bg-white/[0.07]" />
                      </div>
                      <div className="space-y-1">
                        {NATURAL_FEATURES.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-white/[0.08] border border-white/[0.2] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={8} className="text-white" />
                            </div>
                            <span className="text-white text-[11px] leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Alaf Extras — fully bright */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-[#d4a017]/30" />
                        <span className="text-[10px] text-[#d4a017] uppercase tracking-[0.15em] whitespace-nowrap font-bold">+ Team Alaf Extras</span>
                        <div className="h-px flex-1 bg-[#d4a017]/30" />
                      </div>
                      <div className="space-y-1.5">
                        {TEAM_ALAF_EXTRAS.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#d4a017]/20 border border-[#d4a017]/50 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={8} className="text-[#d4a017]" />
                            </div>
                            <span className="text-white text-[12px] leading-snug font-medium">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* CTA */}
                  <Link href={teamPkg ? `/odeme?weeks=${teamWeeks}&packageId=${teamPkg.id}` : "#"}>
                    <button
                      onClick={() => teamPkg && trackAddToCart(`${teamWeeks} Haftalık Team Alaf Paketi`, teamPkg.id, parseFloat(teamPkg.price))}
                      disabled={!teamPkg}
                      data-testid="button-buy-team-alaf"
                      className="w-full h-10 rounded-xl bg-[#d4a017] text-black font-bold text-[12px] uppercase tracking-wider hover:bg-[#d4a017]/90 transition-all hover:shadow-[0_0_24px_rgba(212,160,23,0.4)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Satın al
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto" id="faq">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <HelpCircle size={16} className="text-[#ccff00]" />
                <span className="text-[11px] text-[#ccff00]/70 uppercase tracking-[0.2em]">Sıkça sorulan sorular</span>
              </div>
              <h2 className="text-xl font-heading font-bold uppercase text-white">Aklına takılanlar</h2>
              <p className="text-gray-600 text-sm mt-2">
                Cevap bulamazsan{" "}
                <a
                  href="https://wa.me/905312822402"
                  className="text-[#ccff00]/70 hover:text-[#ccff00] transition-colors"
                >
                  WhatsApp hattından
                </a>{" "}
                yazabilirsin.
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${i}`}
                    className="border border-white/[0.07] rounded-xl bg-[#0a0a0a] px-5 overflow-hidden"
                  >
                    <AccordionTrigger className="text-[13px] font-medium text-white hover:text-[#ccff00] hover:no-underline py-4 gap-3">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-500 text-[13px] pb-4 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </>
  );
}
