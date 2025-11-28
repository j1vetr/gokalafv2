import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Switch, Route } from "wouter";
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
import BMICalculator from "@/pages/calculators/BMICalculator";
import CalorieCalculator from "@/pages/calculators/CalorieCalculator";
import TDEECalculator from "@/pages/calculators/TDEECalculator";
import MacroCalculator from "@/pages/calculators/MacroCalculator";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-black">
          <ScrollToTop />
          <Navbar />
          <main>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/tools" component={Tools} />
              <Route path="/tools/bmi" component={BMICalculator} />
              <Route path="/tools/calories" component={CalorieCalculator} />
              <Route path="/tools/tdee" component={TDEECalculator} />
              <Route path="/tools/macros" component={MacroCalculator} />
              <Route path="/packages" component={Packages} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/dashboard" component={UserDashboard} />
              <Route path="/admin" component={AdminDashboard} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
