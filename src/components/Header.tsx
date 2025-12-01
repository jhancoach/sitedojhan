import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube, Instagram, MessageSquare, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useHasRole } from '@/hooks/useHasRole';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { hasRole: isAdmin } = useHasRole('admin');
  const { t } = useLanguage();

  const mainItems = [
    { name: t('nav.home'), path: '/dashboard' },
    { name: t('nav.about'), path: '/sobre' },
  ];

  const downloadItems = [
    { name: t('nav.maps'), path: '/mapas' },
    { name: t('nav.aerialViews'), path: '/visoes-aereas' },
    { name: t('nav.safes'), path: '/safes' },
    { name: t('nav.characters'), path: '/personagens' },
    { name: t('nav.pets'), path: '/pets' },
    { name: t('nav.loadouts'), path: '/carregamentos' },
  ];

  const gameItems = [
    { name: t('nav.composition'), path: '/composicao' },
    { name: t('nav.picksBans'), path: '/picks-bans' },
    { name: t('nav.statistics'), path: '/estatisticas' },
    { name: t('nav.mapDraw'), path: '/sorteio-mapas' },
    { name: t('nav.trainingCreator'), path: '/criador-treinos' },
    { name: t('nav.feedback'), path: '/feedback' },
  ];

  const communityItems = [
    { name: t('nav.freeAgent'), path: '/free-agent' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-effect">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
                  isActive(item.path)
                    ? 'bg-gradient-premium text-primary-foreground shadow-premium'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent/10'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Downloads Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="text-sm font-medium">
                  {t('nav.downloads')} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-effect z-50 border-border/50">
                {downloadItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full cursor-pointer hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Jogo Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="text-sm font-medium">
                  {t('nav.game')} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-effect z-50 border-border/50">
                {gameItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full cursor-pointer hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Comunidade */}
            {communityItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
                  isActive(item.path)
                    ? 'bg-gradient-premium text-primary-foreground shadow-premium'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent/10'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Admin Link - Only visible to admins */}
            {user && isAdmin && (
              <Link
                to="/admin/storage"
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md border border-primary/50 ${
                  isActive('/admin/storage')
                    ? 'bg-gradient-premium text-primary-foreground shadow-premium'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent/10 hover:border-primary'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}

            {/* Social Links & Auth - Right side */}
            <div className="ml-auto flex items-center space-x-3">
              <LanguageSelector />
              <a href="https://www.youtube.com/@jhanmedeiros" target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="icon" className="hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://www.instagram.com/jhanmedeiros/" target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="icon" className="hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://discord.gg/YU8uTRyz2Y" target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="icon" className="hover:text-accent transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://x.com/Jansey_Medeiros" target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="icon" className="hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Button>
              </a>
              {user && (
                <Button onClick={signOut} variant="outline" className="border-primary/30 hover:border-primary">
                  {t('nav.logout')}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 animate-fade-in">
            {/* Main Items */}
            {mainItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Downloads Section */}
            <div className="pt-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">{t('nav.downloads')}</p>
              {downloadItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Game Section */}
            <div className="pt-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">{t('nav.game')}</p>
              {gameItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Community Section */}
            <div className="pt-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">{t('nav.community')}</p>
              {communityItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Admin Section - Only for admins */}
            {user && isAdmin && (
              <div className="pt-2 border-t border-border">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">{t('nav.administration')}</p>
                <Link
                  to="/admin/storage"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors border border-primary/50 ${
                    isActive('/admin/storage')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {t('nav.adminStorage')}
                </Link>
              </div>
            )}
            <div className="flex items-center space-x-2 pt-4 border-t border-border">
              <LanguageSelector />
              <a href="https://www.youtube.com/@jhanmedeiros" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Youtube className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://www.instagram.com/jhanmedeiros/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://discord.gg/YU8uTRyz2Y" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://x.com/Jansey_Medeiros" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Button>
              </a>
              {user && (
                <Button onClick={signOut} variant="outline" className="w-full mt-2">
                  {t('nav.logout')}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
