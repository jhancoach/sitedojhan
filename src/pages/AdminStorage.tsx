import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useHasRole } from '@/hooks/useHasRole';

type BucketType = 'safes' | 'aerial-views' | 'maps';

interface UploadedFile {
  name: string;
  url: string;
  bucket: BucketType;
}

export default function AdminStorage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasRole, loading: roleLoading } = useHasRole('admin');
  const [selectedBucket, setSelectedBucket] = useState<BucketType>('safes');
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!roleLoading && !hasRole) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar esta página.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
    
    if (!roleLoading && hasRole) {
      loadFiles();
    }
  }, [user, hasRole, roleLoading, navigate, selectedBucket]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .list();

      if (error) throw error;

      const filesWithUrls = data.map((file) => {
        const { data: urlData } = supabase.storage
          .from(selectedBucket)
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: urlData.publicUrl,
          bucket: selectedBucket,
        };
      });

      setFiles(filesWithUrls);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar arquivos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error } = await supabase.storage
          .from(selectedBucket)
          .upload(fileName, file);

        if (error) throw error;
      }

      toast({
        title: 'Upload realizado!',
        description: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso.`,
      });

      loadFiles();
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${fileName}?`)) return;

    try {
      const { error } = await supabase.storage
        .from(selectedBucket)
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: 'Arquivo deletado!',
        description: 'O arquivo foi removido com sucesso.',
      });

      loadFiles();
    } catch (error: any) {
      toast({
        title: 'Erro ao deletar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL copiada!',
      description: 'A URL foi copiada para a área de transferência.',
    });
  };

  if (!user || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasRole) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-fire bg-clip-text text-transparent">
          Gerenciar Storage
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Faça upload e gerencie imagens do site
        </p>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload de Imagens</CardTitle>
              <CardDescription>
                Envie imagens para os diferentes buckets do storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bucket">Selecione o bucket</Label>
                <Select
                  value={selectedBucket}
                  onValueChange={(value) => setSelectedBucket(value as BucketType)}
                >
                  <SelectTrigger id="bucket">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safes">Safes (Cofres)</SelectItem>
                    <SelectItem value="aerial-views">Visões Aéreas</SelectItem>
                    <SelectItem value="maps">Mapas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">Selecione as imagens</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </div>

              {uploading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando arquivos...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Arquivos no bucket: {selectedBucket}</CardTitle>
              <CardDescription>
                Clique na URL para copiar. Limite de 5MB por arquivo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum arquivo neste bucket</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="border rounded-lg p-4 space-y-2 hover:shadow-glow-orange transition-all"
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded"
                      />
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => copyToClipboard(file.url)}
                        >
                          Copiar URL
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(file.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
