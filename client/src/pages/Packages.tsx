import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";
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

/* ── feature lists ──────────────────────────────────────────── */
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
  { n: "01", title: "Paketi seç", desc: "İhtiyacına ve hedefine göre Natural ya da Team Alaf paketlerinden birini seç, süreyi belirle." },
  { n: "02", title: "Ödemeyi tamamla", desc: "Shopier güvencesiyle kredi kartıyla güvenle öde. Birkaç dakika içinde onay mesajı gelir." },
  { n: "03", title: "Programa başla", desc: "WhatsApp üzerinden iletişime geçiyorum. Kişisel programın Google Sheets ile anında paylaşılır." },
];

const faqs = [
  { q: "Ödemeyi nasıl yapabilirim?", a: "Ödemeleri kredi kartı ile (Shopier güvencesiyle) güvenle yapabilirsiniz." },
  { q: "Programlar nasıl teslim ediliyor?", a: "Satın alım sonrası WhatsApp üzerinden iletişime geçiyorum. Antrenman ve beslenme programlarınız size özel Google Sheets dosyası üzerinden eş zamanlı olarak paylaşılır." },
  { q: "Salona gitmek zorunda mıyım?", a: "Evet. Programlar spor salonu ekipmanlarına göre hazırlanmaktadır. Etkili sonuçlar için spor salonu üyeliği gerekmektedir." },
  { q: "Natural ve Team Alaf arasındaki fark nedir?", a: "Team Alaf Paketi, Natural Paket'teki tüm hizmetleri kapsar; bunlara ek olarak ileri seviye performans protokolü, kan değerleri takibi ve sporcu sağlığı odaklı detaylı analiz hizmetleri de dahildir." },
  { q: "İptal ve iade hakkım var mı?", a: "Dijital içerik ve kişiye özel hizmet olduğu için program hazırlandıktan sonra iade yapılmamaktadır. Ancak sağlık sorunu gibi durumlarda üyelik dondurma hakkınız saklıdır." },
];

/* ── marquee ─────────────────────────────────────────────────── */
const MARQUEE_TEXT = "ANTRENMan · BESLenme · KARDİYO · HAFTALIK TAKİP · FORM ANALİZİ · WHATSAPP · MAKRO GÜNCELLEMESI · ";

function Marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap select-none pointer-events-none" aria-hidden>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        className="inline-block"
      >
        {[MARQUEE_TEXT, MARQUEE_TEXT].map((t, i) => (
          <span key={i} className="font-heading font-black uppercase tracking-widest text-[11px] mr-0"
            style={{ color: "rgba(255,255,255,0.055)" }}>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── week selector ───────────────────────────────────────────── */
function WeekSelector({ options, selected, onSelect, color }: { options: number[]; selected: number; onSelect: (w: number) => void; color: string }) {
  return (
    <div className="flex gap-2">
      {options.map(w => {
        const active = selected === w;
        return (
          <button key={w} onClick={() => onSelect(w)}
            data-testid={`button-duration-${w}`}
            className="relative flex-1 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide transition-all duration-250"
            style={{
              background: active ? color : "rgba(255,255,255,0.04)",
              color: active ? "#050505" : "rgba(255,255,255,0.35)",
              border: active ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.07)",
              boxShadow: active ? `0 0 18px ${color}40` : "none",
            }}>
            {w}<span className="text-[10px] font-medium">h</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── feature item ────────────────────────────────────────────── */
function FeatureItem({ text, color, delay = 0 }: { text: string; color: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      className="flex items-start gap-3 group"
    >
      <div className="mt-[5px] w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center transition-all duration-300"
        style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
        <Check className="w-2 h-2" style={{ color }} strokeWidth={3} />
      </div>
      <span className="text-[13px] leading-relaxed transition-colors duration-200 group-hover:text-white"
        style={{ color: "rgba(255,255,255,0.6)" }}>
        {text}
      </span>
    </motion.div>
  );
}

/* ── animated price ──────────────────────────────────────────── */
function PriceDisplay({ price, weeks, color }: { price: string | undefined; weeks: number; color: string }) {
  const formatted = price ? parseFloat(price).toLocaleString("tr-TR") : "—";
  return (
    <AnimatePresence mode="wait">
      <motion.div key={weeks}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.3)" }}>₺</span>
          <span className="font-heading font-black leading-none tabular-nums"
            style={{ fontSize: "clamp(42px, 7vw, 68px)", letterSpacing: "-0.04em", color: "white" }}>
            {formatted}
          </span>
        </div>
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          {weeks} Haftalık Program
          {price && (
            <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold"
              style={{ background: `${color}15`, color }}>
              ≈ ₺{Math.round(parseFloat(price) / (weeks * 7)).toLocaleString("tr-TR")}/gün
            </span>
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── faq item ────────────────────────────────────────────────── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ background: open ? "rgba(204,255,0,0.04)" : "rgba(255,255,255,0.025)", border: `1px solid ${open ? "rgba(204,255,0,0.2)" : "rgba(255,255,255,0.07)"}` }}
      onClick={() => setOpen(o => !o)}>
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <span className="text-[13px] md:text-sm font-medium text-white leading-snug">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <ChevronDown className="w-4 h-4" style={{ color: open ? "#ccff00" : "rgba(255,255,255,0.3)" }} />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <div className="px-6 pb-5 border-t border-white/[0.06]">
              <p className="text-[13px] leading-relaxed pt-4" style={{ color: "rgba(255,255,255,0.5)" }}>{a}</p>
            </div>
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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Paketler yüklenemedi");
      const data = await res.json();
      return data.packages || [];
    },
  });

  const activePackages = Array.isArray(packages) ? packages.filter(p => p.isActive) : [];
  const naturalPackages = activePackages.filter(p => !p.name.includes("Team Alaf")).sort((a, b) => a.weeks - b.weeks);
  const teamPackages = activePackages.filter(p => p.name.includes("Team Alaf")).sort((a, b) => a.weeks - b.weeks);

  const naturalPkg = naturalPackages.find(p => p.weeks === naturalWeeks);
  const teamPkg = teamPackages.find(p => p.weeks === teamWeeks);
  const naturalDurations = naturalPackages.length ? naturalPackages.map(p => p.weeks) : [8, 12, 16, 24];
  const teamDurations = teamPackages.length ? teamPackages.map(p => p.weeks) : [12, 24];

  useEffect(() => { if (!naturalDurations.includes(naturalWeeks)) setNaturalWeeks(naturalDurations[0]); }, []);
  useEffect(() => { if (!teamDurations.includes(teamWeeks)) setTeamWeeks(teamDurations[0]); }, []);

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
      { "@type": "ListItem", position: 1, item: { "@type": "Product", name: "Natural Paket", offers: { "@type": "AggregateOffer", priceCurrency: "TRY", lowPrice: "5950", highPrice: "12000" } } },
      { "@type": "ListItem", position: 2, item: { "@type": "Product", name: "Team Alaf Paketi", offers: { "@type": "AggregateOffer", priceCurrency: "TRY", lowPrice: "12995", highPrice: "23500" } } },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#ccff00" }} />
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

      <div className="min-h-screen bg-[#050505] overflow-x-hidden">

        {/* ── AMBIENT ─────────────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-1/2 h-full opacity-[0.018]"
            style={{ background: "radial-gradient(ellipse at top left, #ccff00, transparent 60%)" }} />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.015]"
            style={{ background: "radial-gradient(ellipse at top right, #d4a017, transparent 60%)" }} />
        </div>

        {/* ── HERO ────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative pt-32 md:pt-40 pb-16 md:pb-20 z-10">

          {/* Marquee strip */}
          <motion.div style={{ y: heroY }} className="mb-10 md:mb-14">
            <Marquee />
          </motion.div>

          {/* Heading */}
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-12 md:mb-16">
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold mb-4" style={{ color: "rgba(204,255,0,0.7)" }}>
                Koçluk Paketleri
              </p>
              <h1 className="font-heading font-black text-white uppercase leading-[0.9] mb-5"
                style={{ fontSize: "clamp(42px, 9vw, 100px)", letterSpacing: "-0.04em" }}>
                Hedefini Seç.<br />
                <span style={{ color: "#ccff00" }}>Değişimi</span> Başlat.
              </h1>
              <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                İki farklı seviyede profesyonel koçluk — süreyi belirle, kişisel programın hazır olsun.
              </p>
            </motion.div>

            {/* ── MOBILE TAB SWITCHER ─────────────────────────── */}
            <div className="lg:hidden max-w-xs mx-auto mb-8">
              <div className="flex rounded-2xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <button onClick={() => setMobileTab("natural")} data-testid="button-tab-natural"
                  className="flex-1 py-3 rounded-xl text-[12px] font-bold uppercase tracking-wide transition-all duration-200"
                  style={{ background: mobileTab === "natural" ? "#ccff00" : "transparent", color: mobileTab === "natural" ? "#050505" : "rgba(255,255,255,0.4)", boxShadow: mobileTab === "natural" ? "0 0 20px rgba(204,255,0,0.3)" : "none" }}>
                  Natural
                </button>
                <button onClick={() => setMobileTab("team")} data-testid="button-tab-team"
                  className="flex-1 py-3 rounded-xl text-[12px] font-bold uppercase tracking-wide transition-all duration-200"
                  style={{ background: mobileTab === "team" ? "#d4a017" : "transparent", color: mobileTab === "team" ? "#050505" : "rgba(255,255,255,0.4)", boxShadow: mobileTab === "team" ? "0 0 20px rgba(212,160,23,0.35)" : "none" }}>
                  Team Alaf
                </button>
              </div>
            </div>

            {/* ── PACKAGE CARDS ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-6">

              {/* ─ Natural Paket ─ */}
              <motion.div
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={mobileTab === "team" ? "hidden lg:block" : ""}>

                <div className="relative h-full rounded-3xl overflow-hidden flex flex-col"
                  style={{ background: "rgba(12,12,12,1)", border: "1px solid rgba(255,255,255,0.08)" }}>

                  {/* Top neon line */}
                  <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #ccff00 30%, #ccff00 70%, transparent)" }} />

                  {/* Glow */}
                  <div className="absolute top-0 left-0 w-72 h-72 pointer-events-none rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(204,255,0,0.06), transparent 70%)", filter: "blur(40px)", transform: "translate(-30%, -30%)" }} />

                  <div className="relative z-10 flex flex-col flex-1 p-7 md:p-8">

                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                          style={{ background: "rgba(204,255,0,0.1)", border: "1px solid rgba(204,255,0,0.2)", color: "#ccff00" }}>
                          Natural
                        </div>
                      </div>
                      <h2 className="font-heading font-black text-white uppercase leading-tight mb-1"
                        style={{ fontSize: "clamp(26px,4vw,36px)", letterSpacing: "-0.03em" }}>
                        Temel Koçluk
                      </h2>
                      <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Kişiselleştirilmiş kapsamlı fitness koçluğu
                      </p>
                    </div>

                    {/* Week selector */}
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Program Süresi
                      </p>
                      <WeekSelector options={naturalDurations} selected={naturalWeeks} onSelect={setNaturalWeeks} color="#ccff00" />
                    </div>

                    {/* Price */}
                    <div className="mb-8 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <PriceDisplay price={naturalPkg?.price} weeks={naturalWeeks} color="#ccff00" />
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-3 mb-8">
                      {NATURAL_FEATURES.map((f, i) => (
                        <FeatureItem key={i} text={f} color="#ccff00" delay={i * 0.03} />
                      ))}
                    </div>

                    {/* CTA */}
                    <Link href={naturalPkg ? `/odeme?weeks=${naturalWeeks}` : "#"}>
                      <button
                        onClick={() => naturalPkg && trackAddToCart(`${naturalWeeks} Haftalık Natural Paket`, naturalPkg.id, parseFloat(naturalPkg.price))}
                        disabled={!naturalPkg}
                        data-testid="button-buy-natural"
                        className="w-full py-4 rounded-2xl font-bold text-[14px] uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                        style={{ background: "#ccff00", color: "#050505", boxShadow: "0 0 28px rgba(204,255,0,0)" }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 32px rgba(204,255,0,0.35)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 28px rgba(204,255,0,0)")}>
                        Satın Al — {naturalWeeks} Hafta
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* ─ Team Alaf Paketi ─ */}
              <motion.div
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`relative ${mobileTab === "natural" ? "hidden lg:block" : ""}`}>

                {/* Outer glow border */}
                <div className="absolute -inset-[1px] rounded-3xl pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.5) 0%, rgba(212,160,23,0.1) 50%, transparent 100%)" }} />

                {/* "Sık tercih" badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]"
                    style={{ background: "#d4a017", color: "#050505", boxShadow: "0 0 24px rgba(212,160,23,0.5)" }}>
                    ★ Sık Tercih Edilen
                  </div>
                </div>

                <div className="relative h-full rounded-3xl overflow-hidden flex flex-col"
                  style={{ background: "rgba(10,8,3,1)", border: "1px solid rgba(212,160,23,0.3)" }}>

                  {/* Top gold line */}
                  <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #d4a017 30%, #d4a017 70%, transparent)" }} />

                  {/* Glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(212,160,23,0.08), transparent 70%)", filter: "blur(50px)", transform: "translate(30%, -30%)" }} />

                  <div className="relative z-10 flex flex-col flex-1 p-7 md:p-8 pt-10 md:pt-12">

                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                          style={{ background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.3)", color: "#d4a017" }}>
                          Team Alaf
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: "rgba(212,160,23,0.6)" }}>İleri Seviye</span>
                      </div>
                      <h2 className="font-heading font-black text-white uppercase leading-tight mb-1"
                        style={{ fontSize: "clamp(26px,4vw,36px)", letterSpacing: "-0.03em" }}>
                        Performans Koçluğu
                      </h2>
                      <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        İleri seviye protokol + sporcu sağlığı takibi
                      </p>
                    </div>

                    {/* Week selector */}
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Program Süresi
                      </p>
                      <WeekSelector options={teamDurations} selected={teamWeeks} onSelect={setTeamWeeks} color="#d4a017" />
                    </div>

                    {/* Price */}
                    <div className="mb-8 pb-8" style={{ borderBottom: "1px solid rgba(212,160,23,0.12)" }}>
                      <PriceDisplay price={teamPkg?.price} weeks={teamWeeks} color="#d4a017" />
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-5 mb-8">

                      {/* Included natural features */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
                            Natural Paket dahil
                          </span>
                          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                        </div>
                        <div className="space-y-3">
                          {NATURAL_FEATURES.map((f, i) => (
                            <FeatureItem key={i} text={f} color="rgba(255,255,255,0.5)" delay={i * 0.02} />
                          ))}
                        </div>
                      </div>

                      {/* Team Alaf extras */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.25)" }} />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#d4a017" }}>
                            + Ekstra Ayrıcalıklar
                          </span>
                          <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.25)" }} />
                        </div>
                        <div className="space-y-3">
                          {TEAM_ALAF_EXTRAS.map((f, i) => (
                            <FeatureItem key={i} text={f} color="#d4a017" delay={i * 0.05} />
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
                        className="w-full py-4 rounded-2xl font-bold text-[14px] uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                        style={{ background: "#d4a017", color: "#050505", boxShadow: "0 0 28px rgba(212,160,23,0)" }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 36px rgba(212,160,23,0.45)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 28px rgba(212,160,23,0)")}>
                        Satın Al — {teamWeeks} Hafta
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* ── PROCESS ─────────────────────────────────────── */}
            <div className="mt-28 md:mt-36">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5 }} className="text-center mb-14">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4" style={{ color: "rgba(204,255,0,0.6)" }}>
                  Süreç
                </p>
                <h2 className="font-heading font-black text-white uppercase leading-tight"
                  style={{ fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.03em" }}>
                  Başlamak Çok Kolay
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PROCESS_STEPS.map((step, i) => (
                  <motion.div key={step.n}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative group rounded-2xl p-7 transition-all duration-400 hover:-translate-y-1"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(204,255,0,0.2)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                    <div className="font-heading font-black text-[56px] leading-none mb-5 select-none"
                      style={{ color: "rgba(204,255,0,0.07)", WebkitTextStroke: "1px rgba(204,255,0,0.12)" }}>
                      {step.n}
                    </div>
                    <h3 className="font-heading font-bold text-white uppercase text-lg mb-3 leading-tight"
                      style={{ letterSpacing: "-0.02em" }}>
                      {step.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── FAQ ─────────────────────────────────────────── */}
            <div className="mt-28 md:mt-36 max-w-2xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5 }} className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4" style={{ color: "rgba(204,255,0,0.6)" }}>
                  SSS
                </p>
                <h2 className="font-heading font-black text-white uppercase leading-tight mb-4"
                  style={{ fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em" }}>
                  Aklına Takılanlar
                </h2>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Cevap bulamazsan{" "}
                  <a href="https://wa.me/905312822402" className="transition-colors hover:text-white underline underline-offset-4"
                    style={{ color: "rgba(204,255,0,0.6)" }}>
                    WhatsApp hattından
                  </a>{" "}
                  yazabilirsin.
                </p>
              </motion.div>

              <div className="space-y-3">
                {faqs.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            </div>

            {/* ── BOTTOM CTA ──────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-28 md:mt-36 relative rounded-3xl overflow-hidden text-center py-16 px-8">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(204,255,0,0.07) 0%, transparent 50%, rgba(212,160,23,0.05) 100%)", border: "1px solid rgba(255,255,255,0.08)" }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(204,255,0,0.05), transparent 70%)" }} />
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4" style={{ color: "rgba(204,255,0,0.7)" }}>
                  Hâlâ Kararsız mısın?
                </p>
                <h2 className="font-heading font-black text-white uppercase mb-3"
                  style={{ fontSize: "clamp(24px,4vw,40px)", letterSpacing: "-0.03em" }}>
                  Sorularını Sormaktan Çekinme
                </h2>
                <p className="text-[13px] mb-8 max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Hangi paketi seçeceğinden emin değilsen WhatsApp üzerinden doğrudan konuşabiliriz.
                </p>
                <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer">
                  <button className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: "#ccff00", color: "#050505", boxShadow: "0 0 0 rgba(204,255,0,0)" }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 36px rgba(204,255,0,0.3)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0 rgba(204,255,0,0)")}>
                    WhatsApp'tan Yaz
                  </button>
                </a>
              </div>
            </motion.div>

          </div>

          <div className="h-16 md:h-24" />
        </section>
      </div>
    </>
  );
}
