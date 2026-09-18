import { Benefits } from "@/components/marketing/benefits";
import { Hero } from "@/components/marketing/hero";
import { Navbar } from "@/components/marketing/navbar";

export default function Home() {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <main>
        <Hero />
        <Benefits />
      </main>
    </div>
  );
}
