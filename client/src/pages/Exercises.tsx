import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Search, X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";
import Model from "react-body-highlighter";
import type { Exercise } from "@shared/schema";

/* ─── Data maps ────────────────────────────────────────────── */
const levelLabels: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  expert: "İleri",
};

const levelColors: Record<string, { bg: string; text: string }> = {
  beginner:     { bg: "rgba(34,197,94,0.15)",  text: "#22c55e" },
  intermediate: { bg: "rgba(234,179,8,0.15)",  text: "#eab308" },
  expert:       { bg: "rgba(239,68,68,0.15)",  text: "#ef4444" },
};

const muscleLabels: Record<string, string> = {
  abdominals: "Karın", abductors: "Dış Bacak", adductors: "İç Bacak",
  biceps: "Biceps", calves: "Baldır", chest: "Göğüs", forearms: "Ön Kol",
  glutes: "Kalça", hamstrings: "Arka Bacak", lats: "Sırt (Lat)",
  "lower back": "Alt Sırt", "middle back": "Orta Sırt", neck: "Boyun",
  quadriceps: "Ön Bacak", shoulders: "Omuz", traps: "Trapez", triceps: "Triceps",
};

const equipmentLabels: Record<string, string> = {
  barbell: "Halter", "body only": "Vücut Ağırlığı", cable: "Kablo",
  dumbbell: "Dambıl", "e-z curl bar": "EZ Bar", "exercise ball": "Pilates Topu",
  "foam roll": "Foam Roller", kettlebells: "Kettlebell", machine: "Makine",
  "medicine ball": "Sağlık Topu", other: "Diğer", bands: "Direnç Bandı",
};

const bodyHighlighterToApiMuscle: Record<string, string> = {
  chest: "chest", abs: "abdominals", obliques: "abdominals",
  "upper-back": "middle back", "lower-back": "lower back",
  trapezius: "traps", biceps: "biceps", triceps: "triceps",
  forearm: "forearms", "front-deltoids": "shoulders", "back-deltoids": "shoulders",
  quadriceps: "quadriceps", hamstring: "hamstrings", gluteal: "glutes",
  calves: "calves", adductor: "adductors", abductors: "abductors",
  neck: "neck", head: "neck", knees: "quadriceps",
  "left-soleus": "calves", "right-soleus": "calves",
};

const apiMuscleToBodyHighlighter: Record<string, string[]> = {
  chest: ["chest"], abdominals: ["abs", "obliques"], "middle back": ["upper-back"],
  "lower back": ["lower-back"], traps: ["trapezius"], biceps: ["biceps"],
  triceps: ["triceps"], forearms: ["forearm"],
  shoulders: ["front-deltoids", "back-deltoids"], quadriceps: ["quadriceps"],
  hamstrings: ["hamstring"], glutes: ["gluteal"],
  calves: ["calves", "left-soleus", "right-soleus"],
  adductors: ["adductor"], abductors: ["abductors"], neck: ["neck", "head"],
  lats: ["upper-back"],
};

type BodyView = "anterior" | "posterior";

interface ExercisesResponse { exercises: Exercise[]; total: number; }

/* ─── Exercise Card ────────────────────────────────────────── */
function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const lvl = levelColors[exercise.level] ?? { bg: "rgba(204,255,0,0.1)", text: "#ccff00" };

  return (
    <Link href={`/egzersiz-akademisi/${exercise.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
        className="group flex flex-col h-full rounded-xl overflow-hidden cursor-pointer border border-white/[0.07] hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
        style={{ background: "rgba(255,255,255,0.025)" }}
        data-testid={`card-exercise-${exercise.id}`}
      >
        {/* Image */}
        <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: "4/3", background: "#0a0a0a" }}>
          {exercise.images[0] && (
            <img
              src={exercise.images[0]}
              alt={exercise.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent opacity-60" />

          {/* Level badge */}
          <span
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: lvl.bg, color: lvl.text, backdropFilter: "blur(8px)", border: `1px solid ${lvl.text}25` }}
          >
            {levelLabels[exercise.level] ?? exercise.level}
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-end justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-0.5 text-primary text-[11px] font-bold">
              Detay <ArrowUpRight size={12} />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-white text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {exercise.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-auto">
            {exercise.primaryMuscles.slice(0, 1).map(m => (
              <span key={m} className="text-[10px] text-gray-500 bg-white/[0.05] px-1.5 py-0.5 rounded-full">
                {muscleLabels[m] ?? m}
              </span>
            ))}
            {exercise.equipment && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(204,255,0,0.08)", color: "#ccff00aa" }}>
                {equipmentLabels[exercise.equipment] ?? exercise.equipment}
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

/* ─── Skeleton card ────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.05]" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="animate-pulse" style={{ aspectRatio: "4/3", background: "rgba(255,255,255,0.05)" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.06)", width: "80%" }} />
        <div className="h-3 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.04)", width: "50%" }} />
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────── */
export default function Exercises() {
  const [location] = useLocation();
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [bodyView, setBodyView] = useState<BodyView>("anterior");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const muscleParam = urlParams.get("muscle");
    if (muscleParam && muscleParam !== selectedMuscle) {
      setSelectedMuscle(muscleParam);
      setTimeout(() => {
        document.getElementById("exercises-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [location]);

  const queryParams = useMemo(() => {
    const p = new URLSearchParams();
    if (searchQuery) p.set("search", searchQuery);
    if (selectedMuscle) p.set("muscle", selectedMuscle);
    p.set("limit", String(limit));
    p.set("offset", String((currentPage - 1) * limit));
    return p.toString();
  }, [searchQuery, selectedMuscle, currentPage]);

  const { data, isLoading } = useQuery<ExercisesResponse>({
    queryKey: ["/api/exercises", queryParams],
    queryFn: async () => (await fetch(`/api/exercises?${queryParams}`)).json(),
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const handleMuscleSelect = (muscle: string) => {
    setSelectedMuscle(muscle === selectedMuscle ? "" : muscle);
    setCurrentPage(1);
    setSearchQuery("");
    if (muscle !== selectedMuscle) {
      setTimeout(() => {
        document.getElementById("exercises-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const clearSelection = () => { setSelectedMuscle(""); setSearchQuery(""); setCurrentPage(1); };

  const handleBodyClick = (d: { muscle: string; data: { exercises: string[]; frequency: number } }) => {
    handleMuscleSelect(bodyHighlighterToApiMuscle[d.muscle] ?? d.muscle);
  };

  const getModelData = () => {
    if (!selectedMuscle) return [];
    return (apiMuscleToBodyHighlighter[selectedMuscle] ?? [selectedMuscle]).map(m => ({
      name: "Selected", muscles: [m],
    }));
  };

  /* Pagination helper */
  const pageNums = useMemo(() => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 4) return [1,2,3,4,5,"…",totalPages];
    if (currentPage >= totalPages - 3) return [1,"…",totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages];
    return [1,"…",currentPage-1,currentPage,currentPage+1,"…",totalPages];
  }, [totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-[#050505]" style={{ overflowX: "hidden" }}>
      <SEO
        title="Egzersiz Akademisi — 800+ Fitness Hareketi | Gokalaf"
        description="800'den fazla fitness egzersizi ve hareket rehberi. Kas gruplarına göre filtrele, doğru egzersizleri öğren."
        keywords="egzersiz, fitness hareketleri, gym egzersizleri, kas çalışma, antrenman rehberi"
        canonical="/egzersiz-akademisi"
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-28 md:pt-36 pb-8 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(204,255,0,0.07) 0%, transparent 70%)", filter: "blur(60px)" }}
        />

        {/* Giant watermark */}
        <div
          className="absolute right-0 top-8 font-heading font-black leading-none select-none pointer-events-none hidden lg:block"
          style={{ fontSize: "clamp(100px,14vw,160px)", color: "rgba(255,255,255,0.02)", letterSpacing: "-0.04em" }}
          aria-hidden
        >
          AKADEMİ
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h1
                className="font-heading font-black text-white uppercase leading-none"
                style={{ fontSize: "clamp(36px,7vw,72px)", letterSpacing: "-0.03em" }}
              >
                EGZERSİZ<br className="sm:hidden" />{" "}
                <span style={{ color: "#ccff00" }}>AKADEMİSİ</span>
              </h1>
              <div className="shrink-0 text-right hidden sm:block">
                <p className="font-heading font-black text-white leading-none" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#ccff00" }}>
                  {data?.total ?? 800}+
                </p>
                <p className="text-gray-500 text-[11px] uppercase tracking-widest font-medium">Egzersiz</p>
              </div>
            </div>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-white/10 my-4 origin-left" />

          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* ── LEFT: BODY MAP PANEL ─────────────────────── */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full lg:w-[340px] xl:w-[360px] shrink-0 lg:sticky lg:top-[120px]"
            >
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Kas Haritası</p>
                  <div
                    className="flex items-center gap-0.5 p-0.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {(["anterior", "posterior"] as BodyView[]).map(view => (
                      <button
                        key={view}
                        onClick={() => setBodyView(view)}
                        className="relative px-3.5 py-1.5 rounded-md text-[11px] font-bold transition-all"
                        style={{ color: bodyView === view ? "#000" : "rgba(156,163,175,1)" }}
                        data-testid={`button-view-${view === "anterior" ? "front" : "back"}`}
                      >
                        {bodyView === view && (
                          <motion.span layoutId="viewIndicator" className="absolute inset-0 rounded-md" style={{ background: "#ccff00" }} />
                        )}
                        <span className="relative z-10">{view === "anterior" ? "Ön" : "Arka"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body model */}
                <div className="flex justify-center mb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={bodyView}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="body-highlighter-container"
                      style={{ width: "min(200px, 55vw)" }}
                    >
                      <Model
                        data={getModelData()}
                        style={{ width: "100%", padding: 0 }}
                        onClick={handleBodyClick}
                        type={bodyView}
                        highlightedColors={["#ccff00"]}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.06] mb-4" />

                {/* Selected muscle indicator */}
                <AnimatePresence>
                  {selectedMuscle && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(204,255,0,0.08)", border: "1px solid rgba(204,255,0,0.2)" }}
                      >
                        <div>
                          <p className="text-[10px] text-primary/70 uppercase tracking-wider font-medium">Seçili Kas</p>
                          <p className="text-white font-bold text-sm">{muscleLabels[selectedMuscle] ?? selectedMuscle}</p>
                        </div>
                        <button
                          onClick={clearSelection}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                          data-testid="button-clear-muscle"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Muscle buttons grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-1.5">
                  {Object.entries(muscleLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleMuscleSelect(key)}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 text-left truncate"
                      style={{
                        background: selectedMuscle === key ? "rgba(204,255,0,0.15)" : "rgba(255,255,255,0.04)",
                        border: selectedMuscle === key ? "1px solid rgba(204,255,0,0.4)" : "1px solid rgba(255,255,255,0.06)",
                        color: selectedMuscle === key ? "#ccff00" : "rgba(156,163,175,1)",
                        boxShadow: selectedMuscle === key ? "0 0 12px rgba(204,255,0,0.12)" : "none",
                      }}
                      data-testid={`button-muscle-${key}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* ── RIGHT: EXERCISE LIST ─────────────────────── */}
            <motion.main
              id="exercises-list"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1 min-w-0 scroll-mt-[120px]"
            >
              {/* Search + results header */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-5">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Egzersiz ara..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full h-11 pl-10 pr-10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(204,255,0,0.3)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    data-testid="input-exercise-search"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Results count */}
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: "#ccff00" }}>
                    {data?.total ?? 0}
                  </span>
                  <span className="text-gray-500 text-sm">egzersiz</span>
                  {(selectedMuscle || searchQuery) && (
                    <button
                      onClick={clearSelection}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                      data-testid="button-show-all"
                    >
                      <X size={11} />
                      Tümü
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
                  </motion.div>
                ) : data?.exercises.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-20 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-4xl mb-3">💪</p>
                    <h3 className="font-heading font-bold text-white text-lg mb-1">Sonuç bulunamadı</h3>
                    <p className="text-gray-500 text-sm mb-5">Farklı bir kas grubu veya arama terimi deneyin.</p>
                    <button
                      onClick={clearSelection}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black"
                      style={{ background: "#ccff00" }}
                    >
                      Tümünü Göster
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key={queryParams} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    {data?.exercises.map((ex, i) => (
                      <ExerciseCard key={ex.id} exercise={ex} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-1.5 mt-8"
                >
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all hover:bg-white/5"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {pageNums.map((p, i) => p === "…" ? (
                    <span key={`ellipsis-${i}`} className="text-gray-600 text-sm px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className="w-9 h-9 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: currentPage === p ? "#ccff00" : "transparent",
                        color: currentPage === p ? "#000" : "rgba(156,163,175,1)",
                        border: currentPage === p ? "none" : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all hover:bg-white/5"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    data-testid="button-next-page"
                  >
                    <ChevronRight size={15} />
                  </button>
                </motion.div>
              )}

              {/* Range info */}
              {!isLoading && data && data.total > 0 && (
                <p className="text-center text-gray-600 text-xs mt-4">
                  {data.total} egzersizden{" "}
                  <span className="text-gray-400">{(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, data.total)}</span>{" "}
                  arası gösteriliyor
                </p>
              )}
            </motion.main>
          </div>
        </div>
      </section>

      {/* ── Body highlighter custom styles ────────────────────── */}
      <style>{`
        .body-highlighter-container svg {
          width: 100% !important;
          height: auto !important;
        }
        .body-highlighter-container svg polygon {
          fill: #151515 !important;
          stroke: #2a2a2a !important;
          stroke-width: 0.5 !important;
          transition: all 0.25s ease !important;
          cursor: pointer !important;
        }
        .body-highlighter-container svg polygon:hover {
          fill: rgba(204,255,0,0.3) !important;
          stroke: #ccff00 !important;
          filter: drop-shadow(0 0 6px rgba(204,255,0,0.4)) !important;
        }
        .body-highlighter-container svg polygon[style*="rgb(204, 255, 0)"],
        .body-highlighter-container svg polygon[fill="#ccff00"] {
          fill: #ccff00 !important;
          stroke: #ccff00 !important;
          filter: drop-shadow(0 0 10px rgba(204,255,0,0.7)) drop-shadow(0 0 24px rgba(204,255,0,0.3)) !important;
        }
      `}</style>
    </div>
  );
}
