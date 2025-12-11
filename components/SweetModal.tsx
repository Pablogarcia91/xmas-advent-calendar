'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Snowfall } from './Snowfall';

interface Sweet {
  day: number;
  name: string;
  description: string;
  emoji: string;
}

interface SweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sweet: Sweet;
  isAlreadyScratched: boolean;
  onScratchComplete: (sweet: Sweet) => void;
  onReset: (day: number) => void;
}

const getDaySuffix = (day: number) => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export function SweetModal({ isOpen, onClose, sweet, isAlreadyScratched, onScratchComplete, onReset }: SweetModalProps) {
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(isAlreadyScratched);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      if (isAlreadyScratched) {
        setIsRevealed(true);
        setScratchProgress(100);
      } else {
        setScratchProgress(0);
        setIsRevealed(false);
        setTimeout(() => initCanvas(), 100);
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isAlreadyScratched]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Christmas card background - red with snow pattern
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add snowflake pattern
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.font = `${10 + Math.random() * 10}px serif`;
      ctx.fillText('❄', x, y);
    }
    ctx.globalAlpha = 1;

    // Add decorative border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, rect.width - 20, rect.height - 20);

    // Add text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 48px serif';
    ctx.fillText('🎁', rect.width / 2, rect.height / 2 - 40);
    ctx.font = 'bold 32px serif';
    ctx.fillText('Scratch Here!', rect.width / 2, rect.height / 2 + 30);
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = (x - rect.left);
    const canvasY = (y - rect.top);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 25, 0, Math.PI * 2);
    ctx.fill();

    // Debounced progress calculation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      calculateProgress();
    });
  };

  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const progress = (transparent / (pixels.length / 4)) * 100;
    setScratchProgress(progress);

    if (progress > 60 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDrawing) {
      e.preventDefault();
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleComplete = () => {
    onScratchComplete(sweet);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Snowfall animation */}
      <Snowfall />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-lg animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg shadow-2xl border-4 border-red-600 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 px-8 py-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-2 font-christmas">
              December {sweet.day}{getDaySuffix(sweet.day)}
            </h2>
            {!isAlreadyScratched && (
              <p className="text-xl text-white/90 font-christmas">
                Scratch to reveal your treat!
              </p>
            )}
            {isAlreadyScratched && (
              <p className="text-xl text-white/90 font-christmas">
                Your Christmas Treat
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {isAlreadyScratched ? (
              /* Already scratched - show content with reset button */
              <div className="space-y-6">
                {/* Sweet emoji */}
                <div className="text-center">
                  <span className="text-9xl drop-shadow-2xl inline-block">
                    {sweet.emoji}
                  </span>
                </div>

                {/* Sweet name */}
                <h3 className="text-4xl font-bold text-center text-red-700 font-christmas">
                  {sweet.name}
                </h3>

                {/* Sweet description */}
                <p className="text-center text-gray-700 text-lg leading-relaxed font-christmas">
                  {sweet.description}
                </p>

                {/* Reset button */}
                <button
                  onClick={() => onReset(sweet.day)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 font-christmas text-xl"
                >
                  <RotateCcw size={24} />
                  Reset This Day
                </button>
              </div>
            ) : (
              /* Not scratched yet - show scratch card */
              <div className="space-y-6">
                {/* Scratch card container */}
                <div className="relative bg-green-50 border-4 border-red-200 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                  {/* Hidden content */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-700 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Sweet emoji */}
                    <span className="text-9xl drop-shadow-2xl inline-block mb-4">
                      {sweet.emoji}
                    </span>

                    {/* Sweet name */}
                    <h3 className="text-4xl font-bold text-center text-red-700 font-christmas mb-4">
                      {sweet.name}
                    </h3>

                    {/* Sweet description */}
                    <p className="text-center text-gray-700 text-lg leading-relaxed font-christmas">
                      {sweet.description}
                    </p>
                  </div>

                  {/* Scratch-off canvas */}
                  <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full touch-none transition-opacity duration-700 ${
                      isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />
                </div>

                {/* Completed button - only show when revealed */}
                {isRevealed && (
                  <button
                    onClick={handleComplete}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-christmas text-xl"
                  >
                    ✓ Completed!
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
