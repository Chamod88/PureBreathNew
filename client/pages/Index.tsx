import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LearnMore from "@/components/LearnMore";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <LearnMore />
    </div>
  );
}
