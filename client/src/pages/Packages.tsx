import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Loader2, Zap } from "lucide-react";
import { Link } from "wouter";
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

const PROCESS_STEPS = [
  { n: "01", title: "Paketi seç", desc: "İhtiyacına ve hedefine göre Natural ya da Team Alaf paketlerinden birini seç." },
  { n: "02", title: "Ödemeyi tamamla", desc: "Shopier güvencesiyle kredi kartıyla güvenle öde." },
  { n: "03", title: "Programa başla", desc: "WhatsApp ile iletişime geçiyorum, programın Google Sheets ile paylaşılır." },
];

const faqs = [
  { q: "Ödemeyi nasıl yapabilirim?", a: "Ödemeleri kredi kartı ile (Shopier güvencesiyle) güvenle yapabilirsiniz." },
  { q: "Programlar nasıl teslim ediliyor?", a: "Satın alım sonrası WhatsApp üzerinden iletişime geçiyorum. Antrenman ve beslenme programlarınız size özel Google Sheets dosyası üzerinden paylaşılır." },
  { q: "Salona gitmek zorunda mıyım?", a: "Evet. Programlar spor salonu ekipmanlarına göre hazırlanmaktadır. Etkili sonuçlar için spor salonu üyeliği gerekmektedir." },
  { q: "Natural ve Team Alaf arasındaki fark nedir?", a: "Team Alaf Paketi, Natural Paket'teki tüm hizmetleri kapsar; bunlara ek olarak ileri seviye performans protokolü, kan değerleri takibi ve detaylı analiz hizmetleri de dahildir." },
  { q: "İptal ve iade hakkım var mı?", a: "Dijital içerik ve kişiye özel hizmet olduğu için program hazırlandıktan sonra iade yapılmamaktadır. Ancak sağlık sorunu gibi durumlarda üyelik dondurma hakkınız saklıdır." },
];

/* ── week pills ─────────────────────────────────────────────── */
function WeekPills({ options, selected, onSelect, color }: { options: number[]; selected: number; onSelect: (w: number) => void; color: string }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(w => {
        const active = selected === w;
        return (
          <button key={w} onClick={() => onSelect(w)} data-testid={`button-duration-${w}`}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all duration-200"
            style={{
              background: active ? color : "rgba(255,255,255,0.05)",
              color: active ? "#050505" : "rgba(255,255,255,0.35)",
              border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
            }}>
            {w} Hafta
          </button>
        );
      })}
    </div>
  );
}

/* ── faq ────────────────────────────────────────────────────── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between py-5 gap-4">
          <span className="text-[13px] font-medium text-white leading-snug">{q}</span>
          <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: open ? "#ccff00" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-[12px] font-bold leading-none" style={{ color: open ? "#050505" : "rgba(255,255,255,0.4)" }}>+</span>
            </div>
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[13px] leading-relaxed pb-5 pr-8" style={{ color: "rgba(255,255,255,0.45)" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── main ────────────────────────────────────────────────────── */
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

  const active = Array.isArray(packages) ? packages.filter(p => p.isActive) : [];
  const naturalPkgs = active.filter(p => !p.name.includes("Team Alaf")).sort((a, b) => a.weeks - b.weeks);
  const teamPkgs = active.filter(p => p.name.includes("Team Alaf")).sort((a, b) => a.weeks - b.weeks);

  const naturalPkg = naturalPkgs.find(p => p.weeks === naturalWeeks);
  const teamPkg = teamPkgs.find(p => p.weeks === teamWeeks);
  const naturalDurations = naturalPkgs.length ? naturalPkgs.map(p => p.weeks) : [8, 12, 16, 24];
  const teamDurations = teamPkgs.length ? teamPkgs.map(p => p.weeks) : [12, 24];

  useEffect(() => { if (!naturalDurations.includes(naturalWeeks)) setNaturalWeeks(naturalDurations[Math.floor(naturalDurations.length / 2)]); }, []);
  useEffect(() => { if (!teamDurations.includes(teamWeeks)) setTeamWeeks(teamDurations[0]); }, []);

  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current && !isLoading) {
      trackViewContent("Koçluk Paketleri", "Fitness Koçluk");
      tracked.current = true;
    }
  }, [isLoading]);

  const packagesSchema = {
    "@context": "https://schema.org", "@type": "ItemList",
    name: "Online Fitness Koçluk Paketleri",
    description: "Natural Paket ve Team Alaf Paketi — 8 ila 24 haftalık kişiye özel online fitness koçluk programları.",
    itemListElement: [
      { "@type": "ListItem", position: 1, item: { "@type": "Product", name: "Natural Paket", offers: { "@type": "AggregateOffer", priceCurrency: "TRY", lowPrice: "5950", highPrice: "12000" } } },
      { "@type": "ListItem", position: 2, item: { "@type": "Product", name: "Team Alaf Paketi", offers: { "@type": "AggregateOffer", priceCurrency: "TRY", lowPrice: "12995", highPrice: "23500" } } },
    ],
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#ccff00" }} />
    </div>
  );

  return (
    <>
      <SEO
        title="Online Fitness Koçluk Paketleri | Natural & Team Alaf | Gokalaf"
        description="Natural Paket ve Team Alaf Paketi — kişiye özel online fitness koçluk programları. 8 ila 24 haftalık seçenekler, antrenman, beslenme, haftalık takip ve WhatsApp iletişimi dahil."
        keywords="online fitness paketi, koçluk paketi, team alaf, natural paket, antrenman programı, beslenme programı, online PT fiyatları"
        canonical="https://gokalaf.com/paketler"
        schema={packagesSchema}
      />

      <div className="min-h-screen bg-[#050505]">

        {/* subtle ambient */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-96 h-96 opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #ccff00, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #d4a017, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div className="relative z-10 pt-28 md:pt-32 pb-24">
          <div className="container mx-auto px-4 max-w-5xl">

            {/* ── PAGE HEADER ─────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-12 md:mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: "#ccff00" }} />
                <span className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: "rgba(204,255,0,0.8)" }}>
                  Koçluk Paketleri
                </span>
              </div>
              <h1 className="font-heading font-black text-white uppercase mb-3"
                style={{ fontSize: "clamp(28px,5vw,48px)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                Hedefine Uygun Paketi Seç
              </h1>
              <p className="text-[13px] max-w-sm" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                İki farklı seviyede profesyonel koçluk — süreyi belirle, kişisel programın hazır olsun.
              </p>
            </motion.div>

            {/* ── MOBILE TAB ──────────────────────────────────── */}
            <div className="lg:hidden mb-6">
              <div className="inline-flex rounded-xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <button onClick={() => setMobileTab("natural")} data-testid="button-tab-natural"
                  className="px-5 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wide transition-all"
                  style={{ background: mobileTab === "natural" ? "#ccff00" : "transparent", color: mobileTab === "natural" ? "#050505" : "rgba(255,255,255,0.4)" }}>
                  Natural
                </button>
                <button onClick={() => setMobileTab("team")} data-testid="button-tab-team"
                  className="px-5 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wide transition-all"
                  style={{ background: mobileTab === "team" ? "#d4a017" : "transparent", color: mobileTab === "team" ? "#050505" : "rgba(255,255,255,0.4)" }}>
                  Team Alaf
                </button>
              </div>
            </div>

            {/* ── CARDS ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-24">

              {/* Natural */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={mobileTab === "team" ? "hidden lg:flex flex-col" : "flex flex-col"}>
                <div className="flex flex-col flex-1 rounded-2xl overflow-hidden"
                  style={{ background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.08)" }}>

                  {/* accent line */}
                  <div className="h-[1.5px]" style={{ background: "linear-gradient(90deg, #ccff00 0%, rgba(204,255,0,0.2) 60%, transparent 100%)" }} />

                  <div className="flex flex-col flex-1 p-6">

                    {/* header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: "#ccff00" }}>Natural Paket</p>
                        <h2 className="text-xl font-heading font-bold text-white uppercase leading-tight" style={{ letterSpacing: "-0.02em" }}>
                          Temel Koçluk
                        </h2>
                        <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Kapsamlı kişisel program</p>
                      </div>
                    </div>

                    {/* week selector */}
                    <div className="mb-5">
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>Süre</p>
                      <WeekPills options={naturalDurations} selected={naturalWeeks} onSelect={setNaturalWeeks} color="#ccff00" />
                    </div>

                    {/* price */}
                    <div className="mb-6 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <AnimatePresence mode="wait">
                        <motion.div key={naturalWeeks}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}>
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>₺</span>
                            <span className="text-[40px] font-heading font-black text-white tabular-nums leading-none" style={{ letterSpacing: "-0.04em" }} data-testid="text-package-price">
                              {naturalPkg ? parseFloat(naturalPkg.price).toLocaleString("tr-TR") : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>{naturalWeeks} haftalık program</span>
                            {naturalPkg && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "rgba(204,255,0,0.1)", color: "#ccff00" }}>
                                ≈ ₺{Math.round(parseFloat(naturalPkg.price) / (naturalWeeks * 7))}/gün
                              </span>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* features */}
                    <div className="flex-1 space-y-2.5 mb-6">
                      {NATURAL_FEATURES.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="mt-[3px] shrink-0 w-[14px] h-[14px] rounded-full flex items-center justify-center"
                            style={{ background: "rgba(204,255,0,0.1)", border: "1px solid rgba(204,255,0,0.25)" }}>
                            <Check className="w-2 h-2" style={{ color: "#ccff00" }} strokeWidth={3} />
                          </div>
                          <span className="text-[12.5px] leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* cta */}
                    <Link href={naturalPkg ? `/odeme?weeks=${naturalWeeks}` : "#"}>
                      <button
                        onClick={() => naturalPkg && trackAddToCart(`${naturalWeeks} Haftalık Natural Paket`, naturalPkg.id, parseFloat(naturalPkg.price))}
                        disabled={!naturalPkg}
                        data-testid="button-buy-natural"
                        className="w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "#ccff00", color: "#050505" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 24px rgba(204,255,0,0.3)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                        Satın Al — {naturalWeeks} Hafta
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Team Alaf */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className={`relative ${mobileTab === "natural" ? "hidden lg:flex flex-col" : "flex flex-col"}`}>

                {/* outer glow border */}
                <div className="absolute -inset-px rounded-2xl pointer-events-none z-0"
                  style={{ background: "linear-gradient(145deg, rgba(212,160,23,0.4), rgba(212,160,23,0.05) 50%, transparent)" }} />

                {/* badge */}
                <div className="absolute -top-3.5 right-5 z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: "#d4a017", color: "#050505", boxShadow: "0 0 16px rgba(212,160,23,0.45)" }}>
                    <Zap className="w-2.5 h-2.5" />
                    Sık Tercih
                  </div>
                </div>

                <div className="relative z-10 flex flex-col flex-1 rounded-2xl overflow-hidden"
                  style={{ background: "#0a0802", border: "1px solid rgba(212,160,23,0.25)" }}>

                  <div className="h-[1.5px]" style={{ background: "linear-gradient(90deg, #d4a017 0%, rgba(212,160,23,0.2) 60%, transparent 100%)" }} />

                  <div className="flex flex-col flex-1 p-6 pt-8">

                    {/* header */}
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: "#d4a017" }}>Team Alaf Paketi</p>
                      <h2 className="text-xl font-heading font-bold text-white uppercase leading-tight" style={{ letterSpacing: "-0.02em" }}>
                        Performans Koçluğu
                      </h2>
                      <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>İleri seviye protokol + kan değeri takibi</p>
                    </div>

                    {/* week selector */}
                    <div className="mb-5">
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>Süre</p>
                      <WeekPills options={teamDurations} selected={teamWeeks} onSelect={setTeamWeeks} color="#d4a017" />
                    </div>

                    {/* price */}
                    <div className="mb-6 pb-6" style={{ borderBottom: "1px solid rgba(212,160,23,0.12)" }}>
                      <AnimatePresence mode="wait">
                        <motion.div key={teamWeeks}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}>
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>₺</span>
                            <span className="text-[40px] font-heading font-black text-white tabular-nums leading-none" style={{ letterSpacing: "-0.04em" }} data-testid="text-team-alaf-price">
                              {teamPkg ? parseFloat(teamPkg.price).toLocaleString("tr-TR") : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>{teamWeeks} haftalık program</span>
                            {teamPkg && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "rgba(212,160,23,0.12)", color: "#d4a017" }}>
                                ≈ ₺{Math.round(parseFloat(teamPkg.price) / (teamWeeks * 7))}/gün
                              </span>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* features */}
                    <div className="flex-1 space-y-3 mb-6">
                      {/* natural included */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                          <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.2)" }}>
                            Natural dahil
                          </span>
                          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                        </div>
                        <div className="space-y-2">
                          {NATURAL_FEATURES.map((f, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="mt-[3px] shrink-0 w-[14px] h-[14px] rounded-full flex items-center justify-center"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}>
                                <Check className="w-2 h-2 text-white/50" strokeWidth={3} />
                              </div>
                              <span className="text-[12px] leading-snug" style={{ color: "rgba(255,255,255,0.38)" }}>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* extras */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.2)" }} />
                          <span className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: "#d4a017" }}>
                            + Ekstralar
                          </span>
                          <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.2)" }} />
                        </div>
                        <div className="space-y-2.5">
                          {TEAM_ALAF_EXTRAS.map((f, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="mt-[3px] shrink-0 w-[14px] h-[14px] rounded-full flex items-center justify-center"
                                style={{ background: "rgba(212,160,23,0.15)", border: "1px solid rgba(212,160,23,0.4)" }}>
                                <Check className="w-2 h-2" style={{ color: "#d4a017" }} strokeWidth={3} />
                              </div>
                              <span className="text-[12.5px] leading-snug font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* cta */}
                    <Link href={teamPkg ? `/odeme?weeks=${teamWeeks}&packageId=${teamPkg.id}` : "#"}>
                      <button
                        onClick={() => teamPkg && trackAddToCart(`${teamWeeks} Haftalık Team Alaf Paketi`, teamPkg.id, parseFloat(teamPkg.price))}
                        disabled={!teamPkg}
                        data-testid="button-buy-team-alaf"
                        className="w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "#d4a017", color: "#050505" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 28px rgba(212,160,23,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                        Satın Al — {teamWeeks} Hafta
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* ── PROCESS ─────────────────────────────────────── */}
            <div className="mb-24">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4 }} className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6" style={{ background: "#ccff00" }} />
                  <span className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: "rgba(204,255,0,0.7)" }}>
                    Nasıl Başlarım
                  </span>
                </div>
                <h2 className="font-heading font-bold text-white uppercase mt-3"
                  style={{ fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.02em" }}>
                  3 Adımda Başla
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PROCESS_STEPS.map((s, i) => (
                  <motion.div key={s.n}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-xl p-5 transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(204,255,0,0.15)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                    <span className="font-heading font-black text-[32px] leading-none select-none"
                      style={{ color: "rgba(204,255,0,0.1)", WebkitTextStroke: "1px rgba(204,255,0,0.15)" }}>
                      {s.n}
                    </span>
                    <h3 className="font-heading font-bold text-white uppercase text-[14px] mt-3 mb-2"
                      style={{ letterSpacing: "-0.01em" }}>
                      {s.title}
                    </h3>
                    <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── FAQ ─────────────────────────────────────────── */}
            <div className="mb-24 max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4 }} className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6" style={{ background: "#ccff00" }} />
                  <span className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: "rgba(204,255,0,0.7)" }}>
                    SSS
                  </span>
                </div>
                <h2 className="font-heading font-bold text-white uppercase mt-3"
                  style={{ fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.02em" }}>
                  Aklına Takılanlar
                </h2>
              </motion.div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {faqs.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} index={i} />
                ))}
              </div>

              <p className="text-[12px] mt-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                Başka soran var mı?{" "}
                <a href="https://wa.me/905312822402" className="transition-colors hover:text-white"
                  style={{ color: "rgba(204,255,0,0.6)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  WhatsApp hattından yaz.
                </a>
              </p>
            </div>

            {/* ── BOTTOM STRIP ────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <p className="text-[13px] font-semibold text-white mb-1">Hâlâ kararsız mısın?</p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Hangi paketi seçeceğini doğrudan konuşabilirsin.
                </p>
              </div>
              <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer" className="shrink-0">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wide transition-all duration-200"
                  style={{ background: "#ccff00", color: "#050505" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(204,255,0,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
                  WhatsApp'tan Yaz
                </button>
              </a>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
