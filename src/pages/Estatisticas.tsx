import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const playerSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  foto: z.string().optional(),
  kills: z.string().min(1, 'Kills é obrigatório'),
  mortes: z.string().min(1, 'Mortes é obrigatório'),
  assistencias: z.string().min(1, 'Assistências é obrigatório'),
  danoCausado: z.string().min(1, 'Dano Causado é obrigatório'),
  derrubados: z.string().min(1, 'Derrubados é obrigatório'),
  salasJogadas: z.string().min(1, 'Salas Jogadas é obrigatório'),
});

type PlayerData = z.infer<typeof playerSchema>;

interface PlayerFormData {
  player1: PlayerData;
  player2: PlayerData;
  player3: PlayerData;
  player4: PlayerData;
  player5: PlayerData;
}

interface CollectiveData {
  pontos: string;
  mediaPontos: string;
  abates: string;
  mediaAbates: string;
  salasJogadas: string;
}

interface MapStats {
  pontos: string;
  salas: string;
  abates: string;
  mediaPontos: string;
  mediaAbates: string;
}

const defaultPlayerData: PlayerData = {
  nome: '',
  foto: '',
  kills: '',
  mortes: '',
  assistencias: '',
  danoCausado: '',
  derrubados: '',
  salasJogadas: '',
};

const defaultMapStats: MapStats = {
  pontos: '',
  salas: '',
  abates: '',
  mediaPontos: '',
  mediaAbates: '',
};

export default function Estatisticas() {
  const { t } = useLanguage();
  const [showSummary, setShowSummary] = useState(false);
  const [eventType, setEventType] = useState<string>('');
  const [eventName, setEventName] = useState<string>('');
  const [formData, setFormData] = useState<PlayerFormData>({
    player1: { ...defaultPlayerData },
    player2: { ...defaultPlayerData },
    player3: { ...defaultPlayerData },
    player4: { ...defaultPlayerData },
    player5: { ...defaultPlayerData },
  });
  const [collectiveData, setCollectiveData] = useState<CollectiveData>({
    pontos: '',
    mediaPontos: '',
    abates: '',
    mediaAbates: '',
    salasJogadas: '',
  });
  const [mapStats, setMapStats] = useState<Record<string, MapStats>>({
    bermuda: { ...defaultMapStats },
    purgatorio: { ...defaultMapStats },
    alpine: { ...defaultMapStats },
    novaTerra: { ...defaultMapStats },
    kalahari: { ...defaultMapStats },
    solara: { ...defaultMapStats },
  });

  // Auto-calculate collective stats from map stats
  useEffect(() => {
    const maps = Object.values(mapStats);
    const totalPontos = maps.reduce((sum, map) => sum + (parseInt(map.pontos) || 0), 0);
    const totalSalas = maps.reduce((sum, map) => sum + (parseInt(map.salas) || 0), 0);
    const totalAbates = maps.reduce((sum, map) => sum + (parseInt(map.abates) || 0), 0);
    
    setCollectiveData({
      pontos: totalPontos > 0 ? totalPontos.toString() : '',
      salasJogadas: totalSalas > 0 ? totalSalas.toString() : '',
      abates: totalAbates > 0 ? totalAbates.toString() : '',
      mediaPontos: totalSalas > 0 ? (totalPontos / totalSalas).toFixed(2) : '',
      mediaAbates: totalSalas > 0 ? (totalAbates / totalSalas).toFixed(2) : '',
    });
  }, [mapStats]);

  const handleInputChange = (
    player: keyof PlayerFormData,
    field: keyof PlayerData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [field]: value,
      },
    }));
  };

  const handleMapStatsChange = (
    map: string,
    field: keyof MapStats,
    value: string
  ) => {
    setMapStats((prev) => ({
      ...prev,
      [map]: {
        ...prev[map],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    setFormData({
      player1: { ...defaultPlayerData },
      player2: { ...defaultPlayerData },
      player3: { ...defaultPlayerData },
      player4: { ...defaultPlayerData },
      player5: { ...defaultPlayerData },
    });
    setCollectiveData({
      pontos: '',
      mediaPontos: '',
      abates: '',
      mediaAbates: '',
      salasJogadas: '',
    });
    setMapStats({
      bermuda: { ...defaultMapStats },
      purgatorio: { ...defaultMapStats },
      alpine: { ...defaultMapStats },
      novaTerra: { ...defaultMapStats },
      kalahari: { ...defaultMapStats },
      solara: { ...defaultMapStats },
    });
    setEventType('');
    setEventName('');
    setShowSummary(false);
    toast.success('Dados resetados com sucesso!');
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotals = () => {
    const players = [formData.player1, formData.player2, formData.player3, formData.player4, formData.player5];
    return {
      totalKills: players.reduce((sum, p) => sum + (parseInt(p.kills) || 0), 0),
      totalMortes: players.reduce((sum, p) => sum + (parseInt(p.mortes) || 0), 0),
      totalAssistencias: players.reduce((sum, p) => sum + (parseInt(p.assistencias) || 0), 0),
      totalDano: players.reduce((sum, p) => sum + (parseInt(p.danoCausado) || 0), 0),
      totalDerrubados: players.reduce((sum, p) => sum + (parseInt(p.derrubados) || 0), 0),
    };
  };

  const handleGenerateSummary = () => {
    const players = [formData.player1, formData.player2, formData.player3, formData.player4, formData.player5];
    const hasData = players.some(p => p.nome.trim() !== '');
    
    if (!hasData) {
      toast.error('Adicione dados de pelo menos um jogador!');
      return;
    }
    
    setShowSummary(true);
    toast.success('Resumo gerado com sucesso!');
    setTimeout(() => {
      document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderPlayerCard = (playerKey: keyof PlayerFormData, playerNumber: number) => {
    const player = formData[playerKey];

    return (
      <Card key={playerKey} className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">{t('statistics.player')} {playerNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${playerKey}-nome`}>{t('statistics.playerName')}</Label>
            <Input
              id={`${playerKey}-nome`}
              placeholder={t('statistics.enterName')}
              value={player.nome}
              onChange={(e) => handleInputChange(playerKey, 'nome', e.target.value)}
              className="bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${playerKey}-foto`}>{t('statistics.photoUrl')}</Label>
            <Input
              id={`${playerKey}-foto`}
              placeholder={t('statistics.playerPhotoUrl')}
              value={player.foto}
              onChange={(e) => handleInputChange(playerKey, 'foto', e.target.value)}
              className="bg-background border-input"
            />
            {player.foto && (
              <div className="mt-2">
                <img
                  src={player.foto}
                  alt={player.nome || 'Jogador'}
                  className="w-24 h-24 object-cover rounded-md border border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${playerKey}-kills`}>{t('statistics.kills')}</Label>
              <Input
                id={`${playerKey}-kills`}
                type="number"
                placeholder="0"
                value={player.kills}
                onChange={(e) => handleInputChange(playerKey, 'kills', e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${playerKey}-mortes`}>{t('statistics.deaths')}</Label>
              <Input
                id={`${playerKey}-mortes`}
                type="number"
                placeholder="0"
                value={player.mortes}
                onChange={(e) => handleInputChange(playerKey, 'mortes', e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${playerKey}-assistencias`}>{t('statistics.assists')}</Label>
              <Input
                id={`${playerKey}-assistencias`}
                type="number"
                placeholder="0"
                value={player.assistencias}
                onChange={(e) => handleInputChange(playerKey, 'assistencias', e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${playerKey}-danoCausado`}>{t('statistics.damageDealt')}</Label>
              <Input
                id={`${playerKey}-danoCausado`}
                type="number"
                placeholder="0"
                value={player.danoCausado}
                onChange={(e) => handleInputChange(playerKey, 'danoCausado', e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${playerKey}-derrubados`}>{t('statistics.knockdowns')}</Label>
              <Input
                id={`${playerKey}-derrubados`}
                type="number"
                placeholder="0"
                value={player.derrubados}
                onChange={(e) => handleInputChange(playerKey, 'derrubados', e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${playerKey}-salasJogadas`}>{t('statistics.roomsPlayed')}</Label>
              <Input
                id={`${playerKey}-salasJogadas`}
                type="number"
                placeholder="0"
                value={player.salasJogadas}
                onChange={(e) => handleInputChange(playerKey, 'salasJogadas', e.target.value)}
                className="bg-background border-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4 no-print">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('statistics.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('statistics.subtitle')}
            </p>
            <div className="bg-muted/50 border border-border rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground italic">
                💡 <span className="font-semibold">{t('statistics.note').split(':')[0]}:</span> {t('statistics.note').split(':')[1]}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center no-print">
            <Button
              onClick={handleReset}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t('statistics.resetData')}
            </Button>

            <Button
              onClick={handlePrint}
              variant="outline"
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              {t('statistics.printPdf')}
            </Button>

            <Button
              onClick={handleGenerateSummary}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              {t('statistics.generateSummary')}
            </Button>
          </div>

          {/* Event Type and Name */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">{t('statistics.eventType')}</Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue placeholder={t('statistics.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="competicao">{t('statistics.competition')}</SelectItem>
                        <SelectItem value="treino">{t('statistics.training')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventName">{t('statistics.eventName')}</Label>
                    <Input
                      id="eventName"
                      placeholder={t('statistics.eventNamePlaceholder')}
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Stats */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">{t('statistics.mapStats')}</h2>
            {['bermuda', 'purgatorio', 'alpine', 'novaTerra', 'kalahari', 'solara'].map((mapKey) => {
              const mapNames: Record<string, string> = {
                bermuda: 'Bermuda',
                purgatorio: 'Purgatório',
                alpine: 'Alpine',
                novaTerra: 'Nova Terra',
                kalahari: 'Kalahari',
                solara: 'Solara',
              };
              const stats = mapStats[mapKey];
              return (
                <Card key={mapKey} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-primary">{mapNames[mapKey]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${mapKey}-pontos`}>{t('statistics.points')}</Label>
                        <Input
                          id={`${mapKey}-pontos`}
                          type="number"
                          placeholder="0"
                          value={stats.pontos}
                          onChange={(e) => handleMapStatsChange(mapKey, 'pontos', e.target.value)}
                          className="bg-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${mapKey}-salas`}>{t('statistics.rooms')}</Label>
                        <Input
                          id={`${mapKey}-salas`}
                          type="number"
                          placeholder="0"
                          value={stats.salas}
                          onChange={(e) => handleMapStatsChange(mapKey, 'salas', e.target.value)}
                          className="bg-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${mapKey}-abates`}>{t('statistics.kills')}</Label>
                        <Input
                          id={`${mapKey}-abates`}
                          type="number"
                          placeholder="0"
                          value={stats.abates}
                          onChange={(e) => handleMapStatsChange(mapKey, 'abates', e.target.value)}
                          className="bg-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${mapKey}-mediaPontos`}>{t('statistics.avgPoints')}</Label>
                        <Input
                          id={`${mapKey}-mediaPontos`}
                          type="number"
                          placeholder={t('statistics.auto')}
                          value={
                            parseInt(stats.salas) > 0
                              ? (parseInt(stats.pontos || '0') / parseInt(stats.salas)).toFixed(2)
                              : stats.mediaPontos
                          }
                          readOnly
                          className="bg-muted border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${mapKey}-mediaAbates`}>{t('statistics.avgKills')}</Label>
                        <Input
                          id={`${mapKey}-mediaAbates`}
                          type="number"
                          placeholder="Auto"
                          value={
                            parseInt(stats.salas) > 0
                              ? (parseInt(stats.abates || '0') / parseInt(stats.salas)).toFixed(2)
                              : stats.mediaAbates
                          }
                          readOnly
                          className="bg-muted border-input"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Collective Stats */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Estatísticas Coletivas (Auto-calculadas)</h2>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pontos">Pontos</Label>
                    <Input
                      id="pontos"
                      type="number"
                      placeholder="Auto"
                      value={collectiveData.pontos}
                      readOnly
                      className="bg-muted border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediaPontos">Média de Pontos</Label>
                    <Input
                      id="mediaPontos"
                      type="number"
                      placeholder="Auto"
                      value={collectiveData.mediaPontos}
                      readOnly
                      className="bg-muted border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abates">Abates</Label>
                    <Input
                      id="abates"
                      type="number"
                      placeholder="Auto"
                      value={collectiveData.abates}
                      readOnly
                      className="bg-muted border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediaAbates">Média de Abates</Label>
                    <Input
                      id="mediaAbates"
                      type="number"
                      placeholder="Auto"
                      value={collectiveData.mediaAbates}
                      readOnly
                      className="bg-muted border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salasJogadas">Salas Jogadas</Label>
                    <Input
                      id="salasJogadas"
                      type="number"
                      placeholder="Auto"
                      value={collectiveData.salasJogadas}
                      readOnly
                      className="bg-muted border-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Individual Stats */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Estatísticas Individuais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderPlayerCard('player1', 1)}
              {renderPlayerCard('player2', 2)}
              {renderPlayerCard('player3', 3)}
              {renderPlayerCard('player4', 4)}
              {renderPlayerCard('player5', 5)}
            </div>
          </div>

          {/* Summary Section */}
          {showSummary && (
            <div id="summary-section" className="mt-12 space-y-6">
              <h2 className="text-3xl font-bold text-center text-primary">
                Resumo Final
              </h2>

              {/* Event Info */}
              {(eventType || eventName) && (
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">
                      {eventType === 'competicao' ? '🏆 Competição' : '💪 Treino'}
                      {eventName && `: ${eventName}`}
                    </CardTitle>
                  </CardHeader>
                </Card>
              )}

              {/* Collective Summary */}
              <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Estatísticas Coletivas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Pontos</p>
                      <p className="text-3xl font-bold text-primary">{collectiveData.pontos || '0'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Média de Pontos</p>
                      <p className="text-3xl font-bold text-secondary">{collectiveData.mediaPontos || '0'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Abates</p>
                      <p className="text-3xl font-bold text-primary">{collectiveData.abates || '0'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Média de Abates</p>
                      <p className="text-3xl font-bold text-secondary">{collectiveData.mediaAbates || '0'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Salas Jogadas</p>
                      <p className="text-3xl font-bold text-primary">{collectiveData.salasJogadas || '0'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Stats Charts - Side by Side */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center text-primary">Pontos Por Mapa e Abates Por Mapa</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Horizontal Bar Chart for Points */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-center">Pontos por Mapa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          layout="horizontal"
                          data={[
                            { name: 'Bermuda', pontos: parseInt(mapStats.bermuda.pontos) || 0 },
                            { name: 'Purgatório', pontos: parseInt(mapStats.purgatorio.pontos) || 0 },
                            { name: 'Alpine', pontos: parseInt(mapStats.alpine.pontos) || 0 },
                            { name: 'Nova Terra', pontos: parseInt(mapStats.novaTerra.pontos) || 0 },
                            { name: 'Kalahari', pontos: parseInt(mapStats.kalahari.pontos) || 0 },
                            { name: 'Solara', pontos: parseInt(mapStats.solara.pontos) || 0 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip />
                          <Bar dataKey="pontos" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Horizontal Bar Chart for Kills */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-center">Abates por Mapa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          layout="horizontal"
                          data={[
                            { name: 'Bermuda', abates: parseInt(mapStats.bermuda.abates) || 0 },
                            { name: 'Purgatório', abates: parseInt(mapStats.purgatorio.abates) || 0 },
                            { name: 'Alpine', abates: parseInt(mapStats.alpine.abates) || 0 },
                            { name: 'Nova Terra', abates: parseInt(mapStats.novaTerra.abates) || 0 },
                            { name: 'Kalahari', abates: parseInt(mapStats.kalahari.abates) || 0 },
                            { name: 'Solara', abates: parseInt(mapStats.solara.abates) || 0 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip />
                          <Bar dataKey="abates" fill="hsl(var(--secondary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Pie Chart for Rooms Distribution */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-center">Distribuição de Salas Por Mapa</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Bermuda', value: parseInt(mapStats.bermuda.salas) || 0 },
                            { name: 'Purgatório', value: parseInt(mapStats.purgatorio.salas) || 0 },
                            { name: 'Alpine', value: parseInt(mapStats.alpine.salas) || 0 },
                            { name: 'Nova Terra', value: parseInt(mapStats.novaTerra.salas) || 0 },
                            { name: 'Kalahari', value: parseInt(mapStats.kalahari.salas) || 0 },
                            { name: 'Solara', value: parseInt(mapStats.solara.salas) || 0 },
                          ].filter(item => item.value > 0)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Team Totals */}
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Totais do Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Kills</p>
                      <p className="text-3xl font-bold text-primary">{totals.totalKills}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Mortes</p>
                      <p className="text-3xl font-bold text-destructive">{totals.totalMortes}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Assists</p>
                      <p className="text-3xl font-bold text-secondary">{totals.totalAssistencias}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Dano</p>
                      <p className="text-3xl font-bold">{totals.totalDano.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Derrubados</p>
                      <p className="text-3xl font-bold">{totals.totalDerrubados}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground mb-2">K/D Ratio do Time</p>
                    <p className="text-4xl font-bold text-primary">
                      {(totals.totalKills / (totals.totalMortes || 1)).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Summary */}
              <h3 className="text-2xl font-bold text-center text-primary mt-8">Estatísticas Individuais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[formData.player1, formData.player2, formData.player3, formData.player4, formData.player5].map(
                  (player, index) =>
                    player.nome && (
                      <Card key={index} className="bg-card border-primary/50">
                        <CardHeader className="text-center">
                          {player.foto && (
                            <img
                              src={player.foto}
                              alt={player.nome}
                              className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-2 border-primary"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <CardTitle className="text-xl">{player.nome}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kills:</span>
                            <span className="font-semibold text-primary">{player.kills}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mortes:</span>
                            <span className="font-semibold text-destructive">{player.mortes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Assistências:</span>
                            <span className="font-semibold text-secondary">{player.assistencias}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dano:</span>
                            <span className="font-semibold">{parseInt(player.danoCausado).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Derrubados:</span>
                            <span className="font-semibold">{player.derrubados}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Salas Jogadas:</span>
                            <span className="font-semibold">{player.salasJogadas}</span>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <div className="flex justify-between">
                              <span className="font-semibold">K/D:</span>
                              <span className="font-bold text-primary">
                                {(
                                  parseInt(player.kills) / (parseInt(player.mortes) || 1)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          header, footer {
            display: none !important;
          }
          
          body {
            background: white !important;
            color: black !important;
          }
          
          .grid {
            break-inside: avoid;
          }
          
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
