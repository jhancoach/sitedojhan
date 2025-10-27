import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

// Schemas de validação
const signUpSchema = z.object({
  apelido: z.string()
    .trim()
    .min(3, 'Usuário deve ter no mínimo 3 caracteres')
    .max(30, 'Usuário deve ter no máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Usuário deve conter apenas letras, números e underscore'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  nick: z.string()
    .trim()
    .min(3, 'Nick no jogo deve ter no mínimo 3 caracteres')
    .max(50, 'Nick no jogo deve ter no máximo 50 caracteres'),
  funcao_ff: z.string()
    .trim()
    .min(1, 'Função é obrigatória')
    .max(50, 'Função deve ter no máximo 50 caracteres'),
  instagram: z.string()
    .trim()
    .max(100, 'Instagram deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
});

const signInSchema = z.object({
  username: z.string()
    .trim()
    .min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  password: z.string()
    .min(1, 'Senha é obrigatória'),
});

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Sign Up Form
  const [signUpData, setSignUpData] = useState({
    password: '',
    nick: '',
    apelido: '',
    funcao_ff: '',
    instagram: '',
  });

  // Sign In Form
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar dados do formulário
      const validatedData = signUpSchema.parse(signUpData);

      // Gera email interno baseado no username
      const internalEmail = `${validatedData.apelido.toLowerCase().replace(/\s+/g, '')}@jhanmedeiros.app`;

      const { error } = await supabase.auth.signUp({
        email: internalEmail,
        password: validatedData.password,
        options: {
          data: {
            nick: validatedData.nick,
            apelido: validatedData.apelido,
            funcao_ff: validatedData.funcao_ff,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        // Mensagem genérica para não revelar se usuário existe
        throw new Error('Erro ao criar conta. Verifique os dados e tente novamente.');
      }

      toast({
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer login.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      // Tratar erros de validação do zod
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Dados inválidos',
          description: firstError.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro no cadastro',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar dados do formulário
      const validatedData = signInSchema.parse(signInData);

      // Gera email interno baseado no username
      const internalEmail = `${validatedData.username.toLowerCase().replace(/\s+/g, '')}@jhanmedeiros.app`;

      const { error } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: validatedData.password,
      });

      if (error) {
        // Mensagem genérica para não revelar se usuário existe
        throw new Error('Credenciais inválidas. Verifique usuário e senha.');
      }

      navigate('/dashboard');
    } catch (error: any) {
      // Tratar erros de validação do zod
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Dados inválidos',
          description: firstError.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro no login',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dark">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="https://i.ibb.co/mCS1fCxY/Whats-App-Image-2025-10-26-at-08-14-03.jpg" 
            alt="Logo" 
            className="h-24 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-2xl bg-gradient-fire bg-clip-text text-transparent">
            Bem Vindo ao Site do Jhan
          </CardTitle>
          <CardDescription className="text-center italic mt-4">
            "Não a nós, Senhor, mas ao teu nome dá glória"
            <br />
            <span className="font-semibold">- Salmo 115:1</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-username">Usuário</Label>
                  <Input
                    id="signin-username"
                    type="text"
                    required
                    value={signInData.username}
                    onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Senha</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    required
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="nick">Nick no Jogo *</Label>
                  <Input
                    id="nick"
                    placeholder="Seu nick no Free Fire"
                    required
                    value={signUpData.nick}
                    onChange={(e) => setSignUpData({ ...signUpData, nick: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="apelido">Usuário *</Label>
                  <Input
                    id="apelido"
                    required
                    value={signUpData.apelido}
                    onChange={(e) => setSignUpData({ ...signUpData, apelido: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="funcao_ff">Função no Free Fire *</Label>
                  <Input
                    id="funcao_ff"
                    placeholder="Ex: Analista"
                    required
                    value={signUpData.funcao_ff}
                    onChange={(e) => setSignUpData({ ...signUpData, funcao_ff: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@usuario"
                    value={signUpData.instagram}
                    onChange={(e) => setSignUpData({ ...signUpData, instagram: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cadastrar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
