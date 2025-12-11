import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { aerialViews } from '@/data/aerialViews';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VisoesAereas() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
          {t('aerialViews.title')}
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          {t('aerialViews.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {aerialViews.map((view, index) => (
            <Card key={index} className="group hover:shadow-glow-orange transition-all duration-300 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4 h-32 bg-gradient-fire/10 rounded-lg">
                  <ExternalLink className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">{view.name}</h3>
                <Button
                  onClick={() => window.open(view.url, '_blank', 'noopener,noreferrer')}
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('aerialViews.accessDrive')}
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
