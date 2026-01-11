import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
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
  Play
} from "lucide-react";
import SEO from "@/components/SEO";
import { ShareButtons } from "@/components/ShareButtons";
import type { Exercise } from "@shared/schema";

const levelConfig = {
  beginner: { label: "Başlangıç", color: "emerald", icon: "🟢" },
  intermediate: { label: "Orta", color: "amber", icon: "🟡" },
  expert: { label: "İleri", color: "rose", icon: "🔴" },
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

function StatCard({ icon: Icon, label, value, accent = false }: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      accent 
        ? 'bg-primary/10 border-primary/30' 
        : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
    }`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
        accent ? 'bg-primary/20' : 'bg-white/5'
      }`}>
        <Icon className={`w-4 h-4 ${accent ? 'text-primary' : 'text-gray-400'}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
        <p className={`text-sm font-medium truncate ${accent ? 'text-primary' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.beginner;
  
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r border ${colorClasses[config.color as keyof typeof colorClasses]}`}>
      <span className="text-xs">{config.icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wider">{config.label}</span>
    </div>
  );
}

export default function ExerciseDetail() {
  const [, params] = useRoute("/egzersiz-akademisi/:slug");
  const slug = params?.slug;
  const [zoomOpen, setZoomOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const { data: exercise, isLoading, error } = useQuery<Exercise>({
    queryKey: ["/api/exercises", slug],
    queryFn: async () => {
      const res = await fetch(`/api/exercises/${slug}`);
      if (!res.ok) throw new Error("Exercise not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const relatedExercises = useMemo(() => {
    return [];
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-36 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-[#050505] pt-36">
        <div className="container mx-auto px-4 py-20 text-center">
          <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold text-white mb-3">Egzersiz Bulunamadı</h1>
          <p className="text-gray-400 text-sm mb-6">Aradığınız egzersiz mevcut değil.</p>
          <Link href="/egzersiz-akademisi">
            <Button size="sm" className="bg-primary text-black hover:bg-primary/90" data-testid="button-back-exercises">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const instructions = exercise.instructionsTr || exercise.instructionsEn;
  const shareUrl = `https://gokalaf.com/egzersiz-akademisi/${exercise.slug}`;
  const primaryMuscle = exercise.primaryMuscles[0];

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title={`${exercise.name} | Egzersiz Rehberi | Gokalaf`}
        description={`${exercise.name} nasıl yapılır? ${exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ')} için adım adım talimatlar.`}
        keywords={`${exercise.name}, ${exercise.primaryMuscles.join(', ')}, egzersiz`}
        canonical={`/egzersiz-akademisi/${exercise.slug}`}
      />

      {/* Compact Header */}
      <section className="pt-32 lg:pt-36 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-gray-500">
              <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <ChevronRight className="w-3 h-3" />
              <li><Link href="/egzersiz-akademisi" className="hover:text-white transition-colors">Egzersizler</Link></li>
              <ChevronRight className="w-3 h-3" />
              <li className="text-primary truncate max-w-[120px]">{exercise.name}</li>
            </ol>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <DifficultyBadge level={exercise.level} />
                {exercise.category && (
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {categoryLabels[exercise.category] || exercise.category}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white tracking-tight">
                {exercise.name}
              </h1>
            </div>
            <ShareButtons 
              url={shareUrl}
              title={exercise.name}
              description={`${exercise.name} egzersizi`}
              className="flex-shrink-0"
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-6">
            
            {/* Left: Media Panel */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08]">
                {/* Main Image/GIF */}
                <div className="aspect-[4/3] relative">
                  {exercise.images[0] && (
                    <img
                      src={showVideo && exercise.images[1] ? exercise.images[1] : exercise.images[0]}
                      alt={exercise.name}
                      className="w-full h-full object-contain bg-black/60"
                      loading="eager"
                    />
                  )}
                  
                  {/* Zoom Button */}
                  <button
                    onClick={() => setZoomOpen(true)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>

                  {/* Position Labels */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs text-white/80">
                      Başlangıç
                    </span>
                    {exercise.images[1] && (
                      <span className="px-2.5 py-1 rounded-md bg-primary/80 backdrop-blur-sm text-xs text-black font-medium">
                        Bitiş
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {exercise.images.length > 1 && (
                  <div className="flex gap-2 p-3 bg-black/40 border-t border-white/[0.05]">
                    {exercise.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setShowVideo(idx === 1);
                          setCurrentImageIndex(idx);
                        }}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx ? 'border-primary' : 'border-transparent hover:border-white/30'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions Section */}
              <div className="mt-6">
                <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-white mb-4">
                  <Play className="w-4 h-4 text-primary" />
                  Nasıl Yapılır?
                </h2>
                <div className="space-y-3">
                  {instructions.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors"
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed pt-0.5">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Stats */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Egzersiz Bilgileri</h3>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard 
                    icon={Target} 
                    label="Hedef Kas" 
                    value={muscleLabels[primaryMuscle] || primaryMuscle}
                    accent
                  />
                  <StatCard 
                    icon={Dumbbell} 
                    label="Ekipman" 
                    value={equipmentLabels[exercise.equipment || ''] || exercise.equipment || 'Yok'}
                  />
                  {exercise.force && (
                    <StatCard 
                      icon={Zap} 
                      label="Hareket" 
                      value={forceLabels[exercise.force] || exercise.force}
                    />
                  )}
                  {exercise.mechanic && (
                    <StatCard 
                      icon={Activity} 
                      label="Tip" 
                      value={mechanicLabels[exercise.mechanic] || exercise.mechanic}
                    />
                  )}
                </div>
              </div>

              {/* Primary Muscles */}
              {exercise.primaryMuscles.length > 0 && (
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4">
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Hedef Kaslar</h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.primaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium"
                      >
                        {muscleLabels[muscle] || muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Muscles */}
              {exercise.secondaryMuscles.length > 0 && (
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4">
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Yardımcı Kaslar</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.secondaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs"
                      >
                        {muscleLabels[muscle] || muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 text-center">
                <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="text-sm font-heading font-bold text-white mb-1">Profesyonel Koçluk</h3>
                <p className="text-xs text-gray-400 mb-3">Kişisel antrenman programı için</p>
                <Link href="/paketler">
                  <Button size="sm" className="bg-primary text-black hover:bg-primary/90 w-full" data-testid="button-cta-packages">
                    Paketleri İncele
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-white/[0.05]">
            <Link href="/egzersiz-akademisi">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tüm Egzersizler
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Zoom Modal */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-3xl w-[95vw] p-0 bg-black/95 border-white/10">
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-3 right-3 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="p-4">
            <img
              src={exercise.images[currentImageIndex]}
              alt={exercise.name}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            
            {exercise.images.length > 1 && (
              <div className="flex justify-center gap-3 mt-4">
                {exercise.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-primary' : 'border-white/20'
                    }`}
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
