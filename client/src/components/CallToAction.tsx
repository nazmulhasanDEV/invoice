import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function CallToAction() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <section className="py-24 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-1 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">
              Ready to Get Started?
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transform Your Invoice Management Today
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses already saving time and money with AI-powered invoice analysis. Start your free trial now—no credit card required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg font-semibold"
              onClick={() => setAuthModalOpen(true)}
              data-testid="button-cta-get-started"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg backdrop-blur-md bg-white/10 border-2 border-white/30 text-white"
              data-testid="button-cta-schedule-demo"
            >
              Schedule a Demo
            </Button>
          </div>

          <p className="mt-8 text-sm text-white/70">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="register"
      />
    </>
  );
}
