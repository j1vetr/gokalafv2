import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, HelpCircle, Star, Zap, Loader2, ChevronDown } from "lucide-react";
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
  "Kişisel Antrenman Programı",
  "Beslenme Planlaması",
  "Kardiyo Planlaması",
  "Vitamin & Supplement Önerisi",
  "Form Analizi (Foto/Video)",
  "Teknik Düzeltme Geri Bildirimleri",
  "Haftalık Kontrol",
  "Geri Dönüşe Göre Plan Güncelleme",
  "Haftalık Teknik Video Analizi",
  "Makro Güncellemesi (Gelişime Göre)",
  "Yaşam Tarzına Uygun Planlama",
  "Haftalık Q&A Destek",
  "7/24 WhatsApp İletişim",
];

const TEAM_ALAF_EXTRAS = [
  "Kişiye özel ileri seviye performans protokolü planlaması",
  "Süreç boyunca detaylı analiz ve ilerleme takibi",
  "Kan değerlerinin trend analizine göre gelişim değerlendirmesi",
  "Sporcu sağlığı odaklı haftalık ölçüm ve takip rehberi",
  "Düzenli kan tahlili kontrol listesi",
];

const faqs = [
  {
    q: "Ödemeyi nasıl yapabilirim?",
    a: "Ödemeleri Kredi Kartı ile (Shopier güvencesiyle) güvenle yapabilirsiniz.",
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
  accent: "green" | "white";
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
                  ? "bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.2)]"
                  : "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.15)]"
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

      <div className="min-h-screen bg-[#050505] pt-24 pb-20">
        {/* ── Background texture ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ccff00]/[0.025] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-[#ccff00]/[0.07] border border-[#ccff00]/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
              <span className="text-[#ccff00] text-[11px] font-semibold uppercase tracking-[0.2em]">Koçluk Paketleri</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white leading-tight mb-3">
              Hedefine Uygun <br />
              <span className="text-[#ccff00]">Paketi Seç</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              İki farklı seviyede profesyonel koçluk. Süreyi ve planı belirle, değişim başlasın.
            </p>
          </motion.div>

          {/* ── Package Cards ── */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 mb-20">

            {/* ── Natural Paket ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative"
            >
              <div className="relative h-full bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col">
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent" />

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center">
                        <Star size={13} className="text-[#ccff00]" />
                      </div>
                      <span className="text-[10px] text-[#ccff00]/70 uppercase tracking-[0.25em] font-medium">Başlangıç Seviyesi</span>
                    </div>
                    <h2 className="text-xl font-heading font-bold uppercase text-white tracking-tight">Natural Paket</h2>
                    <p className="text-gray-600 text-[12px] mt-0.5">Kapsamlı temel koçluk programı</p>
                  </div>

                  {/* Duration selector */}
                  <div className="mb-5">
                    <p className="text-[10px] text-gray-700 uppercase tracking-[0.15em] mb-2">Program Süresi</p>
                    <DurationSelector
                      options={naturalDurations}
                      selected={naturalWeeks}
                      onSelect={setNaturalWeeks}
                      accent="green"
                    />
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={naturalWeeks}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <p className="text-[38px] font-bold text-white tabular-nums leading-none tracking-tight" data-testid="text-package-price">
                          ₺{naturalPkg ? parseFloat(naturalPkg.price).toLocaleString("tr-TR") : "—"}
                        </p>
                        <p className="text-gray-600 text-[12px] mt-1">{naturalWeeks} haftalık program</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-6">
                    <div className="space-y-2">
                      {NATURAL_FEATURES.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/25 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={9} className="text-[#ccff00]" />
                          </div>
                          <span className="text-gray-400 text-[12px] leading-relaxed">{f}</span>
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
                      className="w-full h-11 rounded-xl bg-[#ccff00] text-black font-bold text-[13px] uppercase tracking-wider hover:bg-[#ccff00]/90 transition-all hover:shadow-[0_0_20px_rgba(204,255,0,0.2)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Satın Al
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
              className="relative"
            >
              {/* Glow border wrapper */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/20 via-white/[0.06] to-transparent pointer-events-none z-10" />

              {/* Recommended badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-1.5 bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <Zap size={10} />
                  Önerilen
                </div>
              </div>

              <div className="relative h-full bg-[#0d0d0d] border border-white/[0.12] rounded-2xl overflow-hidden flex flex-col">
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                {/* Subtle inner glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.025] rounded-full blur-[60px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1 relative z-10">
                  {/* Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                        <Zap size={13} className="text-white" />
                      </div>
                      <span className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-medium">Üst Seviye</span>
                    </div>
                    <h2 className="text-xl font-heading font-bold uppercase text-white tracking-tight">Team Alaf Paketi</h2>
                    <p className="text-gray-500 text-[12px] mt-0.5">İleri seviye performans koçluğu</p>
                  </div>

                  {/* Duration selector */}
                  <div className="mb-5">
                    <p className="text-[10px] text-gray-700 uppercase tracking-[0.15em] mb-2">Program Süresi</p>
                    <DurationSelector
                      options={teamDurations}
                      selected={teamWeeks}
                      onSelect={setTeamWeeks}
                      accent="white"
                    />
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={teamWeeks}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <p className="text-[38px] font-bold text-white tabular-nums leading-none tracking-tight" data-testid="text-team-alaf-price">
                          ₺{teamPkg ? parseFloat(teamPkg.price).toLocaleString("tr-TR") : "—"}
                        </p>
                        <p className="text-gray-600 text-[12px] mt-1">{teamWeeks} haftalık program</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-6 space-y-4">
                    {/* Natural base */}
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-px flex-1 bg-white/[0.06]" />
                        <span className="text-[10px] text-gray-700 uppercase tracking-[0.15em] whitespace-nowrap">Natural Paket'teki her şey</span>
                        <div className="h-px flex-1 bg-white/[0.06]" />
                      </div>
                      <div className="space-y-1.5">
                        {NATURAL_FEATURES.map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={9} className="text-gray-500" />
                            </div>
                            <span className="text-gray-600 text-[11px] leading-relaxed">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extra features */}
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-px flex-1 bg-white/[0.06]" />
                        <span className="text-[10px] text-white/60 uppercase tracking-[0.15em] whitespace-nowrap font-semibold">+ Team Alaf Extras</span>
                        <div className="h-px flex-1 bg-white/[0.06]" />
                      </div>
                      <div className="space-y-2">
                        {TEAM_ALAF_EXTRAS.map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={9} className="text-white" />
                            </div>
                            <span className="text-white/80 text-[12px] leading-relaxed">{f}</span>
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
                      className="w-full h-11 rounded-xl bg-white text-black font-bold text-[13px] uppercase tracking-wider hover:bg-white/90 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Satın Al
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── FAQ ── */}
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
                <span className="text-[11px] text-[#ccff00]/70 uppercase tracking-[0.2em]">Sıkça Sorulan Sorular</span>
              </div>
              <h2 className="text-xl font-heading font-bold uppercase text-white">Aklına Takılanlar</h2>
              <p className="text-gray-600 text-sm mt-2">
                Cevap bulamazsan{" "}
                <a
                  href="https://wa.me/905000000000"
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
