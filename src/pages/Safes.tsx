import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { safes, getUniqueMapNames, getUniqueSafeNames } from '@/data/safes';

export default function Safes() {
  const [selectedMap, setSelectedMap] = useState<string>('all');
  const [selectedSafe, setSelectedSafe] = useState<string>('all');

  const mapNames = useMemo(() => getUniqueMapNames(), []);
  const safeNames = useMemo(() => getUniqueSafeNames(), []);

  const filteredSafes = useMemo(() => {
    return safes.filter((safe) => {
      const mapMatch = selectedMap === 'all' || safe.map === selectedMap;
      const safeMatch = selectedSafe === 'all' || safe.safe === selectedSafe;
      return mapMatch && safeMatch;
    });
  }, [selectedMap, selectedSafe]);

  const stats = useMemo(() => {
    const total = filteredSafes.length;
    const byMap = mapNames.reduce((acc, map) => {
      acc[map] = filteredSafes.filter(s => s.map === map).length;
      return acc;
    }, {} as Record<string, number>);
    const bySafe = safeNames.reduce((acc, safe) => {
      acc[safe] = filteredSafes.filter(s => s.safe === safe).length;
      return acc;
    }, {} as Record<string, number>);
    return { total, byMap, bySafe };
  }, [filteredSafes, mapNames, safeNames]);

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
          Safes
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Filtre por mapa e safe para acessar os links
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <Select value={selectedMap} onValueChange={setSelectedMap}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o mapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Mapas</SelectItem>
              {mapNames.map((map) => (
                <SelectItem key={map} value={map}>
                  {map} ({stats.byMap[map]} safes)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSafe} onValueChange={setSelectedSafe}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a safe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Safes</SelectItem>
              {safeNames.map((safe) => (
                <SelectItem key={safe} value={safe}>
                  {safe} ({stats.bySafe[safe]} imagens)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="text-center mb-8">
          <p className="text-lg font-semibold">
            Mostrando <span className="text-primary">{stats.total}</span> safes
          </p>
        </div>

        {/* List */}
        <div className="max-w-4xl mx-auto space-y-2">
          {filteredSafes.map((safe, index) => (
            <Card key={index} className="hover:border-primary/50 transition-all animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">
                      {safe.map} - {safe.safe}
                    </h3>
                  </div>
                  <Button
                    onClick={() => handleDownload(safe.imageUrl)}
                    size="sm"
                    variant="outline"
                    className="ml-4"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Abrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSafes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma safe encontrada com os filtros selecionados</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
