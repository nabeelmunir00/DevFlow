import Image from "next/image";
import { assets } from "@/assets/assets";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <Image src={assets.logo} alt="logo" height={300} width={300} />
      <p className="text-sm text-muted-foreground">DevFlow</p>
    </main>
  );
}
