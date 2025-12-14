import { Suspense, lazy, useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
          aria-label="WhatsApp ile iletişime geç"
          data-testid="button-whatsapp"
        >
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.056 31.2l6.012-1.97A15.91 15.91 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.598c-.39 1.1-1.932 2.012-3.146 2.278-.832.178-1.916.32-5.57-1.198-4.674-1.94-7.684-6.696-7.918-7.006-.224-.31-1.88-2.502-1.88-4.774 0-2.27 1.19-3.386 1.61-3.848.42-.46.918-.576 1.224-.576.306 0 .612.002.88.016.282.014.66-.108.034 1.592-.224.608-1.12 2.73-1.218 2.93-.098.198-.164.432-.032.696.132.264.198.428.396.66.198.232.418.518.598.696.396.394.808.822 1.224 1.2.416.378.85.752 1.346 1.054.496.302 1.008.536 1.466.75.458.214.842.16 1.17-.098.328-.258 1.392-1.62 1.764-2.178.372-.558.744-.458 1.254-.274.51.184 3.242 1.53 3.796 1.808.554.278.924.418 1.06.648.136.232.136 1.342-.254 2.44z"/>
          </svg>
        </a>
      )}
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
