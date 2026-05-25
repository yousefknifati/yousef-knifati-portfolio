import HeroSection from "@/components/layout/HeroSection";
import BuildingJourneySection from "@/feature/home/components/BuildingJourneySection";
import SelectedWorksSection from "@/feature/home/components/SelectedWorksSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SelectedWorksSection />
      <BuildingJourneySection />
    </>
  );
}
