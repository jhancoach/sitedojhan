import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, User, Trash2, RotateCcw, Download, Save, Undo2, Redo2, Image, FolderOpen, LayoutGrid, LayoutList, Shield, Pencil, Check, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PlayerSlot {
  id: string;
  name: string | null;
  role: string | null;
  imageUrl: string | null;
}

interface RoleTag {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface SavedRoster {
  id: string;
  nome: string;
  coach: PlayerSlot | null;
  titulares: PlayerSlot[];
  reservas: PlayerSlot[];
  created_at: string;
  logo_url?: string | null;
  team_name?: string | null;
  notas?: string | null;
}

interface HistoryState {
  slots: PlayerSlot[];
  players: string[];
}

const ROLE_TAGS: RoleTag[] = [
  { id: 'rush1', name: 'RUSH 1', color: 'bg-red-500/80 border-red-400', icon: '◉' },
  { id: 'rush2', name: 'RUSH 2', color: 'bg-red-500/80 border-red-400', icon: '◉' },
  { id: 'cpt', name: 'CPT', color: 'bg-yellow-500/80 border-yellow-400', icon: '👑' },
  { id: 'bomba', name: 'BOMBA', color: 'bg-orange-500/80 border-orange-400', icon: '💣' },
  { id: 'sniper', name: 'SNIPER', color: 'bg-blue-500/80 border-blue-400', icon: '🎯' },
  { id: 'coach', name: 'COACH', color: 'bg-purple-500/80 border-purple-400', icon: '📋' },
];

const createInitialSlots = (): PlayerSlot[] => [
  { id: 'coach', name: null, role: null, imageUrl: null },
  { id: 'lineup1-1', name: null, role: null, imageUrl: null },
  { id: 'lineup1-2', name: null, role: null, imageUrl: null },
  { id: 'lineup1-3', name: null, role: null, imageUrl: null },
  { id: 'lineup2-1', name: null, role: null, imageUrl: null },
  { id: 'lineup2-2', name: null, role: null, imageUrl: null },
  { id: 'reserva1-1', name: null, role: null, imageUrl: null },
  { id: 'reserva1-2', name: null, role: null, imageUrl: null },
  { id: 'reserva1-3', name: null, role: null, imageUrl: null },
  { id: 'reserva2-1', name: null, role: null, imageUrl: null },
  { id: 'reserva2-2', name: null, role: null, imageUrl: null },
];

export default function MontarElenco() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [slots, setSlots] = useState<PlayerSlot[]>(createInitialSlots());
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [draggedRole, setDraggedRole] = useState<string | null>(null);
  const [isCardMode, setIsCardMode] = useState(false);
  const [savedRosters, setSavedRosters] = useState<SavedRoster[]>([]);
  const [rosterName, setRosterName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [editingRosterId, setEditingRosterId] = useState<string | null>(null);
  const [editingRosterName, setEditingRosterName] = useState('');
  const [rosterNotes, setRosterNotes] = useState('');
  const [mobileSelectSlot, setMobileSelectSlot] = useState<string | null>(null);
  const [mobileSelectType, setMobileSelectType] = useState<'player' | 'role'>('player');
  
  // Undo/Redo history
  const [history, setHistory] = useState<HistoryState[]>([{ slots: createInitialSlots(), players: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const rosterRef = useRef<HTMLDivElement>(null);

  // Load saved rosters on mount
  useEffect(() => {
    if (user) {
      loadSavedRosters();
    }
  }, [user]);

  const loadSavedRosters = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('elencos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading rosters:', error);
      return;
    }
    
    setSavedRosters(data.map(r => ({
      id: r.id,
      nome: r.nome,
      coach: r.coach as unknown as PlayerSlot | null,
      titulares: r.titulares as unknown as PlayerSlot[],
      reservas: r.reservas as unknown as PlayerSlot[],
      created_at: r.created_at,
      logo_url: (r as Record<string, unknown>).logo_url as string | null,
      team_name: (r as Record<string, unknown>).team_name as string | null,
      notas: (r as Record<string, unknown>).notas as string | null,
    })));
  };

  const saveToHistory = (newSlots: PlayerSlot[], newPlayers: string[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ slots: [...newSlots], players: [...newPlayers] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSlots([...history[newIndex].slots]);
      setPlayers([...history[newIndex].players]);
      toast.success('Ação desfeita');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSlots([...history[newIndex].slots]);
      setPlayers([...history[newIndex].players]);
      toast.success('Ação refeita');
    }
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      toast.error('Digite um nome para o jogador');
      return;
    }
    if (players.includes(newPlayerName.trim().toUpperCase())) {
      toast.error('Jogador já existe');
      return;
    }
    const newPlayers = [...players, newPlayerName.trim().toUpperCase()];
    setPlayers(newPlayers);
    setNewPlayerName('');
    saveToHistory(slots, newPlayers);
    toast.success('Jogador adicionado!');
  };

  const handleRemovePlayer = (player: string) => {
    const newPlayers = players.filter(p => p !== player);
    const newSlots = slots.map(slot => 
      slot.name === player ? { ...slot, name: null } : slot
    );
    setPlayers(newPlayers);
    setSlots(newSlots);
    saveToHistory(newSlots, newPlayers);
  };

  const handlePlayerDragStart = (e: DragEvent, player: string) => {
    setDraggedPlayer(player);
    setDraggedRole(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRoleDragStart = (e: DragEvent, role: string) => {
    setDraggedRole(role);
    setDraggedPlayer(null);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: DragEvent, slotId: string) => {
    e.preventDefault();
    
    let newSlots = [...slots];
    
    if (draggedPlayer) {
      newSlots = newSlots.map(slot => 
        slot.id === slotId ? { ...slot, name: draggedPlayer } : slot
      );
      setDraggedPlayer(null);
    }
    
    if (draggedRole) {
      newSlots = newSlots.map(slot => 
        slot.id === slotId ? { ...slot, role: draggedRole } : slot
      );
      setDraggedRole(null);
    }
    
    setSlots(newSlots);
    saveToHistory(newSlots, players);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedRole ? 'copy' : 'move';
  };

  const clearSlot = (slotId: string, type: 'name' | 'role' | 'image' | 'both') => {
    const newSlots = slots.map(slot => {
      if (slot.id !== slotId) return slot;
      if (type === 'both') return { ...slot, name: null, role: null, imageUrl: null };
      if (type === 'name') return { ...slot, name: null };
      if (type === 'image') return { ...slot, imageUrl: null };
      return { ...slot, role: null };
    });
    setSlots(newSlots);
    saveToHistory(newSlots, players);
  };

  const resetAll = () => {
    const newSlots = createInitialSlots();
    setSlots(newSlots);
    setTeamLogo(null);
    setTeamName('');
    setRosterNotes('');
    saveToHistory(newSlots, players);
    toast.success('Elenco resetado!');
  };

  // Mobile tap to select player/role
  const handleMobileSelectPlayer = (slotId: string, playerName: string) => {
    const newSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, name: playerName } : slot
    );
    setSlots(newSlots);
    saveToHistory(newSlots, players);
    setMobileSelectSlot(null);
  };

  const handleMobileSelectRole = (slotId: string, roleName: string) => {
    const newSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, role: roleName } : slot
    );
    setSlots(newSlots);
    saveToHistory(newSlots, players);
    setMobileSelectSlot(null);
  };

  const openMobileSelect = (slotId: string, type: 'player' | 'role') => {
    setMobileSelectSlot(slotId);
    setMobileSelectType(type);
  };

  const handleTeamLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setTeamLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (slotId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlots = slots.map(slot =>
        slot.id === slotId ? { ...slot, imageUrl: reader.result as string } : slot
      );
      setSlots(newSlots);
      saveToHistory(newSlots, players);
    };
    reader.readAsDataURL(file);
  };

  const exportAsPNG = async () => {
    if (!rosterRef.current) return;
    
    try {
      toast.loading('Gerando imagem...');
      const canvas = await html2canvas(rosterRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'elenco.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.dismiss();
      toast.success('Imagem exportada!');
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao exportar imagem');
    }
  };

  const saveRoster = async () => {
    if (!user) {
      toast.error('Faça login para salvar elencos');
      return;
    }
    
    if (!rosterName.trim()) {
      toast.error('Digite um nome para o elenco');
      return;
    }
    
    setIsLoading(true);
    
    const coachSlot = slots.find(s => s.id === 'coach') || null;
    const titulares = slots.filter(s => s.id.startsWith('lineup'));
    const reservas = slots.filter(s => s.id.startsWith('reserva'));
    
    const { error } = await supabase.from('elencos').insert([{
      user_id: user.id,
      nome: rosterName.trim(),
      coach: JSON.parse(JSON.stringify(coachSlot)),
      titulares: JSON.parse(JSON.stringify(titulares)),
      reservas: JSON.parse(JSON.stringify(reservas)),
    }]);
    
    setIsLoading(false);
    
    if (error) {
      toast.error('Erro ao salvar elenco');
      console.error(error);
      return;
    }
    
    toast.success('Elenco salvo!');
    setRosterName('');
    setSaveDialogOpen(false);
    loadSavedRosters();
  };

  const loadRoster = (roster: SavedRoster) => {
    const newSlots = createInitialSlots();
    
    if (roster.coach) {
      const idx = newSlots.findIndex(s => s.id === 'coach');
      if (idx !== -1) newSlots[idx] = roster.coach;
    }
    
    roster.titulares.forEach(t => {
      const idx = newSlots.findIndex(s => s.id === t.id);
      if (idx !== -1) newSlots[idx] = t;
    });
    
    roster.reservas.forEach(r => {
      const idx = newSlots.findIndex(s => s.id === r.id);
      if (idx !== -1) newSlots[idx] = r;
    });
    
    setSlots(newSlots);
    setTeamLogo(roster.logo_url || null);
    setTeamName(roster.team_name || '');
    setRosterNotes(roster.notas || '');
    saveToHistory(newSlots, players);
    setLoadDialogOpen(false);
    toast.success(`Elenco "${roster.nome}" carregado!`);
  };

  const deleteRoster = async (id: string) => {
    const { error } = await supabase.from('elencos').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao deletar');
      return;
    }
    toast.success('Elenco deletado');
    loadSavedRosters();
  };

  const updateRosterName = async (id: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('Nome não pode estar vazio');
      return;
    }
    
    const { error } = await supabase.from('elencos').update({ nome: newName.trim() }).eq('id', id);
    if (error) {
      toast.error('Erro ao atualizar nome');
      return;
    }
    
    toast.success('Nome atualizado');
    setEditingRosterId(null);
    setEditingRosterName('');
    loadSavedRosters();
  };

  const getRoleTag = (roleName: string) => {
    return ROLE_TAGS.find(r => r.name === roleName);
  };

  const renderSlot = (slotId: string, label: string) => {
    const slot = slots.find(s => s.id === slotId);
    const roleTag = slot?.role ? getRoleTag(slot.role) : null;
    const inputId = `image-upload-${slotId}`;

    return (
      <Card
        className={`relative bg-card/30 border-dashed border-2 border-border/50 hover:border-primary/50 transition-all cursor-pointer ${isCardMode ? 'min-h-[180px]' : 'min-h-[120px]'}`}
        onDrop={(e) => handleDrop(e, slotId)}
        onDragOver={handleDragOver}
        onClick={() => {
          // Mobile: open player select on card tap (if no player assigned)
          if (!slot?.name && players.length > 0) {
            openMobileSelect(slotId, 'player');
          }
        }}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          {/* Role Badge - tap to select on mobile */}
          <div className="absolute top-2 right-2">
            {slot?.role ? (
              <span 
                className={`px-2 py-1 text-xs font-bold rounded border ${roleTag?.color} text-foreground cursor-pointer hover:opacity-80`}
                onClick={(e) => { e.stopPropagation(); clearSlot(slotId, 'role'); }}
              >
                {roleTag?.icon} {slot.role}
              </span>
            ) : (
              <span 
                className="px-2 py-1 text-xs text-muted-foreground border border-dashed border-border rounded cursor-pointer hover:border-primary/50"
                onClick={(e) => { e.stopPropagation(); openMobileSelect(slotId, 'role'); }}
              >
                FUNÇÃO
              </span>
            )}
          </div>

          {/* Image Upload Button */}
          <div className="absolute top-2 left-2">
            <label htmlFor={inputId} className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <div className="p-1 rounded bg-muted/50 hover:bg-muted transition-colors">
                <Image className="w-4 h-4 text-muted-foreground" />
              </div>
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(slotId, e)}
            />
          </div>

          {/* Player Image or Icon */}
          <div 
            className={`rounded-full bg-muted/50 flex items-center justify-center mb-2 overflow-hidden ${isCardMode ? 'w-20 h-20' : 'w-12 h-12'}`}
            onClick={(e) => { e.stopPropagation(); if (slot?.imageUrl) clearSlot(slotId, 'image'); }}
          >
            {slot?.imageUrl ? (
              <img src={slot.imageUrl} alt="Player" className="w-full h-full object-cover" />
            ) : (
              <User className={`text-muted-foreground ${isCardMode ? 'w-10 h-10' : 'w-6 h-6'}`} />
            )}
          </div>

          {/* Player Name */}
          {slot?.name ? (
            <div className="flex items-center gap-2">
              <span 
                className={`font-medium text-foreground ${isCardMode ? 'text-base' : 'text-sm'} cursor-pointer`}
                onClick={(e) => { e.stopPropagation(); openMobileSelect(slotId, 'player'); }}
              >
                {slot.name}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); clearSlot(slotId, 'name'); }}
                className="text-destructive/70 hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Add Player */}
            <Card className="glass-effect">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> ADICIONAR JOGADOR
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="NICKNAME"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                    className="bg-input/50"
                  />
                  <Button onClick={handleAddPlayer} size="icon" className="shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Player Bank */}
            <Card className="glass-effect">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">BANCO DE JOGADORES</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {players.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Adicione jogadores acima
                    </p>
                  ) : (
                    players.map((player) => (
                      <div
                        key={player}
                        draggable
                        onDragStart={(e) => handlePlayerDragStart(e, player)}
                        className="flex items-center gap-2 p-2 rounded bg-muted/50 border border-border/50 cursor-grab hover:border-primary/50 transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium flex-1">{player}</span>
                        <button
                          onClick={() => handleRemovePlayer(player)}
                          className="text-destructive/70 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role Tags */}
            <Card className="glass-effect">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">FUNÇÕES (ARRASTE)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_TAGS.map((role) => (
                    <div
                      key={role.id}
                      draggable
                      onDragStart={(e) => handleRoleDragStart(e, role.name)}
                      className={`flex items-center justify-center gap-1 p-2 rounded border cursor-grab hover:opacity-80 transition-opacity ${role.color}`}
                    >
                      <span className="text-xs">{role.icon}</span>
                      <span className="text-xs font-bold">{role.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Area */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-premium">MONTAR ELENCO</h1>
              <div className="flex flex-wrap gap-2">
                {/* Undo/Redo */}
                <Button variant="outline" size="icon" onClick={undo} disabled={historyIndex <= 0} title="Desfazer">
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} title="Refazer">
                  <Redo2 className="w-4 h-4" />
                </Button>
                
                {/* View Mode Toggle */}
                <Button variant="outline" size="icon" onClick={() => setIsCardMode(!isCardMode)} title={isCardMode ? "Modo Lista" : "Modo Card"}>
                  {isCardMode ? <LayoutList className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                </Button>
                
                {/* Export */}
                <Button variant="outline" onClick={exportAsPNG} className="gap-2">
                  <Download className="w-4 h-4" /> EXPORTAR PNG
                </Button>
                
                {/* Save */}
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2" disabled={!user}>
                      <Save className="w-4 h-4" /> SALVAR
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Salvar Elenco</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        placeholder="Nome do elenco"
                        value={rosterName}
                        onChange={(e) => setRosterName(e.target.value)}
                      />
                      <Input
                        placeholder="Nome do time (opcional)"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border border-dashed border-border">
                          {teamLogo ? (
                            <img src={teamLogo} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Shield className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label htmlFor="team-logo-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span><Image className="w-4 h-4 mr-2" /> Upload Logo</span>
                            </Button>
                          </label>
                          <input
                            id="team-logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleTeamLogoUpload}
                          />
                          {teamLogo && (
                            <Button variant="ghost" size="sm" onClick={() => setTeamLogo(null)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Remover
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button onClick={saveRoster} disabled={isLoading} className="w-full">
                        {isLoading ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Load */}
                <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2" disabled={!user}>
                      <FolderOpen className="w-4 h-4" /> CARREGAR
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Carregar Elenco</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pt-4">
                      {savedRosters.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">Nenhum elenco salvo</p>
                      ) : (
                        savedRosters.map((roster) => (
                          <div key={roster.id} className="flex items-center gap-3 p-3 rounded bg-muted/50 border border-border/50">
                            {roster.logo_url && (
                              <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                                <img src={roster.logo_url} alt="Logo" className="w-full h-full object-contain" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              {editingRosterId === roster.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={editingRosterName}
                                    onChange={(e) => setEditingRosterName(e.target.value)}
                                    className="h-8 text-sm"
                                    autoFocus
                                  />
                                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateRosterName(roster.id, editingRosterName)}>
                                    <Check className="w-4 h-4 text-green-500" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingRosterId(null); setEditingRosterName(''); }}>
                                    <X className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium truncate">{roster.nome}</p>
                                    <button 
                                      onClick={() => { setEditingRosterId(roster.id); setEditingRosterName(roster.nome); }}
                                      className="text-muted-foreground hover:text-foreground"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                  </div>
                                  {roster.team_name && (
                                    <p className="text-xs text-primary truncate">{roster.team_name}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(roster.created_at).toLocaleDateString('pt-BR')}
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button size="sm" onClick={() => loadRoster(roster)}>Carregar</Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteRoster(roster.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Reset */}
                <Button variant="outline" onClick={resetAll} className="gap-2">
                  <RotateCcw className="w-4 h-4" /> RESETAR
                </Button>
              </div>
            </div>

            {/* Roster Content */}
            <div ref={rosterRef} className="p-4 bg-background rounded-lg">
              {/* Team Header */}
              {(teamLogo || teamName) && (
                <div className="flex items-center justify-center gap-4 mb-6 pb-4 border-b border-border/30">
                  {teamLogo && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img src={teamLogo} alt="Team Logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                  {teamName && (
                    <h2 className="text-xl font-bold text-premium">{teamName}</h2>
                  )}
                </div>
              )}
              
              {/* Coach Section */}
              <div className="mb-8">
                <h2 className="text-xs font-semibold text-muted-foreground mb-3 text-center">COACH</h2>
                <div className="max-w-xs mx-auto">
                  {renderSlot('coach', 'ARRASTE NOME')}
                </div>
              </div>

              {/* Lineup Principal */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-primary mb-4 text-center">LINEUP PRINCIPAL</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {renderSlot('lineup1-1', 'ARRASTE NOME')}
                  {renderSlot('lineup1-2', 'ARRASTE NOME')}
                  {renderSlot('lineup1-3', 'ARRASTE NOME')}
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {renderSlot('lineup2-1', 'ARRASTE NOME')}
                  {renderSlot('lineup2-2', 'ARRASTE NOME')}
                </div>
              </div>

              {/* Opção 2 / Reservas */}
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-4 text-center">↓ OPÇÃO 2 / RESERVAS</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {renderSlot('reserva1-1', 'ARRASTE NOME')}
                  {renderSlot('reserva1-2', 'ARRASTE NOME')}
                  {renderSlot('reserva1-3', 'ARRASTE NOME')}
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {renderSlot('reserva2-1', 'ARRASTE NOME')}
                  {renderSlot('reserva2-2', 'ARRASTE NOME')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
