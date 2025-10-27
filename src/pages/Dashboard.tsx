import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold bg-gradient-fire bg-clip-text text-transparent">
            Plataforma de Análise Free Fire
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesse recursos profissionais para análise de mapas, personagens, composições e muito mais.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Button onClick={() => navigate('/mapas')} className="h-24 text-lg">
              Mapas
            </Button>
            <Button onClick={() => navigate('/personagens')} className="h-24 text-lg">
              Personagens
            </Button>
            <Button onClick={() => navigate('/free-agent')} className="h-24 text-lg">
              Free Agent
            </Button>
            <Button onClick={() => navigate('/composicao')} className="h-24 text-lg">
              Monte Composição
            </Button>
            <Button onClick={() => navigate('/safes')} className="h-24 text-lg">
              Safes
            </Button>
            <Button onClick={() => navigate('/picks-bans')} className="h-24 text-lg">
              Picks & Bans
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
