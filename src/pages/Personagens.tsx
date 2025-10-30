import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { activeCharacters, passiveCharacters } from '@/data/characters';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Personagens() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('ativos');

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
          {t('characters.title')}
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {t('characters.description')}
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="ativos">
              Ativos ({activeCharacters.length})
            </TabsTrigger>
            <TabsTrigger value="passivos">
              Passivos ({passiveCharacters.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ativos">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {activeCharacters.map((char) => (
                <Card key={char.name} className="group hover:shadow-glow-orange transition-all duration-300 animate-fade-in hover-scale">
                  <CardContent className="p-4">
                    <div className="aspect-square relative overflow-hidden rounded-lg mb-3 bg-gradient-fire/10">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-center mb-2">{char.name}</h3>
                    <Button
                      onClick={() => handleDownload(char.image)}
                      size="sm"
                      className="w-full"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="passivos">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {passiveCharacters.map((char) => (
                <Card key={char.name} className="group hover:shadow-glow-blue transition-all duration-300 animate-fade-in hover-scale">
                  <CardContent className="p-4">
                    <div className="aspect-square relative overflow-hidden rounded-lg mb-3 bg-gradient-blue/10">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-center mb-2">{char.name}</h3>
                    <Button
                      onClick={() => handleDownload(char.image)}
                      size="sm"
                      variant="secondary"
                      className="w-full"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
