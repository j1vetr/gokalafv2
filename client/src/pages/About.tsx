import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";

/* ─── Social Icons ─────────────────────────────────────────── */
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function KickIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256S397.385 0 256 0zm-82.95 358.026h-48.07V153.974h48.07v76.308l67.418-76.308h57.864l-76.65 85.13 82.98 119.922h-59.442l-55.726-85.13-16.444 17.514v67.616z"/>
    </svg>
  );
}

/* ─── Animated counter ─────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const id = setInterval(() => {
      n = Math.min(n + step, target);
      setVal(n);
      if (n >= target) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}{suffix}</>;
}

/* ─── Fade-in wrapper ──────────────────────────────────────── */
const Reveal = ({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ─── Bio paragraphs ───────────────────────────────────────── */
const bioParagraphs = [
  {
    num: "01",
    text: "16 yaşında çelimsiz görüntümü değiştirmek için başladığım bu süreç, her geçen yıl gelişmenin verdiği özgüven ve görünümle hayatımdaki en büyük tutkum oldu. Tutkuya dönüşmesiyle beraber Elektronik Mühendisliği okuduğum yıllarda kendimi güncel, bilime dayalı kaynak ve kanallardan eğittim."
  },
  {
    num: "02",
    text: "2021 yılında Türkiye Genç Erkek Klasik Fizik kategorisinde şampiyon olup bir atlet olarak kariyerimi başlattım ve yurt dışından profesyonel koçlarla çalışmaya başladım."
  },
  {
    num: "03",
    text: "Aldığım ve almakta olduğum eğitim ve hizmetleri en iyi şekilde yorumlayıp, yüzlerce kişiye istekleri ve ihtiyaçları doğrultusunda aktardım. Bir atlet ve antrenör olarak uzun yıllar buradayım."
  },
];

const stats = [
  { value: 6, suffix: "+", label: "Yıl Deneyim" },
  { value: 1000, suffix: "+", label: "Başarılı Danışan" },
  { value: 100, suffix: "%", label: "Kişiye Özel" },
  { value: 24, suffix: "/7", label: "WhatsApp Destek" },
];

const philosophy = [
  {
    num: "01",
    title: "Performans",
    desc: "Sadece estetik değil, fonksiyonel güç ve dayanıklılık. Hayatın her alanında daha güçlü olman için çalışıyoruz."
  },
  {
    num: "02",
    title: "Disiplin",
    desc: "Motivasyon geçicidir, disiplin kalıcı. Seni hedeflerine ulaştıracak alışkanlıkları birlikte inşa ediyoruz."
  },
  {
    num: "03",
    title: "Sürdürülebilirlik",
    desc: "Kısa süreli şok diyetler değil, ömür boyu uygulayabileceğin, seninle yaşayan esnek bir sistem."
  },
];

/* ─── Main component ───────────────────────────────────────── */
export default function About() {
  return (
    <>
      <SEO
        title="Göktuğ Alaf Kimdir? | Online Fitness Koçu | Gokalaf"
        description="Göktuğ Alaf — Profesyonel online fitness ve vücut geliştirme koçu. 6+ yıllık deneyim, 1000+ başarılı dönüşüm hikayesi."
        keywords="Göktuğ Alaf, Gokalaf, online fitness koçu, vücut geliştirme koçu, personal trainer"
        canonical="/hakkimizda"
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Göktuğ Alaf",
          "jobTitle": "Online Fitness ve Vücut Geliştirme Koçu",
          "url": "https://gokalaf.com/hakkimizda",
          "image": "https://gokalaf.com/goktug-alaf.jpg",
          "sameAs": ["https://instagram.com/gokalaf", "https://youtube.com/@gokalaf", "https://kick.com/gokalaf"]
        }}
      />

      <div className="bg-[#050505]" style={{ overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════════════════
            HERO — split layout
        ══════════════════════════════════════════════════════ */}
        <section className="relative flex flex-col lg:flex-row" style={{ paddingTop: 60, minHeight: "100vh" }}>

          {/* Photo column */}
          <div className="relative w-full lg:w-[44%] shrink-0 h-[64vw] max-h-[500px] lg:h-auto lg:max-h-none lg:self-stretch">
            <img
              src="/goktug-alaf.jpg"
              alt="Göktuğ Alaf — Online Fitness Koçu"
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="eager"
            />
            {/* Gradient: bottom fade on mobile, right fade on desktop */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 35%, #050505 100%), linear-gradient(to right, transparent 55%, #050505 100%)"
              }}
            />

            {/* Corner decoration */}
            <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-primary/40 hidden lg:block" />
            <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-primary/25 hidden lg:block" />
          </div>

          {/* Content column */}
          <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-16 py-10 lg:py-24">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] mb-5"
            >
              Online Fitness & Vücut Geliştirme Koçu
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-black text-white uppercase leading-[1.0] mb-5"
              style={{ fontSize: "clamp(44px, 8vw, 88px)", letterSpacing: "-0.03em" }}
            >
              GÖKTUĞ<br />ALAF
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="h-px bg-white/10 mb-6 origin-left"
              style={{ maxWidth: 360 }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8"
              style={{ maxWidth: 400 }}
            >
              Türkiye Genç Erkek Klasik Fizik Şampiyonu. 6+ yıllık koçluk deneyimi ile
              binden fazla kişinin dönüşüm hikayesini yazan fitness koçu.
            </motion.p>

            {/* CTA + Social */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/paketler">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider text-black transition-opacity hover:opacity-90"
                  style={{ background: "#ccff00", boxShadow: "0 0 28px rgba(204,255,0,0.25)" }}
                  data-testid="button-hero-work-with-me"
                >
                  Benimle Çalış
                  <ArrowRight size={16} />
                </button>
              </Link>

              <div className="flex items-center gap-2.5">
                {[
                  { href: "https://www.instagram.com/gokalaf/", icon: <InstagramIcon />, label: "Instagram", hoverColor: "#e1306c" },
                  { href: "https://www.youtube.com/gokalaf", icon: <YoutubeIcon />, label: "YouTube", hoverColor: "#ff0000" },
                  { href: "https://kick.com/gokalaf/", icon: <KickIcon />, label: "Kick", hoverColor: "#53fc18" },
                ].map(({ href, icon, label, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hoverColor + "22"; (e.currentTarget as HTMLElement).style.borderColor = hoverColor + "60"; (e.currentTarget as HTMLElement).style.color = hoverColor; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = ""; }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            QUOTE
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 border-t border-white/[0.06]" style={{ background: "#070707" }}>
          <div className="container mx-auto px-5 sm:px-8 max-w-4xl">
            <Reveal>
              <div className="relative">
                <span
                  className="absolute -top-6 -left-2 font-heading font-black leading-none select-none"
                  style={{ fontSize: "clamp(60px, 10vw, 100px)", color: "rgba(204,255,0,0.12)", lineHeight: 1 }}
                  aria-hidden
                >"</span>
                <blockquote
                  className="text-white font-heading font-bold leading-snug pl-4 md:pl-8"
                  style={{ fontSize: "clamp(18px, 3vw, 28px)" }}
                >
                  Amacım sadece sana bir antrenman programı vermek değil; vücudunu tanımanı, sınırlarını zorlamanı ve disiplini bir yaşam tarzı haline getirmeni sağlamak.
                </blockquote>
                <p className="text-primary text-sm font-bold uppercase tracking-widest mt-6 pl-4 md:pl-8">
                  — Göktuğ Alaf
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════════════ */}
        <section className="py-14 md:py-20 border-t border-white/[0.06]">
          <div className="container mx-auto px-5 sm:px-8 max-w-5xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div
                    className="text-center px-6 py-9 lg:py-11 relative group"
                    style={{ background: "#050505" }}
                  >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-primary group-hover:w-10 transition-all duration-500" />
                    <p
                      className="font-heading font-black leading-none mb-2"
                      style={{ fontSize: "clamp(36px, 5vw, 58px)", color: "#ccff00" }}
                    >
                      <Counter target={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-gray-500 text-[11px] uppercase tracking-widest font-medium">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            BIO (numbered paragraphs)
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 border-t border-white/[0.06]" style={{ background: "#070707" }}>
          <div className="container mx-auto px-5 sm:px-8 max-w-5xl">
            <Reveal>
              <p className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Hikayem</p>
              <h2
                className="font-heading font-black text-white uppercase mb-14"
                style={{ fontSize: "clamp(28px, 5vw, 52px)", letterSpacing: "-0.02em" }}
              >
                Nereden Geldim,<br />Nereye Gidiyorum
              </h2>
            </Reveal>

            <div className="space-y-0">
              {bioParagraphs.map((para, i) => (
                <Reveal key={para.num} delay={i * 0.1}>
                  <div
                    className="flex gap-6 md:gap-10 py-8 md:py-10 group"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      borderBottom: i === bioParagraphs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none"
                    }}
                  >
                    {/* Number */}
                    <span
                      className="font-heading font-black shrink-0 leading-none transition-colors duration-300 group-hover:text-primary"
                      style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "rgba(255,255,255,0.15)", minWidth: "2.5rem" }}
                    >
                      {para.num}
                    </span>
                    {/* Text */}
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      {para.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            PHILOSOPHY
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 border-t border-white/[0.06]">
          <div className="container mx-auto px-5 sm:px-8 max-w-5xl">
            <Reveal>
              <p className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Yaklaşımım</p>
              <h2
                className="font-heading font-black text-white uppercase mb-14"
                style={{ fontSize: "clamp(28px, 5vw, 52px)", letterSpacing: "-0.02em" }}
              >
                Koçluk Felsefem
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {philosophy.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.1}>
                  <div
                    className="group relative rounded-2xl p-7 md:p-8 overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(204,255,0,0.25)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    {/* Giant background number */}
                    <div
                      className="absolute top-4 right-4 font-heading font-black leading-none select-none pointer-events-none transition-colors duration-500"
                      style={{ fontSize: 80, color: "rgba(255,255,255,0.03)" }}
                      aria-hidden
                    >
                      {item.num}
                    </div>

                    {/* Number badge */}
                    <span
                      className="inline-block font-heading font-black text-xs uppercase tracking-widest mb-5"
                      style={{ color: "#ccff00" }}
                    >
                      {item.num}
                    </span>

                    <h3 className="font-heading font-black text-white uppercase text-xl md:text-2xl mb-4 tracking-tight">
                      {item.title}
                    </h3>

                    <div className="h-px bg-white/[0.08] mb-4 group-hover:bg-primary/20 transition-colors duration-500" />

                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 border-t border-white/[0.06]" style={{ background: "#070707" }}>
          <div className="container mx-auto px-5 sm:px-8 max-w-5xl">
            <Reveal>
              <div
                className="relative rounded-2xl overflow-hidden p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10"
                style={{
                  background: "linear-gradient(135deg, rgba(204,255,0,0.07) 0%, rgba(204,255,0,0.02) 100%)",
                  border: "1px solid rgba(204,255,0,0.15)",
                }}
              >
                {/* Ambient glow */}
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: "rgba(204,255,0,0.06)", filter: "blur(80px)" }}
                />

                {/* Text */}
                <div className="relative z-10 text-center md:text-left">
                  <p className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Sıradaki Adım</p>
                  <h2
                    className="font-heading font-black text-white uppercase leading-tight"
                    style={{ fontSize: "clamp(24px, 4vw, 42px)", letterSpacing: "-0.02em" }}
                  >
                    Hedefine Ulaşmak<br />İçin Hazır Mısın?
                  </h2>
                </div>

                {/* Buttons */}
                <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                  <Link href="/paketler" className="w-full sm:w-auto">
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-wider text-black transition-opacity hover:opacity-90"
                      style={{ background: "#ccff00", boxShadow: "0 0 28px rgba(204,255,0,0.2)" }}
                      data-testid="button-cta-packages"
                    >
                      Paketleri İncele
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                  <a
                    href="https://wa.me/905312822402"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-wider text-white transition-all hover:bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                      data-testid="button-whatsapp-cta"
                    >
                      WhatsApp&apos;tan Sor
                      <ArrowUpRight size={16} />
                    </button>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </>
  );
}
