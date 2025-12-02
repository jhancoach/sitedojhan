import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer, Share2, Plus, Copy, Trash2, Pencil, Check, ZoomIn, ZoomOut, FileText, Image as ImageIcon } from 'lucide-react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

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
  const { t } = useLanguage();
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
  const [names, setNames] = useState<NameItem[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [itemType, setItemType] = useState<'text' | 'logo'>('text');
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddName = () => {
    if (!newName.trim() && itemType === 'text') {
      toast.error('Digite um nome válido');
      return;
    }

    if (names.length >= 15) {
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

    setNames([...names, newItem]);
    setNewName('');
    toast.success('Item adicionado');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (names.length >= 15) {
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
      setNames([...names, newItem]);
      toast.success('Logo adicionado');
    };
    reader.readAsDataURL(file);
  };

  const handleDuplicate = (id: string) => {
    if (names.length >= 15) {
      toast.error('Máximo de 15 nomes atingido');
      return;
    }

    const original = names.find(n => n.id === id);
    if (original) {
      const duplicate: NameItem = {
        ...original,
        id: Date.now().toString(),
        x: original.x + 20,
        y: original.y + 20,
      };
      setNames([...names, duplicate]);
      toast.success('Nome duplicado');
    }
  };

  const handleDelete = (id: string) => {
    setNames(names.filter(n => n.id !== id));
    toast.success('Nome removido');
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

    setNames(names.map(n => n.id === id ? { ...n, text: editingText.trim() } : n));
    setEditingId(null);
    setEditingText('');
    toast.success('Nome atualizado');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleDrag = (id: string, data: { x: number; y: number }) => {
    setNames(names.map(n => n.id === id ? { ...n, x: data.x, y: data.y } : n));
  };

  const handleExportImage = async () => {
    if (!canvasRef.current || !selectedMap) {
      toast.error('Selecione um mapa primeiro');
      return;
    }

    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });

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
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar imagem');
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) {
      toast.error('Selecione um mapa primeiro');
      return;
    }

    try {
      toast.info('Gerando PDF... Aguarde');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const originalMap = selectedMap;
      const originalNames = names;

      for (let i = 0; i < maps.length; i++) {
        setSelectedMap(maps[i]);
        
        // Aguardar renderização
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(canvasRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#000000',
          scale: 2,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        if (i > 0) pdf.addPage();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save('mapeamento-apresentacao.pdf');
      
      // Restaurar estado original
      setSelectedMap(originalMap);
      setNames(originalNames);
      
      toast.success('PDF gerado com sucesso');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
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
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
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
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
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
            Crie estratégias visuais posicionando nomes sobre os mapas do Free Fire
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel Lateral */}
          <Card className="glass-effect lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Controles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Seleção de Mapa - Grid Visual */}
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
                  Tipo de Item ({names.length}/15)
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
                    disabled={names.length >= 15}
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
                  <label className="text-sm font-medium mb-2 block">
                    Adicionar Nome
                  </label>
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
                      disabled={names.length >= 15}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista de Itens */}
              {names.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Itens Adicionados</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {names.map((name) => (
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
                              disabled={names.length >= 15}
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

              {/* Controles de Zoom */}
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

              {/* Botões de Exportação */}
              {selectedMap && (
                <div className="space-y-2 pt-4 border-t">
                  <Button onClick={handleExportImage} className="w-full" variant="premium">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Imagem Atual
                  </Button>
                  <Button onClick={handleExportPDF} className="w-full" variant="default">
                    <FileText className="h-4 w-4 mr-2" />
                    Baixar PDF (Apresentação)
                  </Button>
                  <Button onClick={handlePrint} className="w-full" variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  {navigator.share && (
                    <Button onClick={handleShare} className="w-full" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Área do Mapa */}
          <div className="lg:col-span-3">
            <Card className="glass-effect">
              <CardContent className="p-4">
                {selectedMap ? (
                  <div className="relative w-full overflow-auto">
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
                    >
                      {/* Itens Arrastáveis */}
                      {names.map((name) => (
                        <Draggable
                          key={name.id}
                          position={{ x: name.x, y: name.y }}
                          onStop={(e, data) => handleDrag(name.id, { x: data.x, y: data.y })}
                          bounds="parent"
                          scale={zoom}
                        >
                          <div
                            className="absolute cursor-move select-none px-3 py-1 rounded shadow-lg"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            {name.type === 'logo' && name.logo ? (
                              <img 
                                src={name.logo} 
                                alt={name.text} 
                                className="h-12 w-12 object-contain"
                              />
                            ) : (
                              <span
                                className="font-bold text-lg"
                                style={{
                                  color: name.color,
                                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                }}
                              >
                                {name.text}
                              </span>
                            )}
                          </div>
                        </Draggable>
                      ))}

                      {/* Marca d'água */}
                      <div
                        className="absolute bottom-4 right-4 text-white font-bold text-sm px-2 py-1 rounded"
                        style={{
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                      >
                        @jhanmedeiros
                      </div>
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
