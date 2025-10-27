import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Pet } from '@/data/pets';

interface PetSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pets: Pet[];
  onSelect: (pet: Pet) => void;
  title: string;
}

export function PetSelector({ open, onOpenChange, pets, onSelect, title }: PetSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (pet: Pet) => {
    onSelect(pet);
    onOpenChange(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-fire bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <Input
            placeholder="Buscar pet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredPets.map((pet) => (
            <Card
              key={`${pet.name}-${pet.image}`}
              className="cursor-pointer hover:shadow-lg hover:shadow-accent/50 transition-all hover-scale"
              onClick={() => handleSelect(pet)}
            >
              <CardContent className="p-2">
                <div className="aspect-square bg-accent/10 rounded overflow-hidden mb-2">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-xs font-semibold text-center truncate">
                  {pet.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum pet encontrado
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
