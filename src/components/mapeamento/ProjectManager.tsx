import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Project {
  id: string;
  nome: string;
  mapa_nome: string;
  created_at: string;
}

interface ProjectManagerProps {
  onSave: (name: string) => void;
  onLoad: (projectId: string) => void;
  canSave: boolean;
}

export const ProjectManager = ({ onSave, onLoad, canSave }: ProjectManagerProps) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mapeamento_projetos')
        .select('id, nome, mapa_nome, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProjects();
    }
  }, [open, user]);

  const handleSave = () => {
    if (!projectName.trim()) {
      toast.error('Digite um nome para o projeto');
      return;
    }
    onSave(projectName.trim());
    setProjectName('');
  };

  const handleDelete = async (projectId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mapeamento_projetos')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Projeto excluído');
      fetchProjects();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir projeto');
    }
  };

  if (!user) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Faça login para salvar projetos
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Nome do projeto"
          disabled={!canSave}
        />
        <Button
          onClick={handleSave}
          className="w-full"
          variant="default"
          disabled={!canSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Projeto
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <FolderOpen className="h-4 w-4 mr-2" />
            Carregar Projeto
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Seus Projetos</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Carregando...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum projeto salvo
              </div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{project.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.mapa_nome}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          onLoad(project.id);
                          setOpen(false);
                        }}
                      >
                        Carregar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
