import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube, Instagram, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: 'Início', path: '/dashboard' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Free Agent', path: '/free-agent' },
    { name: 'Mapas', path: '/mapas' },
    { name: 'Pets', path: '/pets' },
    { name: 'Personagens', path: '/personagens' },
    { name: 'Monte Sua Composição', path: '/composicao' },
    { name: 'Visões Aéreas', path: '/visoes-aereas' },
    { name: 'Safes', path: '/safes' },
    { name: 'Picks e Bans', path: '/picks-bans' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img 
              src="https://i.ibb.co/mCS1fCxY/Whats-App-Image-2025-10-26-at-08-14-03.jpg" 
              alt="Jhan Medeiros Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Social Links & Auth */}
          <div className="hidden lg:flex items-center space-x-3">
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
              <Button onClick={signOut} variant="outline">
                Sair
              </Button>
            )}
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
          <div className="lg:hidden mt-4 pb-4 space-y-2">
            {navItems.map((item) => (
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
            <div className="flex items-center space-x-2 pt-4 border-t border-border">
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
                  Sair
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
