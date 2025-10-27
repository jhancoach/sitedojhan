import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Character } from '@/data/characters';
import { Search } from 'lucide-react';

interface CharacterSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characters: Character[];
  onSelect: (character: Character) => void;
  title: string;
  type: 'active' | 'passive';
}

export function CharacterSelector({ open, onOpenChange, characters, onSelect, title, type }: CharacterSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (char: Character) => {
    onSelect(char);
    onOpenChange(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personagem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredCharacters.map((char) => (
              <Card
                key={char.name}
                className={`cursor-pointer hover:scale-105 transition-all duration-200 ${
                  type === 'active' 
                    ? 'hover:shadow-glow-orange hover:border-primary' 
                    : 'hover:shadow-glow-blue hover:border-secondary'
                }`}
                onClick={() => handleSelect(char)}
              >
                <CardContent className="p-2">
                  <div className={`aspect-square rounded-lg overflow-hidden mb-2 ${
                    type === 'active' ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <p className="text-xs font-semibold text-center truncate">
                    {char.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCharacters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum personagem encontrado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
