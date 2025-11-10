import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import communityImage from '@/assets/farmer-community.jpg';

export const Community = () => {
  const { t } = useLanguage();
  
  const handleJoinCommunity = () => {
    // Replace this URL with your actual WhatsApp community link
    const whatsappCommunityLink = 'https://chat.whatsapp.com/IPebzXAZtDmGjTaut4sCbf?mode=wwt';
    window.open(whatsappCommunityLink, '_blank');
  };

  return (
    <section id="community" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          {/* Hero Image */}
          <div className="w-full overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={communityImage}
              alt="Farmer Community"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Description */}
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              Join Our Farmer Community
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Connect with thousands of farmers across India. Share your experiences, 
              learn new farming techniques, get expert advice, and stay updated with 
              the latest agricultural news. Together, we grow stronger! 🌾
            </p>
          </div>

          {/* Join Button */}
          <motion.button
            onClick={handleJoinCommunity}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-12 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/90"
          >
            <span className="flex items-center gap-2">
              <span>🌱</span>
              <span>Join Now</span>
            </span>
          </motion.button>

          {/* Optional: Community Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 w-full max-w-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Daily Messages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
