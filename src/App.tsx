import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Sobre from "./pages/Sobre";
import FreeAgent from "./pages/FreeAgent";
import Mapas from "./pages/Mapas";
import Pets from "./pages/Pets";
import Personagens from "./pages/Personagens";
import Composicao from "./pages/Composicao";
import VisoesAereas from "./pages/VisoesAereas";
import Safes from "./pages/Safes";
import PicksBans from "./pages/PicksBans";
import Estatisticas from "./pages/Estatisticas";
import Feedback from "./pages/Feedback";
import FeedbackAdmin from "./pages/FeedbackAdmin";
import Carregamentos from "./pages/Carregamentos";
import AdminStorage from "./pages/AdminStorage";
import SorteioMapas from "./pages/SorteioMapas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/free-agent" element={<FreeAgent />} />
                <Route path="/mapas" element={<Mapas />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/personagens" element={<Personagens />} />
                <Route path="/composicao" element={<Composicao />} />
                <Route path="/visoes-aereas" element={<VisoesAereas />} />
                <Route path="/safes" element={<Safes />} />
                <Route path="/picks-bans" element={<PicksBans />} />
                <Route path="/estatisticas" element={<Estatisticas />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/feedback-admin" element={<FeedbackAdmin />} />
                <Route path="/carregamentos" element={<Carregamentos />} />
                <Route path="/sorteio-mapas" element={<SorteioMapas />} />
                <Route path="/admin/storage" element={<AdminStorage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
