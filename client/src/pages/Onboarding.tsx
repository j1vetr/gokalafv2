import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  User, 
  Target, 
  Package, 
  Activity,
  ChevronRight,
  Dumbbell,
  Scale,
  Calculator,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  actionLink?: string;
}

const steps: Step[] = [
  {
    id: "profile",
    title: "Profilini Tamamla",
    description: "Kişisel bilgilerini gir, sana özel programlar için hazır ol.",
    icon: <User className="w-6 h-6" />,
    action: "Profil bilgileri kayıttan alındı",
  },
  {
    id: "goals",
    title: "Hedefini Belirle",
    description: "Kilo vermek mi, kas yapmak mı? Hedefine göre programını belirleyelim.",
    icon: <Target className="w-6 h-6" />,
    action: "Hedef Seç",
  },
  {
    id: "calculate",
    title: "Değerlerini Hesapla",
    description: "BMI, TDEE ve makro değerlerini öğren, yolculuğuna bilinçli başla.",
    icon: <Calculator className="w-6 h-6" />,
    action: "Hesaplayıcılara Git",
    actionLink: "/araclar",
  },
  {
    id: "package",
    title: "Paket Seç",
    description: "Sana uygun koçluk paketini seç, dönüşümüne bugün başla.",
    icon: <Package className="w-6 h-6" />,
    action: "Paketleri Gör",
    actionLink: "/paketler",
  },
  {
    id: "whatsapp",
    title: "WhatsApp Grubuna Katıl",
    description: "Koçunla ve toplulukla iletişimde kal, motivasyonunu yüksek tut.",
    icon: <MessageCircle className="w-6 h-6" />,
    action: "WhatsApp'a Git",
    actionLink: "https://wa.me/905555555555",
  },
];

const goals = [
  { id: "lose", label: "Kilo Vermek", icon: <Scale className="w-8 h-8" />, color: "from-red-500 to-orange-500" },
  { id: "maintain", label: "Formu Korumak", icon: <Activity className="w-8 h-8" />, color: "from-green-500 to-emerald-500" },
  { id: "gain", label: "Kas Yapmak", icon: <Dumbbell className="w-8 h-8" />, color: "from-blue-500 to-purple-500" },
];

export default function Onboarding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<string[]>(["profile"]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showGoalSelection, setShowGoalSelection] = useState(false);

  const handleStepAction = (step: Step) => {
    if (step.id === "goals") {
      setShowGoalSelection(true);
    } else if (step.actionLink) {
      if (step.actionLink.startsWith("http")) {
        window.open(step.actionLink, "_blank");
      } else {
        setLocation(step.actionLink);
      }
      if (!completedSteps.includes(step.id)) {
        setCompletedSteps([...completedSteps, step.id]);
      }
    }
  };

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setShowGoalSelection(false);
    if (!completedSteps.includes("goals")) {
      setCompletedSteps([...completedSteps, "goals"]);
    }
  };

  const handleSkip = () => {
    setLocation("/panel");
  };

  const handleComplete = () => {
    setLocation("/panel");
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="min-h-screen pt-28 pb-12 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Hoş Geldin
          </Badge>
          <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-4">
            Merhaba, <span className="text-primary">{user?.fullName?.split(" ")[0] || "Şampiyon"}</span>!
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Dönüşüm yolculuğuna başlamadan önce birkaç adımı tamamlayalım. Bu adımlar seni koçluk sürecine hazırlayacak.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">İlerleme</span>
            <span className="text-sm text-primary font-bold">{completedSteps.length}/{steps.length}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {showGoalSelection ? (
            <motion.div
              key="goals"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8"
            >
              <h2 className="text-2xl font-heading font-bold uppercase text-white mb-6 text-center">
                Hedefini Seç
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {goals.map((goal) => (
                  <motion.button
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedGoal === goal.id
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:border-white/30 bg-white/5"
                    }`}
                    data-testid={`button-goal-${goal.id}`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-white`}>
                      {goal.icon}
                    </div>
                    <span className="text-white font-heading font-bold uppercase text-sm">{goal.label}</span>
                  </motion.button>
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowGoalSelection(false)}
                className="w-full mt-4 text-gray-500 hover:text-white"
                data-testid="button-cancel-goal"
              >
                Geri
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="steps"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mb-8"
            >
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isGoalStep = step.id === "goals" && selectedGoal;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`bg-black/40 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
                      isCompleted ? "border-primary/30 bg-primary/5" : "border-white/10"
                    }`}
                    data-testid={`step-${step.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted ? "bg-primary text-black" : "bg-white/10 text-gray-400"
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-heading font-bold uppercase ${isCompleted ? "text-primary" : "text-white"}`}>
                            {step.title}
                          </h3>
                          {isGoalStep && (
                            <Badge className="bg-primary/20 text-primary text-xs">
                              {goals.find(g => g.id === selectedGoal)?.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">{step.description}</p>
                      </div>
                      {step.action && !isCompleted && step.id !== "profile" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStepAction(step)}
                          className="text-primary hover:text-white hover:bg-primary/20 shrink-0"
                          data-testid={`button-${step.id}`}
                        >
                          {step.action} <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                      {(isCompleted || step.id === "profile") && (
                        <div className="text-primary shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-500 hover:text-white uppercase tracking-wider"
            data-testid="button-skip"
          >
            Atla
          </Button>
          <Button
            onClick={handleComplete}
            className="bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase px-8"
            data-testid="button-complete"
          >
            Panele Git <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
