import { Suspense, lazy, useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useTabNotification } from "@/hooks/useTabNotification";
import AIChatAssistant from "@/components/AIChatAssistant";
import FeaturePopup from "@/components/FeaturePopup";

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
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminEmailMarketing = lazy(() => import("@/pages/AdminEmailMarketing"));
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
const BoyKiloEndeksiCalculator = lazy(() => import("@/pages/calculators/BoyKiloEndeksiCalculator"));
const WaistHipRatioCalculator = lazy(() => import("@/pages/calculators/WaistHipRatioCalculator"));
const BodyTypeCalculator = lazy(() => import("@/pages/calculators/BodyTypeCalculator"));
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

function AppContent() {
  const [location] = useLocation();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceChecked, setMaintenanceChecked] = useState(false);
  
  useTabNotification();
  
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
      <main id="main-content" role="main">
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
            <Route path="/araclar/boy-kilo-endeksi" component={BoyKiloEndeksiCalculator} />
            <Route path="/araclar/bel-kalca-orani" component={WaistHipRatioCalculator} />
            <Route path="/araclar/vucut-tipi" component={BodyTypeCalculator} />
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
            <Route path="/gokadmin/analytics" component={AdminAnalytics} />
            <Route path="/gokadmin/email-pazarlama" component={AdminEmailMarketing} />
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
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
          aria-label="WhatsApp ile iletişime geç"
          data-testid="button-whatsapp"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}

      {/* Feature Popup - 10sn sonra ortada açılır */}
      {!isAdminRoute && !isMaintenancePage && <FeaturePopup />}

      {/* AI Chat Assistant */}
      {!isAdminRoute && !isMaintenancePage && <AIChatAssistant />}
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
