import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search, Dumbbell, X, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import type { Exercise } from "@shared/schema";

import bodyFrontImage from "@assets/generated_images/matte_black_muscular_body_front.png";
import bodyBackImage from "@assets/generated_images/matte_black_muscular_body_back.png";

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

type BodyView = "front" | "back";

interface MuscleZone {
  id: string;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
  clipPath?: string;
}

const frontMuscleZones: MuscleZone[] = [
  { id: "shoulders", label: "Omuz", top: "14%", left: "12%", width: "18%", height: "10%", clipPath: "ellipse(50% 45% at 50% 50%)" },
  { id: "shoulders-r", label: "Omuz", top: "14%", left: "70%", width: "18%", height: "10%", clipPath: "ellipse(50% 45% at 50% 50%)" },
  { id: "chest", label: "Göğüs", top: "18%", left: "28%", width: "44%", height: "12%", clipPath: "polygon(5% 30%, 50% 0%, 95% 30%, 95% 100%, 50% 85%, 5% 100%)" },
  { id: "biceps", label: "Biceps", top: "22%", left: "8%", width: "14%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "biceps-r", label: "Biceps", top: "22%", left: "78%", width: "14%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "forearms", label: "Ön Kol", top: "35%", left: "5%", width: "12%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "forearms-r", label: "Ön Kol", top: "35%", left: "83%", width: "12%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "abdominals", label: "Karın", top: "30%", left: "35%", width: "30%", height: "18%", clipPath: "polygon(15% 0%, 85% 0%, 95% 100%, 5% 100%)" },
  { id: "quadriceps", label: "Ön Bacak", top: "52%", left: "25%", width: "22%", height: "22%", clipPath: "ellipse(48% 50% at 50% 50%)" },
  { id: "quadriceps-r", label: "Ön Bacak", top: "52%", left: "53%", width: "22%", height: "22%", clipPath: "ellipse(48% 50% at 50% 50%)" },
  { id: "calves", label: "Baldır", top: "76%", left: "28%", width: "16%", height: "16%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "calves-r", label: "Baldır", top: "76%", left: "56%", width: "16%", height: "16%", clipPath: "ellipse(45% 50% at 50% 50%)" },
];

const backMuscleZones: MuscleZone[] = [
  { id: "traps", label: "Trapez", top: "10%", left: "30%", width: "40%", height: "10%", clipPath: "polygon(20% 100%, 50% 0%, 80% 100%)" },
  { id: "shoulders", label: "Omuz", top: "14%", left: "12%", width: "18%", height: "10%", clipPath: "ellipse(50% 45% at 50% 50%)" },
  { id: "shoulders-r", label: "Omuz", top: "14%", left: "70%", width: "18%", height: "10%", clipPath: "ellipse(50% 45% at 50% 50%)" },
  { id: "lats", label: "Sırt (Lat)", top: "22%", left: "20%", width: "25%", height: "18%", clipPath: "polygon(30% 0%, 100% 20%, 90% 100%, 0% 80%)" },
  { id: "lats-r", label: "Sırt (Lat)", top: "22%", left: "55%", width: "25%", height: "18%", clipPath: "polygon(70% 0%, 0% 20%, 10% 100%, 100% 80%)" },
  { id: "middle back", label: "Orta Sırt", top: "22%", left: "38%", width: "24%", height: "12%", clipPath: "ellipse(50% 50% at 50% 50%)" },
  { id: "lower back", label: "Alt Sırt", top: "36%", left: "35%", width: "30%", height: "10%", clipPath: "ellipse(50% 50% at 50% 50%)" },
  { id: "triceps", label: "Triceps", top: "22%", left: "8%", width: "14%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "triceps-r", label: "Triceps", top: "22%", left: "78%", width: "14%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "forearms", label: "Ön Kol", top: "35%", left: "5%", width: "12%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "forearms-r", label: "Ön Kol", top: "35%", left: "83%", width: "12%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "glutes", label: "Kalça", top: "46%", left: "30%", width: "40%", height: "12%", clipPath: "ellipse(50% 50% at 50% 50%)" },
  { id: "hamstrings", label: "Arka Bacak", top: "58%", left: "25%", width: "22%", height: "18%", clipPath: "ellipse(48% 50% at 50% 50%)" },
  { id: "hamstrings-r", label: "Arka Bacak", top: "58%", left: "53%", width: "22%", height: "18%", clipPath: "ellipse(48% 50% at 50% 50%)" },
  { id: "calves", label: "Baldır", top: "78%", left: "28%", width: "16%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
  { id: "calves-r", label: "Baldır", top: "78%", left: "56%", width: "16%", height: "14%", clipPath: "ellipse(45% 50% at 50% 50%)" },
];

function InteractiveBodyMap({ 
  view, 
  selectedMuscle, 
  onSelectMuscle, 
  hoveredMuscle,
  onHoverMuscle 
}: { 
  view: BodyView;
  selectedMuscle: string;
  onSelectMuscle: (muscle: string) => void;
  hoveredMuscle: string;
  onHoverMuscle: (muscle: string) => void;
}) {
  const zones = view === "front" ? frontMuscleZones : backMuscleZones;
  const bodyImage = view === "front" ? bodyFrontImage : bodyBackImage;

  const handleClick = (muscleId: string) => {
    const baseId = muscleId.replace(/-r$/, '');
    onSelectMuscle(baseId === selectedMuscle ? "" : baseId);
  };

  const isSelected = (muscleId: string) => {
    const baseId = muscleId.replace(/-r$/, '');
    return selectedMuscle === baseId;
  };

  const isHovered = (muscleId: string) => {
    return hoveredMuscle === muscleId;
  };

  return (
    <div className="relative w-full max-w-[280px] md:max-w-[320px] mx-auto">
      <img 
        src={bodyImage} 
        alt={`Vücut ${view === "front" ? "ön" : "arka"} görünüm`}
        className="w-full h-auto"
        draggable={false}
      />
      
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="absolute cursor-pointer transition-all duration-300"
          style={{
            top: zone.top,
            left: zone.left,
            width: zone.width,
            height: zone.height,
            clipPath: zone.clipPath,
            backgroundColor: isSelected(zone.id) 
              ? "rgba(57, 255, 20, 0.7)" 
              : isHovered(zone.id) 
                ? "rgba(57, 255, 20, 0.4)" 
                : "transparent",
            boxShadow: isSelected(zone.id) 
              ? "0 0 30px rgba(57, 255, 20, 0.8), 0 0 60px rgba(57, 255, 20, 0.4), inset 0 0 20px rgba(57, 255, 20, 0.3)" 
              : isHovered(zone.id)
                ? "0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.2)"
                : "none",
            border: isSelected(zone.id) || isHovered(zone.id) ? "1px solid rgba(57, 255, 20, 0.5)" : "none",
          }}
          onClick={() => handleClick(zone.id)}
          onMouseEnter={() => onHoverMuscle(zone.id)}
          onMouseLeave={() => onHoverMuscle("")}
          data-testid={`muscle-zone-${zone.id}`}
        />
      ))}

      {hoveredMuscle && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 top-4 bg-black/90 border border-[#39ff14] px-4 py-2 rounded-lg shadow-lg"
          style={{ boxShadow: "0 0 20px rgba(57, 255, 20, 0.3)" }}
        >
          <span className="text-[#39ff14] font-medium text-sm">
            {zones.find(z => z.id === hoveredMuscle)?.label || muscleLabels[hoveredMuscle.replace(/-r$/, '')] || hoveredMuscle}
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default function Exercises() {
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [hoveredMuscle, setHoveredMuscle] = useState<string>("");
  const [bodyView, setBodyView] = useState<BodyView>("front");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

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
  };

  const clearSelection = () => {
    setSelectedMuscle("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title="Egzersiz Akademisi - 800+ Fitness Hareketi | Gokalaf"
        description="800'den fazla fitness egzersizi ve hareket rehberi. Kas gruplarına göre filtreleme yaparak doğru egzersizleri öğrenin."
        keywords="egzersiz, fitness hareketleri, gym egzersizleri, kas çalışma, antrenman rehberi"
        canonical="/egzersiz-akademisi"
      />

      <section className="pt-32 sm:pt-36 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-30" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">{data?.total || 800}+ Egzersiz</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
              Egzersiz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Akademisi
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Çalıştırmak istediğin kasa tıkla, hareketleri keşfet.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Body Map Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 lg:sticky lg:top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-300 tracking-wide">KAS HARİTASI</h2>
                <div className="flex items-center gap-1 bg-[#111] rounded-lg p-1">
                  <button
                    onClick={() => setBodyView("front")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      bodyView === "front" 
                        ? "bg-[#39ff14] text-black" 
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    data-testid="button-view-front"
                  >
                    Ön
                  </button>
                  <button
                    onClick={() => setBodyView("back")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      bodyView === "back" 
                        ? "bg-[#39ff14] text-black" 
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    data-testid="button-view-back"
                  >
                    Arka
                  </button>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bodyView}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <InteractiveBodyMap
                      view={bodyView}
                      selectedMuscle={selectedMuscle}
                      onSelectMuscle={handleMuscleSelect}
                      hoveredMuscle={hoveredMuscle}
                      onHoverMuscle={setHoveredMuscle}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quick muscle buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Object.entries(muscleLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleMuscleSelect(key)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedMuscle === key
                        ? "bg-[#39ff14] text-black shadow-lg shadow-[#39ff14]/30"
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
                  className="mt-4 p-4 bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#39ff14] text-sm font-medium">Seçili Kas:</span>
                      <h3 className="text-white font-bold text-lg">{muscleLabels[selectedMuscle] || selectedMuscle}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="text-gray-400 hover:text-white"
                      data-testid="button-clear-muscle"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Temizle
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Exercises Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Egzersiz ara..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-500"
                  data-testid="input-exercise-search"
                />
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-white">
                  {selectedMuscle ? muscleLabels[selectedMuscle] : "Tüm"} Egzersizler
                  <span className="text-[#39ff14] ml-2">({data?.total || 0})</span>
                </h2>
                {(selectedMuscle || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="text-gray-400 hover:text-white"
                    data-testid="button-show-all"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Tümünü Göster
                  </Button>
                )}
              </div>

              {/* Exercises grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-xl h-64 animate-pulse" />
                  ))}
                </div>
              ) : data?.exercises.length === 0 ? (
                <div className="text-center py-12 bg-[#0a0a0a] rounded-2xl border border-white/5">
                  <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-bold text-white mb-2">Egzersiz Bulunamadı</h3>
                  <p className="text-gray-400 mb-4">Bu kas grubu için egzersiz bulunamadı.</p>
                  <Button onClick={clearSelection} className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90">
                    Tüm Egzersizleri Göster
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data?.exercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link href={`/egzersiz-akademisi/${exercise.slug}`}>
                          <div
                            className="group bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-[#39ff14]/50 transition-all duration-300 cursor-pointer"
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
                              <div className="absolute top-2 left-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  exercise.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                  exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {levelLabels[exercise.level] || exercise.level}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                                <span className="text-[#39ff14] text-sm font-medium flex items-center gap-1">
                                  Detayları Gör <ChevronRight className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-heading font-bold text-white mb-2 group-hover:text-[#39ff14] transition-colors line-clamp-2">
                                {exercise.name}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {exercise.primaryMuscles.slice(0, 2).map((muscle) => (
                                  <span
                                    key={muscle}
                                    className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded"
                                  >
                                    {muscleLabels[muscle] || muscle}
                                  </span>
                                ))}
                                {exercise.equipment && (
                                  <span className="text-xs text-[#39ff14]/80 bg-[#39ff14]/10 px-2 py-1 rounded">
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
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-white/10 text-white hover:bg-white/10"
                        data-testid="button-prev-page"
                      >
                        Önceki
                      </Button>
                      <div className="flex items-center gap-1 px-4">
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
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
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
                        className="border-white/10 text-white hover:bg-white/10"
                        data-testid="button-next-page"
                      >
                        Sonraki
                      </Button>
                    </div>
                  )}

                  <div className="text-center text-gray-500 text-sm">
                    {data?.total} egzersiz arasından {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, data?.total || 0)} arası gösteriliyor
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
