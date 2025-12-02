import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FormationTemplate {
  name: string;
  positions: Array<{ x: number; y: number; label: string }>;
}

const formations: FormationTemplate[] = [
  {
    name: '4-1 (Clássico)',
    positions: [
      { x: 50, y: 80, label: 'Camper' },
      { x: 30, y: 50, label: 'Suporte 1' },
      { x: 70, y: 50, label: 'Suporte 2' },
      { x: 30, y: 20, label: 'Rusher 1' },
      { x: 70, y: 20, label: 'Rusher 2' },
    ],
  },
  {
    name: '3-2 (Agressivo)',
    positions: [
      { x: 50, y: 70, label: 'Camper' },
      { x: 50, y: 50, label: 'Suporte' },
      { x: 25, y: 25, label: 'Rusher 1' },
      { x: 50, y: 15, label: 'Rusher 2' },
      { x: 75, y: 25, label: 'Rusher 3' },
    ],
  },
  {
    name: '2-3 (Defensivo)',
    positions: [
      { x: 35, y: 75, label: 'Camper 1' },
      { x: 65, y: 75, label: 'Camper 2' },
      { x: 50, y: 50, label: 'Suporte' },
      { x: 35, y: 25, label: 'Rusher 1' },
      { x: 65, y: 25, label: 'Rusher 2' },
    ],
  },
  {
    name: '1-4 (Ultra Agressivo)',
    positions: [
      { x: 50, y: 80, label: 'Camper' },
      { x: 20, y: 20, label: 'Rusher 1' },
      { x: 40, y: 15, label: 'Rusher 2' },
      { x: 60, y: 15, label: 'Rusher 3' },
      { x: 80, y: 20, label: 'Rusher 4' },
    ],
  },
];

interface FormationTemplatesProps {
  onApplyTemplate: (template: FormationTemplate) => void;
}

export const FormationTemplates = ({ onApplyTemplate }: FormationTemplatesProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium mb-2 block">Templates de Formação</label>
      <div className="grid grid-cols-1 gap-2">
        {formations.map((formation) => (
          <Card
            key={formation.name}
            className="p-3 hover:border-primary cursor-pointer transition-colors"
            onClick={() => onApplyTemplate(formation)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{formation.name}</span>
              <Button size="sm" variant="ghost">
                Aplicar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export type { FormationTemplate };
