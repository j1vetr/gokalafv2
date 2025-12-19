import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Target, Gauge, Zap, ChevronRight } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title={`${exercise.name} - Egzersiz Rehberi | Gokalaf`}
        description={`${exercise.name} egzersizi nasıl yapılır? Adım adım talimatlar, hedef kaslar ve doğru teknik bilgisi.`}
        keywords={`${exercise.name}, ${exercise.primaryMuscles.join(', ')}, egzersiz, fitness`}
        canonical={`/egzersiz-akademisi/${exercise.slug}`}
      />

      <nav className="pt-28 pb-4">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li>
              <Link href="/egzersiz-akademisi" className="hover:text-white transition-colors">Egzersiz Akademisi</Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li className="text-primary truncate max-w-[200px]">{exercise.name}</li>
          </ol>
        </div>
      </nav>

      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  exercise.level === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {levelLabels[exercise.level] || exercise.level}
                </span>
                {exercise.category && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                    {categoryLabels[exercise.category] || exercise.category}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
                {exercise.name}
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Hedef Kaslar</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.primaryMuscles.map((muscle) => (
                      <span key={muscle} className="text-white text-sm font-medium">
                        {muscleLabels[muscle] || muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {exercise.equipment && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Dumbbell className="w-4 h-4" />
                      <span className="text-sm">Ekipman</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {equipmentLabels[exercise.equipment] || exercise.equipment}
                    </span>
                  </div>
                )}

                {exercise.force && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Hareket Tipi</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {forceLabels[exercise.force] || exercise.force}
                    </span>
                  </div>
                )}

                {exercise.mechanic && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Gauge className="w-4 h-4" />
                      <span className="text-sm">Mekanik</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {mechanicLabels[exercise.mechanic] || exercise.mechanic}
                    </span>
                  </div>
                )}
              </div>

              {exercise.secondaryMuscles.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-2">Yardımcı Kaslar</div>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-2 py-1 bg-white/5 rounded text-sm text-gray-300"
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
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {exercise.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-black/50 rounded-xl overflow-hidden border border-white/10"
                  >
                    <img
                      src={image}
                      alt={`${exercise.name} - ${index === 0 ? 'Başlangıç' : 'Bitiş'} Pozisyonu`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <span>Başlangıç Pozisyonu</span>
                <span>→</span>
                <span>Bitiş Pozisyonu</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-8">
              Nasıl Yapılır?
            </h2>
            <ol className="space-y-6">
              {instructions.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 pt-2 leading-relaxed">{step}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6">
            <div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Profesyonel Koçluk mu Arıyorsunuz?
              </h3>
              <p className="text-gray-400">
                Kişiselleştirilmiş antrenman programı için paketlerimizi inceleyin.
              </p>
            </div>
            <Link href="/paketler">
              <Button className="bg-primary text-black hover:bg-primary/90 whitespace-nowrap" data-testid="button-cta-packages">
                Paketleri İncele
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        <Link href="/egzersiz-akademisi">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tüm Egzersizlere Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
