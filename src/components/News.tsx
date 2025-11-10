import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
}

export const News = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Mock news data - replace with actual gnews.io API call
    const mockArticles: NewsArticle[] = [
      {
        title: "New Agricultural Policy Benefits Small Farmers",
        description: "Government announces support package for marginal farmers",
        url: "#",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        publishedAt: "2025-01-15"
      },
      {
        title: "Organic Farming Shows 30% Growth",
        description: "Demand for organic produce continues to rise nationwide",
        url: "#",
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
        publishedAt: "2025-01-14"
      },
      {
        title: "Smart Irrigation Technology Saves Water",
        description: "New IoT-based systems reduce water usage by 40%",
        url: "#",
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800",
        publishedAt: "2025-01-13"
      },
      {
        title: "Crop Insurance Scheme Expanded",
        description: "More farmers eligible for comprehensive coverage",
        url: "#",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        publishedAt: "2025-01-12"
      }
    ];
    setArticles(mockArticles);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, articles.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, articles.length - 2)) % Math.max(1, articles.length - 2));
  };

  return (
    <section id="news" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-primary"
        >
          {t.news.title}
        </motion.h2>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-6"
              animate={{ x: `-${currentIndex * 33.33}%` }}
              transition={{ duration: 0.5 }}
            >
              {articles.map((article, index) => (
                <div
                  key={index}
                  className="min-w-[100%] md:min-w-[calc(33.33%-1rem)] bg-white rounded-xl overflow-hidden shadow-lg hover-glow cursor-pointer"
                >
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-primary line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};
