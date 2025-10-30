import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';
import { activeCharacters, Character } from '@/data/characters';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
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
      <main className="flex-1 container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 print:mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {t('picksBans.title')}
          </h1>
          <div className="flex gap-2 print:hidden">
            <Button onClick={clearAll} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('picksBans.reset')}
            </Button>
            <Button onClick={handlePrint} size="sm">
              {t('picksBans.print')}
            </Button>
          </div>
        </div>

        {/* Teams Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Team A - Blue */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-blue-500 w-20">{t('picksBans.teamA')}</h2>
              <Input
                placeholder={t('picksBans.teamName')}
                value={teamA.name}
                onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                className="flex-1 border-blue-500/50 text-sm h-9"
              />
            </div>

            <div className="flex gap-2 print:hidden">
              <Button
                onClick={() => setSelectionMode({ team: 'A', type: 'ban' })}
                variant="destructive"
                size="sm"
                className="flex-1 h-8 text-xs"
              >
                {t('picksBans.selectBan')}
              </Button>
              <Button
                onClick={() => setSelectionMode({ team: 'A', type: 'pick', pickIndex: teamA.picks.findIndex(p => p === null) })}
                size="sm"
                className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
              >
                {t('picksBans.selectPick')}
              </Button>
            </div>

            <div className="flex gap-2 items-start">
              <div className="w-20">
                <h3 className="text-destructive font-bold mb-1 text-xs">{t('picksBans.ban')}</h3>
                <Card 
                  className={`border-2 bg-destructive/20 ${selectionMode?.team === 'A' && selectionMode?.type === 'ban' ? 'border-destructive shadow-md shadow-destructive/50' : 'border-destructive/50'} cursor-pointer hover:border-destructive transition-all relative`}
                  onClick={() => teamA.ban && removeCharacter('A', 'ban')}
                >
                  <CardContent className="p-1 relative">
                    {teamA.ban && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <X className="w-12 h-12 text-white/40 stroke-[3]" />
                      </div>
                    )}
                    <div className="aspect-square rounded bg-gradient-to-br from-destructive/30 to-destructive/10 flex items-center justify-center overflow-hidden">
                      {teamA.ban ? (
                        <img src={teamA.ban.image} alt={teamA.ban.name} className="w-full h-full object-contain p-1 opacity-70" />
                      ) : (
                        <span className="text-muted-foreground text-[10px]">{t('picksBans.ban')}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1">
                <h3 className="text-blue-500 font-bold mb-1 text-xs">{t('picksBans.picks')}</h3>
                <div className="grid grid-cols-4 gap-1">
                  {teamA.picks.map((pick, index) => (
                    <Card 
                      key={index}
                      className={`border-2 ${selectionMode?.team === 'A' && selectionMode?.type === 'pick' && selectionMode?.pickIndex === index ? 'border-blue-500 shadow-md shadow-blue-500/50' : 'border-border'} bg-card cursor-pointer hover:border-blue-500/50 transition-all`}
                      onClick={() => pick && removeCharacter('A', 'pick', index)}
                    >
                      <CardContent className="p-1">
                        <div className="aspect-square rounded bg-gradient-to-br from-background to-muted flex items-center justify-center overflow-hidden">
                          {pick ? (
                            <img src={pick.image} alt={pick.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-muted-foreground text-[8px] font-semibold">P{index + 1}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team B - Orange */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-orange-500 w-20">{t('picksBans.teamB')}</h2>
              <Input
                placeholder={t('picksBans.teamName')}
                value={teamB.name}
                onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                className="flex-1 border-orange-500/50 text-sm h-9"
              />
            </div>

            <div className="flex gap-2 print:hidden">
              <Button
                onClick={() => setSelectionMode({ team: 'B', type: 'ban' })}
                variant="destructive"
                size="sm"
                className="flex-1 h-8 text-xs"
              >
                {t('picksBans.selectBan')}
              </Button>
              <Button
                onClick={() => setSelectionMode({ team: 'B', type: 'pick', pickIndex: teamB.picks.findIndex(p => p === null) })}
                size="sm"
                className="flex-1 h-8 text-xs bg-orange-600 hover:bg-orange-700"
              >
                {t('picksBans.selectPick')}
              </Button>
            </div>

            <div className="flex gap-2 items-start">
              <div className="w-20">
                <h3 className="text-destructive font-bold mb-1 text-xs">{t('picksBans.ban')}</h3>
                <Card 
                  className={`border-2 bg-destructive/20 ${selectionMode?.team === 'B' && selectionMode?.type === 'ban' ? 'border-destructive shadow-md shadow-destructive/50' : 'border-destructive/50'} cursor-pointer hover:border-destructive transition-all relative`}
                  onClick={() => teamB.ban && removeCharacter('B', 'ban')}
                >
                  <CardContent className="p-1 relative">
                    {teamB.ban && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <X className="w-12 h-12 text-white/40 stroke-[3]" />
                      </div>
                    )}
                    <div className="aspect-square rounded bg-gradient-to-br from-destructive/30 to-destructive/10 flex items-center justify-center overflow-hidden">
                      {teamB.ban ? (
                        <img src={teamB.ban.image} alt={teamB.ban.name} className="w-full h-full object-contain p-1 opacity-70" />
                      ) : (
                        <span className="text-muted-foreground text-[10px]">{t('picksBans.ban')}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1">
                <h3 className="text-orange-500 font-bold mb-1 text-xs">{t('picksBans.picks')}</h3>
                <div className="grid grid-cols-4 gap-1">
                  {teamB.picks.map((pick, index) => (
                    <Card 
                      key={index}
                      className={`border-2 ${selectionMode?.team === 'B' && selectionMode?.type === 'pick' && selectionMode?.pickIndex === index ? 'border-orange-500 shadow-md shadow-orange-500/50' : 'border-border'} bg-card cursor-pointer hover:border-orange-500/50 transition-all`}
                      onClick={() => pick && removeCharacter('B', 'pick', index)}
                    >
                      <CardContent className="p-1">
                        <div className="aspect-square rounded bg-gradient-to-br from-background to-muted flex items-center justify-center overflow-hidden">
                          {pick ? (
                            <img src={pick.image} alt={pick.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-muted-foreground text-[8px] font-semibold">P{index + 1}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Characters */}
        <div className="print:hidden">
          <h3 className="text-lg font-bold mb-2">
            {t('picksBans.characters')} ({availableCharacters.length})
          </h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-1">
            {activeCharacters.map((char) => {
              const isUsed = usedCharacters.has(char.name);
              const isSelectable = selectionMode && !isUsed;
              
              return (
                <Card
                  key={char.name}
                  className={`cursor-pointer transition-all border ${
                    isUsed 
                      ? 'opacity-30 cursor-not-allowed' 
                      : isSelectable
                      ? 'hover:scale-105 hover:shadow-md hover:shadow-primary/50 border-primary'
                      : 'hover:scale-105 border-border'
                  }`}
                  onClick={() => !isUsed && selectionMode && handleCharacterClick(char)}
                >
                  <CardContent className="p-1">
                    <div className="aspect-square rounded bg-gradient-to-br from-background to-muted overflow-hidden flex items-center justify-center">
                      <img src={char.image} alt={char.name} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-center mt-0.5 text-[8px] font-bold truncate">{char.name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Instruction */}
        <div className="print:hidden text-center mt-3 text-xs text-muted-foreground">
          {selectionMode ? (
            <p className="text-primary font-semibold">
              {selectionMode.type === 'ban' 
                ? `${t('picksBans.selectBanInstruction')} - ${selectionMode.team === 'A' ? t('picksBans.teamA') : t('picksBans.teamB')}` 
                : `${t('picksBans.selectPickInstruction')} - ${selectionMode.team === 'A' ? t('picksBans.teamA') : t('picksBans.teamB')} PICK ${(selectionMode.pickIndex ?? 0) + 1}`
              }
            </p>
          ) : (
            <p>{t('picksBans.startInstruction')}</p>
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
