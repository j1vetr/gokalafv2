import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Tools from "@/pages/Tools";
import Packages from "@/pages/Packages";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Checkout from "@/pages/Checkout";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import BMICalculator from "@/pages/calculators/BMICalculator";
import CalorieCalculator from "@/pages/calculators/CalorieCalculator";
import TDEECalculator from "@/pages/calculators/TDEECalculator";
import MacroCalculator from "@/pages/calculators/MacroCalculator";
import IdealWeightCalculator from "@/pages/calculators/IdealWeightCalculator";
import BodyFatCalculator from "@/pages/calculators/BodyFatCalculator";
import OneRepMaxCalculator from "@/pages/calculators/OneRepMaxCalculator";
import WaterIntakeCalculator from "@/pages/calculators/WaterIntakeCalculator";
import HeartRateZonesCalculator from "@/pages/calculators/HeartRateZonesCalculator";
import ProteinIntakeCalculator from "@/pages/calculators/ProteinIntakeCalculator";
import RestTimerCalculator from "@/pages/calculators/RestTimerCalculator";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import KVKK from "@/pages/legal/KVKK";
import CancellationPolicy from "@/pages/legal/CancellationPolicy";
import DistanceSalesContract from "@/pages/legal/DistanceSalesContract";
import NotFound from "@/pages/not-found";

function AppContent() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/gokadmin");

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-black">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main>
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
      </main>
      {!isAdminRoute && <Footer />}
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
