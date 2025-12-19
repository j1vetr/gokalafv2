import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Dumbbell, Target, Gauge, Zap, ChevronRight, X, ZoomIn } from "lucide-react";
import SEO from "@/components/SEO";
import type { Exercise } from "@shared/schema";

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

const forceLabels: Record<string, string> = {
  push: "İtme",
  pull: "Çekme",
  static: "Statik",
};

const mechanicLabels: Record<string, string> = {
  compound: "Compound (Çoklu Kas)",
  isolation: "İzolasyon (Tek Kas)",
};

function AnimatedBorderImage({ 
  src, 
  alt, 
  label,
  onClick 
}: { 
  src: string; 
  alt: string; 
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square rounded-2xl p-[2px] overflow-hidden animated-border-container">
        <div className="absolute inset-0 rounded-2xl bg-white/10" />
        <div className="animated-border-line" />
        
        <div className="relative w-full h-full bg-black/50 rounded-[14px] overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                {label}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/90 p-1.5 sm:p-2 rounded-full">
                <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ImageZoomModal({ 
  isOpen, 
  onClose, 
  images, 
  exerciseName,
  currentIndex,
  setCurrentIndex
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  images: string[];
  exerciseName: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}) {
  const labels = ["Başlangıç Pozisyonu", "Bitiş Pozisyonu"];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black/95 border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <img
                src={images[currentIndex]}
                alt={`${exerciseName} - ${labels[currentIndex]}`}
                className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index 
                    ? 'border-primary scale-105' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <img
                  src={img}
                  alt={`${exerciseName} - ${labels[index]}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          <p className="text-center text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base">
            {exerciseName} - {labels[currentIndex]}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setZoomOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28">
        <div className="container mx-auto px-4 py-20 text-center">
          <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-white mb-4">
            Egzersiz Bulunamadı
          </h1>
          <p className="text-gray-400 mb-6">
            Aradığınız egzersiz mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link href="/egzersiz-akademisi">
            <Button className="bg-primary text-black hover:bg-primary/90" data-testid="button-back-exercises">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Egzersiz Akademisi'ne Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const instructions = exercise.instructionsTr || exercise.instructionsEn;
  const imageAltStart = `${exercise.name} egzersizi başlangıç pozisyonu - ${exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ')} çalıştırma`;
  const imageAltEnd = `${exercise.name} egzersizi bitiş pozisyonu - doğru form ve teknik`;

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title={`${exercise.name} Nasıl Yapılır? | Egzersiz Rehberi | Gokalaf`}
        description={`${exercise.name} egzersizi nasıl yapılır? ${exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ')} kaslarını çalıştıran bu hareketin adım adım talimatları, doğru teknik ve ipuçları.`}
        keywords={`${exercise.name}, ${exercise.primaryMuscles.join(', ')}, ${exercise.equipment || ''}, egzersiz, fitness, antrenman, kas geliştirme`}
        canonical={`/egzersiz-akademisi/${exercise.slug}`}
      />

      <section className="relative pt-32 sm:pt-36 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-30" />
        
        <div className="container mx-auto px-4 relative">
          <nav className="mb-6 sm:mb-8">
            <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              </li>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <li>
                <Link href="/egzersiz-akademisi" className="hover:text-white transition-colors">Egzersiz Akademisi</Link>
              </li>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <li className="text-primary truncate max-w-[150px] sm:max-w-[250px]">{exercise.name}</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-6">
              <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                exercise.level === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {levelLabels[exercise.level] || exercise.level}
              </span>
              {exercise.category && (
                <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                  {categoryLabels[exercise.category] || exercise.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase mb-3 sm:mb-4 text-white tracking-tighter">
              {exercise.name.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                {exercise.name.split(' ').slice(-1)}
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              {exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ')} kaslarını hedefleyen 
              {exercise.equipment ? ` ${equipmentLabels[exercise.equipment] || exercise.equipment} ile yapılan` : ''} etkili bir egzersiz.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Hedef Kaslar</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.primaryMuscles.map((muscle) => (
                      <span key={muscle} className="text-white text-xs sm:text-sm font-medium">
                        {muscleLabels[muscle] || muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {exercise.equipment && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Dumbbell className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Ekipman</span>
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {equipmentLabels[exercise.equipment] || exercise.equipment}
                    </span>
                  </div>
                )}

                {exercise.force && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Hareket Tipi</span>
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {forceLabels[exercise.force] || exercise.force}
                    </span>
                  </div>
                )}

                {exercise.mechanic && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Gauge className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Mekanik</span>
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {mechanicLabels[exercise.mechanic] || exercise.mechanic}
                    </span>
                  </div>
                )}
              </div>

              {exercise.secondaryMuscles.length > 0 && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Yardımcı Kaslar</div>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-2 py-1 bg-white/5 rounded text-xs sm:text-sm text-gray-300"
                      >
                        {muscleLabels[muscle] || muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {exercise.images[0] && (
                  <AnimatedBorderImage
                    src={exercise.images[0]}
                    alt={imageAltStart}
                    label="Başlangıç"
                    onClick={() => handleImageClick(0)}
                  />
                )}
                {exercise.images[1] && (
                  <AnimatedBorderImage
                    src={exercise.images[1]}
                    alt={imageAltEnd}
                    label="Bitiş"
                    onClick={() => handleImageClick(1)}
                  />
                )}
              </div>
              <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-400">
                <span>Başlangıç</span>
                <div className="flex items-center gap-1">
                  <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span>Bitiş</span>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                Fotoğraflara tıklayarak yakınlaştırabilirsiniz
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto lg:mx-0">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-6 sm:mb-8 flex items-center gap-3"
            >
              <span className="w-1 h-8 sm:h-10 bg-primary rounded-full" />
              Nasıl Yapılır?
            </motion.h2>
            <ol className="space-y-4 sm:space-y-6">
              {instructions.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex gap-3 sm:gap-4 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm sm:text-base group-hover:bg-primary group-hover:text-black transition-colors">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 pt-1 sm:pt-2 leading-relaxed text-sm sm:text-base">{step}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 sm:p-6"
          >
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2">
                Profesyonel Koçluk mu Arıyorsunuz?
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Kişiselleştirilmiş antrenman programı için paketlerimizi inceleyin.
              </p>
            </div>
            <Link href="/paketler">
              <Button className="bg-primary text-black hover:bg-primary/90 whitespace-nowrap" data-testid="button-cta-packages">
                Paketleri İncele
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8 sm:pb-12">
        <Link href="/egzersiz-akademisi">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tüm Egzersizlere Dön
          </Button>
        </Link>
      </div>

      <ImageZoomModal
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        images={exercise.images}
        exerciseName={exercise.name}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      <style>{`
        .animated-border-container {
          position: relative;
        }
        .animated-border-line {
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          overflow: hidden;
        }
        .animated-border-line::before {
          content: '';
          position: absolute;
          width: 150%;
          height: 4px;
          background: linear-gradient(90deg, transparent, #ccff00, #ccff00, transparent);
          top: 0;
          left: -25%;
          animation: border-top 2.5s linear infinite;
          box-shadow: 0 0 10px #ccff00, 0 0 20px #ccff00;
        }
        .animated-border-line::after {
          content: '';
          position: absolute;
          width: 150%;
          height: 4px;
          background: linear-gradient(90deg, transparent, #ccff00, #ccff00, transparent);
          bottom: 0;
          right: -25%;
          animation: border-bottom 2.5s linear infinite;
          box-shadow: 0 0 10px #ccff00, 0 0 20px #ccff00;
        }
        @keyframes border-top {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes border-bottom {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
