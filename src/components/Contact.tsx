import { Instagram, MessageCircle, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-600' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#', color: 'hover:text-green-600' },
  { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:text-red-600' },
  { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-blue-500' }
];

export const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12 text-primary"
        >
          {t.contact.title}
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8"
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.2 }}
                className={`flex flex-col items-center gap-2 text-primary transition-colors ${social.color}`}
                aria-label={social.label}
              >
                <div className="bg-white rounded-full p-4 shadow-lg hover-glow">
                  <Icon className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">{social.label}</span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
