import { Button } from '@/components/ui/button';
import { MousePointer, Pencil, ArrowRight, Type, Eraser, Circle, CircleDashed, Move, Square, Minus } from 'lucide-react';

export type DrawToolType = 'select' | 'draw' | 'arrow' | 'text' | 'eraser' | 'circle' | 'circleOutline' | 'move' | 'rectangle' | 'straightLine';

interface DrawingToolsProps {
  activeTool: DrawToolType;
  onToolChange: (tool: DrawToolType) => void;
  drawColor: string;
  onColorChange: (color: string) => void;
  lineThickness: number;
  onLineThicknessChange: (thickness: number) => void;
  arrowStyle: 'simple' | 'filled' | 'double' | 'dashed';
  onArrowStyleChange: (style: 'simple' | 'filled' | 'double' | 'dashed') => void;
}

const drawColors = [
  { label: 'Branco', value: '#FFFFFF' },
  { label: 'Amarelo', value: '#FFD700' },
  { label: 'Vermelho', value: '#FF0000' },
  { label: 'Verde', value: '#00FF00' },
  { label: 'Azul', value: '#00BFFF' },
  { label: 'Preto', value: '#000000' },
];

export const DrawingTools = ({ 
  activeTool, 
  onToolChange, 
  drawColor, 
  onColorChange,
  lineThickness,
  onLineThicknessChange,
  arrowStyle,
  onArrowStyleChange
}: DrawingToolsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Ferramentas de Desenho</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeTool === 'select' ? 'default' : 'outline'}
            onClick={() => onToolChange('select')}
            className="w-full"
            size="sm"
          >
            <MousePointer className="h-4 w-4 mr-2" />
            Selecionar
          </Button>
          <Button
            variant={activeTool === 'move' ? 'default' : 'outline'}
            onClick={() => onToolChange('move')}
            className="w-full"
            size="sm"
          >
            <Move className="h-4 w-4 mr-2" />
            Mover
          </Button>
          <Button
            variant={activeTool === 'draw' ? 'default' : 'outline'}
            onClick={() => onToolChange('draw')}
            className="w-full"
            size="sm"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Linha
          </Button>
          <Button
            variant={activeTool === 'arrow' ? 'default' : 'outline'}
            onClick={() => onToolChange('arrow')}
            className="w-full"
            size="sm"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Seta
          </Button>
          <Button
            variant={activeTool === 'text' ? 'default' : 'outline'}
            onClick={() => onToolChange('text')}
            className="w-full"
            size="sm"
          >
            <Type className="h-4 w-4 mr-2" />
            Anotação
          </Button>
          <Button
            variant={activeTool === 'circle' ? 'default' : 'outline'}
            onClick={() => onToolChange('circle')}
            className="w-full"
            size="sm"
          >
            <Circle className="h-4 w-4 mr-2" />
            Círculo
          </Button>
          <Button
            variant={activeTool === 'circleOutline' ? 'default' : 'outline'}
            onClick={() => onToolChange('circleOutline')}
            className="w-full"
            size="sm"
          >
            <CircleDashed className="h-4 w-4 mr-2" />
            Círculo vazio
          </Button>
          <Button
            variant={activeTool === 'rectangle' ? 'default' : 'outline'}
            onClick={() => onToolChange('rectangle')}
            className="w-full"
            size="sm"
          >
            <Square className="h-4 w-4 mr-2" />
            Retângulo
          </Button>
          <Button
            variant={activeTool === 'straightLine' ? 'default' : 'outline'}
            onClick={() => onToolChange('straightLine')}
            className="w-full"
            size="sm"
          >
            <Minus className="h-4 w-4 mr-2" />
            Linha Reta
          </Button>
          <Button
            variant={activeTool === 'eraser' ? 'default' : 'outline'}
            onClick={() => onToolChange('eraser')}
            className="w-full"
            size="sm"
          >
            <Eraser className="h-4 w-4 mr-2" />
            Apagar
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Cor do Desenho</label>
        <div className="flex gap-2 flex-wrap">
          {drawColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                drawColor === color.value ? 'border-primary scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Espessura da Linha: {lineThickness}px
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={lineThickness}
          onChange={(e) => onLineThicknessChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Fina</span>
          <span>Grossa</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Estilo da Seta</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={arrowStyle === 'simple' ? 'default' : 'outline'}
            onClick={() => onArrowStyleChange('simple')}
            size="sm"
            className="w-full text-xs"
          >
            Simples →
          </Button>
          <Button
            variant={arrowStyle === 'filled' ? 'default' : 'outline'}
            onClick={() => onArrowStyleChange('filled')}
            size="sm"
            className="w-full text-xs"
          >
            Cheia ▶
          </Button>
          <Button
            variant={arrowStyle === 'double' ? 'default' : 'outline'}
            onClick={() => onArrowStyleChange('double')}
            size="sm"
            className="w-full text-xs"
          >
            Dupla ↔
          </Button>
          <Button
            variant={arrowStyle === 'dashed' ? 'default' : 'outline'}
            onClick={() => onArrowStyleChange('dashed')}
            size="sm"
            className="w-full text-xs"
          >
            Tracejada - -→
          </Button>
        </div>
      </div>
    </div>
  );
};
