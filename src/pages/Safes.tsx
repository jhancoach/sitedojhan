import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';
import { safes, getUniqueMapNames, getUniqueSafeNames } from '@/data/safes';

export default function Safes() {
  const [selectedMap, setSelectedMap] = useState<string>('all');
  const [selectedSafe, setSelectedSafe] = useState<string>('all');

  const mapNames = useMemo(() => getUniqueMapNames(), []);
  const safeNames = useMemo(() => getUniqueSafeNames(), []);

  const filteredSafes = useMemo(() => {
    const filtered = safes.filter((safe) => {
      const mapMatch = selectedMap === 'all' || safe.map === selectedMap;
      const safeMatch = selectedSafe === 'all' || safe.safe === selectedSafe;
      return mapMatch && safeMatch;
    });
    
    // Add enumeration for each link
    const withEnumeration = filtered.map((safe, index) => {
      // Count how many times this map+safe combination appeared before this one
      const previousCount = filtered
        .slice(0, index)
        .filter(s => s.map === safe.map && s.safe === safe.safe)
        .length;
      
      return {
        ...safe,
        enumeration: previousCount + 1
      };
    });
    
    return withEnumeration;
  }, [selectedMap, selectedSafe]);

  const stats = useMemo(() => {
    const total = filteredSafes.length;
    const byMap = mapNames.reduce((acc, map) => {
      acc[map] = safes.filter(s => s.map === map).length;
      return acc;
    }, {} as Record<string, number>);
    const bySafe = safeNames.reduce((acc, safe) => {
      acc[safe] = safes.filter(s => s.safe === safe).length;
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

        {/* Table */}
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Mapa</TableHead>
                <TableHead className="w-48">Safe</TableHead>
                <TableHead className="w-16 text-center">#</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSafes.map((safe, index) => (
                <TableRow key={`${safe.map}-${safe.safe}-${index}`}>
                  <TableCell className="font-medium">{safe.map}</TableCell>
                  <TableCell>{safe.safe}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {safe.enumeration}
                  </TableCell>
                  <TableCell>
                    <a 
                      href={safe.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all text-sm"
                    >
                      {safe.imageUrl}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSafes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma safe encontrada com os filtros selecionados</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
