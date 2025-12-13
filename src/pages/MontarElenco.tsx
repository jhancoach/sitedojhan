import { useState, DragEvent } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, User, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerSlot {
  id: string;
  name: string | null;
  role: string | null;
}

interface RoleTag {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const ROLE_TAGS: RoleTag[] = [
  { id: 'rush1', name: 'RUSH 1', color: 'bg-red-500/80 border-red-400', icon: '◉' },
  { id: 'rush2', name: 'RUSH 2', color: 'bg-red-500/80 border-red-400', icon: '◉' },
  { id: 'cpt', name: 'CPT', color: 'bg-yellow-500/80 border-yellow-400', icon: '👑' },
  { id: 'bomba', name: 'BOMBA', color: 'bg-orange-500/80 border-orange-400', icon: '💣' },
  { id: 'sniper', name: 'SNIPER', color: 'bg-blue-500/80 border-blue-400', icon: '🎯' },
  { id: 'coach', name: 'COACH', color: 'bg-purple-500/80 border-purple-400', icon: '📋' },
];

const initialSlots: PlayerSlot[] = [
  // Coach
  { id: 'coach', name: null, role: null },
  // Lineup Principal - Row 1 (3 players)
  { id: 'lineup1-1', name: null, role: null },
  { id: 'lineup1-2', name: null, role: null },
  { id: 'lineup1-3', name: null, role: null },
  // Lineup Principal - Row 2 (2 players)
  { id: 'lineup2-1', name: null, role: null },
  { id: 'lineup2-2', name: null, role: null },
  // Reservas - Row 1 (3 players)
  { id: 'reserva1-1', name: null, role: null },
  { id: 'reserva1-2', name: null, role: null },
  { id: 'reserva1-3', name: null, role: null },
  // Reservas - Row 2 (2 players)
  { id: 'reserva2-1', name: null, role: null },
  { id: 'reserva2-2', name: null, role: null },
];

export default function MontarElenco() {
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [slots, setSlots] = useState<PlayerSlot[]>(initialSlots);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [draggedRole, setDraggedRole] = useState<string | null>(null);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      toast.error('Digite um nome para o jogador');
      return;
    }
    if (players.includes(newPlayerName.trim().toUpperCase())) {
      toast.error('Jogador já existe');
      return;
    }
    setPlayers([...players, newPlayerName.trim().toUpperCase()]);
    setNewPlayerName('');
    toast.success('Jogador adicionado!');
  };

  const handleRemovePlayer = (player: string) => {
    setPlayers(players.filter(p => p !== player));
    // Also remove from any slot
    setSlots(slots.map(slot => 
      slot.name === player ? { ...slot, name: null } : slot
    ));
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
    
    if (draggedPlayer) {
      setSlots(slots.map(slot => 
        slot.id === slotId ? { ...slot, name: draggedPlayer } : slot
      ));
      setDraggedPlayer(null);
    }
    
    if (draggedRole) {
      setSlots(slots.map(slot => 
        slot.id === slotId ? { ...slot, role: draggedRole } : slot
      ));
      setDraggedRole(null);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedRole ? 'copy' : 'move';
  };

  const clearSlot = (slotId: string, type: 'name' | 'role' | 'both') => {
    setSlots(slots.map(slot => {
      if (slot.id !== slotId) return slot;
      if (type === 'both') return { ...slot, name: null, role: null };
      if (type === 'name') return { ...slot, name: null };
      return { ...slot, role: null };
    }));
  };

  const resetAll = () => {
    setSlots(initialSlots);
    toast.success('Elenco resetado!');
  };

  const getRoleTag = (roleName: string) => {
    return ROLE_TAGS.find(r => r.name === roleName);
  };

  const renderSlot = (slotId: string, label: string) => {
    const slot = slots.find(s => s.id === slotId);
    const roleTag = slot?.role ? getRoleTag(slot.role) : null;

    return (
      <Card
        className="relative bg-card/30 border-dashed border-2 border-border/50 hover:border-primary/50 transition-all cursor-pointer min-h-[120px]"
        onDrop={(e) => handleDrop(e, slotId)}
        onDragOver={handleDragOver}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          {/* Role Badge */}
          <div className="absolute top-2 right-2">
            {slot?.role ? (
              <span 
                className={`px-2 py-1 text-xs font-bold rounded border ${roleTag?.color} text-foreground cursor-pointer hover:opacity-80`}
                onClick={() => clearSlot(slotId, 'role')}
              >
                {roleTag?.icon} {slot.role}
              </span>
            ) : (
              <span className="px-2 py-1 text-xs text-muted-foreground border border-dashed border-border rounded">
                FUNÇÃO
              </span>
            )}
          </div>

          {/* Player Icon */}
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Player Name */}
          {slot?.name ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{slot.name}</span>
              <button 
                onClick={() => clearSlot(slotId, 'name')}
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-premium">MONTAR ELENCO</h1>
              <Button variant="outline" onClick={resetAll} className="gap-2">
                <RotateCcw className="w-4 h-4" /> RESETAR
              </Button>
            </div>

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
      </main>

      <Footer />
    </div>
  );
}
