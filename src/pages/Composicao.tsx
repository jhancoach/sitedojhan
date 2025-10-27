import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CharacterSelector } from '@/components/CharacterSelector';
import { Printer, Upload, X, Plus } from 'lucide-react';
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

type SelectionType = {
  playerIndex: number;
  slot: 'active' | 'passive1' | 'passive2' | 'passive3';
} | null;

export default function Composicao() {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<SelectionType>(null);
  
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

  const openCharacterSelector = (playerIndex: number, slot: 'active' | 'passive1' | 'passive2' | 'passive3') => {
    setCurrentSelection({ playerIndex, slot });
    setSelectionOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (!currentSelection) return;

    const { playerIndex, slot } = currentSelection;
    
    // Validação para ativos - não pode repetir entre jogadores
    if (slot === 'active') {
      const isUsed = players.some((p, i) => i !== playerIndex && p.active?.name === character.name);
      if (isUsed) {
        toast({
          title: 'Erro',
          description: 'Esta habilidade ativa já está sendo usada por outro jogador',
          variant: 'destructive',
        });
        return;
      }
    }

    updatePlayer(playerIndex, slot, character);
  };

  const getAvailableActives = (currentIndex: number) => {
    const usedActives = players
      .filter((_, i) => i !== currentIndex)
      .map(p => p.active?.name)
      .filter(Boolean);
    return activeCharacters.filter(c => !usedActives.includes(c.name));
  };

  const getAvailablePassivesForPlayer = (playerIndex: number, slot: 'passive1' | 'passive2' | 'passive3') => {
    const player = players[playerIndex];
    const usedInPlayer = [
      player.passive1?.name,
      player.passive2?.name,
      player.passive3?.name
    ].filter((name, i) => {
      const slots = ['passive1', 'passive2', 'passive3'];
      return slots[i] !== slot && name;
    });
    
    return passiveCharacters.filter(c => !usedInPlayer.includes(c.name));
  };

  const handlePrint = () => {
    window.print();
  };

  const getCurrentCharacters = () => {
    if (!currentSelection) return [];
    const { playerIndex, slot } = currentSelection;
    
    if (slot === 'active') {
      return getAvailableActives(playerIndex);
    } else {
      return getAvailablePassivesForPlayer(playerIndex, slot);
    }
  };

  const getSelectorTitle = () => {
    if (!currentSelection) return '';
    const { playerIndex, slot } = currentSelection;
    
    if (slot === 'active') {
      return `Selecione Ativa - Jogador ${playerIndex + 1}`;
    } else {
      const slotNumber = slot === 'passive1' ? 1 : slot === 'passive2' ? 2 : 3;
      return `Selecione Passiva ${slotNumber} - Jogador ${playerIndex + 1}`;
    }
  };

  const removeCharacter = (playerIndex: number, slot: keyof PlayerComposition) => {
    updatePlayer(playerIndex, slot, null);
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
            Clique nos cards para selecionar personagens
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
                      <Label className="mb-2 block">Habilidade Ativa</Label>
                      {player.active ? (
                        <Card className="relative group hover:shadow-glow-orange transition-all cursor-pointer">
                          <CardContent className="p-3">
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 z-10"
                              onClick={() => removeCharacter(playerIndex, 'active')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div 
                              className="aspect-square bg-primary/10 rounded-lg overflow-hidden mb-2"
                              onClick={() => openCharacterSelector(playerIndex, 'active')}
                            >
                              <img
                                src={player.active.image}
                                alt={player.active.name}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <p className="text-xs font-semibold text-center truncate">
                              {player.active.name}
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card 
                          className="cursor-pointer hover:shadow-glow-orange hover:border-primary transition-all"
                          onClick={() => openCharacterSelector(playerIndex, 'active')}
                        >
                          <CardContent className="p-3">
                            <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                              <Plus className="h-12 w-12 text-primary/50" />
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                              Selecionar Ativa
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Passives */}
                    {(['passive1', 'passive2', 'passive3'] as const).map((slot, slotIndex) => (
                      <div key={slot}>
                        <Label className="mb-2 block">Passiva {slotIndex + 1}</Label>
                        {player[slot] ? (
                          <Card className="relative group hover:shadow-glow-blue transition-all cursor-pointer">
                            <CardContent className="p-3">
                              <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 z-10"
                                onClick={() => removeCharacter(playerIndex, slot)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div 
                                className="aspect-square bg-secondary/10 rounded-lg overflow-hidden mb-2"
                                onClick={() => openCharacterSelector(playerIndex, slot)}
                              >
                                <img
                                  src={player[slot]!.image}
                                  alt={player[slot]!.name}
                                  className="w-full h-full object-contain p-2"
                                />
                              </div>
                              <p className="text-xs font-semibold text-center truncate">
                                {player[slot]!.name}
                              </p>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card 
                            className="cursor-pointer hover:shadow-glow-blue hover:border-secondary transition-all"
                            onClick={() => openCharacterSelector(playerIndex, slot)}
                          >
                            <CardContent className="p-3">
                              <div className="aspect-square bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                                <Plus className="h-12 w-12 text-secondary/50" />
                              </div>
                              <p className="text-xs text-center text-muted-foreground">
                                Selecionar Passiva
                              </p>
                            </CardContent>
                          </Card>
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
      
      <CharacterSelector
        open={selectionOpen}
        onOpenChange={setSelectionOpen}
        characters={getCurrentCharacters()}
        onSelect={handleCharacterSelect}
        title={getSelectorTitle()}
        type={currentSelection?.slot === 'active' ? 'active' : 'passive'}
      />

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
