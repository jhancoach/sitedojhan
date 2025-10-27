import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Upload, X } from 'lucide-react';
import { activeCharacters, passiveCharacters, Character } from '@/data/characters';
import { useToast } from '@/hooks/use-toast';

interface PlayerComposition {
  name: string;
  photo: string | null;
  active: Character | null;
  passive1: Character | null;
  passive2: Character | null;
  passive3: Character | null;
}

export default function Composicao() {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [players, setPlayers] = useState<PlayerComposition[]>([
    { name: '', photo: null, active: null, passive1: null, passive2: null, passive3: null },
    { name: '', photo: null, active: null, passive1: null, passive2: null, passive3: null },
    { name: '', photo: null, active: null, passive1: null, passive2: null, passive3: null },
    { name: '', photo: null, active: null, passive1: null, passive2: null, passive3: null },
  ]);

  const updatePlayer = (index: number, field: keyof PlayerComposition, value: any) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updatePlayer(index, 'photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvailableActives = (currentIndex: number) => {
    const usedActives = players
      .filter((_, i) => i !== currentIndex)
      .map(p => p.active?.name)
      .filter(Boolean);
    return activeCharacters.filter(c => !usedActives.includes(c.name));
  };

  const getAvailablePassivesForPlayer = (playerIndex: number, slotIndex: number) => {
    const player = players[playerIndex];
    const usedInPlayer = [
      player.passive1?.name,
      player.passive2?.name,
      player.passive3?.name
    ].filter((name, i) => i !== slotIndex && name);
    
    return passiveCharacters.filter(c => !usedInPlayer.includes(c.name));
  };

  const handlePrint = () => {
    window.print();
  };

  const validateComposition = () => {
    const usedActives = new Set<string>();
    for (const player of players) {
      if (player.active) {
        if (usedActives.has(player.active.name)) {
          toast({
            title: 'Erro',
            description: 'Não pode usar a mesma habilidade ativa em jogadores diferentes',
            variant: 'destructive',
          });
          return false;
        }
        usedActives.add(player.active.name);
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
            Monte Sua Composição
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Monte a composição do seu time com 4 jogadores
          </p>

          <div className="flex justify-end mb-6 print:hidden">
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir / Salvar PDF
            </Button>
          </div>

          <div ref={printRef} className="space-y-8">
            {players.map((player, playerIndex) => (
              <Card key={playerIndex} className="animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-primary">
                    Jogador {playerIndex + 1}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor={`name-${playerIndex}`}>Nome do Jogador</Label>
                      <Input
                        id={`name-${playerIndex}`}
                        value={player.name}
                        onChange={(e) => updatePlayer(playerIndex, 'name', e.target.value)}
                        placeholder="Digite o nome..."
                      />
                    </div>

                    {/* Photo */}
                    <div>
                      <Label>Foto do Jogador</Label>
                      <div className="flex items-center gap-4">
                        {player.photo ? (
                          <div className="relative">
                            <img
                              src={player.photo}
                              alt="Foto"
                              className="h-20 w-20 rounded-full object-cover"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => updatePlayer(playerIndex, 'photo', null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(playerIndex, e)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Characters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Active */}
                    <div>
                      <Label>Habilidade Ativa</Label>
                      <Select
                        value={player.active?.name || ''}
                        onValueChange={(value) => {
                          const char = activeCharacters.find(c => c.name === value);
                          updatePlayer(playerIndex, 'active', char || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableActives(playerIndex).map((char) => (
                            <SelectItem key={char.name} value={char.name}>
                              {char.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {player.active && (
                        <div className="mt-2">
                          <img
                            src={player.active.image}
                            alt={player.active.name}
                            className="w-full aspect-square object-contain bg-gradient-fire/10 rounded p-2"
                          />
                        </div>
                      )}
                    </div>

                    {/* Passives */}
                    {(['passive1', 'passive2', 'passive3'] as const).map((slot, slotIndex) => (
                      <div key={slot}>
                        <Label>Passiva {slotIndex + 1}</Label>
                        <Select
                          value={player[slot]?.name || ''}
                          onValueChange={(value) => {
                            const char = passiveCharacters.find(c => c.name === value);
                            updatePlayer(playerIndex, slot, char || null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailablePassivesForPlayer(playerIndex, slotIndex).map((char) => (
                              <SelectItem key={char.name} value={char.name}>
                                {char.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {player[slot] && (
                          <div className="mt-2">
                            <img
                              src={player[slot]!.image}
                              alt={player[slot]!.name}
                              className="w-full aspect-square object-contain bg-gradient-blue/10 rounded p-2"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
