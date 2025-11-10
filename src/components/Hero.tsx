import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import heroBackground from '@/assets/hero-farm.jpg';

export const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section 
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(46, 125, 50, 0.7), rgba(56, 142, 60, 0.7)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12">
            {t.hero.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => navigate('/chatbot', { state: { type: 'general', chatbotName: 'General Chatbot' } })}
            className="bg-[hsl(45,93%,56%)] text-white hover:bg-[hsl(45,93%,50%)] hover-glow text-lg px-12 py-6 rounded-xl font-semibold"
          >
            Ask
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
