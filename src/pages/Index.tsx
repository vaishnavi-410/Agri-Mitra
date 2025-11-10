import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { SpecializedBots } from '@/components/SpecializedBots';
import { News } from '@/components/News';
import { Community } from '@/components/Community';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div id="home" className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <SpecializedBots />
      <News />
      <Community />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
