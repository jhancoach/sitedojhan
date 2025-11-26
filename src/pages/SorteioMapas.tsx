import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Shuffle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MAPS = ['BERMUDA', 'PURGATÓRIO', 'ALPINE', 'NOVA TERRA', 'SOLARA', 'KALAHARI'];

export default function SorteioMapas() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'single' | 'sequence'>('single');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);
  const [currentMap, setCurrentMap] = useState<string>('');

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleDraw = () => {
    setIsSpinning(true);
    setCurrentMap('');
    
    // Animation effect
    let counter = 0;
    const interval = setInterval(() => {
      setCurrentMap(MAPS[Math.floor(Math.random() * MAPS.length)]);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        
        if (mode === 'single') {
          const availableMaps = MAPS.filter(map => !selectedMaps.includes(map));
          if (availableMaps.length === 0) {
            setSelectedMaps([]);
          }
          const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
          setCurrentMap(randomMap);
          setSelectedMaps([randomMap]);
        } else {
          const shuffled = shuffleArray(MAPS);
          setSelectedMaps(shuffled);
          setCurrentMap(shuffled[0]);
        }
        
        setIsSpinning(false);
      }
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
            {t('mapDraw.title')}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {t('mapDraw.description')}
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'sequence')} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">{t('mapDraw.singleMode')}</TabsTrigger>
                  <TabsTrigger value="sequence">{t('mapDraw.sequenceMode')}</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Roulette Display */}
              <div className="relative mb-8">
                <div className="min-h-[200px] flex items-center justify-center bg-gradient-dark rounded-lg p-8 border-2 border-primary">
                  {currentMap ? (
                    <div className={`text-center ${isSpinning ? 'animate-pulse' : 'animate-fade-in'}`}>
                      <h2 className="text-5xl font-bold text-primary mb-2">{currentMap}</h2>
                      {!isSpinning && mode === 'single' && (
                        <p className="text-muted-foreground">{t('mapDraw.selected')}</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Shuffle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>{t('mapDraw.clickToDraw')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sequence Display */}
              {mode === 'sequence' && selectedMaps.length > 0 && !isSpinning && (
                <div className="mb-6 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4 text-center">{t('mapDraw.sequence')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedMaps.map((map, index) => (
                      <div
                        key={map}
                        className="bg-card border border-border rounded-lg p-4 text-center"
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('mapDraw.map')} {index + 1}
                        </div>
                        <div className="font-bold text-foreground">{map}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={handleDraw}
                  disabled={isSpinning}
                  size="lg"
                  className="min-w-[200px]"
                >
                  <Shuffle className="mr-2 h-5 w-5" />
                  {isSpinning ? t('mapDraw.drawing') : t('mapDraw.drawButton')}
                </Button>
                
                {selectedMaps.length > 0 && !isSpinning && (
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px]"
                  >
                    <Printer className="mr-2 h-5 w-5" />
                    {t('mapDraw.print')}
                  </Button>
                )}
              </div>

              {/* Map List */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">
                  {t('mapDraw.availableMaps')}
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {MAPS.map((map) => (
                    <div
                      key={map}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {map}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          header, footer, button {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
