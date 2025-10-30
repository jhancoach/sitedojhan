import { Youtube, Instagram, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-fire bg-clip-text text-transparent">
              Jhan Medeiros
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/sobre" className="hover:text-primary transition-colors">{t('footer.about_link')}</a></li>
              <li><a href="/free-agent" className="hover:text-primary transition-colors">{t('footer.freeAgent')}</a></li>
              <li><a href="/mapas" className="hover:text-primary transition-colors">{t('footer.maps')}</a></li>
              <li><a href="/picks-bans" className="hover:text-primary transition-colors">{t('footer.picksBans')}</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.socialMedia')}</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/@jhanmedeiros" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/jhanmedeiros/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://discord.gg/YU8uTRyz2Y" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageSquare className="h-6 w-6" />
              </a>
              <a 
                href="https://x.com/Jansey_Medeiros" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Jhan Medeiros. {t('footer.rights')}</p>
          <p className="mt-2">
            {t('footer.verse')} - {t('home.verseRef')}
          </p>
        </div>
      </div>
    </footer>
  );
}
