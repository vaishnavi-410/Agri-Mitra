import { Instagram, MessageCircle, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.features.title, href: '#features' },
    { label: t.library.title, href: '/library' },
    { label: t.news.title, href: '#news' },
    { label: t.about.title, href: '#about' }
  ];

  const supportLinks = [
    { label: t.footer.helpCenter, href: '#' },
    { label: t.footer.contactUs, href: '#contact' }
  ];

  const socialLinks = [
    { icon: Instagram, href: '#' },
    { icon: MessageCircle, href: '#' },
    { icon: Youtube, href: '#' },
    { icon: Twitter, href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-b from-primary to-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.footer.support}</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.contact.title}</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                    aria-label={`Social link ${index + 1}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/80">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
