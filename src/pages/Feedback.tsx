import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHasRole } from '@/hooks/useHasRole';
import { useNavigate } from 'react-router-dom';

const feedbackSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(255, 'Email muito longo'),
  tipo: z.enum(['duvida', 'sugestao', 'comentario'], {
    required_error: 'Selecione um tipo',
  }),
  mensagem: z
    .string()
    .min(10, 'Mensagem deve ter no mínimo 10 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { hasRole } = useHasRole('admin');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const tipoValue = watch('tipo');

  const onSubmit = async (data: FeedbackFormData) => {
    // Client-side rate limiting - prevent spam submissions
    const RATE_LIMIT_KEY = 'lastFeedbackSubmit';
    const RATE_LIMIT_MS = 60000; // 1 minute between submissions
    
    const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < RATE_LIMIT_MS) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (Date.now() - parseInt(lastSubmit))) / 1000);
      toast.error('Aguarde um momento', {
        description: `Por favor, aguarde ${remainingSeconds} segundos antes de enviar outra mensagem.`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('feedback').insert([
        {
          nome: data.nome.trim(),
          email: data.email.trim().toLowerCase(),
          tipo: data.tipo,
          mensagem: data.mensagem.trim(),
        },
      ]);

      if (error) throw error;

      // Store submission timestamp for rate limiting
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

      toast.success('Mensagem enviada com sucesso!', {
        description: 'Obrigado pelo seu feedback. Em breve entraremos em contato.',
      });

      reset();
    } catch {
      // Error logged server-side - show generic message to user
      toast.error('Erro ao enviar mensagem', {
        description: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      duvida: 'Dúvida',
      sugestao: 'Sugestão',
      comentario: 'Comentário',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <MessageSquare className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('feedback.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('feedback.description')}
            </p>
          </div>

          {hasRole && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/feedback-admin')}
              >
                {t('feedback.viewMessages')}
              </Button>
            </div>
          )}

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>{t('feedback.sendMessage')}</CardTitle>
              <CardDescription>
                {t('feedback.formDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Digite seu nome"
                    {...register('nome')}
                    className="bg-background border-input"
                  />
                  {errors.nome && (
                    <p className="text-sm text-destructive">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    className="bg-background border-input"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Mensagem *</Label>
                  <Select
                    value={tipoValue}
                    onValueChange={(value) =>
                      setValue('tipo', value as 'duvida' | 'sugestao' | 'comentario')
                    }
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="duvida">Dúvida</SelectItem>
                      <SelectItem value="sugestao">Sugestão</SelectItem>
                      <SelectItem value="comentario">Comentário</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className="text-sm text-destructive">{errors.tipo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem *</Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Digite sua mensagem aqui..."
                    rows={6}
                    {...register('mensagem')}
                    className="bg-background border-input resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      {errors.mensagem && (
                        <p className="text-sm text-destructive">{errors.mensagem.message}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {watch('mensagem')?.length || 0}/1000 caracteres
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Outras formas de contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                📧 Você também pode entrar em contato através das nossas redes sociais disponíveis
                no menu.
              </p>
              <p>⏱️ Tempo de resposta: Geralmente respondemos em até 24-48 horas.</p>
              <p>
                💡 Dica: Seja o mais detalhado possível em sua mensagem para que possamos ajudá-lo
                melhor!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
