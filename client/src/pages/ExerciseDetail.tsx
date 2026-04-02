import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ChevronRight, Pause, Play, ZoomIn, X, Flame } from "lucide-react";
import SEO from "@/components/SEO";
import { ShareButtons } from "@/components/ShareButtons";
import type { Exercise } from "@shared/schema";

/* ── lookup tables ──────────────────────────────────────────── */
const muscleLabels: Record<string, string> = {
  abdominals: "Karın", abductors: "Dış Bacak", adductors: "İç Bacak",
  biceps: "Biceps", calves: "Baldır", chest: "Göğüs",
  forearms: "Ön Kol", glutes: "Kalça", hamstrings: "Arka Bacak",
  lats: "Sırt", "lower back": "Alt Sırt", "middle back": "Orta Sırt",
  neck: "Boyun", quadriceps: "Ön Bacak", shoulders: "Omuz",
  traps: "Trapez", triceps: "Triceps",
};
const equipmentLabels: Record<string, string> = {
  barbell: "Halter", "body only": "Vücut Ağırlığı", cable: "Kablo",
  dumbbell: "Dambıl", "e-z curl bar": "EZ Bar", "exercise ball": "Pilates Topu",
  "foam roll": "Foam Roller", kettlebells: "Kettlebell", machine: "Makine",
  "medicine ball": "Sağlık Topu", other: "Diğer", bands: "Direnç Bandı",
};
const categoryLabels: Record<string, string> = {
  strength: "Güç", stretching: "Esneme", plyometrics: "Pliometrik",
  strongman: "Strongman", powerlifting: "Powerlifting", cardio: "Kardiyo",
  "olympic weightlifting": "Olimpik Halter",
};
const forceLabels: Record<string, string> = { push: "İtme", pull: "Çekme", static: "Statik" };
const mechanicLabels: Record<string, string> = { compound: "Compound", isolation: "İzolasyon" };

const levelConfig = {
  beginner: { label: "Başlangıç", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
  intermediate: { label: "Orta", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  expert: { label: "İleri", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
};

/* ── scroll progress bar ───────────────────────────────────── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left", position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "#ccff00", zIndex: 200, boxShadow: "0 0 12px #ccff00" }}
    />
  );
}

/* ── animated image viewer ──────────────────────────────────── */
function ImageViewer({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!playing || images.length < 2) return;
    const t = setInterval(() => setIdx(p => (p + 1) % images.length), 2200);
    return () => clearInterval(t);
  }, [playing, images.length]);

  const labels = ["Başlangıç", "Bitiş"];

  return (
    <>
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Grain overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        <AnimatePresence mode="crossfade">
          {images[idx] && (
            <motion.img
              key={idx}
              src={images[idx]}
              alt={`${name} — ${labels[idx] || ""}`}
              className="absolute inset-0 w-full h-full object-contain z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              loading="eager"
            />
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
          style={{ background: "linear-gradient(to top, rgba(5,5,5,0.8), transparent)" }}>
          {/* Position label + dots */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-white/70">{labels[idx] || ""}</span>
            {images.length > 1 && (
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => { setIdx(i); setPlaying(false); }}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === idx ? 20 : 6, height: 6, background: i === idx ? "#ccff00" : "rgba(255,255,255,0.3)" }}
                    data-testid={`button-dot-${i}`} />
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {images.length > 1 && (
              <button onClick={() => setPlaying(p => !p)}
                className="p-2 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.6)" }} data-testid="button-play-toggle">
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            )}
            <button onClick={() => setZoom(true)}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.6)" }} data-testid="button-zoom">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Neon corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none z-10"
          style={{ background: "radial-gradient(circle at top right, rgba(204,255,0,0.06), transparent 70%)" }} />
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
            onClick={() => setZoom(false)}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={images[idx]} alt={name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={e => e.stopPropagation()} />
            <button onClick={() => setZoom(false)}
              className="absolute top-6 right-6 p-3 rounded-2xl transition-colors hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <X className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── step card ──────────────────────────────────────────────── */
function StepCard({ step, index, total }: { step: string; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.3"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-24, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, x }} className="group relative flex gap-5 md:gap-8">
      {/* Giant number */}
      <div className="flex-shrink-0 w-12 md:w-16 flex flex-col items-center">
        <div className="relative">
          <span className="font-heading font-black text-5xl md:text-7xl leading-none select-none transition-colors duration-300"
            style={{ color: "rgba(204,255,0,0.08)", WebkitTextStroke: "1px rgba(204,255,0,0.15)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute inset-0 font-heading font-black text-5xl md:text-7xl leading-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ color: "rgba(204,255,0,0.2)", WebkitTextStroke: "1px rgba(204,255,0,0.4)", filter: "blur(0px)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {index < total - 1 && (
          <div className="flex-1 w-px mt-3" style={{ background: "linear-gradient(to bottom, rgba(204,255,0,0.15), transparent)", minHeight: 40 }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-10 md:pb-14 pt-1">
        <div className="rounded-2xl p-5 md:p-6 transition-all duration-500 group-hover:-translate-y-0.5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(204,255,0,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg group-hover:text-white transition-colors duration-300">
            {step}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── stat pill ──────────────────────────────────────────────── */
function StatPill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 rounded-2xl"
      style={{ background: accent ? "rgba(204,255,0,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${accent ? "rgba(204,255,0,0.2)" : "rgba(255,255,255,0.07)"}` }}>
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-[#ccff00]" : "text-white"}`}>{value}</span>
    </div>
  );
}

/* ── main component ─────────────────────────────────────────── */
export default function ExerciseDetail() {
  const [, params] = useRoute("/egzersiz-akademisi/:slug");
  const slug = params?.slug;

  const { data: exercise, isLoading, error } = useQuery<Exercise>({
    queryKey: ["/api/exercises", slug],
    queryFn: async () => {
      const res = await fetch(`/api/exercises/${slug}`);
      if (!res.ok) throw new Error("Exercise not found");
      return res.json();
    },
    enabled: !!slug,
  });

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs text-gray-600 uppercase tracking-widest">Yükleniyor</p>
        </div>
      </div>
    );
  }

  /* ── error ── */
  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-[#050505] pt-40 flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-4xl">🏋️</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Egzersiz Bulunamadı</h1>
          <p className="text-gray-500 text-sm">Aradığınız egzersiz mevcut değil.</p>
        </div>
        <Link href="/egzersiz-akademisi">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:gap-3"
            style={{ background: "#ccff00", color: "#050505" }} data-testid="button-back-exercises">
            <ArrowLeft className="w-4 h-4" />
            Egzersizlere Dön
          </button>
        </Link>
      </div>
    );
  }

  const instructions = exercise.instructionsTr?.length ? exercise.instructionsTr : exercise.instructionsEn;
  const shareUrl = `https://gokalaf.com/egzersiz-akademisi/${exercise.slug}`;
  const levelInfo = levelConfig[exercise.level as keyof typeof levelConfig] || levelConfig.beginner;

  const stats = [
    { label: "Hedef Kas", value: muscleLabels[exercise.primaryMuscles[0]] || exercise.primaryMuscles[0], accent: true },
    { label: "Ekipman", value: equipmentLabels[exercise.equipment || ""] || exercise.equipment || "Yok" },
    { label: "Mekanik", value: mechanicLabels[exercise.mechanic || ""] || exercise.mechanic || "—" },
    ...(exercise.force ? [{ label: "Hareket", value: forceLabels[exercise.force] || exercise.force }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      <ScrollBar />

      <SEO
        title={`${exercise.name} | Egzersiz Rehberi | Gokalaf`}
        description={`${exercise.name} nasıl yapılır? ${exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(", ")} için adım adım talimatlar.`}
        keywords={`${exercise.name}, ${exercise.primaryMuscles.join(", ")}, egzersiz`}
        canonical={`/egzersiz-akademisi/${exercise.slug}`}
      />

      {/* ── AMBIENT GLOWS ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #ccff00, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #ccff00, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative pt-28 md:pt-36 pb-12 z-10">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Breadcrumb */}
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-gray-600 mb-8 md:mb-10">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/egzersiz-akademisi" className="hover:text-white transition-colors">Egzersiz Akademisi</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400 truncate max-w-[180px] md:max-w-none">{exercise.name}</span>
          </motion.nav>

          {/* Title row */}
          <div className="mb-8 md:mb-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
              className="flex items-center gap-3 mb-4 flex-wrap">
              {/* Level badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: levelInfo.bg, border: `1px solid ${levelInfo.border}`, color: levelInfo.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: levelInfo.color }} />
                {levelInfo.label}
              </span>

              {/* Category badge */}
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-gray-400"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {categoryLabels[exercise.category || ""] || exercise.category}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-black text-white uppercase leading-none"
              style={{ fontSize: "clamp(32px, 6vw, 72px)", letterSpacing: "-0.03em" }}>
              {exercise.name}
            </motion.h1>
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">

            {/* ── LEFT: Image + Steps ───────────────────────── */}
            <div className="lg:col-span-7 xl:col-span-8">

              {/* Image viewer */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                <ImageViewer images={exercise.images} name={exercise.name} />
              </motion.div>

              {/* Stat pills row */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {stats.map(s => <StatPill key={s.label} {...s} />)}
              </motion.div>

              {/* Share */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5">
                <ShareButtons url={shareUrl} title={exercise.name} description={`${exercise.name} egzersizi`} />
              </motion.div>

              {/* ── INSTRUCTIONS ─────────────────────────── */}
              <div className="mt-16 md:mt-20">
                {/* Section header */}
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5 }} className="mb-12">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(204,255,0,0.4), transparent)" }} />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#ccff00]">Nasıl Yapılır</span>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(204,255,0,0.4), transparent)" }} />
                  </div>
                  <h2 className="font-heading font-black text-white uppercase text-center"
                    style={{ fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.02em" }}>
                    Adım Adım Rehber
                  </h2>
                </motion.div>

                {/* Steps */}
                <div>
                  {instructions.map((step, i) => (
                    <StepCard key={i} step={step} index={i} total={instructions.length} />
                  ))}
                </div>
              </div>

              {/* Back link */}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="hidden lg:flex items-center gap-3 mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link href="/egzersiz-akademisi">
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors" data-testid="button-back">
                    <ArrowLeft className="w-4 h-4" />
                    Tüm Egzersizlere Dön
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* ── RIGHT: Sticky Info Panel ──────────────────── */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-[120px] space-y-4">

                {/* Muscles card */}
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>

                  {/* Card header */}
                  <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-1.5 h-5 rounded-full" style={{ background: "#ccff00", boxShadow: "0 0 8px #ccff00" }} />
                    <span className="text-sm font-semibold text-white">Çalışan Kaslar</span>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Primary */}
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Ana Kaslar
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.primaryMuscles.map(m => (
                          <span key={m} className="px-3 py-1.5 rounded-xl text-sm font-semibold"
                            style={{ background: "rgba(204,255,0,0.1)", border: "1px solid rgba(204,255,0,0.25)", color: "#ccff00" }}>
                            {muscleLabels[m] || m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Secondary */}
                    {exercise.secondaryMuscles.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                          Yardımcı Kaslar
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {exercise.secondaryMuscles.map(m => (
                            <span key={m} className="px-3 py-1.5 rounded-xl text-sm"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                              {muscleLabels[m] || m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Detailed stats card */}
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.28 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>

                  <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-1.5 h-5 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                    <span className="text-sm font-semibold text-white">Egzersiz Detayları</span>
                  </div>

                  <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    {[
                      { label: "Ekipman", value: equipmentLabels[exercise.equipment || ""] || exercise.equipment || "Yok" },
                      { label: "Kategori", value: categoryLabels[exercise.category || ""] || exercise.category || "—" },
                      ...(exercise.mechanic ? [{ label: "Mekanik", value: mechanicLabels[exercise.mechanic] || exercise.mechanic }] : []),
                      ...(exercise.force ? [{ label: "Hareket Tipi", value: forceLabels[exercise.force] || exercise.force }] : []),
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between px-5 py-3.5" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <span className="text-sm text-gray-500">{row.label}</span>
                        <span className="text-sm font-medium text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA card */}
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
                  className="relative rounded-2xl overflow-hidden"
                  style={{ background: "rgba(204,255,0,0.04)", border: "1px solid rgba(204,255,0,0.15)" }}>

                  {/* Background glow */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at top left, rgba(204,255,0,0.08), transparent 70%)" }} />

                  <div className="relative p-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: "rgba(204,255,0,0.12)", border: "1px solid rgba(204,255,0,0.2)" }}>
                      <Flame className="w-5 h-5" style={{ color: "#ccff00" }} />
                    </div>

                    <h3 className="font-heading font-bold text-white text-lg mb-2 uppercase leading-tight">
                      Kişisel Koçluk
                    </h3>
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                      Sana özel program ile hedeflerine en hızlı şekilde ulaş.
                    </p>

                    <Link href="/paketler">
                      <button className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_24px_rgba(204,255,0,0.3)] hover:-translate-y-0.5"
                        style={{ background: "#ccff00", color: "#050505" }} data-testid="button-cta-packages">
                        Paketleri İncele
                      </button>
                    </Link>
                  </div>
                </motion.div>

                {/* Back link mobile */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="lg:hidden">
                  <Link href="/egzersiz-akademisi">
                    <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium transition-all hover:text-white"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                      data-testid="button-back-mobile">
                      <ArrowLeft className="w-4 h-4" />
                      Tüm Egzersizlere Dön
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20 md:h-32" />
    </div>
  );
}
