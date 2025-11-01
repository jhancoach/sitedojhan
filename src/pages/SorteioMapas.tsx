import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Shuffle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MAPS = ['BERMUDA', 'PURGATÓRIO', 'ALPINE', 'NOVA TERRA', 'SOLARA', 'KALAHARI'];

const MAP_COLORS = [
  'from-primary/80 to-primary',
  'from-yellow-500/80 to-yellow-600',
  'from-orange-500/80 to-orange-600',
  'from-red-500/80 to-red-600',
  'from-purple-500/80 to-purple-600',
  'from-blue-500/80 to-blue-600',
];

export default function SorteioMapas() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'single' | 'sequence'>('single');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);
  const [currentMap, setCurrentMap] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);

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
    
    if (mode === 'single') {
      const availableMaps = MAPS.filter(map => !selectedMaps.includes(map));
      if (availableMaps.length === 0) {
        setSelectedMaps([]);
      }
      const targetMap = availableMaps.length > 0 
        ? availableMaps[Math.floor(Math.random() * availableMaps.length)]
        : MAPS[Math.floor(Math.random() * MAPS.length)];
      
      const targetIndex = MAPS.indexOf(targetMap);
      const segmentAngle = 360 / MAPS.length;
      const baseRotations = 5; // 5 voltas completas
      const targetAngle = (targetIndex * segmentAngle);
      const totalRotation = (baseRotations * 360) + (360 - targetAngle) + (segmentAngle / 2);
      
      setFinalRotation(rotation + totalRotation);
      
      setTimeout(() => {
        setCurrentMap(targetMap);
        setSelectedMaps([targetMap]);
        setIsSpinning(false);
        setRotation(rotation + totalRotation);
      }, 4000);
    } else {
      const shuffled = shuffleArray(MAPS);
      const targetIndex = MAPS.indexOf(shuffled[0]);
      const segmentAngle = 360 / MAPS.length;
      const baseRotations = 5;
      const targetAngle = (targetIndex * segmentAngle);
      const totalRotation = (baseRotations * 360) + (360 - targetAngle) + (segmentAngle / 2);
      
      setFinalRotation(rotation + totalRotation);
      
      setTimeout(() => {
        setSelectedMaps(shuffled);
        setCurrentMap(shuffled[0]);
        setIsSpinning(false);
        setRotation(rotation + totalRotation);
      }, 4000);
    }
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
                {/* Pointer/Arrow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -translate-y-2">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg" />
                </div>
                
                {/* Roulette Wheel */}
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  <div className="absolute inset-0 rounded-full border-8 border-primary shadow-2xl overflow-hidden">
                    <div 
                      className="w-full h-full relative transition-transform duration-[4000ms] ease-out"
                      style={{ 
                        transform: `rotate(${isSpinning ? finalRotation : rotation}deg)`,
                      }}
                    >
                      {MAPS.map((map, index) => {
                        const angle = (360 / MAPS.length) * index;
                        const nextAngle = (360 / MAPS.length) * (index + 1);
                        
                        return (
                          <div
                            key={map}
                            className="absolute inset-0"
                            style={{
                              clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                            }}
                          >
                            <div className={`w-full h-full bg-gradient-to-br ${MAP_COLORS[index]} flex items-center justify-center`}>
                              <div 
                                className="absolute text-center font-bold text-white text-xs sm:text-sm drop-shadow-lg"
                                style={{
                                  transform: `rotate(${angle + (360 / MAPS.length / 2)}deg) translateY(-40%)`,
                                  transformOrigin: 'center',
                                }}
                              >
                                <span className="block" style={{ transform: 'rotate(90deg)' }}>
                                  {map}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-background border-4 border-primary rounded-full flex items-center justify-center shadow-lg z-10">
                      <Shuffle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                
                {/* Result Display */}
                {currentMap && !isSpinning && (
                  <div className="mt-6 text-center animate-fade-in">
                    <h2 className="text-4xl font-bold text-primary mb-2">{currentMap}</h2>
                    {mode === 'single' && (
                      <p className="text-muted-foreground">{t('mapDraw.selected')}</p>
                    )}
                  </div>
                )}
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
