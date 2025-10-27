import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube, Instagram, MessageSquare, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useHasRole } from '@/hooks/useHasRole';
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

  const mainItems = [
    { name: 'Início', path: '/dashboard' },
    { name: 'Sobre', path: '/sobre' },
  ];

  const contentItems = [
    { name: 'Mapas', path: '/mapas' },
    { name: 'Visões Aéreas', path: '/visoes-aereas' },
    { name: 'Safes', path: '/safes' },
  ];

  const gameItems = [
    { name: 'Personagens', path: '/personagens' },
    { name: 'Pets', path: '/pets' },
    { name: 'Monte Sua Composição', path: '/composicao' },
    { name: 'Picks e Bans', path: '/picks-bans' },
  ];

  const communityItems = [
    { name: 'Free Agent', path: '/free-agent' },
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
            {mainItems.map((item) => (
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

            {/* Conteúdo Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Conteúdo <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background z-50">
                {contentItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full cursor-pointer">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Jogo Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Jogo <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background z-50">
                {gameItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full cursor-pointer">
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
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Admin Link - Only visible to admins */}
            {user && isAdmin && (
              <Link
                to="/admin/storage"
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md border border-primary/50 ${
                  isActive('/admin/storage')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                }`}
              >
                Admin
              </Link>
            )}
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

            {/* Content Section */}
            <div className="pt-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">Conteúdo</p>
              {contentItems.map((item) => (
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
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">Jogo</p>
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
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">Comunidade</p>
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
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">Administração</p>
                <Link
                  to="/admin/storage"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors border border-primary/50 ${
                    isActive('/admin/storage')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  Admin Storage
                </Link>
              </div>
            )}
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
