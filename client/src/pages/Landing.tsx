import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
