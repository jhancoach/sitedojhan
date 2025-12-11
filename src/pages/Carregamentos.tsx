import { Download } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadouts } from '@/data/loadouts';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Carregamentos() {
  const { t } = useLanguage();
  
  const handleDownload = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-fire bg-clip-text text-transparent">
          {t('loadouts.title')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadouts.map((loadout) => (
            <Card key={loadout.name} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:scale-105">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-background/50">
                  <img
                    src={loadout.image}
                    alt={loadout.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-3 text-foreground">
                  {loadout.name}
                </h3>
                <Button
                  onClick={() => handleDownload(loadout.image)}
                  className="w-full shadow-glow-orange"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('maps.download')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
