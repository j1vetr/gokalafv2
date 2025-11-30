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
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      {!isAdminRoute && !isDashboard && !isMaintenancePage && <Footer />}
      <Toaster />
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
