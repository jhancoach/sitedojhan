import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink } from 'lucide-react';

export default function CriadorTreinos() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t('trainingCreator.title')}
            </CardTitle>
            <CardDescription className="text-lg mt-4">
              {t('trainingCreator.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 py-8">
            <p className="text-center text-muted-foreground max-w-xl">
              {t('trainingCreator.ideal')}
            </p>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => window.open('https://criador-de-treinos-ff-jhan-medeiros.vercel.app/', '_blank', 'noopener,noreferrer')}
            >
              {t('trainingCreator.accessButton')}
              <ExternalLink className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
