import React, { useRef, useEffect, useState, useCallback } from 'react';
import { explainDiagram } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { BrainCircuitIcon } from './Icons';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  const [prompt, setPrompt] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          canvas.width = width;
          canvas.height = height;
          context.putImageData(imageData, 0, 0);
          // Re-apply settings after resize
          context.lineCap = 'round';
          context.strokeStyle = color;
          context.lineWidth = lineWidth;
      }
    }
  }, [color, lineWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;
      }
    }
  }, [color, lineWidth]);

  useEffect(() => {
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize(); // Initial size
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [setCanvasSize]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const event = 'touches' in e ? e.touches[0] : e;
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const context = contextRef.current;
    if (context) {
      const { x, y } = getCoords(e);
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    }
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const context = contextRef.current;
    if (context) {
      const { x, y } = getCoords(e);
      context.lineTo(x, y);
      context.stroke();
    }
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    const context = contextRef.current;
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if(canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `whiteboard-drawing-${Date.now()}.png`;
        link.click();
    }
  };

  const handleAiAssist = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !prompt) {
        setError("Please draw something and enter a prompt for the AI.");
        return;
    }

    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
        const imageDataUrl = canvas.toDataURL('image/png');
        const result = await explainDiagram(imageDataUrl, prompt);
        setExplanation(result);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setLoading(false);
    }

  }, [prompt]);

  const COLORS = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#A855F7'];
  const SIZES = [2, 5, 10, 15];

  return (
    <div className="p-8 h-full flex flex-col lg:flex-row gap-8">
      <div className="flex-grow flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Interactive Whiteboard</h2>
        <p className="text-gray-500 mb-4">Draw a diagram and use the AI Assistant to get an explanation.</p>

        {/* Toolbar */}
        <Card className="mb-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Color:</span>
                    {COLORS.map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent'}`} style={{ backgroundColor: c }} aria-label={`Set color to ${c}`}></button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Size:</span>
                    {SIZES.map(s => (
                        <button key={s} onClick={() => setLineWidth(s)} className={`px-3 py-1 rounded-md text-sm ${lineWidth === s ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>{s}px</button>
                    ))}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <button onClick={clearCanvas} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Clear</button>
                    <button onClick={downloadImage} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Download</button>
                </div>
            </div>
        </Card>

        {/* Canvas */}
        <div className="flex-grow w-full h-[50vh] lg:h-auto rounded-lg shadow-lg bg-white overflow-hidden">
             <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full"
            />
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="w-full lg:w-1/3 lg:max-w-md flex flex-col">
        <Card className="flex-grow flex flex-col">
          <div className="flex items-center mb-4">
            <BrainCircuitIcon className="w-6 h-6 mr-2 text-primary-600"/>
            <h3 className="text-xl font-semibold text-gray-700">AI Assistant</h3>
          </div>
          <div className="flex-grow space-y-4 flex flex-col">
             <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Explain this ER diagram, or What are the parts of this cell?"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition flex-grow"
              rows={4}
              disabled={loading}
            />
            {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">{error}</div>}
             {explanation && (
                <div className="bg-gray-50 p-3 rounded-lg text-gray-800 leading-relaxed whitespace-pre-line text-sm overflow-y-auto">
                    {explanation}
                </div>
            )}
            
            <div className="mt-auto pt-4">
                 <button
                    onClick={handleAiAssist}
                    disabled={loading || !prompt}
                    className="w-full flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-colors duration-200"
                >
                    {loading ? <Spinner /> : 'AI Assist'}
                </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Whiteboard;
