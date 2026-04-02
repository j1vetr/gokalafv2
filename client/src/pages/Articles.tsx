import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search, Dumbbell, Utensils, Pill, X, ArrowRight } from "lucide-react";
import { articles, categories } from "@shared/articles-data";
import SEO from "@/components/SEO";

/* ─── Category config ──────────────────────────────────────── */
const CAT: Record<string, { color: string; dim: string; icon: any; label: string }> = {
  antrenman:  { color: "#60a5fa", dim: "rgba(96,165,250,0.13)",  icon: Dumbbell, label: "Antrenman" },
  beslenme:   { color: "#ccff00", dim: "rgba(204,255,0,0.13)",   icon: Utensils,  label: "Beslenme"  },
  takviyeler: { color: "#c084fc", dim: "rgba(192,132,252,0.13)", icon: Pill,      label: "Takviyeler"},
};
const DEFAULT_CAT = { color: "#ccff00", dim: "rgba(204,255,0,0.10)", icon: null, label: "" };

function getCat(id: string) { return CAT[id] ?? DEFAULT_CAT; }

/* ─── Animated counter ─────────────────────────────────────── */
function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}</>;
}

/* ─── Featured card ────────────────────────────────────────── */
function FeaturedCard({ article }: { article: (typeof articles)[0] }) {
  const conf = getCat(article.category);
  const Icon = conf.icon;

  return (
    <Link href={`/yazilar/${article.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full rounded-2xl overflow-hidden cursor-pointer"
        style={{ minHeight: 340 }}
        data-testid={`article-featured-${article.slug}`}
      >
        {/* Full-bleed image */}
        <div className="absolute inset-0">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
            loading="eager"
          />
          {/* Left-to-right gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 md:via-[#050505]/70 to-[#050505]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 to-transparent" />
        </div>

        {/* Badges */}
        <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{ background: conf.dim, color: conf.color, border: `1px solid ${conf.color}30` }}
          >
            {Icon && <Icon size={10} />}
            {conf.label || article.category}
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10">
            Öne Çıkan
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10 md:max-w-[58%]" style={{ minHeight: 340 }}>
          <h2 className="font-heading font-black text-white text-2xl md:text-3xl lg:text-[2.25rem] leading-tight mb-3 group-hover:text-primary transition-colors duration-500">
            {article.title}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2 md:line-clamp-3 max-w-md">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Devamını Oku</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 group-hover:border-primary/60 group-hover:bg-primary/10 transition-all"
            >
              <ArrowUpRight size={14} className="text-white group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Regular card ─────────────────────────────────────────── */
function ArticleCard({ article, index }: { article: (typeof articles)[0]; index: number }) {
  const conf = getCat(article.category);
  const Icon = conf.icon;

  return (
    <Link href={`/yazilar/${article.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35), ease: [0.16, 1, 0.3, 1] }}
        className="group flex flex-col h-full rounded-xl overflow-hidden cursor-pointer border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
        style={{ background: "rgba(255,255,255,0.025)" }}
        data-testid={`article-card-${article.slug}`}
      >
        {/* Image */}
        <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: "16/9" }}>
          {article.heroImage ? (
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full" style={{ background: conf.dim }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent" />

          {/* Category chip */}
          <span
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: conf.dim, color: conf.color, border: `1px solid ${conf.color}25`, backdropFilter: "blur(8px)" }}
          >
            {Icon && <Icon size={9} />}
            {conf.label || article.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {article.publishedAt && (
            <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-2 font-medium">
              {new Date(article.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}

          <h3 className="font-heading font-bold text-white text-sm leading-snug mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 flex-grow">
            {article.title}
          </h3>

          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] font-bold mt-auto" style={{ color: conf.color }}>
            Devamını Oku
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

/* ─── Main page ────────────────────────────────────────────── */
export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const all = articles.length;
    const bycat: Record<string, number> = {};
    articles.forEach(a => { bycat[a.category] = (bycat[a.category] || 0) + 1; });
    return { all, bycat };
  }, []);

  const filtered = useMemo(() => {
    let result = [...articles];
    if (selectedCategory) result = result.filter(a => a.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (!a.publishedAt && !b.publishedAt) return 0;
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
    return result;
  }, [selectedCategory, searchQuery]);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const hasFilter = !!selectedCategory || !!searchQuery.trim();

  return (
    <div className="min-h-screen bg-[#050505]" style={{ overflowX: "hidden" }}>
      <SEO
        title="Fitness ve Beslenme Yazıları — Uzman Makaleler | Gokalaf Blog"
        description={`${articles.length}+ uzman makale ile fitness, vücut geliştirme, beslenme ve supplement rehberleri.`}
        keywords="fitness blog, beslenme rehberi, antrenman makaleleri, supplement kullanımı, egzersiz teknikleri"
        canonical="https://gokalaf.com/yazilar"
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Gokalaf Blog",
          "description": "Fitness, vücut geliştirme, beslenme ve sağlık hakkında kapsamlı bilgiler.",
          "url": "https://gokalaf.com/yazilar",
          "publisher": { "@type": "Organization", "name": "Gokalaf", "url": "https://gokalaf.com" },
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(204,255,0,0.06) 0%, transparent 70%)" }} />

        {/* Giant watermark number */}
        <div
          className="absolute right-0 top-16 font-heading font-black leading-none select-none pointer-events-none hidden md:block"
          style={{ fontSize: "clamp(120px, 18vw, 200px)", color: "rgba(255,255,255,0.018)", letterSpacing: "-0.04em" }}
          aria-hidden
        >
          {counts.all}
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4"
          >
            Bilgi Kütüphanesi
          </motion.p>

          {/* Title row */}
          <div className="flex items-end justify-between gap-6 mb-5">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-white uppercase leading-none"
              style={{ fontSize: "clamp(52px, 9vw, 100px)", letterSpacing: "-0.03em" }}
            >
              YAZILAR
            </motion.h1>

            {/* Counter block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-right shrink-0 hidden sm:block"
            >
              <p className="font-heading font-black text-white leading-none" style={{ fontSize: "clamp(36px, 5vw, 56px)" }}>
                <Counter target={counts.all} />
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">Uzman Yazı</p>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px bg-white/10 mb-5 origin-left"
          />

          {/* Subtitle + Category counts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Fitness, beslenme ve takviyeler üzerine bilimsel temelli, uygulanabilir içerikler.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              {categories.map(c => (
                <div key={c.id} className="text-center">
                  <p className="font-heading font-bold text-white text-lg leading-none" style={{ color: CAT[c.id]?.color }}>
                    {counts.bycat[c.id] ?? 0}
                  </p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider">{c.name}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative max-w-lg"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Yazılarda ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
              data-testid="input-search"
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(204,255,0,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── STICKY FILTER ────────────────────────────────────── */}
      <div
        className="sticky top-[60px] z-30 py-3"
        style={{ background: "rgba(5,5,5,0.9)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div
            ref={filterRef}
            className="flex items-center gap-1"
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {/* All */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="relative shrink-0 px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap"
              style={{ color: !selectedCategory ? "#ccff00" : "rgba(156,163,175,1)" }}
              data-testid="filter-all"
            >
              Tümü
              <span className="ml-1.5 text-xs opacity-60">({counts.all})</span>
              {!selectedCategory && (
                <motion.div layoutId="filter-bar" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#ccff00" }} />
              )}
            </button>

            {/* Category tabs */}
            {categories.map(cat => {
              const c = CAT[cat.id];
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                  className="relative shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap"
                  style={{ color: isActive ? c.color : "rgba(156,163,175,1)" }}
                  data-testid={`filter-${cat.id}`}
                >
                  <c.icon size={13} />
                  {cat.name}
                  <span className="text-xs opacity-50">({counts.bycat[cat.id] ?? 0})</span>
                  {isActive && (
                    <motion.div layoutId="filter-bar" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: c.color }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
                data-testid="articles-empty-state"
              >
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-heading font-bold text-white text-xl mb-2">Sonuç bulunamadı</h3>
                <p className="text-gray-500 text-sm mb-6">Farklı kelimeler veya kategori deneyin.</p>
                <button
                  onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-black"
                  style={{ background: "#ccff00" }}
                  data-testid="button-show-all-articles"
                >
                  Tüm Yazıları Göster
                </button>
              </motion.div>
            ) : (
              <motion.div key={selectedCategory ?? "all"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {/* Featured card — only when no search/filter active or first result */}
                {featured && (
                  <div className="mb-8">
                    <FeaturedCard article={featured} />
                  </div>
                )}

                {/* Rest grid */}
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rest.map((article, i) => (
                      <ArticleCard key={article.slug} article={article} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
              background: "linear-gradient(135deg, rgba(204,255,0,0.07) 0%, rgba(204,255,0,0.02) 100%)",
              border: "1px solid rgba(204,255,0,0.15)",
            }}
          >
            {/* Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(204,255,0,0.08)" }} />

            <div className="relative z-10 text-center md:text-left">
              <p className="text-primary text-xs uppercase tracking-[0.25em] font-bold mb-2">Teoriden Pratiğe</p>
              <h2 className="font-heading font-black text-white text-2xl md:text-3xl uppercase leading-tight mb-2">
                Bilgi Yetmez,<br className="hidden md:block" /> Aksiyon Şart
              </h2>
              <p className="text-gray-500 text-sm max-w-xs">
                Profesyonel koçluk ile kişiselleştirilmiş programını al, hedefine emin adımlarla ilerle.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/paketler">
                <button
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider text-black transition-opacity hover:opacity-90"
                  style={{ background: "#ccff00", boxShadow: "0 0 24px rgba(204,255,0,0.25)" }}
                  data-testid="button-cta-packages"
                >
                  Paketleri İncele
                  <ArrowRight size={16} />
                </button>
              </Link>
              <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer">
                <button
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider text-white transition-all hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                  data-testid="button-whatsapp-cta"
                >
                  WhatsApp&apos;tan Sor
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
