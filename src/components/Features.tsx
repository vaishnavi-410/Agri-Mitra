import { Camera, Globe, Sprout, Bot, Target, HeadphonesIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const features = [
  { 
    icon: Camera, 
    titleKey: 'cameraScan',
    descKey: 'cameraScanDesc',
    gradient: 'from-primary to-secondary'
  },
  { 
    icon: Globe, 
    titleKey: 'multiLang',
    descKey: 'multiLangDesc',
    gradient: 'from-secondary to-accent'
  },
  { 
    icon: Sprout, 
    titleKey: 'practices',
    descKey: 'practicesDesc',
    gradient: 'from-accent to-primary'
  },
  { 
    icon: Bot, 
    titleKey: 'bots',
    descKey: 'botsDesc',
    gradient: 'from-primary to-accent'
  },
  { 
    icon: Target, 
    titleKey: 'accuracy',
    descKey: 'accuracyDesc',
    gradient: 'from-secondary to-primary'
  },
  { 
    icon: HeadphonesIcon, 
    titleKey: 'support',
    descKey: 'supportDesc',
    gradient: 'from-accent to-secondary'
  },
];

export const Features = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-muted/30 to-background leaf-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-primary"
        >
          {t.features.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-2xl shadow-lg hover-glow cursor-pointer leaf-texture`}
              >
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t.features[feature.titleKey as keyof typeof t.features]}
                </h3>
                <p className="text-white/90">
                  {t.features[feature.descKey as keyof typeof t.features]}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
