import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { pets } from '@/data/pets';

export default function Pets() {
  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
          Pets Free Fire
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Clique nas imagens para fazer o download
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pets.map((pet) => (
            <Card key={pet.name} className="group hover:shadow-glow-blue transition-all duration-300 animate-fade-in hover-scale">
              <CardContent className="p-4">
                <div className="aspect-square relative overflow-hidden rounded-lg mb-3 bg-muted">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <h3 className="text-sm font-bold text-center mb-2">{pet.name}</h3>
                <Button
                  onClick={() => handleDownload(pet.image)}
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
      </main>
      <Footer />
    </div>
  );
}
