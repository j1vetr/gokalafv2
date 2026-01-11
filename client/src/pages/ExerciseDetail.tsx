import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Dumbbell, 
  Target, 
  Zap, 
  ChevronRight, 
  X, 
  ZoomIn, 
  Flame,
  Activity,
  ArrowRight,
  CheckCircle2,
  Info,
  Layers
} from "lucide-react";
import SEO from "@/components/SEO";
import { ShareButtons } from "@/components/ShareButtons";
import type { Exercise } from "@shared/schema";

const levelConfig = {
  beginner: { label: "Başlangıç", color: "emerald", dotColor: "bg-emerald-500" },
  intermediate: { label: "Orta", color: "amber", dotColor: "bg-amber-500" },
  expert: { label: "İleri", color: "rose", dotColor: "bg-rose-500" },
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
  lats: "Sırt",
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

const forceLabels: Record<string, string> = {
  push: "İtme",
  pull: "Çekme",
  static: "Statik",
};

const mechanicLabels: Record<string, string> = {
  compound: "Compound",
  isolation: "İzolasyon",
};

export default function ExerciseDetail() {
  const [, params] = useRoute("/egzersiz-akademisi/:slug");
  const slug = params?.slug;
  const [zoomOpen, setZoomOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: exercise, isLoading, error } = useQuery<Exercise>({
    queryKey: ["/api/exercises", slug],
    queryFn: async () => {
      const res = await fetch(`/api/exercises/${slug}`);
      if (!res.ok) throw new Error("Exercise not found");
      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-3">Egzersiz Bulunamadı</h1>
          <p className="text-gray-400 mb-8">Aradığınız egzersiz mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/egzersiz-akademisi">
            <Button className="bg-primary text-black hover:bg-primary/90" data-testid="button-back-exercises">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Egzersizlere Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const instructions = exercise.instructionsTr || exercise.instructionsEn;
  const shareUrl = `https://gokalaf.com/egzersiz-akademisi/${exercise.slug}`;
  const primaryMuscle = exercise.primaryMuscles[0];
  const levelInfo = levelConfig[exercise.level as keyof typeof levelConfig] || levelConfig.beginner;

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title={`${exercise.name} | Egzersiz Rehberi | Gokalaf`}
        description={`${exercise.name} nasıl yapılır? ${exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ')} için adım adım talimatlar.`}
        keywords={`${exercise.name}, ${exercise.primaryMuscles.join(', ')}, egzersiz`}
        canonical={`/egzersiz-akademisi/${exercise.slug}`}
      />

      {/* Hero Section */}
      <section className="relative pt-28 lg:pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Breadcrumb */}
          <nav className="mb-6" data-testid="nav-breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <li>
                <Link href="/egzersiz-akademisi" className="text-gray-500 hover:text-white transition-colors">
                  Egzersiz Akademisi
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <li className="text-white font-medium truncate max-w-[200px]">{exercise.name}</li>
            </ol>
          </nav>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column - Media */}
            <div className="lg:col-span-7 xl:col-span-8">
              {/* Title - Mobile Only */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${levelInfo.dotColor}`} />
                  <span className="text-sm text-gray-400">{levelInfo.label}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-400">
                    {categoryLabels[exercise.category || ''] || exercise.category}
                  </span>
                </div>
                <h1 className="text-3xl font-heading font-bold text-white">
                  {exercise.name}
                </h1>
              </div>

              {/* Media Container */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                {/* Main Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-black/60 to-black/40 border border-white/[0.08]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent" />
                  
                  {exercise.images[currentImageIndex] && (
                    <img
                      src={exercise.images[currentImageIndex]}
                      alt={exercise.name}
                      className="w-full h-full object-contain relative z-10"
                      loading="eager"
                    />
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setZoomOpen(true)}
                      className="absolute top-4 right-4 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 hover:bg-black/90 hover:border-white/20 transition-all"
                      data-testid="button-zoom"
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Position Indicator */}
                  {exercise.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10">
                        <span className="text-xs text-gray-400">
                          {currentImageIndex === 0 ? "Başlangıç Pozisyonu" : "Bitiş Pozisyonu"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {exercise.images.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {exercise.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative flex-1 max-w-[120px] aspect-video rounded-xl overflow-hidden transition-all duration-300 ${
                          currentImageIndex === idx 
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#050505]' 
                            : 'opacity-60 hover:opacity-100 border border-white/10'
                        }`}
                        data-testid={`button-thumbnail-${idx}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="text-xs font-medium text-white">
                            {idx === 0 ? "Başlangıç" : "Bitiş"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Instructions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white">Nasıl Yapılır?</h2>
                    <p className="text-sm text-gray-500">Adım adım uygulama rehberi</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {instructions.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.08 }}
                      className="group relative flex gap-4"
                    >
                      {/* Step Number */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        {index < instructions.length - 1 && (
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-[calc(100%-8px)] bg-gradient-to-b from-primary/20 to-transparent" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-4">
                        <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                          {step}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Back Link - Desktop */}
              <div className="hidden lg:block mt-12 pt-8 border-t border-white/[0.06]">
                <Link href="/egzersiz-akademisi">
                  <Button variant="ghost" className="text-gray-400 hover:text-white -ml-4" data-testid="button-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tüm Egzersizlere Dön
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Info Panel */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-6">
                
                {/* Title - Desktop Only */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="hidden lg:block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${levelInfo.dotColor}`} />
                    <span className="text-sm text-gray-400">{levelInfo.label} Seviye</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-400">
                      {categoryLabels[exercise.category || ''] || exercise.category}
                    </span>
                  </div>
                  <h1 className="text-3xl xl:text-4xl font-heading font-bold text-white leading-tight">
                    {exercise.name}
                  </h1>
                </motion.div>

                {/* Share */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <ShareButtons 
                    url={shareUrl}
                    title={exercise.name}
                    description={`${exercise.name} egzersizi`}
                  />
                </motion.div>

                {/* Quick Stats Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-white/[0.06]">
                    <h3 className="text-sm font-medium text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      Egzersiz Detayları
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-white/[0.06]">
                    {/* Target Muscle */}
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Target className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm text-gray-400">Hedef Kas</span>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {muscleLabels[primaryMuscle] || primaryMuscle}
                      </span>
                    </div>

                    {/* Equipment */}
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                          <Dumbbell className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-400">Ekipman</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {equipmentLabels[exercise.equipment || ''] || exercise.equipment || 'Yok'}
                      </span>
                    </div>

                    {/* Force */}
                    {exercise.force && (
                      <div className="px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-400">Hareket Tipi</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {forceLabels[exercise.force] || exercise.force}
                        </span>
                      </div>
                    )}

                    {/* Mechanic */}
                    {exercise.mechanic && (
                      <div className="px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-400">Kategori</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {mechanicLabels[exercise.mechanic] || exercise.mechanic}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Muscles Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] overflow-hidden"
                >
                  {/* Primary Muscles */}
                  <div className="px-5 py-4 border-b border-white/[0.06]">
                    <h3 className="text-sm font-medium text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Çalışan Kaslar
                    </h3>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Ana Kaslar</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.primaryMuscles.map((muscle) => (
                          <span
                            key={muscle}
                            className="px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/25 text-primary text-sm font-medium"
                          >
                            {muscleLabels[muscle] || muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    {exercise.secondaryMuscles.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Yardımcı Kaslar</p>
                        <div className="flex flex-wrap gap-2">
                          {exercise.secondaryMuscles.map((muscle) => (
                            <span
                              key={muscle}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm"
                            >
                              {muscleLabels[muscle] || muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* CTA Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="relative rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                  <div className="absolute inset-0 bg-[#0a0a0a]/80" />
                  
                  <div className="relative p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Flame className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white mb-2">
                      Profesyonel Koçluk
                    </h3>
                    <p className="text-sm text-gray-400 mb-5 max-w-[240px] mx-auto">
                      Kişiselleştirilmiş antrenman programı ile hedeflerine ulaş
                    </p>
                    <Link href="/paketler">
                      <Button className="bg-primary text-black hover:bg-primary/90 w-full font-semibold" data-testid="button-cta-packages">
                        Paketleri İncele
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {/* Back Link - Mobile */}
                <div className="lg:hidden pt-4">
                  <Link href="/egzersiz-akademisi">
                    <Button variant="outline" className="w-full border-white/10 text-gray-400 hover:text-white hover:border-white/20" data-testid="button-back-mobile">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Tüm Egzersizlere Dön
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-16 lg:h-24" />

      {/* Image Zoom Modal */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black/95 border-white/10">
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            data-testid="button-close-zoom"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="p-6">
            <img
              src={exercise.images[currentImageIndex]}
              alt={exercise.name}
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            
            {exercise.images.length > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                {exercise.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-24 h-16 rounded-xl overflow-hidden transition-all ${
                      currentImageIndex === index 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' 
                        : 'opacity-50 hover:opacity-100 border border-white/20'
                    }`}
                    data-testid={`button-modal-thumbnail-${index}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
