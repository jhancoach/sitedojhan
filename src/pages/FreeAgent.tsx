import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Search, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FreeAgentProfile {
  id: string;
  nome_completo: string;
  foto_url: string;
  ano_nascimento: number;
  funcao: string;
  capitao: boolean;
  hud_dedos: string | null;
  instagram: string;
  youtube: string | null;
  referencias: string | null;
  habilidades: string | null;
  user_id: string;
}

const funcoes = ['Coach', 'Analista', 'Manager', 'Rush 1', 'Rush 2', 'Sniper', 'Granadeiro', 'Coringa'];

export default function FreeAgent() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'list'>('form');
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<FreeAgentProfile[]>([]);
  const [myProfile, setMyProfile] = useState<FreeAgentProfile | null>(null);
  const [filterFuncao, setFilterFuncao] = useState<string>('all');
  const [filterCapitao, setFilterCapitao] = useState<string>('all');

  const [formData, setFormData] = useState({
    nome_completo: '',
    foto_url: '',
    ano_nascimento: new Date().getFullYear() - 18,
    funcao: 'Rush 1',
    capitao: false,
    hud_dedos: '',
    instagram: '',
    youtube: '',
    referencias: '',
    habilidades: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfiles();
      loadMyProfile();
    }
  }, [user]);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('free_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Error loading profiles:', error);
    }
  };

  const loadMyProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('free_agents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setMyProfile(data);
        setFormData({
          nome_completo: data.nome_completo,
          foto_url: data.foto_url,
          ano_nascimento: data.ano_nascimento,
          funcao: data.funcao,
          capitao: data.capitao,
          hud_dedos: data.hud_dedos || '',
          instagram: data.instagram,
          youtube: data.youtube || '',
          referencias: data.referencias || '',
          habilidades: data.habilidades || '',
        });
      }
    } catch (error: any) {
      console.error('Error loading my profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        user_id: user.id,
        hud_dedos: formData.hud_dedos || null,
        youtube: formData.youtube || null,
        referencias: formData.referencias || null,
        habilidades: formData.habilidades || null,
      };

      if (myProfile) {
        const { error } = await supabase
          .from('free_agents')
          .update(payload)
          .eq('id', myProfile.id);

        if (error) throw error;
        toast({ title: 'Perfil atualizado!', description: 'Seu perfil foi atualizado com sucesso.' });
      } else {
        const { error } = await supabase
          .from('free_agents')
          .insert([payload]);

        if (error) throw error;
        toast({ title: 'Perfil criado!', description: 'Seu perfil foi criado com sucesso.' });
      }

      await loadMyProfile();
      await loadProfiles();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, foto_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const funcaoMatch = filterFuncao === 'all' || profile.funcao === filterFuncao;
    const capitaoMatch = filterCapitao === 'all' || 
      (filterCapitao === 'sim' && profile.capitao) ||
      (filterCapitao === 'nao' && !profile.capitao);
    return funcaoMatch && capitaoMatch;
  });

  const stats = {
    total: filteredProfiles.length,
    byFuncao: funcoes.reduce((acc, f) => {
      acc[f] = profiles.filter(p => p.funcao === f).length;
      return acc;
    }, {} as Record<string, number>),
    capitaes: profiles.filter(p => p.capitao).length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-fire bg-clip-text text-transparent">
          Free Agent
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setView('form')}
            variant={view === 'form' ? 'default' : 'outline'}
          >
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </Button>
          <Button
            onClick={() => setView('list')}
            variant={view === 'list' ? 'default' : 'outline'}
          >
            <Search className="mr-2 h-4 w-4" />
            Ver Perfis ({profiles.length})
          </Button>
        </div>

        {view === 'form' ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>
                {myProfile ? 'Editar Meu Perfil' : 'Criar Perfil Free Agent'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="nome_completo">Nome e Sobrenome *</Label>
                  <Input
                    id="nome_completo"
                    required
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="foto">Foto *</Label>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    required={!myProfile}
                    onChange={handlePhotoUpload}
                  />
                  {formData.foto_url && (
                    <img src={formData.foto_url} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
                  )}
                </div>

                <div>
                  <Label htmlFor="ano">Nascido em que ano? *</Label>
                  <Input
                    id="ano"
                    type="number"
                    required
                    min="1980"
                    max={new Date().getFullYear()}
                    value={formData.ano_nascimento}
                    onChange={(e) => setFormData({ ...formData, ano_nascimento: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Função *</Label>
                  <RadioGroup
                    value={formData.funcao}
                    onValueChange={(value) => setFormData({ ...formData, funcao: value })}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {funcoes.map((f) => (
                      <div key={f} className="flex items-center space-x-2">
                        <RadioGroupItem value={f} id={f} />
                        <Label htmlFor={f}>{f}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Capitão *</Label>
                  <RadioGroup
                    value={formData.capitao ? 'sim' : 'nao'}
                    onValueChange={(value) => setFormData({ ...formData, capitao: value === 'sim' })}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="cap-sim" />
                      <Label htmlFor="cap-sim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="cap-nao" />
                      <Label htmlFor="cap-nao">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="hud">HUD de Quantos Dedos?</Label>
                  <Input
                    id="hud"
                    value={formData.hud_dedos}
                    onChange={(e) => setFormData({ ...formData, hud_dedos: e.target.value })}
                    placeholder="Ex: 4 dedos"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Link Instagram *</Label>
                  <Input
                    id="instagram"
                    required
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="youtube">Link do Youtube</Label>
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="https://youtube.com/@..."
                  />
                </div>

                <div>
                  <Label htmlFor="referencias">Referências no cenário</Label>
                  <Textarea
                    id="referencias"
                    value={formData.referencias}
                    onChange={(e) => setFormData({ ...formData, referencias: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="habilidades">Descreva suas Habilidades</Label>
                  <Textarea
                    id="habilidades"
                    value={formData.habilidades}
                    onChange={(e) => setFormData({ ...formData, habilidades: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {myProfile ? 'Atualizar Perfil' : 'Criar Perfil'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div>
            {/* Filters */}
            <div className="mb-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={filterFuncao} onValueChange={setFilterFuncao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Funções</SelectItem>
                    {funcoes.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f} ({stats.byFuncao[f]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCapitao} onValueChange={setFilterCapitao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por capitão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="sim">Apenas Capitães ({stats.capitaes})</SelectItem>
                    <SelectItem value="nao">Não Capitães ({profiles.length - stats.capitaes})</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-center">
                  <p className="text-sm font-semibold">
                    Mostrando: <span className="text-primary">{stats.total}</span> perfis
                  </p>
                </div>
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-glow-orange transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={profile.foto_url}
                        alt={profile.nome_completo}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{profile.nome_completo}</h3>
                        <p className="text-sm text-muted-foreground">{profile.ano_nascimento}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Função:</span> {profile.funcao}</p>
                      <p><span className="font-semibold">Capitão:</span> {profile.capitao ? 'Sim' : 'Não'}</p>
                      {profile.hud_dedos && (
                        <p><span className="font-semibold">HUD:</span> {profile.hud_dedos}</p>
                      )}
                      {profile.habilidades && (
                        <p><span className="font-semibold">Habilidades:</span> {profile.habilidades}</p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      {profile.instagram && (
                        <Button size="sm" variant="outline" onClick={() => window.open(profile.instagram, '_blank')}>
                          Instagram
                        </Button>
                      )}
                      {profile.youtube && (
                        <Button size="sm" variant="outline" onClick={() => window.open(profile.youtube, '_blank')}>
                          YouTube
                        </Button>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => window.print()}
                    >
                      <Printer className="mr-2 h-3 w-3" />
                      Imprimir Currículo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProfiles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum perfil encontrado com os filtros selecionados</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
