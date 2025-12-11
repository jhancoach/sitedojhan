import { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Download, Printer, Share2, Plus, Copy, Trash2, Pencil, Check, ZoomIn, ZoomOut, FileText, Image as ImageIcon, Undo, Redo, Eye, FolderSync, Move, Archive } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DrawingTools } from '@/components/mapeamento/DrawingTools';
import { ProjectManager } from '@/components/mapeamento/ProjectManager';

interface MapData {
  name: string;
  url: string;
}

interface NameItem {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  logo?: string;
  type: 'text' | 'logo';
}

interface DrawingElement {
  id: string;
  type: 'line' | 'arrow' | 'circle' | 'circleOutline' | 'text' | 'rectangle' | 'straightLine';
  color: string;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  radius?: number;
  text?: string;
  width?: number;
  height?: number;
  arrowStyle?: 'simple' | 'filled' | 'double' | 'dashed';
}

const maps: MapData[] = [
  { name: 'Purgatório', url: 'https://i.ibb.co/JR6RxXdZ/PURGAT-RIO.jpg' },
  { name: 'Solara', url: 'https://i.ibb.co/nMzg9Qbs/SOLARA.jpg' },
  { name: 'Nova Terra', url: 'https://i.ibb.co/bgrHzY8R/NOVA-TERRA.jpg' },
  { name: 'Kalahari', url: 'https://i.ibb.co/Mxtfgvm0/KALAHARI.jpg' },
  { name: 'Bermuda', url: 'https://i.ibb.co/zVZRhrzW/BERMUDA.jpg' },
  { name: 'Alpine', url: 'https://i.ibb.co/M5SKjzyg/ALPINE.jpg' },
];

const textColors = [
  { label: 'Branco', value: '#FFFFFF' },
  { label: 'Amarelo', value: '#FFD700' },
  { label: 'Vermelho', value: '#FF0000' },
  { label: 'Verde', value: '#00FF00' },
  { label: 'Azul', value: '#00BFFF' },
  { label: 'Rosa', value: '#FF69B4' },
  { label: 'Laranja', value: '#FF8C00' },
  { label: 'Roxo', value: '#9370DB' },
  { label: 'Ciano', value: '#00FFFF' },
];

export default function Mapeamento() {
  const { user } = useAuth();
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
  const [mapNames, setMapNames] = useState<Record<string, NameItem[]>>({});
  const [mapDrawings, setMapDrawings] = useState<Record<string, DrawingElement[]>>({});
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [itemType, setItemType] = useState<'text' | 'logo'>('text');
  const [zoom, setZoom] = useState(1);
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
  const [drawTool, setDrawTool] = useState<'select' | 'draw' | 'arrow' | 'text' | 'eraser' | 'circle' | 'circleOutline' | 'move' | 'rectangle' | 'straightLine'>('select');
  const [drawColor, setDrawColor] = useState('#FFFFFF');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [nameFontSize, setNameFontSize] = useState(18);
  const [nameBorderColor, setNameBorderColor] = useState('#000000');
  const [nameBackgroundOpacity, setNameBackgroundOpacity] = useState(0.85);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<DrawingElement | null>(null);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [presentationTitle, setPresentationTitle] = useState('');
  const [watermark, setWatermark] = useState('@seuinstagram');
  const [selectedDrawingIndex, setSelectedDrawingIndex] = useState<number | null>(null);
  const [isDraggingDrawing, setIsDraggingDrawing] = useState(false);
  const [drawingDragStart, setDrawingDragStart] = useState<{ x: number; y: number } | null>(null);
  const [drawingHistory, setDrawingHistory] = useState<Record<string, DrawingElement[]>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lineThickness, setLineThickness] = useState(3);
  const [arrowStyle, setArrowStyle] = useState<'simple' | 'filled' | 'double' | 'dashed'>('simple');
  const [showWatermark, setShowWatermark] = useState(true);
  const [showNameBackground, setShowNameBackground] = useState(true);
  const [showWatermarkBackground, setShowWatermarkBackground] = useState(true);
  const [exportScale, setExportScale] = useState(2);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copySourceMap, setCopySourceMap] = useState<string>('');
  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obter nomes e desenhos do mapa atual
  const currentNames = selectedMap ? (mapNames[selectedMap.name] || []) : [];
  const currentDrawings = selectedMap ? (mapDrawings[selectedMap.name] || []) : [];

  // Mapas que têm nomes (para copiar)
  const mapsWithNames = maps.filter(m => (mapNames[m.name] || []).length > 0 && m.name !== selectedMap?.name);

  // Função auxiliar para atualizar nomes do mapa atual
  const setCurrentNames = (updater: NameItem[] | ((prev: NameItem[]) => NameItem[])) => {
    if (!selectedMap) return;
    setMapNames(prev => ({
      ...prev,
      [selectedMap.name]: typeof updater === 'function' ? updater(prev[selectedMap.name] || []) : updater,
    }));
  };

  // Função para copiar nomes de outro mapa
  const handleCopyFromMap = () => {
    if (!copySourceMap || !selectedMap) return;
    
    const sourceNames = mapNames[copySourceMap] || [];
    if (sourceNames.length === 0) {
      toast.error('Mapa de origem não tem nomes');
      return;
    }

    // Cria cópias com novos IDs
    const copiedNames = sourceNames.map(name => ({
      ...name,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));

    setMapNames(prev => ({
      ...prev,
      [selectedMap.name]: [...(prev[selectedMap.name] || []), ...copiedNames].slice(0, 15),
    }));

    toast.success(`${Math.min(copiedNames.length, 15 - currentNames.length)} nomes copiados de ${copySourceMap}`);
    setShowCopyDialog(false);
    setCopySourceMap('');
  };

  // Função para desenhar ponta de seta
  const drawArrowHead = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, style: 'simple' | 'filled' | 'double' | 'dashed', headLength: number) => {
    if (style === 'simple' || style === 'dashed') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - headLength * Math.cos(angle - Math.PI / 6), y - headLength * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x, y);
      ctx.lineTo(x - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    } else if (style === 'filled') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - headLength * Math.cos(angle - Math.PI / 6), y - headLength * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }
  };

  // Renderizar todos os desenhos no canvas
  const renderDrawings = useCallback(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar todos os elementos salvos
    currentDrawings.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = lineThickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      switch (element.type) {
        case 'line':
          if (element.points && element.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            element.points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.stroke();
          }
          break;
        case 'arrow':
          if (element.x !== undefined && element.y !== undefined && element.x2 !== undefined && element.y2 !== undefined) {
            const elementArrowStyle = element.arrowStyle || 'simple';
            // Aplicar linha tracejada se estiver selecionado
            if (elementArrowStyle === 'dashed') {
              ctx.setLineDash([10, 5]);
            }
            ctx.beginPath();
            ctx.moveTo(element.x, element.y);
            ctx.lineTo(element.x2, element.y2);
            ctx.stroke();
            ctx.setLineDash([]); // Resetar para linha sólida
            // Desenhar ponta da seta
            const angle = Math.atan2(element.y2 - element.y, element.x2 - element.x);
            const headLength = 10 + lineThickness * 2;
            drawArrowHead(ctx, element.x2, element.y2, angle, elementArrowStyle, headLength);
            // Seta dupla - desenhar também na origem
            if (elementArrowStyle === 'double') {
              const reverseAngle = angle + Math.PI;
              drawArrowHead(ctx, element.x, element.y, reverseAngle, 'simple', headLength);
            }
          }
          break;
        case 'circle':
          if (element.x !== undefined && element.y !== undefined && element.radius !== undefined) {
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
          break;
        case 'circleOutline':
          if (element.x !== undefined && element.y !== undefined && element.radius !== undefined) {
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
        case 'text':
          if (element.x !== undefined && element.y !== undefined && element.text) {
            ctx.font = 'bold 20px Arial';
            ctx.fillText(element.text, element.x, element.y);
          }
          break;
        case 'rectangle':
          if (element.x !== undefined && element.y !== undefined && element.width !== undefined && element.height !== undefined) {
            ctx.beginPath();
            ctx.rect(element.x, element.y, element.width, element.height);
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
          break;
        case 'straightLine':
          if (element.x !== undefined && element.y !== undefined && element.x2 !== undefined && element.y2 !== undefined) {
            ctx.beginPath();
            ctx.moveTo(element.x, element.y);
            ctx.lineTo(element.x2, element.y2);
            ctx.stroke();
          }
          break;
      }
    });

    // Desenhar elemento atual (em progresso)
    if (currentDrawing) {
      ctx.strokeStyle = currentDrawing.color;
      ctx.fillStyle = currentDrawing.color;
      ctx.lineWidth = lineThickness;
      ctx.lineCap = 'round';

      switch (currentDrawing.type) {
        case 'line':
          if (currentDrawing.points && currentDrawing.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
            currentDrawing.points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.stroke();
          }
          break;
        case 'arrow':
          if (currentDrawing.x !== undefined && currentDrawing.y !== undefined && currentDrawing.x2 !== undefined && currentDrawing.y2 !== undefined) {
            const previewArrowStyle = currentDrawing.arrowStyle || arrowStyle;
            if (previewArrowStyle === 'dashed') {
              ctx.setLineDash([10, 5]);
            }
            ctx.beginPath();
            ctx.moveTo(currentDrawing.x, currentDrawing.y);
            ctx.lineTo(currentDrawing.x2, currentDrawing.y2);
            ctx.stroke();
            ctx.setLineDash([]);
            // Preview da ponta
            const angle = Math.atan2(currentDrawing.y2 - currentDrawing.y, currentDrawing.x2 - currentDrawing.x);
            const headLength = 10 + lineThickness * 2;
            drawArrowHead(ctx, currentDrawing.x2, currentDrawing.y2, angle, previewArrowStyle, headLength);
            if (previewArrowStyle === 'double') {
              const reverseAngle = angle + Math.PI;
              drawArrowHead(ctx, currentDrawing.x, currentDrawing.y, reverseAngle, 'simple', headLength);
            }
          }
          break;
        case 'circle':
        case 'circleOutline':
          if (currentDrawing.x !== undefined && currentDrawing.y !== undefined && currentDrawing.radius !== undefined) {
            ctx.beginPath();
            ctx.arc(currentDrawing.x, currentDrawing.y, currentDrawing.radius, 0, Math.PI * 2);
            if (currentDrawing.type === 'circle') {
              ctx.globalAlpha = 0.3;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
            ctx.stroke();
          }
          break;
        case 'rectangle':
          if (currentDrawing.x !== undefined && currentDrawing.y !== undefined && currentDrawing.width !== undefined && currentDrawing.height !== undefined) {
            ctx.beginPath();
            ctx.rect(currentDrawing.x, currentDrawing.y, currentDrawing.width, currentDrawing.height);
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
          break;
        case 'straightLine':
          if (currentDrawing.x !== undefined && currentDrawing.y !== undefined && currentDrawing.x2 !== undefined && currentDrawing.y2 !== undefined) {
            ctx.beginPath();
            ctx.moveTo(currentDrawing.x, currentDrawing.y);
            ctx.lineTo(currentDrawing.x2, currentDrawing.y2);
            ctx.stroke();
          }
          break;
      }
    }
  }, [currentDrawings, currentDrawing, lineThickness, arrowStyle]);

  // Redimensionar e renderizar canvas quando mapa muda
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    const container = canvasRef.current;
    if (!canvas || !container || !selectedMap) return;

    const updateSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      renderDrawings();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [selectedMap, renderDrawings]);

  // Re-renderizar quando desenhos mudam
  useEffect(() => {
    renderDrawings();
  }, [renderDrawings]);

  // Obter posição do mouse relativa ao canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  // Obter posição do touch relativa ao canvas
  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) / zoom,
      y: (touch.clientY - rect.top) / zoom,
    };
  };

  // Função auxiliar: distância de ponto a segmento de reta
  const distanceToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Função para encontrar desenho clicado
  const findClickedDrawing = (pos: { x: number; y: number }): number => {
    return currentDrawings.findIndex(el => {
      if (el.type === 'circle' || el.type === 'circleOutline') {
        const dx = (el.x || 0) - pos.x;
        const dy = (el.y || 0) - pos.y;
        return Math.sqrt(dx * dx + dy * dy) < (el.radius || 0) + 15;
      }
      if (el.type === 'line' && el.points) {
        for (let i = 0; i < el.points.length - 1; i++) {
          const dist = distanceToLineSegment(pos.x, pos.y, el.points[i].x, el.points[i].y, el.points[i + 1].x, el.points[i + 1].y);
          if (dist < 15) return true;
        }
        return false;
      }
      if (el.type === 'arrow' || el.type === 'straightLine') {
        const dist = distanceToLineSegment(pos.x, pos.y, el.x || 0, el.y || 0, el.x2 || 0, el.y2 || 0);
        return dist < 20;
      }
      if (el.type === 'rectangle') {
        const x = el.x || 0;
        const y = el.y || 0;
        const w = el.width || 0;
        const h = el.height || 0;
        const minX = Math.min(x, x + w);
        const maxX = Math.max(x, x + w);
        const minY = Math.min(y, y + h);
        const maxY = Math.max(y, y + h);
        return pos.x >= minX - 10 && pos.x <= maxX + 10 && pos.y >= minY - 10 && pos.y <= maxY + 10;
      }
      if (el.type === 'text') {
        return Math.abs((el.x || 0) - pos.x) < 60 && Math.abs((el.y || 0) - pos.y) < 25;
      }
      return false;
    });
  };

  // Salvar estado para histórico
  const saveToHistory = (newDrawings: Record<string, DrawingElement[]>) => {
    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    newHistory.push({ ...newDrawings });
    setDrawingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Desfazer
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = drawingHistory[historyIndex - 1];
      setMapDrawings(prevState);
      setHistoryIndex(historyIndex - 1);
      toast.info('Desfeito');
    }
  };

  // Refazer
  const handleRedo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const nextState = drawingHistory[historyIndex + 1];
      setMapDrawings(nextState);
      setHistoryIndex(historyIndex + 1);
      toast.info('Refeito');
    }
  };

  // Handlers de desenho
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawTool === 'select') return;
    
    const pos = getMousePos(e);
    // Debug logging removed for production

    // Ferramenta MOVER
    if (drawTool === 'move') {
      const clickedIndex = findClickedDrawing(pos);
      if (clickedIndex >= 0) {
        setSelectedDrawingIndex(clickedIndex);
        setIsDraggingDrawing(true);
        setDrawingDragStart(pos);
        toast.info('Arraste para mover');
      }
      return;
    }

    if (drawTool === 'eraser') {
      const clickedIndex = findClickedDrawing(pos);

      if (clickedIndex >= 0 && selectedMap) {
        const newDrawings = [...currentDrawings];
        newDrawings.splice(clickedIndex, 1);
        const newMapDrawings = { ...mapDrawings, [selectedMap.name]: newDrawings };
        setMapDrawings(newMapDrawings);
        saveToHistory(newMapDrawings);
        toast.success('Elemento apagado');
      }
      return;
    }

    if (drawTool === 'text') {
      const text = prompt('Digite o texto:');
      if (text && selectedMap) {
        const newElement: DrawingElement = {
          id: Date.now().toString(),
          type: 'text',
          color: drawColor,
          x: pos.x,
          y: pos.y,
          text,
        };
        const newMapDrawings = {
          ...mapDrawings,
          [selectedMap.name]: [...(mapDrawings[selectedMap.name] || []), newElement],
        };
        setMapDrawings(newMapDrawings);
        saveToHistory(newMapDrawings);
        toast.success('Texto adicionado');
      }
      return;
    }

    setIsDrawing(true);
    setDrawStart(pos);

    if (drawTool === 'draw') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'line',
        color: drawColor,
        points: [pos],
      });
    } else if (drawTool === 'arrow') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'arrow',
        color: drawColor,
        x: pos.x,
        y: pos.y,
        x2: pos.x,
        y2: pos.y,
        arrowStyle: arrowStyle,
      });
    } else if (drawTool === 'circle' || drawTool === 'circleOutline') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: drawTool,
        color: drawColor,
        x: pos.x,
        y: pos.y,
        radius: 0,
      });
    } else if (drawTool === 'rectangle') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'rectangle',
        color: drawColor,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      });
    } else if (drawTool === 'straightLine') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'straightLine',
        color: drawColor,
        x: pos.x,
        y: pos.y,
        x2: pos.x,
        y2: pos.y,
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    // Mover desenho selecionado
    if (isDraggingDrawing && selectedDrawingIndex !== null && drawingDragStart && selectedMap) {
      const deltaX = pos.x - drawingDragStart.x;
      const deltaY = pos.y - drawingDragStart.y;
      
      setMapDrawings(prev => {
        const drawings = [...(prev[selectedMap.name] || [])];
        const el = { ...drawings[selectedDrawingIndex] };
        
        if (el.type === 'line' && el.points) {
          el.points = el.points.map(p => ({ x: p.x + deltaX, y: p.y + deltaY }));
        } else if (el.type === 'arrow') {
          el.x = (el.x || 0) + deltaX;
          el.y = (el.y || 0) + deltaY;
          el.x2 = (el.x2 || 0) + deltaX;
          el.y2 = (el.y2 || 0) + deltaY;
        } else if (el.type === 'circle' || el.type === 'circleOutline' || el.type === 'text') {
          el.x = (el.x || 0) + deltaX;
          el.y = (el.y || 0) + deltaY;
        }
        
        drawings[selectedDrawingIndex] = el;
        return { ...prev, [selectedMap.name]: drawings };
      });
      
      setDrawingDragStart(pos);
      return;
    }

    if (!isDrawing || !currentDrawing || !drawStart) return;

    if (currentDrawing.type === 'line') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        points: [...(prev.points || []), pos],
      } : null);
    } else if (currentDrawing.type === 'arrow') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        x2: pos.x,
        y2: pos.y,
      } : null);
    } else if (currentDrawing.type === 'circle' || currentDrawing.type === 'circleOutline') {
      const dx = pos.x - drawStart.x;
      const dy = pos.y - drawStart.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setCurrentDrawing(prev => prev ? {
        ...prev,
        radius,
      } : null);
    } else if (currentDrawing.type === 'rectangle') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        width: pos.x - drawStart.x,
        height: pos.y - drawStart.y,
      } : null);
    } else if (currentDrawing.type === 'straightLine') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        x2: pos.x,
        y2: pos.y,
      } : null);
    }
  };

  const handleCanvasMouseUp = () => {
    // Finalizar movimento de desenho
    if (isDraggingDrawing && selectedMap) {
      saveToHistory(mapDrawings);
      setIsDraggingDrawing(false);
      setSelectedDrawingIndex(null);
      setDrawingDragStart(null);
      toast.success('Desenho movido');
      return;
    }

    if (!isDrawing || !currentDrawing || !selectedMap) {
      setIsDrawing(false);
      return;
    }

    // Salvar o desenho atual
    const newMapDrawings = {
      ...mapDrawings,
      [selectedMap.name]: [...(mapDrawings[selectedMap.name] || []), currentDrawing],
    };
    setMapDrawings(newMapDrawings);
    saveToHistory(newMapDrawings);

    // Drawing completed successfully
    toast.success('Desenho adicionado');

    setIsDrawing(false);
    setCurrentDrawing(null);
    setDrawStart(null);
  };

  // Touch handlers para canvas de desenho
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (drawTool === 'select') return;
    e.preventDefault();
    e.stopPropagation();
    
    const pos = getTouchPos(e);

    if (drawTool === 'move') {
      const clickedIndex = findClickedDrawing(pos);
      if (clickedIndex >= 0) {
        setSelectedDrawingIndex(clickedIndex);
        setIsDraggingDrawing(true);
        setDrawingDragStart(pos);
        toast.info('Arraste para mover');
      }
      return;
    }

    if (drawTool === 'eraser') {
      const clickedIndex = findClickedDrawing(pos);
      if (clickedIndex >= 0 && selectedMap) {
        const newDrawings = [...currentDrawings];
        newDrawings.splice(clickedIndex, 1);
        const newMapDrawings = { ...mapDrawings, [selectedMap.name]: newDrawings };
        setMapDrawings(newMapDrawings);
        saveToHistory(newMapDrawings);
        toast.success('Elemento apagado');
      }
      return;
    }

    if (drawTool === 'text') {
      const text = prompt('Digite o texto:');
      if (text && selectedMap) {
        const newElement: DrawingElement = {
          id: Date.now().toString(),
          type: 'text',
          color: drawColor,
          x: pos.x,
          y: pos.y,
          text,
        };
        const newMapDrawings = {
          ...mapDrawings,
          [selectedMap.name]: [...(mapDrawings[selectedMap.name] || []), newElement],
        };
        setMapDrawings(newMapDrawings);
        saveToHistory(newMapDrawings);
        toast.success('Texto adicionado');
      }
      return;
    }

    setIsDrawing(true);
    setDrawStart(pos);

    if (drawTool === 'draw') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'line',
        color: drawColor,
        points: [pos],
      });
    } else if (drawTool === 'arrow') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'arrow',
        color: drawColor,
        x: pos.x,
        y: pos.y,
        x2: pos.x,
        y2: pos.y,
        arrowStyle: arrowStyle,
      });
    } else if (drawTool === 'circle' || drawTool === 'circleOutline') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: drawTool,
        color: drawColor,
        x: pos.x,
        y: pos.y,
        radius: 0,
      });
    } else if (drawTool === 'rectangle') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'rectangle',
        color: drawColor,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      });
    } else if (drawTool === 'straightLine') {
      setCurrentDrawing({
        id: Date.now().toString(),
        type: 'straightLine',
        color: drawColor,
        x: pos.x,
        y: pos.y,
        x2: pos.x,
        y2: pos.y,
      });
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    const pos = getTouchPos(e);

    if (isDraggingDrawing && selectedDrawingIndex !== null && drawingDragStart && selectedMap) {
      const deltaX = pos.x - drawingDragStart.x;
      const deltaY = pos.y - drawingDragStart.y;
      
      setMapDrawings(prev => {
        const drawings = [...(prev[selectedMap.name] || [])];
        const el = { ...drawings[selectedDrawingIndex] };
        
        if (el.type === 'line' && el.points) {
          el.points = el.points.map(p => ({ x: p.x + deltaX, y: p.y + deltaY }));
        } else if (el.type === 'arrow') {
          el.x = (el.x || 0) + deltaX;
          el.y = (el.y || 0) + deltaY;
          el.x2 = (el.x2 || 0) + deltaX;
          el.y2 = (el.y2 || 0) + deltaY;
        } else if (el.type === 'circle' || el.type === 'circleOutline' || el.type === 'text') {
          el.x = (el.x || 0) + deltaX;
          el.y = (el.y || 0) + deltaY;
        }
        
        drawings[selectedDrawingIndex] = el;
        return { ...prev, [selectedMap.name]: drawings };
      });
      
      setDrawingDragStart(pos);
      return;
    }

    if (!isDrawing || !currentDrawing || !drawStart) return;

    if (currentDrawing.type === 'line') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        points: [...(prev.points || []), pos],
      } : null);
    } else if (currentDrawing.type === 'arrow') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        x2: pos.x,
        y2: pos.y,
      } : null);
    } else if (currentDrawing.type === 'circle' || currentDrawing.type === 'circleOutline') {
      const dx = pos.x - drawStart.x;
      const dy = pos.y - drawStart.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setCurrentDrawing(prev => prev ? {
        ...prev,
        radius,
      } : null);
    } else if (currentDrawing.type === 'rectangle') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        width: pos.x - drawStart.x,
        height: pos.y - drawStart.y,
      } : null);
    } else if (currentDrawing.type === 'straightLine') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        x2: pos.x,
        y2: pos.y,
      } : null);
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (isDraggingDrawing && selectedMap) {
      saveToHistory(mapDrawings);
      setIsDraggingDrawing(false);
      setSelectedDrawingIndex(null);
      setDrawingDragStart(null);
      toast.success('Desenho movido');
      return;
    }

    if (!isDrawing || !currentDrawing || !selectedMap) {
      setIsDrawing(false);
      return;
    }

    const newMapDrawings = {
      ...mapDrawings,
      [selectedMap.name]: [...(mapDrawings[selectedMap.name] || []), currentDrawing],
    };
    setMapDrawings(newMapDrawings);
    saveToHistory(newMapDrawings);

    toast.success('Desenho adicionado');

    setIsDrawing(false);
    setCurrentDrawing(null);
    setDrawStart(null);
  };

  const handleAddName = () => {
    if (!newName.trim() && itemType === 'text') {
      toast.error('Digite um nome válido');
      return;
    }

    if (currentNames.length >= 15) {
      toast.error('Máximo de 15 itens atingido');
      return;
    }

    const newItem: NameItem = {
      id: Date.now().toString(),
      text: newName.trim(),
      x: 50,
      y: 50,
      color: selectedColor,
      type: 'text',
    };

    // Name item added successfully

    setCurrentNames([...currentNames, newItem]);
    setNewName('');
    toast.success('Item adicionado');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (currentNames.length >= 15) {
      toast.error('Máximo de 15 itens atingido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newItem: NameItem = {
        id: Date.now().toString(),
        text: file.name,
        x: 50,
        y: 50,
        color: selectedColor,
        logo: event.target?.result as string,
        type: 'logo',
      };
      setCurrentNames(prev => [...prev, newItem]);
      toast.success('Logo adicionado');
    };
    reader.readAsDataURL(file);
  };

  const handleDuplicate = (id: string) => {
    if (currentNames.length >= 15) {
      toast.error('Máximo de 15 itens atingido');
      return;
    }

    const original = currentNames.find(n => n.id === id);
    if (original) {
      const duplicate: NameItem = {
        ...original,
        id: Date.now().toString(),
        x: original.x + 20,
        y: original.y + 20,
      };
      setCurrentNames([...currentNames, duplicate]);
      toast.success('Item duplicado');
    }
  };

  const handleDelete = (id: string) => {
    setCurrentNames(currentNames.filter(n => n.id !== id));
    toast.success('Item removido');
  };

  const handleStartEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) {
      toast.error('Nome não pode estar vazio');
      return;
    }

    setCurrentNames(currentNames.map(n => n.id === id ? { ...n, text: editingText.trim() } : n));
    setEditingId(null);
    setEditingText('');
    toast.success('Nome atualizado');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleDrag = (id: string, position: { x: number; y: number }) => {
    setCurrentNames(prev => prev.map(n => n.id === id ? { ...n, x: position.x, y: position.y } : n));
  };

  const handleNameMouseDown = (id: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    const name = currentNames.find(n => n.id === id);
    if (!name) return;

    setDraggingId(id);
    setDragOffset({ x: pointerX - name.x, y: pointerY - name.y });
  };

  const handleNameTouchStart = (id: string, event: React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    event.preventDefault();
    event.stopPropagation(); // Previne zoom ao arrastar nomes
    const touch = event.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const pointerX = touch.clientX - rect.left;
    const pointerY = touch.clientY - rect.top;

    const name = currentNames.find(n => n.id === id);
    if (!name) return;

    setDraggingId(id);
    setDragOffset({ x: pointerX - name.x, y: pointerY - name.y });
  };

  const handleMapMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    const newX = pointerX - dragOffset.x;
    const newY = pointerY - dragOffset.y;

    handleDrag(draggingId, { x: newX, y: newY });
  };

  const handleMapTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!draggingId || !canvasRef.current) return;
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const pointerX = touch.clientX - rect.left;
    const pointerY = touch.clientY - rect.top;

    const newX = pointerX - dragOffset.x;
    const newY = pointerY - dragOffset.y;

    handleDrag(draggingId, { x: newX, y: newY });
  };

  const handleMapMouseUp = () => {
    setDraggingId(null);
  };

  const handleMapTouchEnd = () => {
    setDraggingId(null);
  };

  const handleClearDrawings = () => {
    if (!selectedMap) return;
    const newMapDrawings = {
      ...mapDrawings,
      [selectedMap.name]: [],
    };
    setMapDrawings(newMapDrawings);
    saveToHistory(newMapDrawings);
    toast.success('Desenhos limpos');
  };

  const handlePreview = async () => {
    if (!canvasRef.current || !selectedMap) {
      toast.error('Selecione um mapa primeiro');
      return;
    }

    if (currentNames.length < 2) {
      toast.error('Adicione pelo menos 2 nomes de times');
      return;
    }

    try {
      const canvas = await createExportCanvas();
      if (!canvas) {
        toast.error('Erro ao criar preview');
        return;
      }
      setPreviewImage(canvas.toDataURL('image/png'));
      setShowPreview(true);
    } catch {
      toast.error('Erro ao gerar preview');
    }
  };

  const handleConfirmDownload = () => {
    if (previewImage) {
      const link = document.createElement('a');
      link.href = previewImage;
      link.download = `mapeamento-${selectedMap?.name || 'mapa'}.png`;
      link.click();
      toast.success('Imagem baixada com sucesso');
      setShowPreview(false);
      setPreviewImage(null);
    }
  };

  const handleSaveProject = async (projectName: string) => {
    if (!user || !selectedMap) {
      toast.error('Faça login e selecione um mapa');
      return;
    }

    try {
      const projectData = {
        user_id: user.id,
        nome: projectName,
        mapa_nome: selectedMap.name,
        itens: mapNames as any,
        anotacoes: [] as any,
        desenhos: mapDrawings as any,
      };

      const { error } = await supabase
        .from('mapeamento_projetos')
        .insert(projectData);

      if (error) throw error;
      
      toast.success('Projeto salvo com sucesso');
    } catch {
      toast.error('Erro ao salvar projeto');
    }
  };

  const handleLoadProject = async (projectId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mapeamento_projetos')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const map = maps.find(m => m.name === data.mapa_nome);
      if (map) setSelectedMap(map);

      // Carregar nomes (por mapa)
      const loadedNames = ((data.itens as any) || {}) as Record<string, NameItem[]>;
      setMapNames(loadedNames);

      // Carregar desenhos (específicos por mapa)
      const loadedDrawings = (data.desenhos as any) || {};
      setMapDrawings(loadedDrawings);

      toast.success('Projeto carregado');
    } catch {
      toast.error('Erro ao carregar projeto');
    }
  };

  // Função helper para criar canvas com todos os elementos desenhados manualmente
  const createExportCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!canvasRef.current || !selectedMap) return null;
    
    const container = canvasRef.current;
    const rect = container.getBoundingClientRect();
    
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = rect.width * exportScale;
    finalCanvas.height = rect.height * exportScale;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.scale(exportScale, exportScale);
    
    // 1. Desenhar imagem de fundo do mapa
    const mapImg = new Image();
    mapImg.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      mapImg.onload = () => resolve();
      mapImg.onerror = reject;
      mapImg.src = selectedMap.url;
    });
    
    ctx.drawImage(mapImg, 0, 0, rect.width, rect.height);
    
    // 2. Copiar os desenhos do canvas de desenho
    if (drawingCanvasRef.current) {
      ctx.drawImage(drawingCanvasRef.current, 0, 0, rect.width, rect.height);
    }
    
    // 3. Desenhar os nomes dos times com posicionamento exato
    for (const name of currentNames) {
      if (name.type === 'logo' && name.logo) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = () => resolve();
          logoImg.src = name.logo!;
        });
        
        const logoSize = 48;
        const padding = showNameBackground ? 8 : 0;
        const bgWidth = logoSize + padding * 2;
        const bgHeight = logoSize + padding * 2;
        
        if (showNameBackground) {
          ctx.fillStyle = `rgba(0,0,0,${nameBackgroundOpacity})`;
          ctx.beginPath();
          ctx.roundRect(name.x, name.y, bgWidth, bgHeight, 4);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        ctx.drawImage(logoImg, name.x + padding, name.y + padding, logoSize, logoSize);
      } else {
        ctx.font = `bold ${nameFontSize}px Arial`;
        const textMetrics = ctx.measureText(name.text);
        const textWidth = textMetrics.width;
        const textHeight = nameFontSize;
        const paddingX = showNameBackground ? 12 : 0;
        const paddingY = showNameBackground ? 7 : 0;
        const bgWidth = textWidth + paddingX * 2;
        const bgHeight = textHeight + paddingY * 2;
        
        if (showNameBackground) {
          ctx.fillStyle = `rgba(0,0,0,${nameBackgroundOpacity})`;
          ctx.beginPath();
          ctx.roundRect(name.x, name.y, bgWidth, bgHeight, 4);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        ctx.fillStyle = nameBorderColor;
        const offsets = [[2, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (const [ox, oy] of offsets) {
          ctx.fillText(name.text, name.x + paddingX + ox, name.y + paddingY + textHeight - 2 + oy);
        }
        
        ctx.fillStyle = name.color;
        ctx.fillText(name.text, name.x + paddingX, name.y + paddingY + textHeight - 2);
      }
    }
    
    // 4. Desenhar marca d'água
    if (showWatermark && watermark.trim()) {
      ctx.font = 'bold 14px Arial';
      const wmMetrics = ctx.measureText(watermark);
      const wmWidth = wmMetrics.width;
      const wmHeight = 14;
      const wmPaddingX = showWatermarkBackground ? 12 : 0;
      const wmPaddingY = showWatermarkBackground ? 7 : 0;
      const wmBgWidth = wmWidth + wmPaddingX * 2;
      const wmBgHeight = wmHeight + wmPaddingY * 2;
      const wmX = rect.width - wmBgWidth - 16;
      const wmY = rect.height - wmBgHeight - 16;
      
      if (showWatermarkBackground) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.roundRect(wmX, wmY, wmBgWidth, wmBgHeight, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#000';
        const offsets = [[2, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (const [ox, oy] of offsets) {
          ctx.fillText(watermark, wmX + wmPaddingX + ox, wmY + wmPaddingY + wmHeight - 2 + oy);
        }
      }
      
      ctx.fillStyle = '#ffd700';
      ctx.fillText(watermark, wmX + wmPaddingX, wmY + wmPaddingY + wmHeight - 2);
    }
    
    return finalCanvas;
  };

  const handleExportImage = async () => {
    if (!canvasRef.current || !selectedMap) {
      toast.error('Selecione um mapa primeiro');
      return;
    }

    try {
      const canvas = await createExportCanvas();
      if (!canvas) {
        toast.error('Erro ao criar canvas');
        return;
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `mapeamento-${selectedMap.name}.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('Imagem baixada com sucesso');
        }
      });
    } catch {
      toast.error('Erro ao exportar imagem');
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current || !selectedMap) {
      toast.error('Selecione um mapa primeiro');
      return;
    }

    try {
      toast.info('Gerando PDF... Aguarde');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Usar canvas manual ao invés de html2canvas
      const canvas = await createExportCanvas();
      if (!canvas) {
        toast.error('Erro ao criar canvas');
        return;
      }
      
      // Calcular tamanho mantendo proporção
      const imageRatio = canvas.width / canvas.height;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let imgWidthMM, imgHeightMM, offsetX, offsetY;
      if (imageRatio > pdfRatio) {
        imgWidthMM = pdfWidth;
        imgHeightMM = pdfWidth / imageRatio;
        offsetX = 0;
        offsetY = (pdfHeight - imgHeightMM) / 2;
      } else {
        imgHeightMM = pdfHeight;
        imgWidthMM = pdfHeight * imageRatio;
        offsetX = (pdfWidth - imgWidthMM) / 2;
        offsetY = 0;
      }
      
      // PÁGINA DE CAPA (se houver título)
      if (presentationTitle.trim()) {
        const coverCanvas = document.createElement('canvas');
        coverCanvas.width = canvas.width;
        coverCanvas.height = canvas.height;
        const coverCtx = coverCanvas.getContext('2d');
        if (coverCtx) {
          coverCtx.fillStyle = '#1a1a2e';
          coverCtx.fillRect(0, 0, coverCanvas.width, coverCanvas.height);
          
          const fontSize = Math.round(coverCanvas.width * 0.04);
          coverCtx.fillStyle = '#ffd700';
          coverCtx.font = `bold ${fontSize}px Arial`;
          coverCtx.textAlign = 'center';
          coverCtx.textBaseline = 'middle';
          coverCtx.fillText(presentationTitle, coverCanvas.width / 2, coverCanvas.height / 2 - fontSize);
          
          coverCtx.fillStyle = '#ffffff';
          coverCtx.font = `${fontSize * 0.5}px Arial`;
          coverCtx.fillText('Mapeamento Tático', coverCanvas.width / 2, coverCanvas.height / 2 + fontSize * 0.5);
          
          if (watermark.trim()) {
            coverCtx.font = 'bold 28px Arial';
            coverCtx.fillStyle = '#ffd700';
            coverCtx.textAlign = 'right';
            coverCtx.textBaseline = 'bottom';
            coverCtx.fillText(watermark, coverCanvas.width - 30, coverCanvas.height - 20);
          }
          
          pdf.setFillColor(26, 26, 46);
          pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
          
          const coverImgData = coverCanvas.toDataURL('image/png');
          pdf.addImage(coverImgData, 'PNG', offsetX, offsetY, imgWidthMM, imgHeightMM);
          pdf.addPage();
        }
      }
      
      // PÁGINA DO MAPA
      pdf.setFillColor(26, 26, 46);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidthMM, imgHeightMM);
      pdf.save(`mapeamento-${presentationTitle || selectedMap.name}.pdf`);
      
      toast.success('PDF gerado com sucesso');
    } catch {
      toast.error('Erro ao gerar PDF');
    }
  };

  const createCanvasForMap = async (map: MapData): Promise<HTMLCanvasElement | null> => {
    const names = mapNames[map.name] || [];
    const drawings = mapDrawings[map.name] || [];
    
    // Criar canvas temporário
    const tempCanvas = document.createElement('canvas');
    const rect = { width: 1280, height: 720 }; // Dimensões padrão 16:9
    tempCanvas.width = rect.width * exportScale;
    tempCanvas.height = rect.height * exportScale;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.scale(exportScale, exportScale);
    
    // 1. Desenhar imagem de fundo do mapa
    const mapImg = new Image();
    mapImg.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      mapImg.onload = () => resolve();
      mapImg.onerror = reject;
      mapImg.src = map.url;
    });
    
    ctx.drawImage(mapImg, 0, 0, rect.width, rect.height);
    
    // 2. Desenhar os desenhos
    for (const element of drawings) {
      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = lineThickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (element.type === 'line' && element.points && element.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        ctx.stroke();
      } else if (element.type === 'arrow' && element.x !== undefined && element.y !== undefined && element.x2 !== undefined && element.y2 !== undefined) {
        const elementArrowStyle = element.arrowStyle || 'simple';
        if (elementArrowStyle === 'dashed') {
          ctx.setLineDash([10, 5]);
        }
        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        const angle = Math.atan2(element.y2 - element.y, element.x2 - element.x);
        const headLength = 10 + lineThickness * 2;
        drawArrowHead(ctx, element.x2, element.y2, angle, elementArrowStyle, headLength);
        if (elementArrowStyle === 'double') {
          const reverseAngle = angle + Math.PI;
          drawArrowHead(ctx, element.x, element.y, reverseAngle, 'simple', headLength);
        }
      } else if ((element.type === 'circle' || element.type === 'circleOutline') && element.x !== undefined && element.y !== undefined && element.radius !== undefined) {
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
        if (element.type === 'circle') {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      } else if (element.type === 'rectangle' && element.x !== undefined && element.y !== undefined && element.width !== undefined && element.height !== undefined) {
        ctx.strokeRect(element.x, element.y, element.width, element.height);
      } else if (element.type === 'straightLine' && element.x !== undefined && element.y !== undefined && element.x2 !== undefined && element.y2 !== undefined) {
        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();
      } else if (element.type === 'text' && element.x !== undefined && element.y !== undefined && element.text) {
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#000';
        const offsets = [[2, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (const [ox, oy] of offsets) {
          ctx.fillText(element.text, element.x + ox, element.y + oy);
        }
        ctx.fillStyle = element.color;
        ctx.fillText(element.text, element.x, element.y);
      }
    }
    
    // 3. Desenhar os nomes dos times
    for (const name of names) {
      if (name.type === 'logo' && name.logo) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = () => resolve();
          logoImg.src = name.logo!;
        });
        
        const logoSize = 48;
        const padding = showNameBackground ? 8 : 0;
        const bgWidth = logoSize + padding * 2;
        const bgHeight = logoSize + padding * 2;
        
        if (showNameBackground) {
          ctx.fillStyle = `rgba(0,0,0,${nameBackgroundOpacity})`;
          ctx.beginPath();
          ctx.roundRect(name.x, name.y, bgWidth, bgHeight, 4);
          ctx.fill();
        }
        
        ctx.drawImage(logoImg, name.x + padding, name.y + padding, logoSize, logoSize);
      } else {
        ctx.font = `bold ${nameFontSize}px Arial`;
        const textMetrics = ctx.measureText(name.text);
        const textWidth = textMetrics.width;
        const textHeight = nameFontSize;
        const paddingX = showNameBackground ? 12 : 0;
        const paddingY = showNameBackground ? 7 : 0;
        const bgWidth = textWidth + paddingX * 2;
        const bgHeight = textHeight + paddingY * 2;
        
        if (showNameBackground) {
          ctx.fillStyle = `rgba(0,0,0,${nameBackgroundOpacity})`;
          ctx.beginPath();
          ctx.roundRect(name.x, name.y, bgWidth, bgHeight, 4);
          ctx.fill();
        }
        
        ctx.fillStyle = nameBorderColor;
        const offsets = [[2, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (const [ox, oy] of offsets) {
          ctx.fillText(name.text, name.x + paddingX + ox, name.y + paddingY + textHeight - 2 + oy);
        }
        
        ctx.fillStyle = name.color;
        ctx.fillText(name.text, name.x + paddingX, name.y + paddingY + textHeight - 2);
      }
    }
    
    // 4. Desenhar marca d'água
    if (showWatermark && watermark.trim()) {
      ctx.font = 'bold 14px Arial';
      const wmMetrics = ctx.measureText(watermark);
      const wmWidth = wmMetrics.width;
      const wmHeight = 14;
      const wmPaddingX = showWatermarkBackground ? 12 : 0;
      const wmPaddingY = showWatermarkBackground ? 7 : 0;
      const wmBgWidth = wmWidth + wmPaddingX * 2;
      const wmBgHeight = wmHeight + wmPaddingY * 2;
      const wmX = rect.width - wmBgWidth - 16;
      const wmY = rect.height - wmBgHeight - 16;
      
      if (showWatermarkBackground) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.roundRect(wmX, wmY, wmBgWidth, wmBgHeight, 4);
        ctx.fill();
      } else {
        ctx.fillStyle = '#000';
        const offsets = [[2, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (const [ox, oy] of offsets) {
          ctx.fillText(watermark, wmX + wmPaddingX + ox, wmY + wmPaddingY + wmHeight - 2 + oy);
        }
      }
      
      ctx.fillStyle = '#ffd700';
      ctx.fillText(watermark, wmX + wmPaddingX, wmY + wmPaddingY + wmHeight - 2);
    }
    
    return tempCanvas;
  };

  const handleExportAllZip = async () => {
    const mapsWithContent = maps.filter(map => {
      const names = mapNames[map.name] || [];
      return names.length >= 2;
    });

    if (mapsWithContent.length === 0) {
      toast.error('Nenhum mapa com conteúdo para exportar. Adicione pelo menos 2 nomes em cada mapa.');
      return;
    }

    try {
      toast.info(`Exportando ${mapsWithContent.length} mapa(s)... Aguarde`);
      const zip = new JSZip();

      for (const map of mapsWithContent) {
        const canvas = await createCanvasForMap(map);
        if (canvas) {
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/png');
          });
          if (blob) {
            zip.file(`mapeamento-${map.name}.png`, blob);
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mapeamentos-${presentationTitle || 'todos'}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`${mapsWithContent.length} mapa(s) exportado(s) com sucesso!`);
    } catch {
      toast.error('Erro ao exportar mapas');
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Calcular distância entre dois toques
  const getPinchDistance = (touches: React.TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handler para início do pinch
  const handlePinchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setLastPinchDistance(getPinchDistance(e.touches));
    }
  };

  // Handler para movimento do pinch (zoom)
  const handlePinchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && lastPinchDistance !== null) {
      e.preventDefault();
      const currentDistance = getPinchDistance(e.touches);
      const delta = currentDistance - lastPinchDistance;
      
      // Ajustar zoom baseado na diferença de distância
      if (Math.abs(delta) > 5) {
        const zoomDelta = delta > 0 ? 0.02 : -0.02;
        setZoom(prev => Math.min(Math.max(prev + zoomDelta, 0.5), 2));
        setLastPinchDistance(currentDistance);
      }
    }
  };

  // Handler para fim do pinch
  const handlePinchEnd = () => {
    setLastPinchDistance(null);
  };

  // Double tap para resetar zoom
  const lastTapRef = useRef<number>(0);
  const handleDoubleTap = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (e.touches.length === 1) {
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        // Double tap detectado - resetar zoom
        setZoom(1);
        toast.info('Zoom resetado para 100%');
      }
      lastTapRef.current = now;
    }
  };

  const handlePrint = () => {
    if (!selectedMap) {
      toast.error('Selecione um mapa primeiro');
      return;
    }
    window.print();
  };

  const handleShare = async () => {
    if (!canvasRef.current || !selectedMap) {
      toast.error('Selecione um mapa primeiro');
      return;
    }

    try {
      const container = canvasRef.current;
      const rect = container.getBoundingClientRect();
      
      // Criar canvas final combinando mapa + desenhos + nomes
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = rect.width * 2;
      finalCanvas.height = rect.height * 2;
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return;
      
      ctx.scale(2, 2);
      
      // 1. Desenhar imagem de fundo do mapa
      const mapImg = new Image();
      mapImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        mapImg.onload = () => resolve();
        mapImg.onerror = reject;
        mapImg.src = selectedMap.url;
      });
      
      ctx.drawImage(mapImg, 0, 0, rect.width, rect.height);
      
      // 2. Desenhar os elementos do canvas de desenho
      if (drawingCanvasRef.current) {
        ctx.drawImage(drawingCanvasRef.current, 0, 0, rect.width, rect.height);
      }
      
      // 3. Desenhar os nomes dos times
      currentNames.forEach((name) => {
        ctx.fillStyle = name.color;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        // Fundo semi-transparente
        const textMetrics = ctx.measureText(name.text);
        const padding = 8;
        const bgWidth = textMetrics.width + padding * 2;
        const bgHeight = 24;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(name.x - bgWidth / 2, name.y - bgHeight / 2, bgWidth, bgHeight);
        
        // Texto
        ctx.fillStyle = name.color;
        ctx.fillText(name.text, name.x, name.y + 5);
      });

      finalCanvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], `mapeamento-${selectedMap.name}.png`, { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'Mapeamento Free Fire',
            text: `Mapa: ${selectedMap.name}`,
          });
          toast.success('Compartilhado com sucesso');
        } else {
          toast.error('Compartilhamento não disponível neste navegador');
        }
      });
    } catch {
      toast.error('Erro ao compartilhar');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-premium bg-clip-text text-transparent">
            Mapeamento Tático
          </h1>
          <p className="text-muted-foreground text-lg">
            Crie estratégias visuais com nomes, logos, desenhos e formações
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel Lateral */}
          <Card className="glass-effect lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Controles</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="map" className="w-full" onValueChange={(value) => {
                if (value === 'map') setDrawTool('select');
              }}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="map">Mapa</TabsTrigger>
                  <TabsTrigger value="draw">Desenho</TabsTrigger>
                  <TabsTrigger value="project">Projeto</TabsTrigger>
                </TabsList>

                <TabsContent value="map" className="space-y-4 mt-4">
                  {/* Seleção de Mapa */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Selecione o Mapa</label>
                    <div className="grid grid-cols-2 gap-2">
                      {maps.map((map) => (
                        <button
                          key={map.name}
                          onClick={() => setSelectedMap(map)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                            selectedMap?.name === map.name
                              ? 'border-primary shadow-premium'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={map.url}
                            alt={map.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                            <span className="text-white font-bold text-xs p-2 w-full text-center">
                              {map.name}
                            </span>
                          </div>
                          {selectedMap?.name === map.name && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Check className="h-8 w-8 text-primary drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tipo de Item */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Adicionar Item ({currentNames.length}/15)
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Button
                        variant={itemType === 'text' ? 'default' : 'outline'}
                        onClick={() => setItemType('text')}
                        className="w-full"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Nome
                      </Button>
                      <Button
                        variant={itemType === 'logo' ? 'default' : 'outline'}
                        onClick={() => {
                          setItemType('logo');
                          fileInputRef.current?.click();
                        }}
                        disabled={currentNames.length >= 15}
                        className="w-full"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Logo
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Adicionar Nome */}
                  {itemType === 'text' && (
                    <div>
                      <div className="space-y-2">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Digite o nome"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
                        />
                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {textColors.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                <span style={{ color: color.value }}>● {color.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleAddName}
                          className="w-full"
                          disabled={currentNames.length >= 15}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Lista de Itens */}
                  {currentNames.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Itens no Mapa</label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {currentNames.map((name) => (
                          <div
                            key={name.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-border"
                          >
                            {editingId === name.id ? (
                              <>
                                <Input
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="flex-1 h-8 text-sm"
                                  autoFocus
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit(name.id);
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleSaveEdit(name.id)}
                                  className="h-8 w-8"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                {name.type === 'logo' && name.logo && (
                                  <img src={name.logo} alt={name.text} className="h-6 w-6 object-contain" />
                                )}
                                <span
                                  className="flex-1 truncate text-sm"
                                  style={{ color: name.color }}
                                >
                                  {name.text}
                                </span>
                                {name.type === 'text' && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleStartEdit(name.id, name.text)}
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDuplicate(name.id)}
                                  disabled={currentNames.length >= 15}
                                  className="h-8 w-8"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(name.id)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copiar nomes de outro mapa */}
                  {mapsWithNames.length > 0 && currentNames.length < 15 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowCopyDialog(true)}
                      className="w-full"
                    >
                      <FolderSync className="h-4 w-4 mr-2" />
                      Copiar de outro mapa
                    </Button>
                  )}

                  {/* Configuração de Aparência dos Nomes */}
                  {currentNames.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      <label className="text-sm font-medium block">Aparência dos Nomes</label>
                      
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Tamanho da Fonte: {nameFontSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="32"
                          value={nameFontSize}
                          onChange={(e) => setNameFontSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Opacidade do Fundo: {Math.round(nameBackgroundOpacity * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={nameBackgroundOpacity * 100}
                          onChange={(e) => setNameBackgroundOpacity(Number(e.target.value) / 100)}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Cor da Borda
                        </label>
                        <div className="flex gap-2">
                          {[
                            { label: 'Preto', value: '#000000' },
                            { label: 'Branco', value: '#FFFFFF' },
                            { label: 'Vermelho', value: '#FF0000' },
                            { label: 'Azul', value: '#0000FF' },
                          ].map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setNameBorderColor(color.value)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                nameBorderColor === color.value ? 'border-primary scale-110' : 'border-border'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Zoom (Mapa) */}
                  {selectedMap && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Zoom</label>
                      <div className="flex gap-2">
                        <Button onClick={handleZoomOut} variant="outline" className="flex-1">
                          <ZoomOut className="h-4 w-4 mr-2" />
                          -
                        </Button>
                        <Button onClick={handleZoomIn} variant="outline" className="flex-1">
                          <ZoomIn className="h-4 w-4 mr-2" />
                          +
                        </Button>
                      </div>
                      <div className="text-center text-sm text-muted-foreground mt-1">
                        {Math.round(zoom * 100)}%
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="draw" className="space-y-4 mt-4">
                  {/* Tutorial */}
                  <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      Tutorial Rápido
                    </h3>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p><strong>✏️ Linha:</strong> Clique, segure e arraste para desenhar livre</p>
                      <p><strong>➡️ Seta:</strong> Clique no início, arraste até o fim e solte</p>
                      <p><strong>⭕ Círculo:</strong> Clique no centro, arraste e solte</p>
                      <p><strong>○ Círculo vazio:</strong> Igual ao círculo, mas só contorno</p>
                      <p><strong>▢ Retângulo:</strong> Clique no canto, arraste até o outro</p>
                      <p><strong>— Linha Reta:</strong> Clique no início, arraste até o fim</p>
                      <p><strong>📝 Anotação:</strong> Clique onde quer escrever e digite</p>
                      <p><strong>🗑️ Apagar:</strong> Clique no desenho que quer remover</p>
                    </div>
                  </div>

                  <DrawingTools
                    activeTool={drawTool}
                    onToolChange={setDrawTool}
                    drawColor={drawColor}
                    onColorChange={setDrawColor}
                    lineThickness={lineThickness}
                    onLineThicknessChange={setLineThickness}
                    arrowStyle={arrowStyle}
                    onArrowStyleChange={setArrowStyle}
                  />

                  {/* Botões Desfazer/Refazer */}
                  {selectedMap && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleUndo} 
                        variant="outline" 
                        className="flex-1"
                        disabled={historyIndex <= 0}
                      >
                        <Undo className="h-4 w-4 mr-2" />
                        Desfazer
                      </Button>
                      <Button 
                        onClick={handleRedo} 
                        variant="outline" 
                        className="flex-1"
                        disabled={historyIndex >= drawingHistory.length - 1}
                      >
                        <Redo className="h-4 w-4 mr-2" />
                        Refazer
                      </Button>
                    </div>
                  )}

                  {/* Botão Limpar Desenhos */}
                  {selectedMap && (
                    <div>
                      <Button 
                        onClick={handleClearDrawings} 
                        variant="destructive" 
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar Desenhos
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        Remove apenas linhas, setas e textos
                      </p>
                    </div>
                  )}

                  {/* Zoom (Desenho) */}
                  {selectedMap && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Zoom</label>
                      <div className="flex gap-2">
                        <Button onClick={handleZoomOut} variant="outline" className="flex-1">
                          <ZoomOut className="h-4 w-4 mr-2" />
                          -
                        </Button>
                        <Button onClick={handleZoomIn} variant="outline" className="flex-1">
                          <ZoomIn className="h-4 w-4 mr-2" />
                          +
                        </Button>
                      </div>
                      <div className="text-center text-sm text-muted-foreground mt-1">
                        {Math.round(zoom * 100)}%
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="project" className="space-y-4 mt-4">
                  <ProjectManager
                    onSave={handleSaveProject}
                    onLoad={handleLoadProject}
                    canSave={!!selectedMap}
                  />
                  
                  {selectedMap && (
                    <div className="space-y-4 pt-4 border-t">
                      {/* Configurações da Apresentação */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Título da Apresentação</label>
                        <Input
                          value={presentationTitle}
                          onChange={(e) => setPresentationTitle(e.target.value)}
                          placeholder="Ex: Liga LBFF - Semana 1"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Marca d'água</label>
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={showWatermark}
                              onChange={(e) => setShowWatermark(e.target.checked)}
                              className="rounded"
                            />
                            Exibir
                          </label>
                        </div>
                        <Input
                          value={watermark}
                          onChange={(e) => setWatermark(e.target.value)}
                          placeholder="@seuinstagram"
                          className="w-full"
                          disabled={!showWatermark}
                        />
                        {showWatermark && (
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-muted-foreground">Fundo na marca d'água</label>
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={showWatermarkBackground}
                                onChange={(e) => setShowWatermarkBackground(e.target.checked)}
                                className="rounded"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <label className="text-sm font-medium">Fundo nos nomes</label>
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={showNameBackground}
                            onChange={(e) => setShowNameBackground(e.target.checked)}
                            className="rounded"
                          />
                          Exibir
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Resolução do Export</label>
                        <Select value={String(exportScale)} onValueChange={(v) => setExportScale(Number(v))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Resolução" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1x (Rápido)</SelectItem>
                            <SelectItem value="2">2x (Padrão)</SelectItem>
                            <SelectItem value="3">3x (Alta)</SelectItem>
                            <SelectItem value="4">4x (Ultra)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 pt-2">
                        {currentNames.length < 2 && (
                          <p className="text-xs text-muted-foreground text-center py-2 bg-muted/50 rounded-lg">
                            Adicione pelo menos 2 nomes de times para baixar
                          </p>
                        )}
                        <Button 
                          onClick={handlePreview} 
                          className="w-full" 
                          variant="outline"
                          disabled={currentNames.length < 2}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview antes de Baixar
                        </Button>
                        <Button 
                          onClick={handleExportImage} 
                          className="w-full" 
                          variant="premium"
                          disabled={currentNames.length < 2}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar Imagem Atual
                        </Button>
                        <Button 
                          onClick={handleExportPDF} 
                          className="w-full" 
                          variant="default"
                          disabled={currentNames.length < 2}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Baixar PDF (Com Capa)
                        </Button>
                        <Button 
                          onClick={handleExportAllZip} 
                          className="w-full" 
                          variant="outline"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Exportar Todos (ZIP)
                        </Button>
                        <Button onClick={handlePrint} className="w-full" variant="outline">
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                        {navigator.share && (
                          <Button 
                            onClick={handleShare} 
                            className="w-full" 
                            variant="outline"
                            disabled={currentNames.length < 2}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartilhar
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Área do Mapa */}
          <div className="lg:col-span-3">
            <Card className="glass-effect">
              <CardContent className="p-4">
                {selectedMap ? (
                    <div className="relative w-full overflow-auto">
                      {/* Indicador de Zoom */}
                      {zoom !== 1 && (
                        <div className="absolute top-2 right-2 z-20 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          {Math.round(zoom * 100)}%
                        </div>
                      )}
                      <div
                        ref={canvasRef}
                        className="relative bg-card rounded-lg overflow-hidden mx-auto"
                        style={{
                          aspectRatio: '16/9',
                          backgroundImage: `url(${selectedMap.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          minHeight: '500px',
                          transform: `scale(${zoom})`,
                          transformOrigin: 'center',
                          transition: 'transform 0.2s ease',
                        }}
                        onClick={() => setSelectedNameId(null)}
                        onMouseMove={handleMapMouseMove}
                        onMouseUp={handleMapMouseUp}
                        onMouseLeave={handleMapMouseUp}
                        onTouchStart={(e) => {
                          handleDoubleTap(e);
                          handlePinchStart(e);
                        }}
                        onTouchMove={(e) => {
                          if (e.touches.length === 2) {
                            handlePinchMove(e);
                          } else {
                            handleMapTouchMove(e);
                          }
                        }}
                        onTouchEnd={(e) => {
                          handlePinchEnd();
                          handleMapTouchEnd();
                        }}
                      >
                       {/* Canvas para Desenhos */}
                      <canvas
                        ref={drawingCanvasRef}
                        className="absolute inset-0 w-full h-full"
                        style={{ 
                          pointerEvents: drawTool === 'select' ? 'none' : 'auto',
                          zIndex: drawTool === 'select' ? 1 : 15,
                          cursor: drawTool === 'draw' || drawTool === 'arrow' || drawTool === 'circle' || drawTool === 'circleOutline' || drawTool === 'text' || drawTool === 'rectangle' || drawTool === 'straightLine'
                            ? 'crosshair'
                            : drawTool === 'eraser'
                              ? 'pointer'
                              : drawTool === 'move'
                                ? 'grab'
                                : 'default',
                        }}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        onTouchStart={handleCanvasTouchStart}
                        onTouchMove={handleCanvasTouchMove}
                        onTouchEnd={handleCanvasTouchEnd}
                      />

                      {/* Itens Arrastáveis - Nomes dos Times */}
                      {currentNames.map((name) => (
                        <div
                          key={name.id}
                          className="absolute select-none"
                          style={{
                            left: name.x,
                            top: name.y,
                            zIndex: selectedNameId === name.id ? 15 : 10,
                            pointerEvents: 'auto',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNameId(name.id);
                          }}
                          onTouchEnd={(e) => {
                            if (!draggingId) {
                              setSelectedNameId(name.id);
                            }
                          }}
                        >
                          {/* Handle de arrastar - aparece quando selecionado */}
                          {selectedNameId === name.id && (
                            <div
                              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg cursor-move z-20 touch-none"
                              style={{ 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                              }}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                                handleNameMouseDown(name.id, event);
                              }}
                              onTouchStart={(event) => {
                                event.stopPropagation();
                                handleNameTouchStart(name.id, event);
                              }}
                            >
                              <Move size={20} />
                            </div>
                          )}
                          
                          <div
                            className="cursor-pointer"
                            style={{
                              backgroundColor: showNameBackground ? `rgba(0,0,0,${nameBackgroundOpacity})` : 'transparent',
                              border: selectedNameId === name.id 
                                ? '2px solid hsl(var(--primary))' 
                                : showNameBackground && nameBackgroundOpacity > 0 
                                  ? '1px solid rgba(255,255,255,0.2)' 
                                  : 'none',
                              boxShadow: showNameBackground ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
                              borderRadius: '4px',
                              height: showNameBackground ? `${nameFontSize + 14}px` : 'auto',
                              textAlign: 'center',
                            }}
                            onMouseDown={(event) => {
                              event.stopPropagation();
                              handleNameMouseDown(name.id, event);
                            }}
                            onTouchStart={(event) => {
                              event.stopPropagation();
                              handleNameTouchStart(name.id, event);
                            }}
                          >
                            {name.type === 'logo' && name.logo ? (
                              <img
                                src={name.logo}
                                alt={name.text}
                                style={{ 
                                  display: 'block',
                                  height: '48px',
                                  width: '48px',
                                  objectFit: 'contain',
                                  margin: showNameBackground ? '4px 8px' : '0',
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: `${nameFontSize}px`,
                                  fontWeight: 'bold',
                                  color: name.color,
                                  textShadow: `2px 2px 4px ${nameBorderColor}, -1px -1px 0 ${nameBorderColor}, 1px -1px 0 ${nameBorderColor}, -1px 1px 0 ${nameBorderColor}, 1px 1px 0 ${nameBorderColor}`,
                                  whiteSpace: 'nowrap',
                                  lineHeight: showNameBackground ? `${nameFontSize + 14}px` : 'normal',
                                  paddingLeft: showNameBackground ? '12px' : '0',
                                  paddingRight: showNameBackground ? '12px' : '0',
                                }}
                              >
                                {name.text}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}




                      {/* Marca d'água */}
                      {showWatermark && watermark.trim() && (
                        <div
                          className="absolute"
                          style={{
                            bottom: '16px',
                            right: '16px',
                            backgroundColor: showWatermarkBackground ? 'rgba(0,0,0,0.8)' : 'transparent',
                            border: showWatermarkBackground ? '1px solid rgba(255,215,0,0.3)' : 'none',
                            zIndex: 20,
                            borderRadius: '4px',
                            height: showWatermarkBackground ? '28px' : 'auto',
                            textAlign: 'center',
                          }}
                        >
                          <span
                            style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#ffd700',
                              textShadow: showWatermarkBackground ? 'none' : '2px 2px 4px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                              whiteSpace: 'nowrap',
                              lineHeight: showWatermarkBackground ? '28px' : 'normal',
                              paddingLeft: showWatermarkBackground ? '12px' : '0',
                              paddingRight: showWatermarkBackground ? '12px' : '0',
                            }}
                          >
                            {watermark}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 text-muted-foreground">
                    <div className="text-center">
                      <p className="text-xl mb-2">Selecione um mapa para começar</p>
                      <p className="text-sm">Use o painel lateral para escolher o mapa</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Dialog de Preview */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview da Imagem</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-auto rounded-lg border"
              />
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancelar
            </Button>
            <Button variant="premium" onClick={handleConfirmDownload}>
              <Download className="h-4 w-4 mr-2" />
              Confirmar Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Copiar Nomes */}
      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Copiar Nomes de Outro Mapa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione o mapa de origem para copiar os nomes para {selectedMap?.name}
            </p>
            <Select value={copySourceMap} onValueChange={setCopySourceMap}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mapa" />
              </SelectTrigger>
              <SelectContent>
                {mapsWithNames.map((map) => (
                  <SelectItem key={map.name} value={map.name}>
                    {map.name} ({(mapNames[map.name] || []).length} nomes)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCopyFromMap} disabled={!copySourceMap}>
              <FolderSync className="h-4 w-4 mr-2" />
              Copiar Nomes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
