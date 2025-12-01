import { Youtube, Instagram, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-border/40 glass-effect mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="animate-slide-up">
            <h3 className="text-xl font-display font-bold mb-4 text-premium">
              Jhan Medeiros
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-display font-bold mb-4 text-foreground">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/sobre" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('footer.about_link')}
                </a>
              </li>
              <li>
                <a href="/free-agent" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('footer.freeAgent')}
                </a>
              </li>
              <li>
                <a href="/mapas" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('footer.maps')}
                </a>
              </li>
              <li>
                <a href="/picks-bans" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  {t('footer.picksBans')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-display font-bold mb-4 text-foreground">{t('footer.socialMedia')}</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/@jhanmedeiros" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/jhanmedeiros/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://discord.gg/YU8uTRyz2Y" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <MessageSquare className="h-6 w-6" />
              </a>
              <a 
                href="https://x.com/Jansey_Medeiros" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p className="font-medium">© {new Date().getFullYear()} Jhan Medeiros. {t('footer.rights')}</p>
          <p className="mt-3 text-foreground/60 italic">
            {t('footer.verse')} - <span className="text-primary font-medium">{t('home.verseRef')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
