import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, Filter, Dumbbell, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SEO from "@/components/SEO";
import type { Exercise } from "@shared/schema";

interface ExercisesResponse {
  exercises: Exercise[];
  total: number;
}

interface FiltersResponse {
  muscles: string[];
  equipment: string[];
  levels: string[];
  categories: string[];
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

const categoryLabels: Record<string, string> = {
  strength: "Güç",
  stretching: "Esneme",
  plyometrics: "Pliometrik",
  strongman: "Strongman",
  powerlifting: "Powerlifting",
  cardio: "Kardiyo",
  "olympic weightlifting": "Olimpik Halter",
};

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 24;

  const { data: filtersData } = useQuery<FiltersResponse>({
    queryKey: ["/api/exercises/filters"],
    queryFn: async () => {
      const res = await fetch("/api/exercises/filters");
      return res.json();
    },
  });

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedMuscle) params.set("muscle", selectedMuscle);
    if (selectedEquipment) params.set("equipment", selectedEquipment);
    if (selectedLevel) params.set("level", selectedLevel);
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("limit", String(limit));
    params.set("offset", String((currentPage - 1) * limit));
    return params.toString();
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedLevel, selectedCategory, currentPage]);

  const { data, isLoading } = useQuery<ExercisesResponse>({
    queryKey: ["/api/exercises", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/exercises?${queryParams}`);
      return res.json();
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;
  const hasActiveFilters = selectedMuscle || selectedEquipment || selectedLevel || selectedCategory || searchQuery;

  const clearFilters = () => {
    setSelectedMuscle("");
    setSelectedEquipment("");
    setSelectedLevel("");
    setSelectedCategory("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title="Egzersiz Akademisi - 800+ Fitness Hareketi | Gokalaf"
        description="800'den fazla fitness egzersizi ve hareket rehberi. Kas gruplarına, ekipmana ve zorluk seviyesine göre filtreleme yaparak doğru egzersizleri öğrenin."
        keywords="egzersiz, fitness hareketleri, gym egzersizleri, kas çalışma, antrenman rehberi"
        canonical="/egzersiz-akademisi"
      />

      <section className="pt-28 pb-8 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-30" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs sm:text-sm font-medium">{data?.total || 800}+ Egzersiz</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase mb-4 sm:mb-6 text-white tracking-tighter">
              Egzersiz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Akademisi
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
              Doğru teknikle doğru sonuçlar. Her hareketin detaylı açıklaması ve görsel rehberi.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-4 sm:py-6 sticky top-16 sm:top-20 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Egzersiz ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 sm:pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm sm:text-base"
                data-testid="input-exercise-search"
              />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Select value={selectedMuscle} onValueChange={(v) => { setSelectedMuscle(v === "all" ? "" : v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[120px] sm:w-[160px] bg-white/5 border-white/10 text-white text-xs sm:text-sm" data-testid="select-muscle">
                  <SelectValue placeholder="Kas Grubu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {filtersData?.muscles.map((m) => (
                    <SelectItem key={m} value={m}>{muscleLabels[m] || m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedEquipment} onValueChange={(v) => { setSelectedEquipment(v === "all" ? "" : v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[110px] sm:w-[160px] bg-white/5 border-white/10 text-white text-xs sm:text-sm" data-testid="select-equipment">
                  <SelectValue placeholder="Ekipman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {filtersData?.equipment.map((e) => (
                    <SelectItem key={e} value={e}>{equipmentLabels[e] || e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={(v) => { setSelectedLevel(v === "all" ? "" : v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[100px] sm:w-[140px] bg-white/5 border-white/10 text-white text-xs sm:text-sm" data-testid="select-level">
                  <SelectValue placeholder="Seviye" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {filtersData?.levels.map((l) => (
                    <SelectItem key={l} value={l}>{levelLabels[l] || l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v === "all" ? "" : v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[110px] sm:w-[150px] bg-white/5 border-white/10 text-white text-xs sm:text-sm" data-testid="select-category">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {filtersData?.categories.map((c) => (
                    <SelectItem key={c} value={c}>{categoryLabels[c] || c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white text-xs sm:text-sm"
                  data-testid="button-clear-filters"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Temizle
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl h-56 sm:h-72 md:h-80 animate-pulse" />
              ))}
            </div>
          ) : data?.exercises.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <Dumbbell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2">Egzersiz Bulunamadı</h3>
              <p className="text-gray-400 mb-6 text-sm sm:text-base">Arama kriterlerinize uygun egzersiz bulunamadı.</p>
              <Button onClick={clearFilters} className="bg-primary text-black hover:bg-primary/90">
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {data?.exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <Link href={`/egzersiz-akademisi/${exercise.slug}`}>
                      <div
                        className="group bg-white/5 border border-white/10 rounded-lg sm:rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer h-full"
                        data-testid={`card-exercise-${exercise.id}`}
                      >
                        <div className="aspect-[4/3] relative overflow-hidden bg-black/50">
                          {exercise.images[0] && (
                            <img
                              src={exercise.images[0]}
                              alt={`${exercise.name} egzersizi - ${exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ')} çalıştırma hareketi`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                            <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium ${
                              exercise.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                              exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {levelLabels[exercise.level] || exercise.level}
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 sm:p-3 md:p-4">
                          <h3 className="font-heading font-bold text-white mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2 text-xs sm:text-sm md:text-base">
                            {exercise.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {exercise.primaryMuscles.slice(0, 2).map((muscle) => (
                              <span
                                key={muscle}
                                className="text-[10px] sm:text-xs text-gray-400 bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
                              >
                                {muscleLabels[muscle] || muscle}
                              </span>
                            ))}
                            {exercise.equipment && (
                              <span className="text-[10px] sm:text-xs text-primary/80 bg-primary/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded hidden sm:inline-block">
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

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-white/10 text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4"
                    data-testid="button-prev-page"
                  >
                    <span className="hidden sm:inline">Önceki</span>
                    <span className="sm:hidden">&lt;</span>
                  </Button>
                  <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-4">
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
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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
                    className="border-white/10 text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4"
                    data-testid="button-next-page"
                  >
                    <span className="hidden sm:inline">Sonraki</span>
                    <span className="sm:hidden">&gt;</span>
                  </Button>
                </div>
              )}

              <div className="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm">
                {data?.total} egzersiz arasından {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, data?.total || 0)} arası gösteriliyor
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
