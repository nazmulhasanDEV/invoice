import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, TrendingUp, LogIn } from "lucide-react";
import heroImage from "@assets/generated_images/AI_invoice_dashboard_hero_background_b30c793b.png";
import AuthModal from "./AuthModal";

export default function Hero() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("register");

  const handleGetStarted = () => {
    setAuthTab("register");
    setAuthModalOpen(true);
  };

  const handleLogin = () => {
    setAuthTab("login");
    setAuthModalOpen(true);
  };

  const handleViewDemo = () => {
    console.log("View Demo clicked");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold">InvoiceAI</span>
        </div>
        <Button 
          variant="outline" 
          className="backdrop-blur-md bg-background/10 border"
          onClick={handleLogin}
          data-testid="button-login-hero"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-chart-3" />
          <span className="text-chart-3 text-sm font-medium tracking-wide uppercase">AI-Powered Analysis</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-1 bg-clip-text text-transparent">
          Transform Your Invoice
          <br />
          Management with AI
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Perfect for individuals and businesses. Automate invoice data extraction, categorize items intelligently, track price trends, and gain actionable insights—all powered by advanced AI.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-chart-3 hover:bg-chart-3 text-background font-semibold px-8 h-12 text-base"
            onClick={handleGetStarted}
            data-testid="button-get-started"
          >
            <Upload className="w-5 h-5 mr-2" />
            Get Started Free
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="backdrop-blur-md bg-background/10 border-2 h-12 px-8 text-base"
            onClick={handleViewDemo}
            data-testid="button-view-demo"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Demo
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Extraction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">10x</div>
            <div className="text-sm text-muted-foreground">Faster Processing</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Automated Tracking</div>
          </div>
        </div>
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultTab={authTab}
      />
    </section>
  );
}
