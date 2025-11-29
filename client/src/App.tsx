import { Suspense, lazy } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";

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
  const isAdminRoute = location.startsWith("/gokadmin");
  const isDashboard = location === "/dashboard";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-black">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/tools" component={Tools} />
            <Route path="/tools/bmi" component={BMICalculator} />
            <Route path="/tools/calories" component={CalorieCalculator} />
            <Route path="/tools/tdee" component={TDEECalculator} />
            <Route path="/tools/macros" component={MacroCalculator} />
            <Route path="/tools/ideal-weight" component={IdealWeightCalculator} />
            <Route path="/tools/body-fat" component={BodyFatCalculator} />
            <Route path="/tools/one-rep-max" component={OneRepMaxCalculator} />
            <Route path="/tools/water-intake" component={WaterIntakeCalculator} />
            <Route path="/tools/heart-rate-zones" component={HeartRateZonesCalculator} />
            <Route path="/tools/protein-intake" component={ProteinIntakeCalculator} />
            <Route path="/tools/rest-timer" component={RestTimerCalculator} />
            <Route path="/packages" component={Packages} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/dashboard" component={UserDashboard} />
            <Route path="/gokadmin/login" component={AdminLogin} />
            <Route path="/gokadmin" component={AdminDashboard} />
            <Route path="/gizlilik" component={PrivacyPolicy} />
            <Route path="/kvkk" component={KVKK} />
            <Route path="/iptal-iade" component={CancellationPolicy} />
            <Route path="/mesafeli-satis" component={DistanceSalesContract} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      {!isAdminRoute && !isDashboard && <Footer />}
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
