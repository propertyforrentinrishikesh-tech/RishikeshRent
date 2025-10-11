import AboutUsSection from "@/components/AboutUsSection";
import HeroSection from "@/components/HeroSection";
import RandomTourPackageSection from "@/components/RandomTourPackageSection";
import Boxes from "@/components/Boxes";
import InstaBlog from "@/components/InstaBlog";
import Banner from "@/components/Banner";
import ChatBot from "@/components/ChatBot";
import PopUpBanner from "@/components/PopUpBanner";
import Social from "@/components/Social";
import SearchSection from "@/components/SearchSection";
import PropertyShow from "@/components/PropertyShow";

export default async function Home() {
  return (
    <>
      <PopUpBanner />
      <HeroSection />
      <SearchSection />
      <Boxes />
      <AboutUsSection />
      <Banner />
      <PropertyShow/>
      <RandomTourPackageSection />
      <InstaBlog />
      <Social/>
      <ChatBot/>
    </>
  );
}
