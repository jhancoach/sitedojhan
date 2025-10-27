import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { activeCharacters, Character } from '@/data/characters';

interface TeamData {
  name: string;
  ban: Character | null;
  picks: (Character | null)[];
}

export default function PicksBans() {
  const [teamA, setTeamA] = useState<TeamData>({
    name: 'Time A',
    ban: null,
    picks: [null, null, null, null],
  });

  const [teamB, setTeamB] = useState<TeamData>({
    name: 'Time B',
    ban: null,
    picks: [null, null, null, null],
  });

  const getAllUsedCharacters = () => {
    const used = new Set<string>();
    if (teamA.ban) used.add(teamA.ban.name);
    if (teamB.ban) used.add(teamB.ban.name);
    teamA.picks.forEach(p => p && used.add(p.name));
    teamB.picks.forEach(p => p && used.add(p.name));
    return used;
  };

  const getAvailableCharacters = () => {
    const used = getAllUsedCharacters();
    return activeCharacters.filter(c => !used.has(c.name));
  };

  const updateTeam = (team: 'A' | 'B', field: 'name' | 'ban' | 'picks', value: any, pickIndex?: number) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const currentTeam = team === 'A' ? teamA : teamB;

    if (field === 'picks' && pickIndex !== undefined) {
      const newPicks = [...currentTeam.picks];
      newPicks[pickIndex] = value;
      setter({ ...currentTeam, picks: newPicks });
    } else {
      setter({ ...currentTeam, [field]: value });
    }
  };

  const clearAll = () => {
    setTeamA({ name: 'Time A', ban: null, picks: [null, null, null, null] });
    setTeamB({ name: 'Time B', ban: null, picks: [null, null, null, null] });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-fire bg-clip-text text-transparent">
                PICKS & BANS
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Produzido por @jhanmedeiros
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <Button onClick={clearAll} variant="outline">
              Limpar Tudo
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Team A */}
            <Card className="border-2 border-secondary">
              <CardContent className="p-6">
                <div className="mb-6">
                  <Label htmlFor="teamA-name" className="text-lg font-bold text-secondary">
                    TIME A
                  </Label>
                  <Input
                    id="teamA-name"
                    value={teamA.name}
                    onChange={(e) => updateTeam('A', 'name', e.target.value)}
                    className="mt-2 border-secondary"
                    placeholder="Nome do Time A"
                  />
                </div>

                {/* Ban */}
                <div className="mb-6">
                  <Label className="text-md font-semibold">BAN</Label>
                  <Select
                    value={teamA.ban?.name || ''}
                    onValueChange={(value) => {
                      const char = activeCharacters.find(c => c.name === value);
                      updateTeam('A', 'ban', char || null);
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione personagem..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCharacters().map((char) => (
                        <SelectItem key={char.name} value={char.name}>
                          {char.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {teamA.ban && (
                    <div className="mt-4 relative">
                      <img
                        src={teamA.ban.image}
                        alt={teamA.ban.name}
                        className="w-full aspect-square object-contain bg-secondary/20 rounded-lg p-4"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => updateTeam('A', 'ban', null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-center mt-2 font-semibold">{teamA.ban.name}</p>
                    </div>
                  )}
                </div>

                {/* Picks */}
                <div>
                  <Label className="text-md font-semibold">PICKS</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {teamA.picks.map((pick, index) => (
                      <div key={index}>
                        <Select
                          value={pick?.name || ''}
                          onValueChange={(value) => {
                            const char = activeCharacters.find(c => c.name === value);
                            updateTeam('A', 'picks', char || null, index);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Pick ${index + 1}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableCharacters().map((char) => (
                              <SelectItem key={char.name} value={char.name}>
                                {char.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {pick && (
                          <div className="mt-2 relative">
                            <img
                              src={pick.image}
                              alt={pick.name}
                              className="w-full aspect-square object-contain bg-secondary/20 rounded p-2"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => updateTeam('A', 'picks', null, index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <p className="text-center text-xs mt-1 font-semibold">{pick.name}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team B */}
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="mb-6">
                  <Label htmlFor="teamB-name" className="text-lg font-bold text-primary">
                    TIME B
                  </Label>
                  <Input
                    id="teamB-name"
                    value={teamB.name}
                    onChange={(e) => updateTeam('B', 'name', e.target.value)}
                    className="mt-2 border-primary"
                    placeholder="Nome do Time B"
                  />
                </div>

                {/* Ban */}
                <div className="mb-6">
                  <Label className="text-md font-semibold">BAN</Label>
                  <Select
                    value={teamB.ban?.name || ''}
                    onValueChange={(value) => {
                      const char = activeCharacters.find(c => c.name === value);
                      updateTeam('B', 'ban', char || null);
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione personagem..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCharacters().map((char) => (
                        <SelectItem key={char.name} value={char.name}>
                          {char.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {teamB.ban && (
                    <div className="mt-4 relative">
                      <img
                        src={teamB.ban.image}
                        alt={teamB.ban.name}
                        className="w-full aspect-square object-contain bg-primary/20 rounded-lg p-4"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => updateTeam('B', 'ban', null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-center mt-2 font-semibold">{teamB.ban.name}</p>
                    </div>
                  )}
                </div>

                {/* Picks */}
                <div>
                  <Label className="text-md font-semibold">PICKS</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {teamB.picks.map((pick, index) => (
                      <div key={index}>
                        <Select
                          value={pick?.name || ''}
                          onValueChange={(value) => {
                            const char = activeCharacters.find(c => c.name === value);
                            updateTeam('B', 'picks', char || null, index);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Pick ${index + 1}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableCharacters().map((char) => (
                              <SelectItem key={char.name} value={char.name}>
                                {char.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {pick && (
                          <div className="mt-2 relative">
                            <img
                              src={pick.image}
                              alt={pick.name}
                              className="w-full aspect-square object-contain bg-primary/20 rounded p-2"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => updateTeam('B', 'picks', null, index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <p className="text-center text-xs mt-1 font-semibold">{pick.name}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
