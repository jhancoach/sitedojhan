import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CharacterSelector } from '@/components/CharacterSelector';
import { PetSelector } from '@/components/PetSelector';
import { Printer, X, Plus, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { activeCharacters, passiveCharacters, Character } from '@/data/characters';
import { pets, Pet } from '@/data/pets';
import { loadouts } from '@/data/loadouts';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlayerComposition {
  name: string;
  active: Character | null;
  passive1: Character | null;
  passive2: Character | null;
  passive3: Character | null;
  pet: Pet | null;
  loadout: { name: string; image: string } | null;
}

type SelectionType = {
  playerIndex: number;
  slot: 'active' | 'passive1' | 'passive2' | 'passive3';
} | null;

export default function Composicao() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<SelectionType>(null);
  const [petSelectionOpen, setPetSelectionOpen] = useState(false);
  const [currentPetPlayerIndex, setCurrentPetPlayerIndex] = useState<number | null>(null);
  const [loadoutSelectionOpen, setLoadoutSelectionOpen] = useState(false);
  const [currentLoadoutPlayerIndex, setCurrentLoadoutPlayerIndex] = useState<number | null>(null);
  
  const [players, setPlayers] = useState<PlayerComposition[]>([
    { name: '', active: null, passive1: null, passive2: null, passive3: null, pet: null, loadout: null },
    { name: '', active: null, passive1: null, passive2: null, passive3: null, pet: null, loadout: null },
    { name: '', active: null, passive1: null, passive2: null, passive3: null, pet: null, loadout: null },
    { name: '', active: null, passive1: null, passive2: null, passive3: null, pet: null, loadout: null },
  ]);

  const updatePlayer = (index: number, field: keyof PlayerComposition, value: any) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
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

  const handleSavePng = async () => {
    if (!printRef.current) return;
    
    try {
      const canvas = await html2canvas(printRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = 'composicao.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: 'Sucesso',
        description: 'Composição salva como PNG!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar imagem',
        variant: 'destructive',
      });
    }
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

  const openPetSelector = (playerIndex: number) => {
    setCurrentPetPlayerIndex(playerIndex);
    setPetSelectionOpen(true);
  };

  const handlePetSelect = (pet: Pet) => {
    if (currentPetPlayerIndex !== null) {
      updatePlayer(currentPetPlayerIndex, 'pet', pet);
    }
  };

  const openLoadoutSelector = (playerIndex: number) => {
    setCurrentLoadoutPlayerIndex(playerIndex);
    setLoadoutSelectionOpen(true);
  };

  const handleLoadoutSelect = (loadout: { name: string; image: string }) => {
    if (currentLoadoutPlayerIndex !== null) {
      updatePlayer(currentLoadoutPlayerIndex, 'loadout', loadout);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
            {t('composition.title')}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {t('composition.description')}
          </p>

          <div className="flex justify-end gap-2 mb-6 print:hidden">
            <Button onClick={handleSavePng} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Salvar em PNG
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              {t('composition.print')}
            </Button>
          </div>

          <div ref={printRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {players.map((player, playerIndex) => (
              <Card key={playerIndex} className="animate-fade-in">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-4 text-primary">
                    {t('composition.player')} {playerIndex + 1}
                  </h3>

                  {/* Name */}
                  <div className="mb-4">
                    <Label htmlFor={`name-${playerIndex}`}>{t('composition.playerName')}</Label>
                    <Input
                      id={`name-${playerIndex}`}
                      value={player.name}
                      onChange={(e) => updatePlayer(playerIndex, 'name', e.target.value)}
                      placeholder={t('composition.namePlaceholder')}
                    />
                  </div>

                  {/* Characters */}
                  <div className="grid grid-cols-6 gap-2">
                    {/* Active */}
                    <div>
                      <Label className="mb-2 block text-xs">{t('composition.active')}</Label>
                      {player.active ? (
                        <Card className="relative group hover:shadow-lg hover:shadow-primary/50 transition-all cursor-pointer">
                          <CardContent className="p-2">
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-5 w-5 z-10"
                              onClick={() => removeCharacter(playerIndex, 'active')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div 
                              className="aspect-square bg-primary/10 rounded overflow-hidden mb-1"
                              onClick={() => openCharacterSelector(playerIndex, 'active')}
                            >
                              <img
                                src={player.active.image}
                                alt={player.active.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <p className="text-[10px] font-semibold text-center truncate">
                              {player.active.name}
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card 
                          className="cursor-pointer hover:shadow-lg hover:shadow-primary/50 hover:border-primary transition-all"
                          onClick={() => openCharacterSelector(playerIndex, 'active')}
                        >
                          <CardContent className="p-2">
                            <div className="aspect-square bg-primary/10 rounded flex items-center justify-center mb-1">
                              <Plus className="h-8 w-8 text-primary/50" />
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground">
                              Ativa
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Passives */}
                    {(['passive1', 'passive2', 'passive3'] as const).map((slot, slotIndex) => (
                      <div key={slot}>
                        <Label className="mb-2 block text-xs">Pass. {slotIndex + 1}</Label>
                        {player[slot] ? (
                          <Card className="relative group hover:shadow-lg hover:shadow-secondary/50 transition-all cursor-pointer">
                            <CardContent className="p-2">
                              <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 z-10"
                                onClick={() => removeCharacter(playerIndex, slot)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div 
                                className="aspect-square bg-secondary/10 rounded overflow-hidden mb-1"
                                onClick={() => openCharacterSelector(playerIndex, slot)}
                              >
                                <img
                                  src={player[slot]!.image}
                                  alt={player[slot]!.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <p className="text-[10px] font-semibold text-center truncate">
                                {player[slot]!.name}
                              </p>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card 
                            className="cursor-pointer hover:shadow-lg hover:shadow-secondary/50 hover:border-secondary transition-all"
                            onClick={() => openCharacterSelector(playerIndex, slot)}
                          >
                            <CardContent className="p-2">
                              <div className="aspect-square bg-secondary/10 rounded flex items-center justify-center mb-1">
                                <Plus className="h-8 w-8 text-secondary/50" />
                              </div>
                              <p className="text-[10px] text-center text-muted-foreground">
                                Pass.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ))}

                    {/* Pet */}
                    <div>
                      <Label className="mb-2 block text-xs">Pet</Label>
                      {player.pet ? (
                        <Card className="relative group hover:shadow-lg hover:shadow-accent/50 transition-all cursor-pointer">
                          <CardContent className="p-2">
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-5 w-5 z-10"
                              onClick={() => removeCharacter(playerIndex, 'pet')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div 
                              className="aspect-square bg-accent/10 rounded overflow-hidden mb-1"
                              onClick={() => openPetSelector(playerIndex)}
                            >
                              <img
                                src={player.pet.image}
                                alt={player.pet.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <p className="text-[10px] font-semibold text-center truncate">
                              {player.pet.name}
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card 
                          className="cursor-pointer hover:shadow-lg hover:shadow-accent/50 hover:border-accent transition-all"
                          onClick={() => openPetSelector(playerIndex)}
                        >
                          <CardContent className="p-2">
                            <div className="aspect-square bg-accent/10 rounded flex items-center justify-center mb-1">
                              <Plus className="h-8 w-8 text-accent/50" />
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground">
                              Pet
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Loadout */}
                    <div>
                      <Label className="mb-2 block text-xs">Carreg.</Label>
                      {player.loadout ? (
                        <Card className="relative group hover:shadow-lg hover:shadow-accent/50 transition-all cursor-pointer">
                          <CardContent className="p-2">
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-5 w-5 z-10"
                              onClick={() => removeCharacter(playerIndex, 'loadout')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div 
                              className="aspect-square bg-accent/10 rounded overflow-hidden mb-1"
                              onClick={() => openLoadoutSelector(playerIndex)}
                            >
                              <img
                                src={player.loadout.image}
                                alt={player.loadout.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <p className="text-[10px] font-semibold text-center truncate">
                              {player.loadout.name}
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card 
                          className="cursor-pointer hover:shadow-lg hover:shadow-accent/50 hover:border-accent transition-all"
                          onClick={() => openLoadoutSelector(playerIndex)}
                        >
                          <CardContent className="p-2">
                            <div className="aspect-square bg-accent/10 rounded flex items-center justify-center mb-1">
                              <Plus className="h-8 w-8 text-accent/50" />
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground">
                              Carreg.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
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

      <PetSelector
        open={petSelectionOpen}
        onOpenChange={setPetSelectionOpen}
        pets={pets}
        onSelect={handlePetSelect}
        title={currentPetPlayerIndex !== null ? `Selecione Pet - Jogador ${currentPetPlayerIndex + 1}` : 'Selecione Pet'}
      />

      <Dialog open={loadoutSelectionOpen} onOpenChange={setLoadoutSelectionOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentLoadoutPlayerIndex !== null ? `Selecione Carregamento - Jogador ${currentLoadoutPlayerIndex + 1}` : 'Selecione Carregamento'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {loadouts.map((loadout) => (
              <Card
                key={loadout.name}
                className="cursor-pointer hover:border-accent transition-all hover:scale-105"
                onClick={() => {
                  handleLoadoutSelect(loadout);
                  setLoadoutSelectionOpen(false);
                }}
              >
                <CardContent className="p-3">
                  <div className="aspect-square bg-accent/10 rounded overflow-hidden mb-2">
                    <img
                      src={loadout.image}
                      alt={loadout.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-semibold text-center">{loadout.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
