import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { activeCharacters, Character } from '@/data/characters';

interface TeamData {
  name: string;
  ban: Character | null;
  picks: (Character | null)[];
}

type SelectionMode = {
  team: 'A' | 'B';
  type: 'ban' | 'pick';
  pickIndex?: number;
} | null;

export default function PicksBans() {
  const [teamA, setTeamA] = useState<TeamData>({
    name: '',
    ban: null,
    picks: [null, null, null, null],
  });

  const [teamB, setTeamB] = useState<TeamData>({
    name: '',
    ban: null,
    picks: [null, null, null, null],
  });

  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);

  const getAllUsedCharacters = () => {
    const used = new Set<string>();
    if (teamA.ban) used.add(teamA.ban.name);
    if (teamB.ban) used.add(teamB.ban.name);
    teamA.picks.forEach(p => p && used.add(p.name));
    teamB.picks.forEach(p => p && used.add(p.name));
    return used;
  };

  const usedCharacters = getAllUsedCharacters();

  const handleCharacterClick = (character: Character) => {
    if (!selectionMode) return;

    const { team, type, pickIndex } = selectionMode;
    const setter = team === 'A' ? setTeamA : setTeamB;
    const currentTeam = team === 'A' ? teamA : teamB;

    if (type === 'ban') {
      setter({ ...currentTeam, ban: character });
    } else if (type === 'pick' && pickIndex !== undefined) {
      const newPicks = [...currentTeam.picks];
      newPicks[pickIndex] = character;
      setter({ ...currentTeam, picks: newPicks });
    }

    setSelectionMode(null);
  };

  const clearAll = () => {
    setTeamA({ name: '', ban: null, picks: [null, null, null, null] });
    setTeamB({ name: '', ban: null, picks: [null, null, null, null] });
    setSelectionMode(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const removeCharacter = (team: 'A' | 'B', type: 'ban' | 'pick', pickIndex?: number) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const currentTeam = team === 'A' ? teamA : teamB;

    if (type === 'ban') {
      setter({ ...currentTeam, ban: null });
    } else if (type === 'pick' && pickIndex !== undefined) {
      const newPicks = [...currentTeam.picks];
      newPicks[pickIndex] = null;
      setter({ ...currentTeam, picks: newPicks });
    }
  };

  const availableCharacters = activeCharacters.filter(c => !usedCharacters.has(c.name));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              PICKS & BANS
            </h1>
            <span className="text-sm text-muted-foreground hidden md:block">
              Produzido por @jhanmedeiros
            </span>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button onClick={clearAll} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetar
            </Button>
            <Button onClick={handlePrint} size="sm">
              Imprimir
            </Button>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Team A */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-secondary">TIME A</h2>
              <Input
                placeholder="Nome do time"
                value={teamA.name}
                onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                className="flex-1 border-secondary/50"
              />
            </div>

            <div className="flex gap-2 print:hidden">
              <Button
                onClick={() => setSelectionMode({ team: 'A', type: 'ban' })}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                Selecionar Ban
              </Button>
              <Button
                onClick={() => setSelectionMode({ team: 'A', type: 'pick', pickIndex: teamA.picks.findIndex(p => p === null) })}
                size="sm"
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                Selecionar Pick
              </Button>
            </div>

            {/* Ban */}
            <div>
              <h3 className="text-destructive font-bold mb-2 text-sm">BAN</h3>
              <div className="max-w-[180px]">
                <Card 
                  className={`border-4 ${selectionMode?.team === 'A' && selectionMode?.type === 'ban' ? 'border-destructive shadow-lg shadow-destructive/50' : 'border-border'} bg-card cursor-pointer hover:border-destructive/50 transition-all`}
                  onClick={() => teamA.ban && removeCharacter('A', 'ban')}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-background to-muted flex items-center justify-center overflow-hidden">
                      {teamA.ban ? (
                        <img
                          src={teamA.ban.image}
                          alt={teamA.ban.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">BAN</span>
                      )}
                    </div>
                    {teamA.ban && (
                      <p className="text-center mt-1 font-bold text-xs">{teamA.ban.name}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Picks */}
            <div>
              <h3 className="text-secondary font-bold mb-3 text-lg">PICKS</h3>
              <div className="grid grid-cols-2 gap-4">
                {teamA.picks.map((pick, index) => (
                  <Card 
                    key={index}
                    className={`border-4 ${selectionMode?.team === 'A' && selectionMode?.type === 'pick' && selectionMode?.pickIndex === index ? 'border-secondary shadow-xl shadow-secondary/50' : 'border-border'} bg-card cursor-pointer hover:border-secondary/50 hover:shadow-lg transition-all`}
                    onClick={() => pick && removeCharacter('A', 'pick', index)}
                  >
                    <CardContent className="p-3">
                      <div className="aspect-square rounded bg-gradient-to-br from-background to-muted flex items-center justify-center overflow-hidden">
                        {pick ? (
                          <img
                            src={pick.image}
                            alt={pick.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm font-semibold">PICK {index + 1}</span>
                        )}
                      </div>
                      {pick && (
                        <p className="text-center mt-2 text-sm font-bold">{pick.name}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-primary">TIME B</h2>
              <Input
                placeholder="Nome do time"
                value={teamB.name}
                onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                className="flex-1 border-primary/50"
              />
            </div>

            <div className="flex gap-2 print:hidden">
              <Button
                onClick={() => setSelectionMode({ team: 'B', type: 'ban' })}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                Selecionar Ban
              </Button>
              <Button
                onClick={() => setSelectionMode({ team: 'B', type: 'pick', pickIndex: teamB.picks.findIndex(p => p === null) })}
                size="sm"
                className="flex-1"
              >
                Selecionar Pick
              </Button>
            </div>

            {/* Ban */}
            <div>
              <h3 className="text-destructive font-bold mb-2 text-sm">BAN</h3>
              <div className="max-w-[180px]">
                <Card 
                  className={`border-4 ${selectionMode?.team === 'B' && selectionMode?.type === 'ban' ? 'border-destructive shadow-lg shadow-destructive/50' : 'border-border'} bg-card cursor-pointer hover:border-destructive/50 transition-all`}
                  onClick={() => teamB.ban && removeCharacter('B', 'ban')}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-background to-muted flex items-center justify-center overflow-hidden">
                      {teamB.ban ? (
                        <img
                          src={teamB.ban.image}
                          alt={teamB.ban.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">BAN</span>
                      )}
                    </div>
                    {teamB.ban && (
                      <p className="text-center mt-1 font-bold text-xs">{teamB.ban.name}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Picks */}
            <div>
              <h3 className="text-primary font-bold mb-3 text-lg">PICKS</h3>
              <div className="grid grid-cols-2 gap-4">
                {teamB.picks.map((pick, index) => (
                  <Card 
                    key={index}
                    className={`border-4 ${selectionMode?.team === 'B' && selectionMode?.type === 'pick' && selectionMode?.pickIndex === index ? 'border-primary shadow-xl shadow-primary/50' : 'border-border'} bg-card cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all`}
                    onClick={() => pick && removeCharacter('B', 'pick', index)}
                  >
                    <CardContent className="p-3">
                      <div className="aspect-square rounded bg-gradient-to-br from-background to-muted flex items-center justify-center overflow-hidden">
                        {pick ? (
                          <img
                            src={pick.image}
                            alt={pick.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm font-semibold">PICK {index + 1}</span>
                        )}
                      </div>
                      {pick && (
                        <p className="text-center mt-2 text-sm font-bold">{pick.name}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Available Characters */}
        <div className="print:hidden">
          <h3 className="text-xl font-bold mb-4">
            PERSONAGENS ({availableCharacters.length})
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {activeCharacters.map((char) => {
              const isUsed = usedCharacters.has(char.name);
              const isSelectable = selectionMode && !isUsed;
              
              return (
                <Card
                  key={char.name}
                  className={`cursor-pointer transition-all border-2 ${
                    isUsed 
                      ? 'opacity-30 cursor-not-allowed' 
                      : isSelectable
                      ? 'hover:scale-105 hover:shadow-lg hover:shadow-primary/50 border-primary'
                      : 'hover:scale-105 border-border'
                  }`}
                  onClick={() => !isUsed && selectionMode && handleCharacterClick(char)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square rounded bg-gradient-to-br from-background to-muted overflow-hidden flex items-center justify-center">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <p className="text-center mt-1 text-xs font-bold truncate">
                      {char.name}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Print instruction */}
        <div className="print:hidden text-center mt-8 text-sm text-muted-foreground">
          {selectionMode ? (
            <p className="text-primary font-semibold">
              {selectionMode.type === 'ban' 
                ? `Clique em um personagem para banir - TIME ${selectionMode.team}` 
                : `Clique em um personagem para escolher - TIME ${selectionMode.team} PICK ${(selectionMode.pickIndex ?? 0) + 1}`
              }
            </p>
          ) : (
            <p>Clique em "Selecionar Ban" ou "Selecionar Pick" para começar</p>
          )}
        </div>
      </main>
      <Footer />

      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
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
