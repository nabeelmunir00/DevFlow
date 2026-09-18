import { AiSpotlight } from "@/components/marketing/ai-spotlight";
import { Benefits } from "@/components/marketing/benefits";
import { CoreFeatures } from "@/components/marketing/core-features";
import { GithubWorkflow } from "@/components/marketing/github-workflow";
import { Hero } from "@/components/marketing/hero";
import { Navbar } from "@/components/marketing/navbar";
import { TeamCollaboration } from "@/components/marketing/team-collaboration";

export default function Home() {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Hero />
        <Benefits />
        <CoreFeatures />
        <AiSpotlight />
        <GithubWorkflow />
        <TeamCollaboration />
      </main>
    </div>
  );
}
