import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const crops = [
  { name: 'Tomato', nameHi: 'टमाटर', nameMr: 'टोमॅटो', emoji: '🍅' },
  { name: 'Mango', nameHi: 'आम', nameMr: 'आंबा', emoji: '🥭' },
  { name: 'Rice', nameHi: 'चावल', nameMr: 'तांदूळ', emoji: '🌾' },
  { name: 'Wheat', nameHi: 'गेहूं', nameMr: 'गहू', emoji: '🌾' },
  { name: 'Cotton', nameHi: 'कपास', nameMr: 'कापूस', emoji: '🌱' },
  { name: 'Sugarcane', nameHi: 'गन्ना', nameMr: 'ऊस', emoji: '🎋' },
  { name: 'Potato', nameHi: 'आलू', nameMr: 'बटाटा', emoji: '🥔' },
  { name: 'Onion', nameHi: 'प्याज', nameMr: 'कांदा', emoji: '🧅' },
];

export const SpecializedBots = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const getCropName = (crop: typeof crops[0]) => {
    if (language === 'hi') return crop.nameHi;
    if (language === 'mr') return crop.nameMr;
    return crop.name;
  };

  const handleCropClick = (cropName: string) => {
    navigate('/chatbot', { 
      state: { 
        type: 'specialized', 
        chatbotName: `${cropName} Specialist` 
      } 
    });
  };

  return (
    <section id="chatbots" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-primary"
        >
          {t.chatbots.title}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {crops.map((crop, index) => (
            <motion.div
              key={crop.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-center hover-glow cursor-pointer"
              onClick={() => handleCropClick(crop.name)}
            >
              <div className="text-5xl mb-3">{crop.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-4">
                {getCropName(crop)}
              </h3>
              <Button 
                size="sm"
                className="w-full bg-[hsl(45,93%,85%)] text-white hover:bg-[hsl(45,93%,75%)]"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
