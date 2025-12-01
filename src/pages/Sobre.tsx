import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Sobre() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-fire bg-clip-text text-transparent">
            {t('about.title')}
          </h1>
          
          <blockquote className="text-xl italic text-center border-l-4 border-primary pl-4 my-8">
            "{t('about.quote')}"
          </blockquote>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg" dangerouslySetInnerHTML={{ __html: t('about.intro') }} />

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.education')}</h2>
            <ul>
              <li>FORMAÇÃO EM ANÁLISE DE DADOS - CFAD – XPERIUN</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.teams')}</h2>
            <ul>
              <li>ANALISTA DE DESEMPENHO DE DADOS COLETIVOS E INDIVIDUAIS E DE MAPA - ALFA 34 2024</li>
              <li>ANALISTA DE DESEMPENHO DE DADOS COLETIVOS E INDIVIDUAIS E DE MAPA - E1 (LBFF) - 2023/2024</li>
              <li>ANALISTA DE DESEMPENHO DE DADOS GERAIS MUNDIAL 2023 - FURIOUS GAMING - SETEMBRO A NOVEMBRO DE 2023</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.championships')}</h2>
            <ul>
              <li>FINALISTA E TOP 4 COMISSÃO TÉCNICA LBFF 2023 (E1 ESPORTS)</li>
              <li>TOP 2 COPA FF – 2024 (E1 ESPORTS)</li>
              <li>TOP 3 COPA NOBRU – 2024 (E1 ESPORTS)</li>
              <li>FINALISTA LBFF 2023, WB 2024, WB 2024 SPLIT 1 E 2</li>
              <li>TOP 2 DA FASE CLASSIFICATÓRIA WB 2025</li>
              <li>TOP 2 DA FINAL SPLIT 2 WB 2025</li>
              <li>TOP 5 MUNDIAL 2025 (TEAM SOLID)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.workDescription')}</h2>
            <ul>
              <li>Análise de Desempenho Coletivo e Individual durante os splits</li>
              <li>Análise de Mapa</li>
              <li>Análise de Desempenho Geral dos times</li>
              <li>Prospecção e projeção para futuras contratações para os próximos splits</li>
              <li>Coleta e recolhimento de dados diários de desempenho dos jogadores nos campeonatos</li>
              <li>Criação de Plataformas e acessibilidades de visualização e estudos</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.mission')}, {t('about.vision')} e {t('about.values')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary">{t('about.mission')}</h3>
                <p>{t('about.missionText')}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">{t('about.vision')}</h3>
                <p>{t('about.visionText')}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">{t('about.values')}</h3>
                <p>{t('about.valuesText')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
