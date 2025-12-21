import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search, Dumbbell, X, RotateCcw, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
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

type BodyView = "front" | "back";

interface MuscleZone {
  id: string;
  path: string;
  label: string;
  view: BodyView;
}

const muscleZones: MuscleZone[] = [
  // Front view muscles
  { id: "chest", path: "M 85 95 Q 100 85 115 95 Q 120 110 115 125 Q 100 130 85 125 Q 80 110 85 95", label: "Göğüs", view: "front" },
  { id: "shoulders", path: "M 65 90 Q 75 80 85 90 L 85 110 Q 75 115 65 105 Z", label: "Omuz", view: "front" },
  { id: "shoulders-r", path: "M 115 90 Q 125 80 135 90 L 135 105 Q 125 115 115 110 Z", label: "Omuz", view: "front" },
  { id: "biceps", path: "M 55 110 Q 65 105 70 115 L 65 145 Q 55 150 50 140 Z", label: "Biceps", view: "front" },
  { id: "biceps-r", path: "M 130 115 Q 135 105 145 110 L 150 140 Q 145 150 135 145 Z", label: "Biceps", view: "front" },
  { id: "forearms", path: "M 45 145 Q 55 140 60 150 L 55 185 Q 45 190 40 180 Z", label: "Ön Kol", view: "front" },
  { id: "forearms-r", path: "M 140 150 Q 145 140 155 145 L 160 180 Q 155 190 145 185 Z", label: "Ön Kol", view: "front" },
  { id: "abdominals", path: "M 88 130 Q 100 125 112 130 L 112 175 Q 100 180 88 175 Z", label: "Karın", view: "front" },
  { id: "quadriceps", path: "M 78 185 Q 88 180 95 185 L 92 245 Q 85 250 78 245 Z", label: "Ön Bacak", view: "front" },
  { id: "quadriceps-r", path: "M 105 185 Q 112 180 122 185 L 122 245 Q 115 250 108 245 Z", label: "Ön Bacak", view: "front" },
  { id: "calves", path: "M 80 260 Q 88 255 92 260 L 90 310 Q 85 315 80 310 Z", label: "Baldır", view: "front" },
  { id: "calves-r", path: "M 108 260 Q 112 255 120 260 L 120 310 Q 115 315 110 310 Z", label: "Baldır", view: "front" },
  
  // Back view muscles
  { id: "traps", path: "M 85 70 Q 100 60 115 70 L 115 95 Q 100 100 85 95 Z", label: "Trapez", view: "back" },
  { id: "lats", path: "M 75 100 Q 85 95 95 100 L 90 145 Q 80 150 75 140 Z", label: "Sırt (Lat)", view: "back" },
  { id: "lats-r", path: "M 105 100 Q 115 95 125 100 L 125 140 Q 120 150 110 145 Z", label: "Sırt (Lat)", view: "back" },
  { id: "middle back", path: "M 88 100 Q 100 95 112 100 L 112 130 Q 100 135 88 130 Z", label: "Orta Sırt", view: "back" },
  { id: "lower back", path: "M 88 135 Q 100 130 112 135 L 112 165 Q 100 170 88 165 Z", label: "Alt Sırt", view: "back" },
  { id: "triceps", path: "M 55 110 Q 65 105 70 115 L 65 145 Q 55 150 50 140 Z", label: "Triceps", view: "back" },
  { id: "triceps-r", path: "M 130 115 Q 135 105 145 110 L 150 140 Q 145 150 135 145 Z", label: "Triceps", view: "back" },
  { id: "glutes", path: "M 78 170 Q 100 165 122 170 L 122 200 Q 100 205 78 200 Z", label: "Kalça", view: "back" },
  { id: "hamstrings", path: "M 78 205 Q 88 200 95 205 L 92 260 Q 85 265 78 260 Z", label: "Arka Bacak", view: "back" },
  { id: "hamstrings-r", path: "M 105 205 Q 112 200 122 205 L 122 260 Q 115 265 108 260 Z", label: "Arka Bacak", view: "back" },
];

function BodyMap({ 
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
  const visibleMuscles = muscleZones.filter(m => m.view === view);
  
  return (
    <svg viewBox="0 0 200 340" className="w-full h-full max-h-[500px]">
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Body silhouette */}
      <g className="body-outline">
        {/* Head */}
        <ellipse cx="100" cy="35" rx="22" ry="28" fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
        {/* Neck */}
        <rect x="92" y="58" width="16" height="15" fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
        {/* Torso */}
        <path d="M 70 73 Q 65 75 60 90 L 55 110 L 50 145 Q 48 155 55 185 L 75 185 L 78 175 Q 100 180 122 175 L 125 185 L 145 185 Q 152 155 150 145 L 145 110 L 140 90 Q 135 75 130 73 Q 100 65 70 73" 
              fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
        {/* Left arm */}
        <path d="M 60 90 Q 50 95 45 110 L 40 145 L 35 180 Q 30 195 35 200 L 50 200 L 55 185 L 60 150 L 65 115 Q 68 100 70 90" 
              fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
        {/* Right arm */}
        <path d="M 140 90 Q 150 95 155 110 L 160 145 L 165 180 Q 170 195 165 200 L 150 200 L 145 185 L 140 150 L 135 115 Q 132 100 130 90" 
              fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
        {/* Hips/Pelvis */}
        <path d="M 75 175 Q 100 170 125 175 L 125 195 Q 100 200 75 195 Z" 
              fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
        {/* Left leg */}
        <path d="M 75 195 Q 70 200 72 220 L 75 260 L 78 300 Q 77 320 80 330 L 95 330 L 95 300 L 95 250 L 98 200 Q 100 195 95 190" 
              fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
        {/* Right leg */}
        <path d="M 125 195 Q 130 200 128 220 L 125 260 L 122 300 Q 123 320 120 330 L 105 330 L 105 300 L 105 250 L 102 200 Q 100 195 105 190" 
              fill="url(#bodyGradient)" stroke="#333" strokeWidth="1"/>
      </g>

      {/* Muscle zones */}
      {visibleMuscles.map((muscle) => {
        const baseId = muscle.id.replace(/-r$/, '');
        const isSelected = selectedMuscle === baseId;
        const isHovered = hoveredMuscle === muscle.id;
        
        return (
          <motion.path
            key={muscle.id}
            d={muscle.path}
            fill={isSelected ? "#ccff00" : isHovered ? "rgba(204, 255, 0, 0.5)" : "rgba(204, 255, 0, 0.15)"}
            stroke={isSelected || isHovered ? "#ccff00" : "rgba(204, 255, 0, 0.3)"}
            strokeWidth={isSelected ? 2 : 1}
            className="cursor-pointer transition-all duration-200"
            filter={isSelected || isHovered ? "url(#glow)" : ""}
            onClick={() => onSelectMuscle(baseId)}
            onMouseEnter={() => onHoverMuscle(muscle.id)}
            onMouseLeave={() => onHoverMuscle("")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid={`muscle-${muscle.id}`}
          />
        );
      })}

      {/* Muscle labels on hover */}
      {visibleMuscles.map((muscle) => {
        const isHovered = hoveredMuscle === muscle.id;
        if (!isHovered) return null;
        
        const pathParts = muscle.path.match(/M\s*([\d.]+)\s*([\d.]+)/);
        const x = pathParts ? parseFloat(pathParts[1]) + 20 : 100;
        const y = pathParts ? parseFloat(pathParts[2]) : 100;
        
        return (
          <g key={`label-${muscle.id}`}>
            <rect x={x - 5} y={y - 12} width={muscle.label.length * 7 + 10} height="18" rx="4" fill="rgba(0,0,0,0.8)" />
            <text x={x} y={y} fill="#ccff00" fontSize="10" fontWeight="bold" className="pointer-events-none">
              {muscle.label}
            </text>
          </g>
        );
      })}
    </svg>
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
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-white">Kas Haritası</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant={bodyView === "front" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBodyView("front")}
                    className={bodyView === "front" ? "bg-primary text-black" : "border-white/20 text-gray-400"}
                    data-testid="button-view-front"
                  >
                    Ön
                  </Button>
                  <Button
                    variant={bodyView === "back" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBodyView("back")}
                    className={bodyView === "back" ? "bg-primary text-black" : "border-white/20 text-gray-400"}
                    data-testid="button-view-back"
                  >
                    Arka
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBodyView(bodyView === "front" ? "back" : "front")}
                    className="text-gray-400 hover:text-white"
                    data-testid="button-rotate-body"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bodyView}
                    initial={{ opacity: 0, rotateY: bodyView === "front" ? -90 : 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: bodyView === "front" ? 90 : -90 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-[300px]"
                  >
                    <BodyMap
                      view={bodyView}
                      selectedMuscle={selectedMuscle}
                      onSelectMuscle={handleMuscleSelect}
                      hoveredMuscle={hoveredMuscle}
                      onHoverMuscle={setHoveredMuscle}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Muscle buttons grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Object.entries(muscleLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleMuscleSelect(key)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedMuscle === key
                        ? "bg-primary text-black"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
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
                  className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary text-sm font-medium">Seçili Kas:</span>
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
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  data-testid="input-exercise-search"
                />
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-white">
                  {selectedMuscle ? muscleLabels[selectedMuscle] : "Tüm"} Egzersizler
                  <span className="text-primary ml-2">({data?.total || 0})</span>
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
                <div className="text-center py-12 bg-white/5 rounded-2xl">
                  <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-bold text-white mb-2">Egzersiz Bulunamadı</h3>
                  <p className="text-gray-400 mb-4">Bu kas grubu için egzersiz bulunamadı.</p>
                  <Button onClick={clearSelection} className="bg-primary text-black hover:bg-primary/90">
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
                            className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
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
                                <span className="text-primary text-sm font-medium flex items-center gap-1">
                                  Detayları Gör <ChevronRight className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
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
                                  <span className="text-xs text-primary/80 bg-primary/10 px-2 py-1 rounded">
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
                                  ? "bg-primary text-black"
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
