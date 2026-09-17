import { BenefitsSection } from "@/components/landing/benefits-section";
import { DeveloperFeatures } from "@/components/landing/developer-features";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />

      <main>
        <HeroSection />
        <BenefitsSection />
        <DeveloperFeatures />
      </main>

      <LandingFooter />
    </div>
  );
}
