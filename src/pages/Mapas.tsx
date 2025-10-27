import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { maps } from '@/data/maps';
import { useAuth } from '@/contexts/AuthContext';

export default function Mapas() {
  const { user } = useAuth();

  const handleDownload = (url: string, name: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
          Mapas Free Fire
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          {user?.email?.split('@')[0]}, clique nos mapas para fazer o download
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map((map) => (
            <Card key={map.name} className="group hover:shadow-glow-orange transition-all duration-300 animate-fade-in">
              <CardContent className="p-6">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={map.image}
                    alt={map.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">{map.name}</h3>
                <Button
                  onClick={() => handleDownload(map.downloadUrl, map.name)}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
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
