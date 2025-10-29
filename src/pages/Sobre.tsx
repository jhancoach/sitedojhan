import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-fire bg-clip-text text-transparent">
            Sobre Jhan Medeiros
          </h1>
          
          <blockquote className="text-xl italic text-center border-l-4 border-primary pl-4 my-8">
            "Os dados nos mostram claramente as áreas em que precisamos focar para melhorar."
          </blockquote>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg">
              Olá meu nome é <strong>Jansey Medeiros</strong> mais conhecido como <strong>Jhan</strong>, 
              sou analista de dados e mapas e atualmente faço parte da <strong>Team Solid</strong> como Analista de Free Fire.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Formação</h2>
            <ul>
              <li>FORMAÇÃO EM ANÁLISE DE DADOS - CFAD – XPERIUN</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Times Que já Trabalhei</h2>
            <ul>
              <li>ANALISTA DE DESEMPENHO DE DADOS COLETIVOS E INDIVIDUAIS E DE MAPA - ALFA 34 2024</li>
              <li>ANALISTA DE DESEMPENHO DE DADOS COLETIVOS E INDIVIDUAIS E DE MAPA - E1 (LBFF) - 2023/2024</li>
              <li>ANALISTA DE DESEMPENHO DE DADOS GERAIS MUNDIAL 2023 - FURIOUS GAMING - SETEMBRO A NOVEMBRO DE 2023</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Campeonatos</h2>
            <ul>
              <li>FINALISTA E TOP 4 COMISSÃO TÉCNICA LBFF 2023 (E1 ESPORTS)</li>
              <li>TOP 2 COPA FF – 2024 (E1 ESPORTS)</li>
              <li>TOP 3 COPA NOBRU – 2024 (E1 ESPORTS)</li>
              <li>FINALISTA LBFF 2023, WB 2024, WB 2024 SPLIT 1 E 2</li>
              <li>TOP 2 DA FASE CLASSIFICATÓRIA WB 2025</li>
              <li>TOP 2 DA FINAL SPLIT 2 WB 2025</li>
              <li>MUNDIAL 2025 EM ANDAMENTO (TEAM SOLID)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Descritivo de Trabalho</h2>
            <ul>
              <li>Análise de Desempenho Coletivo e Individual durante os splits</li>
              <li>Análise de Mapa</li>
              <li>Análise de Desempenho Geral dos times</li>
              <li>Prospecção e projeção para futuras contratações para os próximos splits</li>
              <li>Coleta e recolhimento de dados diários de desempenho dos jogadores nos campeonatos</li>
              <li>Criação de Plataformas e acessibilidades de visualização e estudos</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Missão, Visão e Valores</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary">Missão</h3>
                <p>Tocar vidas através da minha vida com Cristo</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Visão</h3>
                <p>Inspirar as pessoas a serem suas melhores versões não apenas no jogo mas como na vida.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">Valores</h3>
                <p>Agir com transparência, honestidade, fazer sempre o que é certo.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
