import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Search, Dumbbell, X, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import Model from "react-body-highlighter";
import type { Exercise } from "@shared/schema";

interface ExercisesResponse {
  exercises: Exercise[];
  total: number;
}

const levelLabels: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  expert: "İleri",
};

const muscleLabels: Record<string, string> = {
  abdominals: "Karın",
  abductors: "Dış Bacak",
  adductors: "İç Bacak",
  biceps: "Biceps",
  calves: "Baldır",
  chest: "Göğüs",
  forearms: "Ön Kol",
  glutes: "Kalça",
  hamstrings: "Arka Bacak",
  lats: "Sırt (Lat)",
  "lower back": "Alt Sırt",
  "middle back": "Orta Sırt",
  neck: "Boyun",
  quadriceps: "Ön Bacak",
  shoulders: "Omuz",
  traps: "Trapez",
  triceps: "Triceps",
};

const equipmentLabels: Record<string, string> = {
  barbell: "Halter",
  "body only": "Vücut Ağırlığı",
  cable: "Kablo",
  dumbbell: "Dambıl",
  "e-z curl bar": "EZ Bar",
  "exercise ball": "Pilates Topu",
  "foam roll": "Foam Roller",
  kettlebells: "Kettlebell",
  machine: "Makine",
  "medicine ball": "Sağlık Topu",
  other: "Diğer",
  bands: "Direnç Bandı",
};

const bodyHighlighterToApiMuscle: Record<string, string> = {
  "chest": "chest",
  "abs": "abdominals",
  "obliques": "abdominals",
  "upper-back": "middle back",
  "lower-back": "lower back",
  "trapezius": "traps",
  "biceps": "biceps",
  "triceps": "triceps",
  "forearm": "forearms",
  "front-deltoids": "shoulders",
  "back-deltoids": "shoulders",
  "quadriceps": "quadriceps",
  "hamstring": "hamstrings",
  "gluteal": "glutes",
  "calves": "calves",
  "adductor": "adductors",
  "abductors": "abductors",
  "neck": "neck",
  "head": "neck",
  "knees": "quadriceps",
  "left-soleus": "calves",
  "right-soleus": "calves",
};

const apiMuscleToBodyHighlighter: Record<string, string[]> = {
  "chest": ["chest"],
  "abdominals": ["abs", "obliques"],
  "middle back": ["upper-back"],
  "lower back": ["lower-back"],
  "traps": ["trapezius"],
  "biceps": ["biceps"],
  "triceps": ["triceps"],
  "forearms": ["forearm"],
  "shoulders": ["front-deltoids", "back-deltoids"],
  "quadriceps": ["quadriceps"],
  "hamstrings": ["hamstring"],
  "glutes": ["gluteal"],
  "calves": ["calves", "left-soleus", "right-soleus"],
  "adductors": ["adductor"],
  "abductors": ["abductors"],
  "neck": ["neck", "head"],
  "lats": ["upper-back"],
};

type BodyView = "anterior" | "posterior";

export default function Exercises() {
  const [location] = useLocation();
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [hoveredMuscle, setHoveredMuscle] = useState<string>("");
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
        const exercisesSection = document.getElementById('exercises-list');
        if (exercisesSection) {
          exercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedMuscle) params.set("muscle", selectedMuscle);
    params.set("limit", String(limit));
    params.set("offset", String((currentPage - 1) * limit));
    return params.toString();
  }, [searchQuery, selectedMuscle, currentPage]);

  const { data, isLoading } = useQuery<ExercisesResponse>({
    queryKey: ["/api/exercises", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/exercises?${queryParams}`);
      return res.json();
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const handleMuscleSelect = (muscle: string) => {
    setSelectedMuscle(muscle === selectedMuscle ? "" : muscle);
    setCurrentPage(1);
    setSearchQuery("");
    
    if (muscle !== selectedMuscle) {
      setTimeout(() => {
        const exercisesSection = document.getElementById('exercises-list');
        if (exercisesSection) {
          exercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const clearSelection = () => {
    setSelectedMuscle("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleBodyClick = (data: { muscle: string; data: { exercises: string[]; frequency: number } }) => {
    const apiMuscle = bodyHighlighterToApiMuscle[data.muscle] || data.muscle;
    handleMuscleSelect(apiMuscle);
  };

  const getModelData = () => {
    if (!selectedMuscle) return [];
    const highlighterMuscles = apiMuscleToBodyHighlighter[selectedMuscle] || [selectedMuscle];
    return highlighterMuscles.map(muscle => ({
      name: "Selected",
      muscles: [muscle],
    }));
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title="Egzersiz Akademisi - 800+ Fitness Hareketi | Gokalaf"
        description="800'den fazla fitness egzersizi ve hareket rehberi. Kas gruplarına göre filtreleme yaparak doğru egzersizleri öğrenin."
        keywords="egzersiz, fitness hareketleri, gym egzersizleri, kas çalışma, antrenman rehberi"
        canonical="/egzersiz-akademisi"
      />

      <section className="pt-24 sm:pt-28 pb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/10 rounded-full blur-[80px] opacity-30" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 mb-3">
              <Dumbbell className="w-3 h-3 text-primary" />
              <span className="text-primary text-xs font-medium">{data?.total || 800}+ Egzersiz</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase mb-2 text-white tracking-tighter">
              Egzersiz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Akademisi
              </span>
            </h1>
            <p className="text-sm text-gray-400">
              Çalıştırmak istediğin kasa tıkla, hareketleri keşfet.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Body Map Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 lg:sticky lg:top-20"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-300 tracking-wide">KAS HARİTASI</h2>
                <div className="flex items-center gap-0.5 bg-[#111] rounded-md p-0.5">
                  <button
                    onClick={() => setBodyView("anterior")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      bodyView === "anterior" 
                        ? "bg-[#39ff14] text-black" 
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    data-testid="button-view-front"
                  >
                    Ön
                  </button>
                  <button
                    onClick={() => setBodyView("posterior")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      bodyView === "posterior" 
                        ? "bg-[#39ff14] text-black" 
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    data-testid="button-view-back"
                  >
                    Arka
                  </button>
                </div>
              </div>

              <div className="flex justify-center mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bodyView}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-[180px] md:max-w-[220px] body-highlighter-container"
                  >
                    <Model
                      data={getModelData()}
                      style={{ width: "100%", padding: "0" }}
                      onClick={handleBodyClick}
                      type={bodyView}
                      highlightedColors={["#39ff14"]}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {hoveredMuscle && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-3"
                >
                  <span className="text-[#39ff14] font-medium text-xs bg-[#39ff14]/10 px-3 py-1.5 rounded-full">
                    {muscleLabels[hoveredMuscle] || hoveredMuscle}
                  </span>
                </motion.div>
              )}

              {/* Quick muscle buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {Object.entries(muscleLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleMuscleSelect(key)}
                    className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                      selectedMuscle === key
                        ? "bg-[#39ff14] text-black shadow-md shadow-[#39ff14]/30"
                        : "bg-[#111] text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 border border-white/5"
                    }`}
                    data-testid={`button-muscle-${key}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {selectedMuscle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#39ff14] text-xs font-medium">Seçili Kas:</span>
                      <h3 className="text-white font-bold text-sm">{muscleLabels[selectedMuscle] || selectedMuscle}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="text-gray-400 hover:text-white h-7 text-xs"
                      data-testid="button-clear-muscle"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Temizle
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Exercises Section */}
            <motion.div
              id="exercises-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 scroll-mt-20"
            >
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Egzersiz ara..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-9 text-sm bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-500"
                  data-testid="input-exercise-search"
                />
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-heading font-bold text-white">
                  {selectedMuscle ? muscleLabels[selectedMuscle] : "Tüm"} Egzersizler
                  <span className="text-[#39ff14] ml-1.5">({data?.total || 0})</span>
                </h2>
                {(selectedMuscle || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="text-gray-400 hover:text-white h-7 text-xs"
                    data-testid="button-show-all"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Tümünü Göster
                  </Button>
                )}
              </div>

              {/* Exercises grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-lg h-44 animate-pulse" />
                  ))}
                </div>
              ) : data?.exercises.length === 0 ? (
                <div className="text-center py-8 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-sm font-heading font-bold text-white mb-1">Egzersiz Bulunamadı</h3>
                  <p className="text-gray-400 text-xs mb-3">Bu kas grubu için egzersiz bulunamadı.</p>
                  <Button onClick={clearSelection} size="sm" className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90 h-8 text-xs">
                    Tüm Egzersizleri Göster
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data?.exercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <Link href={`/egzersiz-akademisi/${exercise.slug}`}>
                          <div
                            className="group bg-[#0a0a0a] border border-white/5 rounded-lg overflow-hidden hover:border-[#39ff14]/50 transition-all duration-300 cursor-pointer"
                            data-testid={`card-exercise-${exercise.id}`}
                          >
                            <div className="aspect-[4/3] relative overflow-hidden bg-black/50">
                              {exercise.images[0] && (
                                <img
                                  src={exercise.images[0]}
                                  alt={exercise.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                              )}
                              <div className="absolute top-1.5 left-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  exercise.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                  exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {levelLabels[exercise.level] || exercise.level}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                                <span className="text-[#39ff14] text-xs font-medium flex items-center gap-0.5">
                                  Detay <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                            <div className="p-2.5">
                              <h3 className="font-heading font-bold text-white text-xs sm:text-sm mb-1.5 group-hover:text-[#39ff14] transition-colors line-clamp-2">
                                {exercise.name}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {exercise.primaryMuscles.slice(0, 1).map((muscle) => (
                                  <span
                                    key={muscle}
                                    className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded"
                                  >
                                    {muscleLabels[muscle] || muscle}
                                  </span>
                                ))}
                                {exercise.equipment && (
                                  <span className="text-[10px] text-[#39ff14]/80 bg-[#39ff14]/10 px-1.5 py-0.5 rounded">
                                    {equipmentLabels[exercise.equipment] || exercise.equipment}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-1.5 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-white/10 text-white hover:bg-white/10 h-7 text-xs px-2"
                        data-testid="button-prev-page"
                      >
                        Önceki
                      </Button>
                      <div className="flex items-center gap-0.5 px-2">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-[#39ff14] text-black"
                                  : "text-gray-400 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-white/10 text-white hover:bg-white/10 h-7 text-xs px-2"
                        data-testid="button-next-page"
                      >
                        Sonraki
                      </Button>
                    </div>
                  )}

                  <div className="text-center text-gray-500 text-xs">
                    {data?.total} egzersiz arasından {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, data?.total || 0)} arası gösteriliyor
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        .body-highlighter-container svg {
          width: 100% !important;
          height: auto !important;
        }
        .body-highlighter-container svg polygon {
          fill: #1a1a1a !important;
          stroke: #2a2a2a !important;
          stroke-width: 0.5 !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }
        .body-highlighter-container svg polygon:hover {
          fill: rgba(57, 255, 20, 0.4) !important;
          stroke: #39ff14 !important;
          filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.5)) !important;
        }
        .body-highlighter-container svg polygon[style*="rgb(57, 255, 20)"],
        .body-highlighter-container svg polygon[fill="#39ff14"] {
          fill: #39ff14 !important;
          stroke: #39ff14 !important;
          filter: drop-shadow(0 0 15px rgba(57, 255, 20, 0.8)) drop-shadow(0 0 30px rgba(57, 255, 20, 0.4)) !important;
        }
      `}</style>
    </div>
  );
}
