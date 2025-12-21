import { Suspense, lazy, useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Scale, Flame, Droplets, Utensils, Trophy, Calendar, TrendingUp } from "lucide-react";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Tools = lazy(() => import("@/pages/Tools"));
const Packages = lazy(() => import("@/pages/Packages"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const UserDashboard = lazy(() => import("@/pages/UserDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminCoupons = lazy(() => import("@/pages/AdminCoupons"));
const AdminSystemLogs = lazy(() => import("@/pages/AdminSystemLogs"));
const AdminBackup = lazy(() => import("@/pages/AdminBackup"));
const BMICalculator = lazy(() => import("@/pages/calculators/BMICalculator"));
const CalorieCalculator = lazy(() => import("@/pages/calculators/CalorieCalculator"));
const TDEECalculator = lazy(() => import("@/pages/calculators/TDEECalculator"));
const MacroCalculator = lazy(() => import("@/pages/calculators/MacroCalculator"));
const IdealWeightCalculator = lazy(() => import("@/pages/calculators/IdealWeightCalculator"));
const BodyFatCalculator = lazy(() => import("@/pages/calculators/BodyFatCalculator"));
const OneRepMaxCalculator = lazy(() => import("@/pages/calculators/OneRepMaxCalculator"));
const WaterIntakeCalculator = lazy(() => import("@/pages/calculators/WaterIntakeCalculator"));
const HeartRateZonesCalculator = lazy(() => import("@/pages/calculators/HeartRateZonesCalculator"));
const ProteinIntakeCalculator = lazy(() => import("@/pages/calculators/ProteinIntakeCalculator"));
const RestTimerCalculator = lazy(() => import("@/pages/calculators/RestTimerCalculator"));
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const KVKK = lazy(() => import("@/pages/legal/KVKK"));
const CancellationPolicy = lazy(() => import("@/pages/legal/CancellationPolicy"));
const DistanceSalesContract = lazy(() => import("@/pages/legal/DistanceSalesContract"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Maintenance = lazy(() => import("@/pages/Maintenance"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("@/pages/PaymentFailed"));
const Articles = lazy(() => import("@/pages/Articles"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const Exercises = lazy(() => import("@/pages/Exercises"));
const ExerciseDetail = lazy(() => import("@/pages/ExerciseDetail"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <span className="text-gray-400 text-sm">Yükleniyor...</span>
      </div>
    </div>
  );
}

function FeatureTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem("gokalaf_feature_tooltip_seen");
    if (!hasSeenTooltip) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        setIsOpen(true);
        localStorage.setItem("gokalaf_feature_tooltip_seen", "true");
      }, 2000);

      return () => clearTimeout(showTimer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const hideTimer = setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setIsVisible(false), 500);
      }, 20000);

      return () => clearTimeout(hideTimer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const features = [
    { icon: Scale, text: "Kilo & Vücut Yağ Takibi", color: "text-green-400" },
    { icon: TrendingUp, text: "İlerleme Grafikleri", color: "text-blue-400" },
    { icon: Utensils, text: "Günlük Beslenme Kaydı", color: "text-orange-400" },
    { icon: Droplets, text: "Su Tüketimi Takibi", color: "text-cyan-400" },
    { icon: Flame, text: "Antrenman Serisi", color: "text-red-400" },
    { icon: Trophy, text: "Başarım Rozetleri", color: "text-yellow-400" },
    { icon: Calendar, text: "Aktivite Takvimi", color: "text-purple-400" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-72 md:w-80 bg-[#0A0A0A] border border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-white">Bunları Biliyor Musun?</h3>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => setIsVisible(false), 500);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-400 text-sm mb-3">
                Kayıt olarak bu özellikleri kullanabilirsin:
              </p>
              <div className="space-y-2">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    <span className="text-sm text-gray-300">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
              <a 
                href="/kayit" 
                className="mt-4 block w-full py-2.5 bg-primary text-black font-bold text-center rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                Hemen Kayıt Ol
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen 
            ? "bg-primary text-black" 
            : "bg-[#0A0A0A] border border-primary/50 text-primary hover:bg-primary/10"
        }`}
      >
        <HelpCircle className="w-7 h-7" />
      </motion.button>
    </div>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceChecked, setMaintenanceChecked] = useState(false);
  
  const isAdminRoute = location.startsWith("/gokadmin");
  const isDashboard = location === "/panel";
  const isMaintenancePage = location === "/bakim";

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch("/api/maintenance");
        if (res.ok) {
          const data = await res.json();
          setMaintenanceMode(data.maintenanceMode || false);
        }
      } catch (error) {
        console.error("Maintenance check failed:", error);
      } finally {
        setMaintenanceChecked(true);
      }
    };
    checkMaintenance();
  }, []);

  if (!maintenanceChecked || authLoading) {
    return <PageLoader />;
  }

  if (maintenanceMode && !isAdmin && !isAdminRoute && !isMaintenancePage) {
    return <Redirect to="/bakim" />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-black">
      <ScrollToTop />
      {!isAdminRoute && !isMaintenancePage && <Navbar />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/hakkimizda" component={About} />
            <Route path="/araclar" component={Tools} />
            <Route path="/araclar/vki" component={BMICalculator} />
            <Route path="/araclar/kalori" component={CalorieCalculator} />
            <Route path="/araclar/tdee" component={TDEECalculator} />
            <Route path="/araclar/makro" component={MacroCalculator} />
            <Route path="/araclar/ideal-kilo" component={IdealWeightCalculator} />
            <Route path="/araclar/vucut-yagi" component={BodyFatCalculator} />
            <Route path="/araclar/bir-tekrar-max" component={OneRepMaxCalculator} />
            <Route path="/araclar/su-tuketimi" component={WaterIntakeCalculator} />
            <Route path="/araclar/kalp-atisi" component={HeartRateZonesCalculator} />
            <Route path="/araclar/protein" component={ProteinIntakeCalculator} />
            <Route path="/araclar/dinlenme" component={RestTimerCalculator} />
            <Route path="/paketler" component={Packages} />
            <Route path="/yazilar" component={Articles} />
            <Route path="/yazilar/:slug" component={ArticleDetail} />
            <Route path="/egzersiz-akademisi" component={Exercises} />
            <Route path="/egzersiz-akademisi/:slug" component={ExerciseDetail} />
            <Route path="/giris" component={Login} />
            <Route path="/kayit" component={Register} />
            <Route path="/hosgeldin" component={Onboarding} />
            <Route path="/odeme" component={Checkout} />
            <Route path="/panel" component={UserDashboard} />
            <Route path="/gokadmin/login" component={AdminLogin} />
            <Route path="/gokadmin" component={AdminDashboard} />
            <Route path="/gokadmin/kuponlar" component={AdminCoupons} />
            <Route path="/gokadmin/loglar" component={AdminSystemLogs} />
            <Route path="/gokadmin/yedekleme" component={AdminBackup} />
            <Route path="/gizlilik" component={PrivacyPolicy} />
            <Route path="/kvkk" component={KVKK} />
            <Route path="/iptal-iade" component={CancellationPolicy} />
            <Route path="/mesafeli-satis" component={DistanceSalesContract} />
            <Route path="/bakim" component={Maintenance} />
            <Route path="/odeme-basarili" component={PaymentSuccess} />
            <Route path="/odeme-basarisiz" component={PaymentFailed} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      {!isAdminRoute && !isDashboard && !isMaintenancePage && <Footer />}
      <Toaster />
      
      {/* WhatsApp Floating Button */}
      {!isAdminRoute && !isMaintenancePage && (
        <a
          href="https://wa.me/905312822402"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-24 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
          aria-label="WhatsApp ile iletişime geç"
          data-testid="button-whatsapp"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}

      {/* Feature Tooltip - Shows on first visit */}
      {!isAdminRoute && !isMaintenancePage && <FeatureTooltip />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
