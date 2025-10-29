import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-dark">
      <div className="text-center space-y-8 max-w-2xl">
        <img 
          src="https://i.ibb.co/mCS1fCxY/Whats-App-Image-2025-10-26-at-08-14-03.jpg" 
          alt="Jhan Medeiros Logo" 
          className="h-32 w-auto mx-auto animate-float"
        />
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-fire bg-clip-text text-transparent">
          {t('home.welcome')}
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/80 italic px-4">
          "{t('home.verse')}"
          <br />
          <span className="font-semibold text-primary">- {t('home.verseRef')}</span>
        </p>

        <Button 
          size="lg" 
          onClick={() => navigate('/auth')}
          className="text-lg px-8 py-6 shadow-glow-orange"
        >
          {t('home.accessPlatform')}
        </Button>

        <div className="mt-12 w-full">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-fire bg-clip-text text-transparent">
            Últimos Vídeos do YouTube
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-video rounded-lg overflow-hidden shadow-glow-orange">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed?list=UULFOvJHcWOZ6pYCcv-Jjmj6bQ"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
