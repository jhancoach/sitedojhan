import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHasRole } from '@/hooks/useHasRole';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeedbackMessage {
  id: string;
  nome: string;
  email: string;
  tipo: 'duvida' | 'sugestao' | 'comentario';
  mensagem: string;
  created_at: string;
}

export default function FeedbackAdmin() {
  const { t } = useLanguage();
  const { hasRole, loading: roleLoading } = useHasRole('admin');
  const navigate = useNavigate();
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !hasRole) {
      navigate('/feedback');
    }
  }, [hasRole, roleLoading, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages((data || []) as FeedbackMessage[]);
      }
      setLoading(false);
    };

    if (hasRole) {
      fetchMessages();
    }
  }, [hasRole]);

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      duvida: t('feedback.doubt'),
      sugestao: t('feedback.suggestion'),
      comentario: t('feedback.comment'),
    };
    return labels[tipo] || tipo;
  };

  const getTipoBadgeVariant = (tipo: string): "default" | "secondary" | "destructive" => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      duvida: 'default',
      sugestao: 'secondary',
      comentario: 'destructive',
    };
    return variants[tipo] || 'default';
  };

  if (roleLoading || !hasRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('feedback.adminMessages')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('feedback.noMessages')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('feedback.name')}</TableHead>
                      <TableHead>{t('feedback.email')}</TableHead>
                      <TableHead>{t('feedback.type')}</TableHead>
                      <TableHead>{t('feedback.message')}</TableHead>
                      <TableHead>{t('feedback.createdAt')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.nome}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>
                          <Badge variant={getTipoBadgeVariant(message.tipo)}>
                            {getTipoLabel(message.tipo)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="truncate">{message.mensagem}</p>
                        </TableCell>
                        <TableCell>
                          {new Date(message.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
